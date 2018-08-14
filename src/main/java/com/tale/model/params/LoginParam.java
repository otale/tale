package com.tale.model.params;

import lombok.Data;

/**
 * 登录参数
 *
 * @author biezhi
 * @date 2017/9/17
 */
@Data
public class LoginParam {

    private String username;
    private String password;
    private String rememberMe;

}
