package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import com.blade.jdbc.core.ActiveRecord;
import lombok.Data;

/**
 * 内容
 *
 * @author biezhi
 */
@Data
@Table(value = "t_contents", pk = "cid")
public class Contents extends ActiveRecord {

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

    // 点击次数
    private Integer hits;

    // 内容类别
    private String type;

    // 内容类型，markdown或者html
    private String fmt_type;

    // 文章缩略图
    private String thumb_img;

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

}