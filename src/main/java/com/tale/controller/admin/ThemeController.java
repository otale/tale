package com.tale.controller.admin;

import com.blade.Blade;
import com.blade.Environment;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.JsonKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.ThemeDto;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.init.TaleConst;
import com.tale.init.TaleLoader;
import com.tale.service.LogService;
import com.tale.service.OptionsService;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 主题控制器
 */
@Slf4j
@Path("admin/themes")
public class ThemeController extends BaseController {

    @Inject
    private OptionsService optionsService;

    @Inject
    private LogService logService;

    @GetRoute(value = "")
    public String index(Request request) {
        // 读取主题
        String themesDir = AttachController.CLASSPATH + "templates/themes";
        File[] themesFile = new File(themesDir).listFiles();
        List<ThemeDto> themes = new ArrayList<>(themesFile.length);
        for(File f : themesFile){
            if(f.isDirectory()){
                ThemeDto themeDto = new ThemeDto(f.getName());
                if (Files.exists(Paths.get(f.getPath() + "/setting.html"))) {
                    themeDto.setHasSetting(true);
                }
                themes.add(themeDto);
                try {
                    Blade.me().addStatics("/templates/themes/" + f.getName() + "/screenshot.png");
                } catch (Exception e){}
            }
        }
        request.attribute("current_theme", Commons.site_theme());
        request.attribute("themes", themes);
        return "admin/themes";
    }

    /**
     * 主题设置页面
     * @param request
     * @return
     */
    @GetRoute(value = "setting")
    public String setting(Request request) {
        Map<String, String> themeOptions = optionsService.getOptions("theme_option_");
        request.attribute("theme_options", themeOptions);
        return this.render("setting");
    }

    /**
     * 保存主题配置项
     * @param request
     * @return
     */
    @PostRoute(value = "setting")
    @JSON
    public RestResponse saveSetting(Request request) {
        try {
            Map<String, List<String>> querys = request.parameters();
            optionsService.saveOptions(querys);

            TaleConst.OPTIONS = Environment.of(optionsService.getOptions());

            logService.save(LogActions.THEME_SETTING, JsonKit.toString(querys), request.address(), this.getUid());
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "主题设置失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 激活主题
     * @param request
     * @param site_theme
     * @return
     */
    @PostRoute(value = "active")
    @JSON
    public RestResponse activeTheme(Request request, @QueryParam String site_theme) {
        try {
            optionsService.saveOption("site_theme", site_theme);
            optionsService.deleteOption("theme_option_");

            TaleConst.OPTIONS.set("site_theme", site_theme);
            BaseController.THEME = "themes/" + site_theme;

            String themePath = "/templates/themes/" + site_theme;
            try {
                TaleLoader.loadTheme(themePath);
            } catch (Exception e){}
            logService.save(LogActions.THEME_SETTING, site_theme, request.address(), this.getUid());
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "主题启用失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}
