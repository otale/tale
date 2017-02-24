package com.tale.service;

import com.blade.jdbc.model.Paginator;
import com.tale.dto.Comment;
import com.tale.model.Comments;

public interface CommentsService {

    void save(Comments comments);

    void delete(Integer coid) throws Exception;

    Paginator<Comment> getComments(Integer cid, int page, int limit);
}
