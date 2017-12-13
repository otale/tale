package com.tale.controller.admin;

import com.blade.Environment;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.kit.EncryptKit;
import com.blade.kit.JsonKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.init.TaleConst;
import com.tale.model.dto.BackResponse;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Statistics;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
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
@Path("admin")
public class IndexController extends BaseController {

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    /**
     * 仪表盘
     */
    @Route(value = {"/", "index"}, method = HttpMethod.GET)
    public String index(Request request) {
        List<Comments> comments   = siteService.recentComments(5);
        List<Contents> contents   = siteService.getContens(Types.RECENT_ARTICLE, 5);
        Statistics     statistics = siteService.getStatistics();
        // 取最新的20条日志
        Page<Logs> logsPage = new Logs().page(1, 20, "id desc");
        List<Logs> logs     = logsPage.getRows();

        request.attribute("comments", comments);
        request.attribute("articles", contents);
        request.attribute("statistics", statistics);
        request.attribute("logs", logs);
        return "admin/index";
    }

    /**
     * 系统设置
     */
    @Route(value = "setting", method = HttpMethod.GET)
    public String setting(Request request) {
        Map<String, String> options = optionsService.getOptions();
        request.attribute("options", options);
        return "admin/setting";
    }

    /**
     * 保存系统设置
     */
    @Route(value = "setting", method = HttpMethod.POST)
    @JSON
    public RestResponse saveSetting(@Param String site_theme, Request request) {
        try {
            Map<String, List<String>> querys = request.parameters();
            optionsService.saveOptions(querys);

            Environment config = Environment.of(optionsService.getOptions());
            TaleConst.OPTIONS = config;

            new Logs(LogActions.SYS_SETTING, JsonKit.toString(querys), request.address(), this.getUid()).save();
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "保存设置失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 个人设置页面
     */
    @Route(value = "profile", method = HttpMethod.GET)
    public String profile() {
        return "admin/profile";
    }

    /**
     * 保存个人信息
     */
    @Route(value = "profile", method = HttpMethod.POST)
    @JSON
    public RestResponse saveProfile(@Param String screen_name, @Param String email, Request request) {
        Users users = this.user();
        if (StringKit.isNotBlank(screen_name) && StringKit.isNotBlank(email)) {
            Users temp = new Users();
            temp.setScreen_name(screen_name);
            temp.setEmail(email);
            temp.update(users.getUid());
            new Logs(LogActions.UP_INFO, JsonKit.toString(temp), request.address(), this.getUid()).save();
        }
        return RestResponse.ok();
    }

    /**
     * 修改密码
     */
    @Route(value = "password", method = HttpMethod.POST)
    @JSON
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

        try {
            Users  temp = new Users();
            String pwd  = EncryptKit.md5(users.getUsername() + password);
            temp.setPassword(pwd);
            temp.update(users.getUid());
            new Logs(LogActions.UP_PWD, null, request.address(), this.getUid()).save();
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "密码修改失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 系统备份
     *
     * @return
     */
    @Route(value = "backup", method = HttpMethod.POST)
    @JSON
    public RestResponse backup(@Param String bk_type, @Param String bk_path,
                               Request request) {
        if (StringKit.isBlank(bk_type)) {
            return RestResponse.fail("请确认信息输入完整");
        }

        try {
            BackResponse backResponse = siteService.backup(bk_type, bk_path, "yyyyMMddHHmm");
            new Logs(LogActions.SYS_BACKUP, null, request.address(), this.getUid()).save();
            return RestResponse.ok(backResponse);
        } catch (Exception e) {
            String msg = "备份失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 保存高级选项设置
     *
     * @return
     */
    @Route(value = "advanced", method = HttpMethod.POST)
    @JSON
    public RestResponse doAdvanced(@Param String cache_key, @Param String block_ips,
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
     *
     * @param sleep
     * @return
     */
    @Route(value = "reload", method = HttpMethod.GET)
    public void reload(@Param(defaultValue = "0") int sleep, Request request) {
        if (sleep < 0 || sleep > 999) {
            sleep = 10;
        }
        try {
            // sh tale.sh reload 10
            String webHome = new File(AttachController.CLASSPATH).getParent();
            String cmd     = "sh " + webHome + "/bin tale.sh reload " + sleep;
            log.info("execute shell: {}", cmd);
            ShellUtils.shell(cmd);
            new Logs(LogActions.RELOAD_SYS, "", request.address(), this.getUid()).save();
            TimeUnit.SECONDS.sleep(sleep);
        } catch (Exception e) {
            log.error("重启系统失败", e);
        }
    }
}
