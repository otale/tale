package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import com.blade.jdbc.core.ActiveRecord;
import com.blade.validator.annotation.Email;
import com.blade.validator.annotation.Length;
import com.blade.validator.annotation.NotEmpty;
import com.blade.validator.annotation.Url;
import lombok.Data;

/**
 * 评论
 *
 * @author biezhi
 */
@Data
@Table(value = "t_comments", pk = "coid")
public class Comments extends ActiveRecord {

    // comment表主键
    private Integer coid;

    // post表主键,关联字段
    private Integer cid;

    // 评论生成时的GMT unix时间戳
    private Integer created;

    // 评论作者
    @NotEmpty(message = "请输入评论作者")
    @Length(max = 30, message = "姓名过长")
    private String author;

    // 评论所属用户id
    private Integer author_id;

    // 评论所属内容作者id
    private Integer owner_id;

    // 评论者邮件
    @NotEmpty(message = "请输入电子邮箱")
    @Email(message = "请输入正确的邮箱格式")
    private String mail;

    // 评论者网址
    @Url
    private String url;

    // 评论者ip地址
    private String ip;

    // 评论者客户端
    private String agent;

    // 评论内容
    @NotEmpty(message = "请输入评论内容")
    @Length(max = 2000, message = "请输入%d个字符以内的评论")
    private String content;

    // 评论类型
    private String type;

    // 评论状态
    private String status;

    // 父级评论
    private Integer parent;

}