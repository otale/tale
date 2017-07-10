package com.tale.model.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 后台统计对象
 * <p>
 * Created by biezhi on 2017/2/24.
 */
@Data
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

}
