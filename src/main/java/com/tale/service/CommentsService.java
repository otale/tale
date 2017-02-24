package com.tale.service;

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
     * 分页读取评论
     * @param cid
     * @param page
     * @param limit
     * @return
     */
    Paginator<Comment> getComments(Integer cid, int page, int limit);
}
