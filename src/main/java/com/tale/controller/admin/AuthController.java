package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.wrapper.Session;
import com.blade.mvc.view.RestResponse;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import com.tale.service.UsersService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Inject
    private UsersService usersService;

    @Route(value = "login", method = HttpMethod.GET)
    public String login() {
        return "admin/login";
    }

    @Route(value = "login", method = HttpMethod.POST)
    @JSON
    public RestResponse doLogin(@QueryParam String username,
                                @QueryParam String password,
                                @QueryParam String remeber_me,
                                Session session, Response response) {
        try {
            Users user = usersService.login(username, password);
            session.attribute(TaleConst.LOGIN_SESSION_KEY, user);
            if (StringKit.isNotBlank(remeber_me)) {
                TaleUtils.setCookie(response, user.getUid());
            }
        } catch (Exception e) {
            String msg = "登录失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
