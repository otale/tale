package com.tale.hooks;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.DateKit;
import com.blade.mvc.hook.Signature;
import com.blade.mvc.hook.WebHook;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.extension.Commons;
import com.tale.model.dto.Types;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.utils.TaleUtils;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static io.github.biezhi.anima.Anima.select;

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

        log.info("IP: {}, UserAgent: {}", ip, request.userAgent());

        if (uri.startsWith(TaleConst.STATIC_URI)) {
            return true;
        }

        if (!TaleConst.INSTALLED && !uri.startsWith(TaleConst.INSTALL_URI)) {
            response.redirect(TaleConst.INSTALL_URI);
            return false;
        }

        if (TaleConst.INSTALLED) {
            return isRedirect(request, response);
        }
        return true;
    }

    @Override
    public boolean after(Signature signature) {
        if(null != TaleUtils.getLoginUser()){
            SysLog sysLog = signature.getAction().getAnnotation(SysLog.class);
            if (null != sysLog) {
                Logs logs = new Logs();
                logs.setAction(sysLog.value());
                logs.setAuthorId(TaleUtils.getLoginUser().getUid());
                logs.setIp(signature.request().address());
                logs.setData(signature.request().bodyToString());
                logs.setCreated(DateKit.nowUnix());
                logs.save();
            }
        }

        signature.request().attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        signature.request().attribute("now", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()));
        return true;
    }

    private boolean isRedirect(Request request, Response response) {
        Users  user = TaleUtils.getLoginUser();
        String uri  = request.uri();
        if (null == user) {
            Integer uid = TaleUtils.getCookieUid(request);
            if (null != uid) {
                user = select().from(Users.class).byId(uid);
                request.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);
            }
        }
        if (uri.startsWith(TaleConst.ADMIN_URI) && !uri.startsWith(TaleConst.LOGIN_URI)) {
            if (null == user) {
                response.redirect(TaleConst.LOGIN_URI);
                return false;
            }
            request.attribute(TaleConst.PLUGINS_MENU_NAME, TaleConst.PLUGIN_MENUS);
        }
        return true;
    }

}
