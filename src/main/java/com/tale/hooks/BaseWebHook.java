package com.tale.hooks;

import com.blade.ioc.annotation.Bean;
import com.blade.mvc.hook.Signature;
import com.blade.mvc.hook.WebHook;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.tale.init.TaleConst;
import com.tale.model.entity.Users;
import com.tale.utils.TaleUtils;
import lombok.extern.slf4j.Slf4j;

@Bean
@Slf4j
public class BaseWebHook implements WebHook {

    @Override
    public boolean before(Signature signature) {
        Request  request  = signature.request();
        Response response = signature.response();

        String uri = request.uri();
        String ip  = request.address();

        // 禁止该ip访问
        if (TaleConst.BLOCK_IPS.contains(ip)) {
            response.text("You have been banned, brother");
            return false;
        }

        log.info("UserAgent: {}", request.userAgent());
        log.info("用户访问地址: {}, 来路地址: {}", uri, ip);

        if (uri.startsWith("/static")) {
            return true;
        }

        if (!TaleConst.INSTALL && !uri.startsWith("/install")) {
            response.redirect("/install");
            return false;
        }

        if (TaleConst.INSTALL) {
            Users user = TaleUtils.getLoginUser();
            if (null == user) {
                Integer uid = TaleUtils.getCookieUid(request);
                if (null != uid) {
                    user = new Users().find(uid);
                    request.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);
                }
            }

            if (uri.startsWith("/admin") && !uri.startsWith("/admin/login")) {
                if (null == user) {
                    response.redirect("/admin/login");
                    return false;
                }
                request.attribute("PLUGIN_MENUS", TaleConst.PLUGIN_MENUS);
            }
        }
        return true;
    }

}
