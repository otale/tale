package com.tale.controller.admin;

import com.blade.Environment;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.JsonKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import com.tale.model.dto.BackResponse;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import jetbrick.util.ShellUtils;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 后台控制器
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin", restful = true)
public class SystemController extends BaseController {

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    /**
     * 保存系统设置
     */
    @PostRoute("setting")
    public RestResponse<?> saveSetting(@Param String site_theme, Request request) {
        Map<String, List<String>> querys = request.parameters();
        querys.forEach((k, v) -> optionsService.saveOption(k, v.get(0)));

        Environment config = Environment.of(optionsService.getOptions());
        TaleConst.OPTIONS = config;

        new Logs(LogActions.SYS_SETTING, JsonKit.toString(querys), request.address(), this.getUid()).save();
        return RestResponse.ok();
    }

    /**
     * 保存个人信息
     */
    @PostRoute("profile")
    public RestResponse saveProfile(@Param String screenName, @Param String email, Request request) {
        Users users = this.user();
        if (StringKit.isNotBlank(screenName) && StringKit.isNotBlank(email)) {
            Users temp = new Users();
            temp.setScreenName(screenName);
            temp.setEmail(email);
            temp.updateById(users.getUid());
            new Logs(LogActions.UP_INFO, JsonKit.toString(temp), request.address(), this.getUid()).save();
        }
        return RestResponse.ok();
    }

    /**
     * 修改密码
     */
    @PostRoute("password")
    public RestResponse upPwd(@Param String old_password, @Param String password, Request request) {
        Users users = this.user();
        if (StringKit.isBlank(old_password) || StringKit.isBlank(password)) {
            return RestResponse.fail("请确认信息输入完整");
        }

        if (!users.getPassword().equals(EncryptKit.md5(users.getUsername() + old_password))) {
            return RestResponse.fail("旧密码错误");
        }
        if (password.length() < 6 || password.length() > 14) {
            return RestResponse.fail("请输入6-14位密码");
        }

        Users  temp = new Users();
        String pwd  = EncryptKit.md5(users.getUsername() + password);
        temp.setPassword(pwd);
        temp.updateById(users.getUid());
        new Logs(LogActions.UP_PWD, null, request.address(), this.getUid()).save();
        return RestResponse.ok();
    }

    /**
     * 系统备份
     */
    @PostRoute("backup")
    public RestResponse<?> backup(@Param String bk_type, @Param String bk_path,
                                  Request request) throws Exception {
        if (StringKit.isBlank(bk_type)) {
            return RestResponse.fail("请确认信息输入完整");
        }

        BackResponse backResponse = siteService.backup(bk_type, bk_path, "yyyyMMddHHmm");
        new Logs(LogActions.SYS_BACKUP, null, request.address(), this.getUid()).save();
        return RestResponse.ok(backResponse);
    }

    /**
     * 保存高级选项设置
     */
    @PostRoute("advanced")
    public RestResponse<?> doAdvanced(@Param String cache_key, @Param String block_ips,
                                      @Param String plugin_name, @Param String rewrite_url,
                                      @Param String allow_install) {
        // 清除缓存
        if (StringKit.isNotBlank(cache_key)) {
            if ("*".equals(cache_key)) {
                cache.clean();
            } else {
                cache.del(cache_key);
            }
        }
        // 要过过滤的黑名单列表
        if (StringKit.isNotBlank(block_ips)) {
            optionsService.saveOption(Types.BLOCK_IPS, block_ips);
            TaleConst.BLOCK_IPS.addAll(Arrays.asList(block_ips.split(",")));
        } else {
            optionsService.saveOption(Types.BLOCK_IPS, "");
            TaleConst.BLOCK_IPS.clear();
        }
        // 处理卸载插件
        if (StringKit.isNotBlank(plugin_name)) {
            String key = "plugin_";
            // 卸载所有插件
            if (!"*".equals(plugin_name)) {
                key = "plugin_" + plugin_name;
            } else {
                optionsService.saveOption(Types.ATTACH_URL, Commons.site_url());
            }
            optionsService.deleteOption(key);
        }
        // 是否允许重新安装
        if (StringKit.isNotBlank(allow_install)) {
            optionsService.saveOption("allow_install", allow_install);
            TaleConst.OPTIONS.toMap().put("allow_install", allow_install);
        }

        return RestResponse.ok();
    }

    /**
     * 重启系统
     */
    @GetRoute("reload")
    public void reload(@Param(defaultValue = "0") int sleep, Request request) throws InterruptedException {
        if (sleep < 0 || sleep > 999) {
            sleep = 10;
        }
        // sh tale.sh reload 10
        String webHome = new File(AttachController.CLASSPATH).getParent();
        String cmd     = "sh " + webHome + "/bin tale.sh reload " + sleep;
        log.info("execute shell: {}", cmd);
        ShellUtils.shell(cmd);
        new Logs(LogActions.RELOAD_SYS, "", request.address(), this.getUid()).save();
        TimeUnit.SECONDS.sleep(sleep);
    }
}
