package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import com.blade.jdbc.core.ActiveRecord;
import com.blade.validator.annotation.Length;
import com.blade.validator.annotation.Max;
import com.blade.validator.annotation.NotEmpty;
import com.tale.init.TaleConst;
import lombok.Data;

import static com.tale.init.TaleConst.MAX_TEXT_COUNT;
import static com.tale.init.TaleConst.MAX_TITLE_COUNT;

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
    @NotEmpty(message = "标题不能为空")
    @Length(max = MAX_TITLE_COUNT, message = "文章标题最多可以输入%d个字符")
    private String  title;
    // 内容缩略名
    private String  slug;
    // 内容生成时的GMT unix时间戳
    private Integer created;
    // 内容更改时的GMT unix时间戳
    private Integer modified;
    // 内容文字
    @NotEmpty(message = "内容不能为空")
    @Length(max = MAX_TEXT_COUNT, message = "文章内容最多可以输入%d个字符")
    private String  content;
    // 内容所属用户id
    private Integer authorId;
    // 点击次数
    private Integer hits;
    // 内容类别
    private String  type;
    // 内容类型，markdown或者html
    private String  fmtType;
    // 文章缩略图
    private String  thumbImg;
    // 标签列表
    private String  tags;
    // 分类列表
    private String  categories;
    // 内容状态
    private String  status;
    // 内容所属评论数
    private Integer commentsNum;
    // 是否允许评论
    private Boolean allowComment;
    // 是否允许ping
    private Boolean allowPing;
    // 允许出现在聚合中
    private Boolean allowFeed;
}