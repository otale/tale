package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.FileKit;
import com.blade.kit.StringKit;
import com.blade.kit.base.Config;
import com.blade.kit.json.JSONKit;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.LogActions;
import com.tale.dto.ThemeDto;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.service.LogService;
import com.tale.service.OptionsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 主题控制器
 */
@Controller("admin/themes")
public class ThemeController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ThemeController.class);

    @Inject
    private OptionsService optionsService;

    @Inject
    private LogService logService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request) {
        // 读取主题
        String themesDir = AttachController.CLASSPATH + "templates/themes";
        File[] themesFile = new File(themesDir).listFiles();
        List<ThemeDto> themes = new ArrayList<>(themesFile.length);
        for(File f : themesFile){
            if(f.isDirectory()){
                ThemeDto themeDto = new ThemeDto(f.getName());
                if(FileKit.exist(f.getPath() + "/setting.html")){
                    themeDto.setHasSetting(true);
                }
                themes.add(themeDto);
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
    @Route(value = "setting", method = HttpMethod.GET)
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
    @Route(value = "setting", method = HttpMethod.POST)
    @JSON
    public RestResponse saveSetting(Request request) {
        try {
            Map<String, String> querys = request.querys();
            optionsService.saveOptions(querys);

            Config config = new Config();
            config.addAll(optionsService.getOptions());
            TaleConst.OPTIONS = config;

            logService.save(LogActions.THEME_SETTING, JSONKit.toJSONString(querys), request.address(), this.getUid());
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "主题设置失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
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
    @Route(value = "active", method = HttpMethod.POST)
    @JSON
    public RestResponse activeTheme(Request request, @QueryParam String site_theme) {
        try {
            optionsService.saveOption("site_theme", site_theme);
            TaleConst.OPTIONS.put("site_theme", site_theme);
            BaseController.THEME = "themes/" + site_theme;
            logService.save(LogActions.THEME_SETTING, site_theme, request.address(), this.getUid());
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "激活主题失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}
