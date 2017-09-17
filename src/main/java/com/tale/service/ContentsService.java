package com.tale.service;

import com.blade.jdbc.page.Page;
import com.tale.model.entity.Contents;

import java.util.Optional;

public interface ContentsService {

    /**
     * 根据id或slug获取文章
     *
     * @param id
     * @return
     */
    Optional<Contents> getContents(String id);

    /**
     * 发布文章
     * @param contents
     */
    Integer publish(Contents contents);

    /**
     * 编辑文章
     * @param contents
     */
    void updateArticle(Contents contents);

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
    Page<Contents> getArticles(Integer mid, int page, int limit);

}
