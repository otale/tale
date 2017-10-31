package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.kit.DateKit;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.init.TaleConst;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.model.entity.Attach;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * 附件管理
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin/attach")
public class AttachController extends BaseController {

    public static final String CLASSPATH = new File(AttachController.class.getResource("/").getPath()).getPath() + File.separatorChar;

    @Inject
    private SiteService siteService;

    /**
     * 附件页面
     *
     * @param request
     * @param page
     * @param limit
     * @return
     */
    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request, @Param(defaultValue = "1") int page,
                        @Param(defaultValue = "12") int limit) {

        Attach       attach     = new Attach();
        Page<Attach> attachPage = attach.page(page, limit);
        request.attribute("attachs", attachPage);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        request.attribute("max_file_size", TaleConst.MAX_FILE_SIZE / 1024);
        return "admin/attach";
    }

    /**
     * 上传文件接口
     * <p>
     * 返回格式
     *
     * @param request
     * @return
     */
    @Route(value = "upload", method = HttpMethod.POST)
    @JSON
    public RestResponse upload(Request request) {

        log.info("UPLOAD DIR = {}", TaleUtils.UP_DIR);

        Users                 users       = this.user();
        Integer               uid         = users.getUid();
        Map<String, FileItem> fileItemMap = request.fileItems();
        Collection<FileItem>  fileItems   = fileItemMap.values();
        List<Attach>          errorFiles  = new ArrayList<>();
        List<Attach>          urls        = new ArrayList<>();
        try {
            fileItems.forEach((FileItem f) -> {
                String fname = f.getFileName();

                if ((f.getLength() / 1024) <= TaleConst.MAX_FILE_SIZE) {
                    String fkey = TaleUtils.getFileKey(fname);

                    String ftype    = f.getContentType().contains("image") ? Types.IMAGE : Types.FILE;
                    String filePath = TaleUtils.UP_DIR + fkey;

                    try {
                        Files.write(Paths.get(filePath), f.getData());
                    } catch (IOException e) {
                        log.error("", e);
                    }

                    Attach attach = new Attach();
                    attach.setFname(fname);
                    attach.setAuthor_id(uid);
                    attach.setFkey(fkey);
                    attach.setFtype(ftype);
                    attach.setCreated(DateKit.nowUnix());
                    attach.save();

                    urls.add(attach);
                    siteService.cleanCache(Types.C_STATISTICS);
                } else {
                    Attach attach = new Attach();
                    attach.setFname(fname);
                    errorFiles.add(attach);
                }
            });
            if (errorFiles.size() > 0) {
                return RestResponse.builder().success(false).payload(errorFiles).build();
            }
            return RestResponse.ok(urls);
        } catch (Exception e) {
            String msg = "文件上传失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    @Route(value = "delete")
    @JSON
    public RestResponse delete(@Param Integer id, Request request) {
        try {
            Attach attach = new Attach().find(id);
            if (null == attach) {
                return RestResponse.fail("不存在该附件");
            }
            String fkey = attach.getFkey();
            siteService.cleanCache(Types.C_STATISTICS);
            String             filePath = CLASSPATH.substring(0, CLASSPATH.length() - 1) + fkey;
            java.nio.file.Path path     = Paths.get(filePath);
            log.info("Delete attach: [{}]", filePath);
            if (Files.exists(path)) {
                Files.delete(path);
            }
            attach.delete(id);
            new Logs(LogActions.DEL_ATTACH, fkey, request.address(), this.getUid()).save();
        } catch (Exception e) {
            String msg = "附件删除失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
