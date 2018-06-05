package com.tale.controller.admin;

import com.blade.kit.StringKit;
import com.blade.mvc.Const;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * 编辑模板
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/template", restful = true)
public class TemplateController extends BaseController {

    @Route(value = "save", method = HttpMethod.POST)
    public RestResponse<?> saveTpl(@Param String fileName, @Param String content) {
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
