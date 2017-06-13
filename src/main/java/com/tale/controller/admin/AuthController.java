package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.LogActions;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import com.tale.service.LogService;
import com.tale.service.UsersService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 登录，退出
 * Created by biezhi on 2017/2/21.
 */
@Path("admin")
public class AuthController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Inject
    private UsersService usersService;

    @Inject
    private LogService logService;

    @Route(value = "login", method = HttpMethod.GET)
    public String login(Response response) {
        if (null != this.user()) {
            response.redirect("/admin/index");
            return null;
        }
        return "admin/login";
    }

    @Route(value = "login", method = HttpMethod.POST)
    @JSON
    public RestResponse doLogin(@QueryParam String username,
                                @QueryParam String password,
                                @QueryParam String remeber_me,
                                Request request,
                                Session session, Response response) {

        Integer error_count = cache.get("login_error_count");
        try {
            error_count = null == error_count ? 0 : error_count;

            if (null != error_count && error_count > 3) {
                return RestResponse.fail("您输入密码已经错误超过3次，请10分钟后尝试");
            }

            Users user = usersService.login(username, password);
            session.attribute(TaleConst.LOGIN_SESSION_KEY, user);
            if (StringKit.isNotBlank(remeber_me)) {
                TaleUtils.setCookie(response, user.getUid());
            }
            Users temp = new Users();
            temp.setUid(user.getUid());
            temp.setLogged(DateKit.nowUnix());
            usersService.update(temp);
            LOGGER.info("登录成功：{}", username);
            cache.set("login_error_count", 0);
            logService.save(LogActions.LOGIN, username, request.address(), user.getUid());
        } catch (Exception e) {
            error_count += 1;
            cache.set("login_error_count", error_count, 10 * 60);
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
