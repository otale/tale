package com.tale.model.entity;

import io.github.biezhi.anima.Model;
import io.github.biezhi.anima.annotation.Ignore;
import io.github.biezhi.anima.annotation.Table;
import lombok.Data;

/**
 * 元数据
 *
 * @author biezhi
 */
@Data
@Table(name = "t_metas", pk = "mid")
public class Metas extends Model {

    /**
     * 项目主键
     */
    private Integer mid;

    /**
     * 项目名称
     */
    private String  name;

    /**
     * 项目缩略名
     */
    private String  slug;

    /**
     * 项目类型
     */
    private String  type;

    /**
     * 项目描述
     */
    private String  description;

    /**
     * 项目排序
     */
    private Integer sort;

    /**
     * 父级
     */
    private Integer parent;

    /**
     * 项目下文章数
     */
    @Ignore
    private Integer count;

}