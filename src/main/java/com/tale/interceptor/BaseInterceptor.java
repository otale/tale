package com.tale.interceptor;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.IPKit;
import com.blade.kit.StringKit;
import com.blade.kit.UUID;
import com.blade.mvc.annotation.Intercept;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.interceptor.Interceptor;
import com.tale.dto.Types;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import com.tale.service.UsersService;
import com.tale.utils.MapCache;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Intercept
public class BaseInterceptor implements Interceptor {

    private static final Logger LOGGE = LoggerFactory.getLogger(BaseInterceptor.class);

    @Inject
    private UsersService usersService;

    private MapCache cache = MapCache.single();

    @Override
    public boolean before(Request request, Response response) {

        String uri = request.uri();
        String ip = IPKit.getIpAddrByRequest(request.raw());

        // 禁止该ip访问
        if(TaleConst.BLOCK_IPS.contains(ip)){
            response.text("You have been banned, brother");
            return false;
        }

        LOGGE.info("UserAgent: {}", request.userAgent());
        LOGGE.info("用户访问地址: {}, 来路地址: {}", uri, ip);

        if (!TaleConst.INSTALL && !uri.startsWith("/install")) {
            response.go("/install");
            return false;
        }

        if (TaleConst.INSTALL) {
            Users user = TaleUtils.getLoginUser();
            if (null == user) {
                Integer uid = TaleUtils.getCookieUid(request);
                if (null != uid) {
                    user = usersService.byId(Integer.valueOf(uid));
                    request.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);
                }
            }

            if(uri.startsWith("/admin") && !uri.startsWith("/admin/login")){
                if(null == user){
                    response.go("/admin/login");
                    return false;
                }
                request.attribute("plugin_menus", TaleConst.plugin_menus);
            }
        }
        String method = request.method();
        if(method.equals("GET")){
            String csrf_token = UUID.UU64();
            // 默认存储20分钟
            int timeout = TaleConst.BCONF.getInt("app.csrf-token-timeout", 20) * 60;
            cache.hset(Types.CSRF_TOKEN, csrf_token, uri, timeout);
            request.attribute("_csrf_token", csrf_token);
        }
        return true;
    }


    @Override
    public boolean after(Request request, Response response) {
        String _csrf_token = request.attribute("del_csrf_token");
        if(StringKit.isNotBlank(_csrf_token)){
            // 移除本次token
            cache.hdel(Types.CSRF_TOKEN, _csrf_token);
        }
        return true;
    }

}
