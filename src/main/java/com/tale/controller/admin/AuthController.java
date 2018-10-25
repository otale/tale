package com.tale.controller.admin;

import com.blade.exception.ValidatorException;
import com.blade.kit.DateKit;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.blade.mvc.RouteContext;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.model.entity.Users;
import com.tale.model.params.LoginParam;
import com.tale.utils.TaleUtils;
import com.tale.validators.CommonValidator;
import lombok.extern.slf4j.Slf4j;

import static com.tale.bootstrap.TaleConst.LOGIN_ERROR_COUNT;
import static io.github.biezhi.anima.Anima.select;

/**
 * 登录，退出
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin", restful = true)
public class AuthController extends BaseController {

    @SysLog("登录后台")
    @PostRoute("login")
    public RestResponse<?> doLogin(LoginParam loginParam, RouteContext context) {

        CommonValidator.valid(loginParam);

        Integer errorCount = cache.get(LOGIN_ERROR_COUNT);
        try {
            errorCount = null == errorCount ? 0 : errorCount;
            if (errorCount > 3) {
                return RestResponse.fail("您输入密码已经错误超过3次，请10分钟后尝试");
            }

            long count = new Users().where("username", loginParam.getUsername()).count();
            if (count < 1) {
                errorCount += 1;
                return RestResponse.fail("不存在该用户");
            }
            String pwd = EncryptKit.md5(loginParam.getUsername(), loginParam.getPassword());

            Users user = select().from(Users.class)
                    .where(Users::getUsername, loginParam.getUsername())
                    .and(Users::getPassword, pwd).one();

            if (null == user) {
                errorCount += 1;
                return RestResponse.fail("用户名或密码错误");
            }
            context.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);

            if (StringKit.isNotBlank(loginParam.getRememberMe())) {
                TaleUtils.setCookie(context, user.getUid());
            }

            Users temp = new Users();
            temp.setLogged(DateKit.nowUnix());
            temp.updateById(user.getUid());
            log.info("登录成功：{}", loginParam.getUsername());

            cache.set(LOGIN_ERROR_COUNT, 0);

            return RestResponse.ok();

        } catch (Exception e) {
            errorCount += 1;
            cache.set(LOGIN_ERROR_COUNT, errorCount, 10 * 60);
            String msg = "登录失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}
