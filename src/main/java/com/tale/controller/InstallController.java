package com.tale.controller;


import com.blade.Environment;
import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.bootstrap.TaleConst;
import com.tale.model.entity.Users;
import com.tale.model.params.InstallParam;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.tale.validators.CommonValidator;
import lombok.extern.slf4j.Slf4j;

import java.nio.file.Files;
import java.nio.file.Paths;

import static com.tale.bootstrap.TaleConst.CLASSPATH;
import static com.tale.bootstrap.TaleConst.OPTION_ALLOW_INSTALL;

@Slf4j
@Path("install")
public class InstallController extends BaseController {

    @Inject
    private SiteService siteService;

    @Inject
    private OptionsService optionsService;

    /**
     * 安装页
     */
    @GetRoute
    public String index(Request request) {
        boolean existInstall   = Files.exists(Paths.get(CLASSPATH + "install.lock"));
        boolean allowReinstall = TaleConst.OPTIONS.getBoolean(OPTION_ALLOW_INSTALL, false);
        request.attribute("is_install", !allowReinstall && existInstall);
        return "install";
    }

    @PostRoute
    @JSON
    public RestResponse<?> doInstall(InstallParam installParam) {
        if (isRepeatInstall()) {
            return RestResponse.fail("请勿重复安装");
        }

        CommonValidator.valid(installParam);

        Users temp = new Users();
        temp.setUsername(installParam.getAdminUser());
        temp.setPassword(installParam.getAdminPwd());
        temp.setEmail(installParam.getAdminEmail());

        siteService.initSite(temp);

        String siteUrl = TaleUtils.buildURL(installParam.getSiteUrl());
        optionsService.saveOption("site_title", installParam.getSiteTitle());
        optionsService.saveOption("site_url", siteUrl);

        TaleConst.OPTIONS = Environment.of(optionsService.getOptions());

        return RestResponse.ok();
    }

    private boolean isRepeatInstall() {
        return Files.exists(Paths.get(CLASSPATH + "install.lock"))
                && TaleConst.OPTIONS.getInt("allow_install", 0) != 1;
    }

}
