package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.LogActions;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.model.Attach;
import com.tale.model.Users;
import com.tale.service.AttachService;
import com.tale.service.LogService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
@Path("admin/attach")
public class AttachController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AttachController.class);

    public static final String CLASSPATH = AttachController.class.getClassLoader().getResource("").getPath();

    @Inject
    private AttachService attachService;

    @Inject
    private LogService logService;

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
    @Route(values = "", method = HttpMethod.GET)
    public String index(Request request, @QueryParam(defaultValue = "1") int page,
                        @QueryParam(defaultValue = "12") int limit) {
        Paginator<Attach> attachPaginator = attachService.getAttachs(new Take(Attach.class).page(page, limit, "id desc"));
        request.attribute("attachs", attachPaginator);
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
    @Route(values = "upload", method = HttpMethod.POST)
    @JSON
    public RestResponse upload(Request request) {

        LOGGER.info("UPLOAD DIR = {}", TaleUtils.upDir);

        Users users = this.user();
        Integer uid = users.getUid();
        Map<String, FileItem> fileItemMap = request.fileItems();
        Collection<FileItem> fileItems = fileItemMap.values();
        List<Attach> errorFiles = new ArrayList<>();
        List<Attach> urls = new ArrayList<>();
        try {
            fileItems.forEach((FileItem f) -> {
                String fname = f.fileName();

                if ((f.length() / 1024) <= TaleConst.MAX_FILE_SIZE) {
                    String fkey = TaleUtils.getFileKey(fname);

                    String ftype = f.contentType().contains("image") ? Types.IMAGE : Types.FILE;
                    String filePath = TaleUtils.upDir + fkey;

                    try {
                        Files.write(Paths.get(filePath), f.data());
                    } catch (IOException e) {
                        LOGGER.error("", e);
                    }
                    Attach attach = attachService.save(fname, fkey, ftype, uid);
                    urls.add(attach);
                    siteService.cleanCache(Types.C_STATISTICS);
                } else {
                    errorFiles.add(new Attach(fname));
                }
            });
            if (errorFiles.size() > 0) {
                RestResponse restResponse = new RestResponse();
                restResponse.setSuccess(false);
                restResponse.setPayload(errorFiles);
                return restResponse;
            }
            return RestResponse.ok(urls);
        } catch (Exception e) {
            String msg = "文件上传失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    @Route(values = "delete")
    @JSON
    public RestResponse delete(@QueryParam Integer id, Request request) {
        try {
            Attach attach = attachService.byId(id);
            if (null == attach) return RestResponse.fail("不存在该附件");
            attachService.delete(id);
            siteService.cleanCache(Types.C_STATISTICS);
            String upDir = CLASSPATH.substring(0, CLASSPATH.length() - 1);
            Files.delete(Paths.get(upDir + attach.getFkey()));
            logService.save(LogActions.DEL_ATTACH, attach.getFkey(), request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "附件删除失败";
            if (e instanceof TipException) msg = e.getMessage();
            else LOGGER.error(msg, e);
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
