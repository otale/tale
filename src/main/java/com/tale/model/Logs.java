package com.tale.model;

import com.blade.jdbc.annotation.Table;
import lombok.Data;

import java.io.Serializable;

/**
 * 日志记录
 *
 * @author biezhi
 */
@Data
@Table(name = "t_logs")
public class Logs implements Serializable {

    private static final long serialVersionUID = 1L;

    // 项目主键
    private Integer id;

    // 产生的动作
    private String action;

    // 产生的数据
    private String data;

    // 发生人id
    private Integer author_id;

    // 日志产生的ip
    private String ip;

    // 日志创建时间
    private Integer created;

}