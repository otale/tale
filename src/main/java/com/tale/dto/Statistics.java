package com.tale.dto;

import java.io.Serializable;

/**
 * 后台统计对象
 * <p>
 * Created by biezhi on 2017/2/24.
 */
public class Statistics implements Serializable {

    // 文章数
    private int articles;
    // 页面数
    private int pages;
    // 评论数
    private int comments;
    // 分类数
    private int categories;
    // 标签数
    private int tags;
    // 链接数
    private int links;
    // 附件数
    private int attachs;

    public int getArticles() {
        return articles;
    }

    public void setArticles(int articles) {
        this.articles = articles;
    }

    public int getComments() {
        return comments;
    }

    public void setComments(int comments) {
        this.comments = comments;
    }

    public int getLinks() {
        return links;
    }

    public void setLinks(int links) {
        this.links = links;
    }

    public int getAttachs() {
        return attachs;
    }

    public void setAttachs(int attachs) {
        this.attachs = attachs;
    }

    public int getCategories() {
        return categories;
    }

    public void setCategories(int categories) {
        this.categories = categories;
    }

    public int getTags() {
        return tags;
    }

    public void setTags(int tags) {
        this.tags = tags;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }
}
