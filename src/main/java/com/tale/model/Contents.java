package com.tale.model;

import com.blade.jdbc.annotation.Table;

import java.io.Serializable;

//
@Table(name = "t_contents", pk = "cid")
public class Contents implements Serializable {

    private static final long serialVersionUID = 1L;

    // post表主键
    private Integer cid;

    // 内容标题
    private String title;

    // 内容缩略名
    private String slug;

    // 内容生成时的GMT unix时间戳
    private Integer created;

    // 内容更改时的GMT unix时间戳
    private Integer modified;

    // 内容文字
    private String content;

    // 内容所属用户id
    private Integer author_id;

    // 内容类别
    private String type;

    // 标签列表
    private String tags;

    // 分类列表
    private String categories;

    // 内容状态
    private String status;

    // 内容所属评论数
    private Integer comments_num;

    // 是否允许评论
    private Boolean allow_comment;

    // 是否允许ping
    private Boolean allow_ping;

    // 允许出现在聚合中
    private Boolean allow_feed;

    public Contents() {
    }

    public Integer getCid() {
        return cid;
    }

    public void setCid(Integer cid) {
        this.cid = cid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Integer getCreated() {
        return created;
    }

    public void setCreated(Integer created) {
        this.created = created;
    }

    public Integer getModified() {
        return modified;
    }

    public void setModified(Integer modified) {
        this.modified = modified;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getAuthor_id() {
        return author_id;
    }

    public void setAuthor_id(Integer author_id) {
        this.author_id = author_id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getComments_num() {
        return comments_num;
    }

    public void setComments_num(Integer comments_num) {
        this.comments_num = comments_num;
    }

    public Boolean getAllow_comment() {
        return allow_comment;
    }

    public void setAllow_comment(Boolean allow_comment) {
        this.allow_comment = allow_comment;
    }

    public Boolean getAllow_ping() {
        return allow_ping;
    }

    public void setAllow_ping(Boolean allow_ping) {
        this.allow_ping = allow_ping;
    }

    public Boolean getAllow_feed() {
        return allow_feed;
    }

    public void setAllow_feed(Boolean allow_feed) {
        this.allow_feed = allow_feed;
    }
}