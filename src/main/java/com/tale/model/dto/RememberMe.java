package com.tale.model.dto;

import lombok.Data;

import java.util.List;

/**
 * 记住我数据结构
 *
 * @author biezhi
 * @date 2018-10-25
 */
@Data
public class RememberMe {

    private Integer      uid;
    private Integer      expires;
    private String       token;
    private List<String> recentIp;

}
