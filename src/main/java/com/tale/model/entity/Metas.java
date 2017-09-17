package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import com.blade.jdbc.core.ActiveRecord;
import lombok.Data;

/**
 * 元数据
 *
 * @author biezhi
 */
@Data
@Table(value = "t_metas", pk = "mid")
public class Metas extends ActiveRecord {

    // 项目主键
    private Integer mid;
    // 名称
    private String  name;
    // 项目缩略名
    private String  slug;
    // 项目类型
    private String  type;
    // 选项描述
    private String  description;
    // 项目排序
    private Integer sort;
    // 父级
    private Integer parent;
    // 文章数
    private Integer count;

}