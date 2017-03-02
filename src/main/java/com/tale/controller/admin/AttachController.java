package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.FileKit;
import com.blade.kit.Tools;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.view.RestResponse;
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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin/attach")
public class AttachController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AttachController.class);

    public static final String CLASSPATH = AttachController.class.getClassLoader().getResource("").getPath();

    @Inject
    private AttachService attachService;

    @Inject
    private LogService logService;

    @Inject
    private SiteService siteService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request, @QueryParam(value = "page", defaultValue = "1") int page,
                        @QueryParam(value = "limit", defaultValue = "12") int limit) {
        Paginator<Attach> attachPaginator = attachService.getAttachs(new Take(Attach.class).page(page, limit, "id desc"));
        request.attribute("attachs", attachPaginator);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        request.attribute("max_file_size", TaleConst.MAX_FILE_SIZE / 1024);
        return "admin/attach";
    }

    @Route(value = "upload", method = HttpMethod.POST)
    @JSON
    public RestResponse upload(Request request) {

        LOGGER.info("UPLOAD DIR = {}", TaleUtils.upDir);

        Users users = this.user();
        Integer uid = users.getUid();
        Map<String, FileItem> fileItemMap = request.fileItems();
        Collection<FileItem> fileItems = fileItemMap.values();
        List<String> errorFiles = new ArrayList<>();
        try {
            fileItems.forEach((FileItem f) -> {
                String fname = f.fileName();

                if(f.file().length() / 1024 <= TaleConst.MAX_FILE_SIZE){
                    String fkey = TaleUtils.getFileKey(fname);
                    String ftype = TaleUtils.isImage(f.file()) ? Types.IMAGE : Types.FILE;
                    String filePath = TaleUtils.upDir + fkey;

                    File file = new File(filePath);
                    try {
                        Tools.copyFileUsingFileChannels(f.file(), file);
                        f.file().delete();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    attachService.save(fname, fkey, ftype, uid);
                    siteService.cleanCache(Types.C_STATISTICS);
                } else {
                    errorFiles.add(fname);
                }
            });
        } catch (Exception e) {
            return RestResponse.fail();
        }
        return RestResponse.ok(errorFiles);
    }

    @Route(value = "delete")
    @JSON
    public RestResponse delete(@QueryParam Integer id, Request request) {
        try {
            Attach attach = attachService.byId(id);
            if (null == attach) return RestResponse.fail("不存在该附件");
            attachService.delete(id);
            siteService.cleanCache(Types.C_STATISTICS);
            String upDir = CLASSPATH.substring(0, CLASSPATH.length() - 1);
            FileKit.delete(upDir + attach.getFkey());
            logService.save(LogActions.DEL_ARTICLE, attach.getFkey(), request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "附件删除失败";
            if (e instanceof TipException) msg = e.getMessage();
            else LOGGER.error(msg, e);
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
