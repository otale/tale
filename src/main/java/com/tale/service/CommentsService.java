package com.tale.service;

import com.blade.jdbc.page.Page;
import com.tale.model.dto.Comment;
import com.tale.model.entity.Comments;

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
     * @param cid
     * @throws Exception
     */
    void delete(Integer coid, Integer cid);

    /**
     * 获取文章下的评论
     * @param cid
     * @param page
     * @param limit
     * @return
     */
    Page<Comment> getComments(Integer cid, int page, int limit);

    /**
     * 根据主键查询评论
     * @param coid
     * @return
     */
    Comments byId(Integer coid);

}
