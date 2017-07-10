package com.tale.model;

import com.blade.jdbc.annotation.Table;
import lombok.Data;

import java.io.Serializable;

/**
 * 配置选项
 *
 * @author biezhi
 */
@Data
@Table(name = "t_options", pk = "name")
public class Options implements Serializable {

    private static final long serialVersionUID = 1L;

    // 配置名称
    private String name;

    // 配置值
    private String value;

    // 配置描述
    private String description;

}