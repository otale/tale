package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import com.blade.jdbc.core.ActiveRecord;
import lombok.Data;

/**
 * 数据关系
 *
 * @author biezhi
 */
@Data
@Table(value = "t_relationships", pk = "mid")
public class Relationships extends ActiveRecord {

    // 内容主键
    private Integer cid;

    // 项目主键
    private Integer mid;

}