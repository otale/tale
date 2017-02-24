package com.tale.controller;


import com.blade.Blade;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.FileKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.dto.JdbcConf;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.init.TaleJdbc;
import com.tale.model.Users;
import com.tale.service.SiteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller("install")
public class InstallController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(InstallController.class);

    @Inject
    private SiteService siteService;

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
            request.attribute("is_install", !"1".equals(TaleConst.options.get("allow_install")));
        } else {
            request.attribute("is_install", false);
        }
        return "install";
    }

    @Route(value = "/", method = HttpMethod.POST)
    @JSON
    public RestResponse doInstall(@QueryParam String site_title, @QueryParam String admin_user,
                                  @QueryParam String admin_email, @QueryParam String admin_pwd,
                                  @QueryParam String db_host, @QueryParam String db_name,
                                  @QueryParam String db_user, @QueryParam String db_pass) {

        try {

            if (StringKit.isBlank(site_title) ||
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

            TaleJdbc.open(Blade.$().ioc());

            Users users = new Users();
            users.setUsername(admin_user);
            users.setPassword(admin_pwd);
            users.setEmail(admin_email);

            JdbcConf jdbcConf = new JdbcConf(db_host, db_name, db_user, db_pass);

            siteService.initSite(users, jdbcConf, site_title);
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

        String url = "jdbc:mysql://" + db_host + "/" + db_name;
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
