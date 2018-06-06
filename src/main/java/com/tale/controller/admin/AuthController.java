package com.tale.controller.admin;

import com.blade.exception.ValidatorException;
import com.blade.kit.DateKit;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.model.entity.Users;
import com.tale.model.params.LoginParam;
import com.tale.utils.TaleUtils;
import com.tale.validators.CommonValidator;
import lombok.extern.slf4j.Slf4j;

import static io.github.biezhi.anima.Anima.select;

/**
 * 登录，退出
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin", restful = true)
public class AuthController extends BaseController {

    @SysLog("登录后台")
    @PostRoute("login")
    public RestResponse<?> doLogin(LoginParam loginParam, Request request,
                                   Session session, Response response) {

        CommonValidator.valid(loginParam);

        Integer error_count = cache.get("login_error_count");
        try {
            error_count = null == error_count ? 0 : error_count;
            if (error_count > 3) {
                return RestResponse.fail("您输入密码已经错误超过3次，请10分钟后尝试");
            }

            long count = new Users().where("username", loginParam.getUsername()).count();
            if (count < 1) {
                return RestResponse.fail("不存在该用户");
            }
            String pwd = EncryptKit.md5(loginParam.getUsername(), loginParam.getPassword());

            Users user = select().from(Users.class)
                    .where(Users::getUsername, loginParam.getUsername())
                    .and(Users::getPassword, pwd).one();

            if (null == user) {
                return RestResponse.fail("用户名或密码错误");
            }
            session.attribute(TaleConst.LOGIN_SESSION_KEY, user);
            if (StringKit.isNotBlank(loginParam.getRememberMe())) {
                TaleUtils.setCookie(response, user.getUid());
            }

            Users temp = new Users();
            temp.setLogged(DateKit.nowUnix());
            temp.updateById(user.getUid());
            log.info("登录成功：{}", loginParam.getUsername());
            cache.set("login_error_count", 0);
        } catch (Exception e) {
            error_count += 1;
            cache.set("login_error_count", error_count, 10 * 60);
            String msg = "登录失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
