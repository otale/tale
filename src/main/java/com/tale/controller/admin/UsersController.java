package com.tale.controller.admin;

import com.blade.jdbc.page.Page;
import com.blade.kit.DateKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.init.TaleConst;
import com.tale.model.entity.Users;
import lombok.extern.slf4j.Slf4j;

/**
 * 用户管理
 * <p>
 * Created by biezhi on 2017/10/31.
 */
@Slf4j
@Path("admin/users")
public class UsersController extends BaseController {

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
        System.out.println(users);
        Integer time = DateKit.nowUnix();
        users.setCreated(time);
        return RestResponse.ok();
    }

    @PostRoute("update")
    @JSON
    public RestResponse update(@Param Users users) {
        System.out.println(users);
        return RestResponse.ok();
    }

}
