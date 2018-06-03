package com.tale.model.entity;

import io.github.biezhi.anima.Model;
import io.github.biezhi.anima.annotation.Table;
import lombok.Data;

/**
 * 评论
 *
 * @author biezhi
 */
@Data
@Table(name = "t_comments", pk = "coid")
public class Comments extends Model {

    // comment表主键
    private Integer coid;

    // post表主键,关联字段
    private Integer cid;

    // 评论生成时的GMT unix时间戳
    private Integer created;

    // 评论作者
    private String author;

    // 评论所属用户id
    private Integer authorId;

    // 评论所属内容作者id
    private Integer ownerId;

    // 评论者邮件
    private String mail;

    // 评论者网址
    private String url;

    // 评论者ip地址
    private String ip;

    // 评论者客户端
    private String agent;

    // 评论内容
    private String content;

    // 评论类型
    private String type;

    // 评论状态
    private String status;

    // 父级评论
    private Integer parent;

}