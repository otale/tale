package com.tale.model.params;

import lombok.Data;

/**
 * 分页基础参数
 *
 * @author biezhi
 * @date 2018/6/5
 */
@Data
public class PageParam {

    private Integer page = 1;
    private Integer limit = 12;

}
