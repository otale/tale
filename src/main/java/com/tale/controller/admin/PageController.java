package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.init.TaleConst;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Users;
import com.tale.service.ContentsService;
import com.tale.service.LogService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

/**
 * 页面管理
 *
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin/page")
public class PageController extends BaseController {

    @Inject
    private ContentsService contentsService;

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
    public RestResponse publishPage(@Param String title, @Param String content,
                                    @Param String status, @Param String slug,
                                    @Param String fmt_type,
                                    @Param Boolean allow_comment) {

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
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "modify", method = HttpMethod.POST)
    @JSON
    public RestResponse modifyArticle(@Param Integer cid, @Param String title,
                                      @Param String content,@Param String fmt_type,
                                      @Param String status, @Param String slug,
                                      @Param Boolean allow_comment) {

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
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "delete")
    @JSON
    public RestResponse delete(@Param int cid, Request request) {
        try {
            contentsService.delete(cid);
            siteService.cleanCache(Types.C_STATISTICS);
            logService.save(LogActions.DEL_PAGE, cid+"", request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "页面删除失败";
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
