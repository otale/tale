package com.tale.model.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * Created by biezhi on 2017/2/25.
 */
@Data
public class BackResponse implements Serializable {

    private static final long serialVersionUID = 5992812699862539321L;
	private String attach_path;
    private String theme_path;
    private String sql_path;

}
