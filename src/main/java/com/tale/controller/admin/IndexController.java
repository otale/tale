package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.model.dto.Statistics;
import com.tale.model.dto.Types;
import com.tale.model.entity.Attach;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Users;
import com.tale.service.SiteService;
import com.tale.utils.ImageUtils;
import com.tale.utils.TaleUtils;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.tale.bootstrap.TaleConst.CLASSPATH;

/**
 * 后台控制器
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin")
public class IndexController extends BaseController {


    @Inject
    private SiteService siteService;

    /**
     * 仪表盘
     */
    @GetRoute(value = {"/", "index"})
    public String index(Request request) {
        List<Comments> comments   = siteService.recentComments(5);
        List<Contents> contents   = siteService.getContens(Types.RECENT_ARTICLE, 5);
        Statistics     statistics = siteService.getStatistics();

        request.attribute("comments", comments);
        request.attribute("articles", contents);
        request.attribute("statistics", statistics);
        return "admin/index";
    }

    /**
     * 个人设置页面
     */
    @GetRoute("profile")
    public String profile() {
        return "admin/profile";
    }

    /**
     * 上传文件接口
     */
    @SysLog("上传附件")
    @PostRoute("api/attach/upload")
    @JSON
    public RestResponse<?> upload(Request request) {

        log.info("UPLOAD DIR = {}", TaleUtils.UP_DIR);

        Users        users      = this.user();
        Integer      uid        = users.getUid();
        List<Attach> errorFiles = new ArrayList<>();
        List<Attach> urls       = new ArrayList<>();

        Map<String, FileItem> fileItems = request.fileItems();
        if (null == fileItems || fileItems.size() == 0) {
            return RestResponse.fail("请选择文件上传");
        }

        fileItems.forEach((fileName, fileItem) -> {
            String fname = fileItem.getFileName();
            if ((fileItem.getLength() / 1024) <= TaleConst.MAX_FILE_SIZE) {
                String fkey = TaleUtils.getFileKey(fname);

                String ftype    = fileItem.getContentType().contains("image") ? Types.IMAGE : Types.FILE;
                String filePath = TaleUtils.UP_DIR + fkey;


                try {
                    Files.write(Paths.get(filePath), fileItem.getData());
                    if (TaleUtils.isImage(new File(filePath))) {
                        String newFileName       = TaleUtils.getFileName(fkey);
                        String thumbnailFilePath = TaleUtils.UP_DIR + fkey.replace(newFileName, "thumbnail_" + newFileName);
                        ImageUtils.cutCenterImage(CLASSPATH + fkey, thumbnailFilePath, 270, 380);

                    }
                } catch (IOException e) {
                    log.error("", e);
                }

                Attach attach = new Attach();
                attach.setFname(fname);
                attach.setAuthorId(uid);
                attach.setFkey(fkey);
                attach.setFtype(ftype);
                attach.setCreated(DateKit.nowUnix());
                attach.save();

                urls.add(attach);
                siteService.cleanCache(Types.SYS_STATISTICS);
            } else {
                Attach attach = new Attach();
                attach.setFname(fname);
                errorFiles.add(attach);
            }
        });

        if (errorFiles.size() > 0) {
            return RestResponse.fail().payload(errorFiles);
        }
        return RestResponse.ok(urls);
    }


}
