package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.kit.Tools;
import com.blade.kit.base.Config;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.Statistics;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.model.Users;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import com.tale.service.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

/**
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin")
public class IndexController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    @Inject
    private UsersService usersService;

    @Route(value = {"/", "index"}, method = HttpMethod.GET)
    public String index(Request request) {
        List<Comments> comments = siteService.recentComments(5);
        List<Contents> contents = siteService.recentContents(5);
        Statistics statistics = siteService.getStatistics();
        request.attribute("comments", comments);
        request.attribute("articles", contents);
        request.attribute("statistics", statistics);
        return "admin/index";
    }

    @Route(value = "setting", method = HttpMethod.GET)
    public String setting(Request request) {
        Map<String, String> options = optionsService.getOptions();
        request.attribute("options", options);
        return "admin/setting";
    }

    @Route(value = "setting", method = HttpMethod.POST)
    @JSON
    public RestResponse saveSetting(@QueryParam String site_title,
                                    @QueryParam String social_weibo,
                                    @QueryParam String social_zhihu,
                                    @QueryParam String social_github,
                                    @QueryParam String social_twitter,
                                    @QueryParam String site_theme,
                                    @QueryParam String allow_install,
                                    @QueryParam String site_description,
                                    @QueryParam String site_keywords,
                                    Request request) {

        try {

            Map<String, String> querys = request.querys();

            optionsService.saveOption("site_title", site_title);
            optionsService.saveOption("site_theme", site_theme);
            optionsService.saveOption("site_description", site_description);
            optionsService.saveOption("site_keywords", site_keywords);
            optionsService.saveOption("allow_install", allow_install);

            optionsService.saveOption("social_weibo", social_weibo);
            optionsService.saveOption("social_zhihu", social_zhihu);
            optionsService.saveOption("social_github", social_github);
            optionsService.saveOption("social_twitter", social_twitter);

            Config config = new Config();
            config.addAll(optionsService.getOptions());
            TaleConst.OPTIONS = config;

            BaseController.THEME = "themes/" + site_theme;

        } catch (Exception e) {
            String msg = "保存设置失败";
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
     * 个人设置页面
     *
     * @return
     */
    @Route(value = "profile", method = HttpMethod.GET)
    public String profile() {
        return "admin/profile";
    }

    /**
     * 保存个人信息
     *
     * @return
     */
    @Route(value = "profile", method = HttpMethod.POST)
    @JSON
    public RestResponse saveProfile(@QueryParam String screen_name, @QueryParam String email) {
        Users users = this.user();
        if (StringKit.isNotBlank(screen_name) && StringKit.isNotBlank(email)) {
            Users temp = new Users();
            temp.setUid(users.getUid());
            temp.setScreen_name(screen_name);
            temp.setEmail(email);
            usersService.update(temp);
        }
        return RestResponse.ok();
    }

    /**
     * 修改密码
     *
     * @return
     */
    @Route(value = "password", method = HttpMethod.POST)
    @JSON
    public RestResponse upPwd(@QueryParam String old_password, @QueryParam String password) {
        Users users = this.user();
        if (StringKit.isBlank(old_password) || StringKit.isBlank(password)) {
            return RestResponse.fail("请确认信息输入完整");
        }

        if (!users.getPassword().equals(Tools.md5(users.getUsername() + old_password))) {
            return RestResponse.fail("旧密码错误");
        }
        if (password.length() < 6 || password.length() > 14) {
            return RestResponse.fail("请输入6-14位密码");
        }

        Users temp = new Users();
        temp.setUid(users.getUid());
        String pwd = Tools.md5(users.getUsername() + password);
        temp.setPassword(pwd);
        usersService.update(temp);
        return RestResponse.ok();
    }

}
