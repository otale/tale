package com.tale.model;

import com.blade.jdbc.annotation.Table;

import java.io.Serializable;

//
@Table(name = "t_options", pk = "name")
public class Options implements Serializable {

    private static final long serialVersionUID = 1L;

    // 配置名称
    private String name;

    // 配置值
    private String value;

    // 配置描述
    private String description;

    public Options() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}