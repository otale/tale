package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.jdbc.utils.StringUtils;
import com.blade.kit.EncryptKit;
import com.tale.model.entity.Users;

/**
 * Created by chaihaipeng on 2018/4/2.
 */
@Bean
public class UsersService {

    /**
     * 查询用户
     *
     * @param uid
     * @return
     */
    public Users findUser(Integer uid) {
        if (uid == null) return new Users();
        return new Users().find(uid);
    }

    /**
     * 保存用户
     *
     * @param user
     */
    public void saveUser(Users user) {
        try {
            if (user != null) {
                user.setScreenName(user.getUsername());
                user.setPassword(EncryptKit.md5(user.getUsername(), user.getPassword()));
                user.save();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 更新用户
     *
     * @param user
     */
    public void updateUser(Users user) {
        try {
            if (user != null && user.getUid() != null) {
                Users users = new Users().find(user.getUid());
                if (users != null) {
                    Users temp = new Users();
                    if (StringUtils.isNotBlank(user.getPassword())) {
                        temp.setPassword(EncryptKit.md5(user.getUsername(), user.getPassword()));
                    }
                    if (user.getState() != null) {
                        temp.setState(user.getState());
                    }
                    temp.update(user.getUid());
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 删除用户
     *
     * @param user
     */
    public void deleteUser(Users user) {
        try {
            if (user != null && user.getUid() != null) {
                new Users().delete("uid", user.getUid());
            }
        } catch (Exception e) {
            throw e;
        }
    }

}
