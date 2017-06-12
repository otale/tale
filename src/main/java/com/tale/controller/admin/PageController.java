package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.LogActions;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.model.Contents;
import com.tale.model.Users;
import com.tale.service.ContentsService;
import com.tale.service.LogService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 页面设置
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin/page")
public class PageController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PageController.class);

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private LogService logService;

    @Inject
    private SiteService siteService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request) {
        Paginator<Contents> contentsPaginator = contentsService.getArticles(new Take(Contents.class).eq("type", Types.PAGE).page(1, TaleConst.MAX_POSTS, "created desc"));
        request.attribute("articles", contentsPaginator);
        return "admin/page_list";
    }

    @Route(value = "new", method = HttpMethod.GET)
    public String newPage(Request request) {
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/page_edit";
    }

    @Route(value = "/:cid", method = HttpMethod.GET)
    public String editPage(@PathParam String cid, Request request) {
        Contents contents = contentsService.getContents(cid);
        request.attribute("contents", contents);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/page_edit";
    }

    @Route(value = "publish", method = HttpMethod.POST)
    @JSON
    public RestResponse publishPage(@QueryParam String title, @QueryParam String content,
                                    @QueryParam String status, @QueryParam String slug,
                                    @QueryParam String fmt_type,
                                    @QueryParam Boolean allow_comment) {

        Users users = this.user();
        Contents contents = new Contents();
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setSlug(slug);
        contents.setFmt_type(fmt_type);
        contents.setType(Types.PAGE);
        contents.setAllow_comment(allow_comment);
        contents.setAllow_ping(true);
        contents.setAuthor_id(users.getUid());

        try {
            contentsService.publish(contents);
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "页面发布失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "modify", method = HttpMethod.POST)
    @JSON
    public RestResponse modifyArticle(@QueryParam Integer cid, @QueryParam String title,
                                      @QueryParam String content,@QueryParam String fmt_type,
                                      @QueryParam String status, @QueryParam String slug,
                                      @QueryParam Boolean allow_comment) {

        Users users = this.user();
        Contents contents = new Contents();
        contents.setCid(cid);
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setFmt_type(fmt_type);
        contents.setSlug(slug);
        contents.setType(Types.PAGE);
        contents.setAllow_comment(allow_comment);
        contents.setAllow_ping(true);
        contents.setAuthor_id(users.getUid());
        try {
            contentsService.updateArticle(contents);
        } catch (Exception e) {
            String msg = "页面编辑失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "delete")
    @JSON
    public RestResponse delete(@QueryParam int cid, Request request) {
        try {
            contentsService.delete(cid);
            siteService.cleanCache(Types.C_STATISTICS);
            logService.save(LogActions.DEL_PAGE, cid+"", request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "页面删除失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }
}
