package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.Const;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import com.tale.service.ContentsService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 编辑模板
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin/template")
public class TemplateController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private SiteService siteService;

    @Route(value = "", method = HttpMethod.GET)
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

    @GetRoute("content")
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

    @Route(value = "save", method = HttpMethod.POST)
    @JSON
    public RestResponse saveTpl(@Param String fileName, @Param String content) {
        if (StringKit.isBlank(fileName)) {
            return RestResponse.fail("缺少参数，请重试");
        }
        String themePath = Const.CLASSPATH + File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + Commons.site_theme();
        String filePath  = themePath + File.separatorChar + fileName;
        try {
            if (Files.exists(Paths.get(filePath))) {
                byte[] rf_wiki_byte = content.getBytes("UTF-8");
                Files.write(Paths.get(filePath), rf_wiki_byte);
            } else {
                Files.createFile(Paths.get(filePath));
                byte[] rf_wiki_byte = content.getBytes("UTF-8");
                Files.write(Paths.get(filePath), rf_wiki_byte);
            }
            return RestResponse.ok();
        } catch (Exception e) {
            log.error("写入文件失败", e);
            return RestResponse.fail("写入文件失败: " + e.getMessage());
        }
    }

}
