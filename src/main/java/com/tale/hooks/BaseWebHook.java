package com.tale.hooks;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.DateKit;
import com.blade.mvc.RouteContext;
import com.blade.mvc.hook.WebHook;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.utils.TaleUtils;
import lombok.extern.slf4j.Slf4j;

import static io.github.biezhi.anima.Anima.select;

@Bean
@Slf4j
public class BaseWebHook implements WebHook {

    @Override
    public boolean before(RouteContext context) {
        String uri = context.uri();
        String ip  = context.address();

        // 禁止该ip访问
        if (TaleConst.BLOCK_IPS.contains(ip)) {
            context.text("You have been banned, brother");
            return false;
        }

        log.info("IP: {}, UserAgent: {}", ip, context.userAgent());

        if (uri.startsWith(TaleConst.STATIC_URI)) {
            return true;
        }

        if (!TaleConst.INSTALLED && !uri.startsWith(TaleConst.INSTALL_URI)) {
            context.redirect(TaleConst.INSTALL_URI);
            return false;
        }

        if (TaleConst.INSTALLED) {
            return isRedirect(context);
        }
        return true;
    }

    @Override
    public boolean after(RouteContext context) {
        if(null != TaleUtils.getLoginUser()){
            SysLog sysLog = context.routeAction().getAnnotation(SysLog.class);
            if (null != sysLog) {
                Logs logs = new Logs();
                logs.setAction(sysLog.value());
                logs.setAuthorId(TaleUtils.getLoginUser().getUid());
                logs.setIp(context.request().address());
                if(!context.request().uri().contains("upload")){
                    logs.setData(context.request().bodyToString());
                }
                logs.setCreated(DateKit.nowUnix());
                logs.save();
            }
        }
        return true;
    }

    private boolean isRedirect(RouteContext context) {
        Users  user = TaleUtils.getLoginUser();
        String uri  = context.uri();
        if (uri.startsWith(TaleConst.ADMIN_URI) && !uri.startsWith(TaleConst.LOGIN_URI)) {
            context.attribute(TaleConst.PLUGINS_MENU_NAME, TaleConst.PLUGIN_MENUS);
            if(null != user){
                return true;
            }

            Integer uid = TaleUtils.getCookieUid(context);
            if (null != uid) {
                user = select().from(Users.class).byId(uid);
                context.session().attribute(TaleConst.LOGIN_SESSION_KEY, user);
            }
            if (null == user) {
                context.redirect(TaleConst.LOGIN_URI);
                return false;
            }
        }
        return true;
    }

}
