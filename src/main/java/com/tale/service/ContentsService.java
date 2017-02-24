package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.dto.Archive;
import com.tale.model.Contents;

import java.util.List;

public interface ContentsService {

    /**
     * 根据id或slug获取文章
     *
     * @param id
     * @return
     */
    Contents getContents(String id);

    /**
     * 根据Take条件查询分页信息
     * @param take
     * @return
     */
    Paginator<Contents> getArticles(Take take);

    /**
     * 发布文章
     * @param contents
     */
    void publish(Contents contents);

    /**
     * 编辑文章
     * @param contents
     */
    void update(Contents contents);

    /**
     * 根据文章id删除
     * @param cid
     */
    void delete(int cid);

    /**
     * 查询分类/标签下的文章归档
     * @param mid
     * @param page
     * @param limit
     * @return
     */
    Paginator<Contents> getArticles(Integer mid, int page, int limit);

}
