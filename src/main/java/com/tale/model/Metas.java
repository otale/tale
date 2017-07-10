package com.tale.model;

import com.blade.jdbc.annotation.Table;
import lombok.Data;

import java.io.Serializable;

/**
 * 元数据
 *
 * @author biezhi
 */
@Data
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

}