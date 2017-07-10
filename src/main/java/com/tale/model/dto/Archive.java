package com.tale.model.dto;

import com.tale.model.entity.Contents;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 文章归档
 *
 * Created by biezhi on 2017/2/23.
 */
@Data
public class Archive implements Serializable {

    private String date_str;
    private Date date;
    private String count;
    private List<Contents> articles;

}
