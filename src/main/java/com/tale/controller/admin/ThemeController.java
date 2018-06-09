package com.tale.controller.admin;

import com.blade.Environment;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.JsonKit;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.bootstrap.TaleLoader;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import com.tale.model.entity.Options;
import com.tale.service.OptionsService;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tale.bootstrap.TaleConst.OPTION_SITE_THEME;
import static io.github.biezhi.anima.Anima.delete;

/**
 * 主题控制器
 */
@Slf4j
@Path(value = "admin/themes", restful = true)
public class ThemeController extends BaseController {

    @Inject
    private OptionsService optionsService;

    @SysLog("保存主题设置")
    @PostRoute("setting")
    public RestResponse<?> saveSetting(Request request) {
        Map<String, List<String>> query = request.parameters();

        // theme_milk_options => {  }
        String currentTheme = Commons.site_theme();
        String key          = "theme_" + currentTheme + "_options";

        Map<String, String> options = new HashMap<>();
        query.forEach((k, v) -> options.put(k, v.get(0)));

        optionsService.saveOption(key, JsonKit.toString(options));

        TaleConst.OPTIONS = Environment.of(optionsService.getOptions());
        return RestResponse.ok();
    }

    @SysLog("激活主题")
    @PostRoute("active")
    public RestResponse<?> activeTheme(@Param String site_theme) {
        optionsService.saveOption("site_theme", site_theme);
        delete().from(Options.class).where(Options::getName).like("theme_option_%").execute();

        TaleConst.OPTIONS.set(OPTION_SITE_THEME, site_theme);
        BaseController.THEME = "themes/" + site_theme;

        String themePath = "/templates/themes/" + site_theme;
        try {
            TaleLoader.loadTheme(themePath);
        } catch (Exception e) {
        }
        return RestResponse.ok();
    }

}
