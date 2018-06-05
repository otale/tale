package com.tale.controller.admin;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.ui.RestResponse;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.model.entity.Attach;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import io.github.biezhi.anima.Anima;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static io.github.biezhi.anima.Anima.select;

/**
 * 附件管理
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/attach", restful = true)
public class AttachController extends BaseController {

    public static final String CLASSPATH = new File(AttachController.class.getResource("/").getPath()).getPath() + File.separatorChar;

    @Inject
    private SiteService siteService;

    /**
     * 上传文件接口
     * <p>
     * 返回格式
     *
     * @param request
     * @return
     */
    @PostRoute("upload")
    public RestResponse<?> upload(Request request) {

        log.info("UPLOAD DIR = {}", TaleUtils.UP_DIR);

        Users        users      = this.user();
        Integer      uid        = users.getUid();
        List<Attach> errorFiles = new ArrayList<>();
        List<Attach> urls       = new ArrayList<>();

        try {

            request.fileItem("file").ifPresent(fileItem -> {
                String fname = fileItem.getFileName();

                if ((fileItem.getLength() / 1024) <= TaleConst.MAX_FILE_SIZE) {
                    String fkey = TaleUtils.getFileKey(fname);

                    String ftype    = fileItem.getContentType().contains("image") ? Types.IMAGE : Types.FILE;
                    String filePath = TaleUtils.UP_DIR + fkey;

                    try {
                        Files.write(Paths.get(filePath), fileItem.getData());
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
                    siteService.cleanCache(Types.C_STATISTICS);
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
        } catch (Exception e) {
            String msg = "文件上传失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    @PostRoute("delete")
    public RestResponse<?> delete(@Param Integer id, Request request) {
        try {
            Attach attach = select().from(Attach.class).byId(id);
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
            Anima.deleteById(Attach.class, id);
            new Logs(LogActions.DEL_ATTACH, fkey, request.address(), this.getUid()).save();
        } catch (Exception e) {
            String msg = "附件删除失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
