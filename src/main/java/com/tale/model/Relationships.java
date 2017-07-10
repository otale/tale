package com.tale.model;

import com.blade.jdbc.annotation.Table;
import lombok.Data;

import java.io.Serializable;

/**
 * 数据关系
 *
 * @author biezhi
 */
@Data
@Table(name = "t_relationships", pk = "mid")
public class Relationships implements Serializable {

    private static final long serialVersionUID = 1L;

    // 内容主键
    private Integer cid;

    // 项目主键
    private Integer mid;

}