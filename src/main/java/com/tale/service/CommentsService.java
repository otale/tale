package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.BladeKit;
import com.blade.kit.DateKit;
import com.tale.exception.TipException;
import com.tale.model.dto.Comment;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import io.github.biezhi.anima.Anima;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;

import java.util.ArrayList;
import java.util.List;

import static io.github.biezhi.anima.Anima.select;
import static io.github.biezhi.anima.Anima.update;

/**
 * 评论Service
 *
 * @author biezhi
 * @since 1.3.1
 */
@Bean
public class CommentsService {

    @Inject
    private ContentsService contentsService;

    /**
     * 保存评论
     *
     * @param comments
     */
    public void saveComment(Comments comments) {
        if (comments.getContent().length() < 5 || comments.getContent().length() > 2000) {
            throw new TipException("评论字数在5-2000个字符");
        }
        if (null == comments.getCid()) {
            throw new TipException("评论文章不能为空");
        }
        Contents contents = select().from(Contents.class).byId(comments.getCid());
        if (null == contents) {
            throw new TipException("不存在的文章");
        }
        try {
            comments.setOwnerId(contents.getAuthorId());
            comments.setCreated(DateKit.nowUnix());
            comments.setParent(comments.getCoid());
            comments.setCoid(null);
            comments.save();

            new Contents().set(Contents::getCommentsNum, contents.getCommentsNum() + 1).updateById(contents.getCid());
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 删除评论，暂时没用
     *
     * @param coid
     * @param cid
     * @throws Exception
     */
    public void delete(Integer coid, Integer cid) {
        Anima.delete().from(Comments.class).deleteById(coid);

        Contents contents = select().from(Contents.class).byId(cid);
        if (null != contents && contents.getCommentsNum() > 0) {
            update().from(Contents.class).set(Contents::getCommentsNum, contents.getCommentsNum() - 1).updateById(cid);
        }
    }

    /**
     * 获取文章下的评论
     *
     * @param cid
     * @param page
     * @param limit
     * @return
     */
    public Page<Comment> getComments(Integer cid, int page, int limit) {
        if (null != cid) {
            Page<Comments> cp = select().from(Comments.class).where(Comments::getCid, cid).and(Comments::getParent, 0).order(Comments::getCoid, OrderBy.DESC).page(page, limit);
            return cp.map(parent -> {
                Comment        comment  = new Comment(parent);
                List<Comments> children = new ArrayList<>();
                getChildren(children, comment.getCoid());
                comment.setChildren(children);
                if (BladeKit.isNotEmpty(children)) {
                    comment.setLevels(1);
                }
                return comment;
            });
        }
        return null;
    }

    /**
     * 获取该评论下的追加评论
     *
     * @param coid
     * @return
     */
    private void getChildren(List<Comments> list, Integer coid) {
        List<Comments> cms = select().from(Comments.class).where(Comments::getParent, coid).order(Comments::getCoid, OrderBy.ASC).all();
        if (null != cms) {
            list.addAll(cms);
            cms.forEach(c -> getChildren(list, c.getCoid()));
        }
    }

    /**
     * 根据主键查询评论
     *
     * @param coid
     * @return
     */
    public Comments byId(Integer coid) {
        if (null != coid) {
            return select().from(Comment.class).byId(coid);
        }
        return null;
    }
}
