package com.tale.interceptor;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.Intercept;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.interceptor.Interceptor;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import com.tale.service.UsersService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Intercept
public class BaseInterceptor implements Interceptor {

    private static final Logger LOGGE = LoggerFactory.getLogger(BaseInterceptor.class);

    @Inject
    private UsersService usersService;

    @Override
    public boolean before(Request request, Response response) {

        String uri = request.uri();

        LOGGE.info("UserAgent: {}", request.userAgent());
        LOGGE.info("用户访问地址: {}, 来路地址: {}", uri, request.address());

        Users user = TaleUtils.getLoginUser();
        if (null == user) {
            Integer uid = TaleUtils.getCookieUid(request);;
            if (null != uid) {
                user = usersService.byId(Integer.valueOf(uid));
                request.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);
            }
        }
        if(uri.startsWith("/admin") && !uri.startsWith("/admin/login") && null == user){
            response.go("/admin/login");
            return false;
        }
        return true;
    }


    @Override
    public boolean after(Request request, Response response) {
        return true;
    }

}
