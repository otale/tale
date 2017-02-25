package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.dto.Comment;
import com.tale.model.Comments;

public interface CommentsService {

    /**
     * 保存评论
     *
     * @param comments
     */
    void saveComment(Comments comments);

    /**
     * 删除评论，暂时没用
     * @param coid
     * @throws Exception
     */
    void delete(Integer coid) throws Exception;

    /**
     * 获取文章下的评论
     * @param cid
     * @param page
     * @param limit
     * @return
     */
    Paginator<Comment> getComments(Integer cid, int page, int limit);

    /**
     * 分页管理评论
     * @param take
     * @return
     */
    Paginator<Comments> getComments(Take take);

    /**
     * 根据主键查询评论
     * @param coid
     * @return
     */
    Comments byId(Integer coid);

    /**
     * 更新评论状态
     * @param comments
     */
    void update(Comments comments);
}
