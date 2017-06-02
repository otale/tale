package com.tale.controller;


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
import com.tale.controller.admin.AttachController;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
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
        boolean existInstall = FileKit.exist(AttachController.CLASSPATH + "install.lock");
        int allow_reinstall = TaleConst.OPTIONS.getInt("allow_install", 0);

        if(allow_reinstall == 1){
            request.attribute("is_install", false);
        } else {
            request.attribute("is_install", existInstall);
        }
        return "install";
    }

    @Route(value = "/", method = HttpMethod.POST)
    @JSON
    public RestResponse doInstall(@QueryParam String site_title, @QueryParam String site_url,
                                  @QueryParam String admin_user, @QueryParam String admin_email,
                                  @QueryParam String admin_pwd) {
        if(FileKit.exist(AttachController.CLASSPATH + "install.lock")
                && TaleConst.OPTIONS.getInt("allow_install", 0)!=1){
            return RestResponse.fail("请勿重复安装");
        }
        try {
            if (StringKit.isBlank(site_title) ||
                    StringKit.isBlank(site_url) ||
                    StringKit.isBlank(admin_user) ||
                    StringKit.isBlank(admin_pwd)) {
                return RestResponse.fail("请确认网站信息输入完整");
            }

            if (admin_pwd.length() < 6 || admin_pwd.length() > 14) {
                return RestResponse.fail("请输入6-14位密码");
            }

            if (StringKit.isNotBlank(admin_email) && !TaleUtils.isEmail(admin_email)) {
                return RestResponse.fail("邮箱格式不正确");
            }

            Users temp = new Users();
            temp.setUsername(admin_user);
            temp.setPassword(admin_pwd);
            temp.setEmail(admin_email);

            siteService.initSite(temp);

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

}
