package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.OrderBy;
import com.blade.jdbc.page.Page;
import com.blade.kit.BladeKit;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.exception.TipException;
import com.tale.model.dto.Comment;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.utils.TaleUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        if (null == comments) {
            throw new TipException("评论对象为空");
        }
        if (StringKit.isBlank(comments.getAuthor())) {
            throw new TipException("姓名不能为空");
        }
        if (StringKit.isBlank(comments.getMail())) {
            throw new TipException("邮箱不能为空");
        }
        if (!TaleUtils.isEmail(comments.getMail())) {
            throw new TipException("请输入正确的邮箱格式");
        }
        if (StringKit.isBlank(comments.getContent())) {
            throw new TipException("评论内容不能为空");
        }
        if (comments.getContent().length() < 5 || comments.getContent().length() > 2000) {
            throw new TipException("评论字数在5-2000个字符");
        }
        if (null == comments.getCid()) {
            throw new TipException("评论文章不能为空");
        }
        Contents contents = new Contents().where("cid", comments.getCid()).find();
        if (null == contents) {
            throw new TipException("不存在的文章");
        }
        try {
            comments.setOwner_id(contents.getAuthor_id());
            comments.setCreated(DateKit.nowUnix());
            comments.save();

            Contents temp = new Contents();
            temp.setComments_num(contents.getComments_num() + 1);
            temp.update(contents.getCid());
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 删除评论，暂时没用
     * @param coid
     * @param cid
     * @throws Exception
     */
    public void delete(Integer coid, Integer cid) {
        if (null == coid) {
            throw new TipException("主键为空");
        }
        try {
            new Comments().delete(coid);
            Optional<Contents> contents = contentsService.getContents(cid + "");
            if (!contents.isPresent()) {
                return;
            }

            contents.filter(c -> c.getComments_num() > 0)
                    .ifPresent(c -> {
                        Contents temp = new Contents();
                        temp.setComments_num(c.getComments_num() - 1);
                        temp.update(cid);
                    });
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 获取文章下的评论
     * @param cid
     * @param page
     * @param limit
     * @return
     */
    public Page<Comment> getComments(Integer cid, int page, int limit) {
        if (null != cid) {
            Page<Comments> cp = new Comments().where("cid", cid).and("parent", 0).page(page, limit, "coid desc");
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
        List<Comments> cms = new Comments().where("parent", coid).findAll(OrderBy.asc("coid"));
        if (null != cms) {
            list.addAll(cms);
            cms.forEach(c -> getChildren(list, c.getCoid()));
        }
    }

    /**
     * 根据主键查询评论
     * @param coid
     * @return
     */
    public Comments byId(Integer coid) {
        if (null != coid) {
            return new Comments().find(coid);
        }
        return null;
    }
}
