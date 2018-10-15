package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.JsonKit;
import com.blade.kit.StringKit;
import com.blade.mvc.Const;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PathParam;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author biezhi
 * @date 2018/6/5
 */
@Slf4j
@Path("admin")
public class PagesController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    @GetRoute("/:page")
    public String commonPage(@PathParam String page) {
        return "admin/" + page + ".html";
    }

    @GetRoute("/:module/:page")
    public String commonPage(@PathParam String module, @PathParam String page) {
        return "admin/" + module + "/" + page + ".html";
    }

    @GetRoute("/article/edit/:cid")
    public String editArticle(@PathParam String cid) {
        return "admin/article/edit.html";
    }

    @GetRoute("/page/edit/:cid")
    public String editPage(@PathParam String cid) {
        return "admin/page/edit.html";
    }

    @GetRoute("login")
    public String login(Response response) {
        if (null != this.user()) {
            response.redirect("/admin/index");
            return null;
        }
        return "admin/login";
    }

    @GetRoute("template")
    public String index(Request request) {
        String themePath = Const.CLASSPATH + File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + Commons.site_theme();
        try {
            List<String> files = Files.list(Paths.get(themePath))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".html"))
                    .collect(Collectors.toList());

            List<String> partial = Files.list(Paths.get(themePath + File.separatorChar + "partial"))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".html"))
                    .map(fileName -> "partial/" + fileName)
                    .collect(Collectors.toList());

            List<String> statics = Files.list(Paths.get(themePath + File.separatorChar + "static"))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".js") || path.endsWith(".css"))
                    .map(fileName -> "static/" + fileName)
                    .collect(Collectors.toList());

            files.addAll(partial);
            files.addAll(statics);

            request.attribute("tpls", files);
        } catch (IOException e) {
            log.error("找不到模板路径");
        }
        return "admin/tpl_list";
    }

    @GetRoute("template/content")
    public void getContent(@Param String fileName, Response response) {
        try {
            String themePath = Const.CLASSPATH + File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + Commons.site_theme();
            String filePath  = themePath + File.separatorChar + fileName;
            String content   = Files.readAllLines(Paths.get(filePath)).stream().collect(Collectors.joining("\n"));
            response.text(content);
        } catch (IOException e) {
            log.error("获取模板文件失败", e);
        }
    }

    /**
     * 主题设置页面
     */
    @GetRoute("theme/setting")
    public String setting(Request request) {
        String currentTheme = Commons.site_theme();
        String key          = "theme_" + currentTheme + "_options";

        String              option = optionsService.getOption(key);
        Map<String, Object> map    = new HashMap<>();
        try {
            if (StringKit.isNotBlank(option)) {
                map = (Map<String, Object>) JsonKit.toAson(option);
            }
            request.attribute("options", map);
        } catch (Exception e) {
            log.error("解析主题设置出现异常", e);
        }
        request.attribute("theme_options", map);
        return this.render("setting");
    }

}
