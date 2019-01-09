package com.tale.service;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Bean;
import com.blade.kit.BladeKit;
import com.blade.kit.DateKit;
import com.tale.bootstrap.TaleConst;
import com.tale.extension.Commons;
import com.tale.model.dto.Comment;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.params.CommentParam;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import io.github.biezhi.anima.Anima;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;

import java.util.ArrayList;
import java.util.List;

import static com.tale.bootstrap.TaleConst.*;
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

    /**
     * 保存评论
     *
     * @param comments
     */
    public void saveComment(Comments comments) {
        comments.setAuthor(TaleUtils.cleanXSS(comments.getAuthor()));
        comments.setContent(TaleUtils.cleanXSS(comments.getContent()));

        comments.setAuthor(EmojiParser.parseToAliases(comments.getAuthor()));
        comments.setContent(EmojiParser.parseToAliases(comments.getContent()));

        Contents contents = select().from(Contents.class).byId(comments.getCid());
        if (null == contents) {
            throw new ValidatorException("不存在的文章");
        }
        try {
            comments.setOwnerId(contents.getAuthorId());
            comments.setAuthorId(null == comments.getAuthorId() ? 0 : comments.getAuthorId());
            comments.setCreated(DateKit.nowUnix());
            comments.setParent(null == comments.getCoid() ? 0 : comments.getCoid());
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
        if (null == cid) {
            return null;
        }

        Page<Comments> commentsPage = select().from(Comments.class)
                .where(Comments::getCid, cid).and(Comments::getParent, 0)
                .and(Comments::getStatus, COMMENT_APPROVED)
                .order(Comments::getCoid, OrderBy.DESC).page(page, limit);

        return commentsPage.map(this::apply);
    }

    /**
     * 获取文章下的评论统计
     *
     * @param cid 文章ID
     */
    public long getCommentCount(Integer cid) {
        if (null == cid) {
            return 0;
        }
        return select().from(Comments.class).where(Comments::getCid, cid).count();
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

    private Comment apply(Comments parent) {
        Comment        comment  = new Comment(parent);
        List<Comments> children = new ArrayList<>();
        getChildren(children, comment.getCoid());
        comment.setChildren(children);
        if (BladeKit.isNotEmpty(children)) {
            comment.setLevels(1);
        }
        return comment;
    }

    public Page<Comments> findComments(CommentParam commentParam) {
        return select().from(Comments.class)
                .order(Comments::getCoid, OrderBy.DESC)
                .page(commentParam.getPage(), commentParam.getLimit());
    }

}
