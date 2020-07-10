package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.kit.DateKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.entity.Users;
import com.tale.service.UsersService;
import lombok.extern.slf4j.Slf4j;

/**
 * 用户管理
 * <p>
 * Created by biezhi on 2017/10/31.
 */
@Slf4j
@Path("admin/users")
public class UsersController extends BaseController {

    @Inject
    private UsersService usersService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request) {
        Page<Users> usersPage = new Users().page(1, TaleConst.MAX_POSTS);
        request.attribute("users", usersPage);
        return "admin/user_list";
    }

    /**
     * 创建用户
     *
     * @param users
     * @return
     */
    @PostRoute("create")
    @JSON
    public RestResponse create(@Param Users users) {
        try {
            Integer time = DateKit.nowUnix();
            users.setCreated(time);
            usersService.saveUser(users);
        } catch (Exception e) {
            String msg = "操作失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }


    /**
     * 删除用户
     *
     * @param users
     * @return
     */
    @PostRoute("delete")
    @JSON
    public RestResponse delete(@Param Users users) {
        try {
            usersService.deleteUser(users);
        } catch (Exception e) {
            String msg = "操作失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @PostRoute("update")
    @JSON
    public RestResponse update(@Param Users users) {
        try {
            usersService.updateUser(users);
        } catch (Exception e) {
            String msg = "操作失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
