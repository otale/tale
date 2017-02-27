package com.tale.controller;


import com.blade.Blade;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.FileKit;
import com.blade.kit.StringKit;
import com.blade.kit.base.Config;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.dto.JdbcConf;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.init.TaleJdbc;
import com.tale.model.Users;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller("install")
public class InstallController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(InstallController.class);

    @Inject
    private SiteService siteService;

    @Inject
    private OptionsService optionsService;

    /**
     * 安装页
     *
     * @return
     */
    @Route(value = "/", method = HttpMethod.GET)
    public String index(Request request) {
        String webRoot = Blade.$().webRoot();
        boolean existInstall = FileKit.exist(webRoot + "/install.lock");
        if (existInstall) {
            request.attribute("is_install", !"1".equals(TaleConst.OPTIONS.get("allow_install")));
        } else {
            request.attribute("is_install", false);
        }
        return "install";
    }

    @Route(value = "/", method = HttpMethod.POST)
    @JSON
    public RestResponse doInstall(@QueryParam String site_title, @QueryParam String site_url,
                                  @QueryParam String admin_user, @QueryParam String admin_email,
                                  @QueryParam String admin_pwd,
                                  @QueryParam String db_host, @QueryParam String db_name,
                                  @QueryParam String db_user, @QueryParam String db_pass) {

        try {
            if (StringKit.isBlank(site_title) ||
                    StringKit.isBlank(site_url) ||
                    StringKit.isBlank(admin_user) ||
                    StringKit.isBlank(admin_pwd)) {
                return RestResponse.fail("请确认网站信息输入完整");
            }

            if (StringKit.isBlank(db_host) ||
                    StringKit.isBlank(db_name) ||
                    StringKit.isBlank(db_user) ||
                    StringKit.isBlank(db_pass)) {
                return RestResponse.fail("请确认数据库信息输入完整");
            }

            if (admin_pwd.length() < 6 || admin_pwd.length() > 14) {
                return RestResponse.fail("请输入6-14位密码");
            }

            if (StringKit.isNotBlank(admin_email) && !TaleUtils.isEmail(admin_email)) {
                return RestResponse.fail("邮箱格式不正确");
            }

            TaleJdbc.injection(Blade.$().ioc());

            Users users = new Users();
            users.setUsername(admin_user);
            users.setPassword(admin_pwd);
            users.setEmail(admin_email);

            JdbcConf jdbcConf = new JdbcConf(db_host, db_name, db_user, db_pass);

            siteService.initSite(users, jdbcConf);

            if (site_url.endsWith("/")) {
                site_url = site_url.substring(0, site_url.length() - 1);
            }
            if (!site_url.startsWith("http")) {
                site_url = "http://".concat(site_url);
            }
            optionsService.saveOption("site_title", site_title);
            optionsService.saveOption("site_url", site_url);

            Config config = new Config();
            config.addAll(optionsService.getOptions());
            TaleConst.OPTIONS = config;
            TaleConst.INSTALL = true;
            Commons.setSiteService(siteService);

        } catch (Exception e) {
            String msg = "安装失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    /**
     * 测试数据库连接
     *
     * @return
     */
    @Route(value = "conn_test", method = HttpMethod.POST)
    @JSON
    public RestResponse conn_test(@QueryParam String db_host, @QueryParam String db_name,
                                  @QueryParam String db_user, @QueryParam String db_pass) {

        String url = "jdbc:mysql://" + db_host + "/" + db_name + "?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull";
        TaleJdbc.put("url", url);
        TaleJdbc.put("username", db_user);
        TaleJdbc.put("password", db_pass);
        try {
            TaleJdbc.testConn();
        } catch (Exception e) {
            String msg = "数据库连接失败, 请检查数据库配置";
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
