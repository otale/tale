package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.kit.EncrypKit;
import com.blade.kit.StringKit;
import com.tale.exception.TipException;
import com.tale.model.entity.Users;
import com.tale.service.UsersService;

/**
 * 用户Service实现
 *
 * @author biezhi
 */
@Bean
public class UsersServiceImpl implements UsersService {

    @Inject
    private ActiveRecord activeRecord;

    @Override
    public Users byId(Integer uid) {
        if (null == uid) {
            return null;
        }
        return activeRecord.byId(Users.class, uid);
    }

    @Override
    public void update(Users users) {
        if (null == users || null == users.getUid()) {
            throw new TipException("对象为空");
        }
        activeRecord.update(users);
    }

    @Override
    public Users login(String username, String password) {

        if (StringKit.isBlank(username) || StringKit.isBlank(password)) {
            throw new TipException("用户名和密码不能为空");
        }

        int count = activeRecord.count(new Take(Users.class).eq("username", username));
        if (count < 1) {
            throw new TipException("不存在该用户");
        }
        String pwd = EncrypKit.md5(username, password);
        Users users = activeRecord.one(new Take(Users.class).eq("username", username).eq("password", pwd));
        if (null == users) {
            throw new TipException("用户名或密码错误");
        }
        return users;
    }
}
