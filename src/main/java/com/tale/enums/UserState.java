package com.tale.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author biezhi
 * @date 2017/10/31
 */
@AllArgsConstructor
public enum UserState {

    ENABLED(1, "启用"), DISABLE(0, "禁用");

    @Getter
    private Integer state;
    @Getter
    private String  desc;

}
