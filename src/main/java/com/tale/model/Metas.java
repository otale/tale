package com.tale.model;

import com.blade.jdbc.annotation.Table;

import java.io.Serializable;

//
@Table(name = "t_metas", pk = "mid")
public class Metas implements Serializable {

    private static final long serialVersionUID = 1L;

    // 项目主键
    private Integer mid;

    // 名称
    private String name;

    // 项目缩略名
    private String slug;

    // 项目类型
    private String type;

    // 选项描述
    private String description;

    // 项目排序
    private Integer sort;

    private Integer parent;

    public Metas() {
    }

    public Integer getMid() {
        return mid;
    }

    public void setMid(Integer mid) {
        this.mid = mid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getParent() {
        return parent;
    }

    public void setParent(Integer parent) {
        this.parent = parent;
    }


}