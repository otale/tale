package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.CollectionKit;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.dto.Comment;
import com.tale.exception.TipException;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.service.CommentsService;
import com.tale.utils.TaleUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentsServiceImpl implements CommentsService {

    @Inject
    private ActiveRecord activeRecord;

    @Override
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
        if (null == comments.getCid()) {
            throw new TipException("评论文章不能为空");
        }
        Contents contents = activeRecord.byId(Contents.class, comments.getCid());
        if (null == contents) {
            throw new TipException("不存在的文章");
        }
        try {
            comments.setOwner_id(contents.getAuthor_id());
            comments.setCreated(DateKit.getCurrentUnixTime());
            activeRecord.insert(comments);

            Contents temp = new Contents();
            temp.setCid(contents.getCid());
            temp.setComments_num(contents.getComments_num() + 1);
            activeRecord.update(temp);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void delete(Integer coid) throws Exception {
        if (null == coid) {
            throw new TipException("主键为空");
        }
        try {
            activeRecord.delete(Comments.class, coid);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public Paginator<Comment> getComments(Integer cid, int page, int limit) {
        if (null != cid) {
            Take take = new Take(Comments.class);
            take.eq("cid", cid).eq("parent", 0);
            take.page(page, limit, "coid desc");
            Paginator<Comments> cp = activeRecord.page(take);
            Paginator<Comment> commentPaginator = new Paginator<>(cp.getTotal(), page, limit);
            if (null != cp.getList()) {
                List<Comments> parents = cp.getList();
                List<Comment> comments = new ArrayList<>(parents.size());
                parents.forEach(parent -> {
                    Comment comment = new Comment(parent);
                    List<Comments> children = new ArrayList<>();
                    getChildren(children, comment.getCoid());
                    comment.setChildren(children);
                    if (CollectionKit.isNotEmpty(children)) {
                        comment.setLevels(1);
                    }
                    comments.add(comment);
                });
                commentPaginator.setList(comments);
            }
            return commentPaginator;
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
        List<Comments> cms = activeRecord.list(new Take(Comments.class).eq("parent", coid).orderby("coid asc"));
        if (null != cms) {
            list.addAll(cms);
            cms.forEach(c -> getChildren(list, c.getCoid()));
        }
    }

}