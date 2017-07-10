package com.tale.model.entity;

import com.blade.jdbc.annotation.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 附件
 * <p>
 * Created by biezhi on 2017/2/23.
 */
@Data
@NoArgsConstructor
@Table(name = "t_attach")
public class Attach implements Serializable {

    private Integer id;
    private String fname;
    private String ftype;
    private String fkey;
    private Integer author_id;
    private Integer created;

    public Attach(String fname) {
        this.fname = fname;
    }
}
