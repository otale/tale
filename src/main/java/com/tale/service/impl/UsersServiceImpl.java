package com.tale.service.impl;

import java.util.List;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;

import com.blade.kit.StringKit;
import com.blade.kit.Tools;
import com.tale.model.Users;
import com.tale.exception.TipException;
import com.tale.service.UsersService;

@Service
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
    public List<Users> getUsersList(Take take) {
        if (null != take) {
            if (null != take.getPageRow()) {
                return this.getUsersPage(take).getList();
            }
            return activeRecord.list(take);
        }
        return null;
    }

    @Override
    public Paginator<Users> getUsersPage(Take take) {
        if (null != take) {
            return activeRecord.page(take);
        }
        return null;
    }

    @Override
    public void save(Users users) throws Exception {
        if (null == users) {
            throw new TipException("对象为空");
        }
        try {
            activeRecord.insert(users);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void update(Users users) throws Exception {
        if (null == users) {
            throw new TipException("对象为空");
        }
        try {
            activeRecord.update(users);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void delete(Integer uid) throws Exception {
        if (null == uid) {
            throw new TipException("主键为空");
        }
        try {
            activeRecord.delete(Users.class, uid);
        } catch (Exception e) {
            throw e;
        }
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
        String pwd = Tools.md5(username, password);
        Users users = activeRecord.one(new Take(Users.class).eq("username", username).eq("password", pwd));
        if(null == users){
            throw new TipException("用户名或密码错误");
        }
        return users;
    }
}
