package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.base.Config;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.service.OptionsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin")
public class IndexController {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    @Inject
    private OptionsService optionsService;

    @Route(value = {"/", "index"}, method = HttpMethod.GET)
    public String index() {
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
                                    @QueryParam String site_keywords) {

        try {
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

}
