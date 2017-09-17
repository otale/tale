package com.tale.service;

import com.tale.model.entity.Users;
import com.tale.model.param.LoginParam;

public interface UsersService {

    /**
     * 根据用户id查询
     *
     * @param uid
     * @return
     */
    Users byId(Integer uid);

    /**
     * 更新用户信息
     *
     * @param users
     */
    void update(Users users);

    /**
     * 用户登录
     *
     * @return
     */
    Users login(LoginParam loginParam);
}
