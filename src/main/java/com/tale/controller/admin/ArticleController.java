package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Users;
import com.tale.service.ContentsService;
import com.tale.service.LogService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

/**
 * 文章管理控制器
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin/article")
public class ArticleController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private LogService logService;

    @Inject
    private SiteService siteService;

    /**
     * 文章管理首页
     *
     * @param page
     * @param limit
     * @param request
     * @return
     */
    @GetRoute(value = "")
    public String index(@Param(defaultValue = "1") int page,
                        @Param(defaultValue = "15") int limit, Request request) {

        Page<Contents> articles = new Contents().where("type", Types.ARTICLE).page(page, limit, "created desc");
        request.attribute("articles", articles);
        return "admin/article_list";
    }

    /**
     * 文章发布页面
     *
     * @param request
     * @return
     */
    @GetRoute(value = "publish")
    public String newArticle(Request request) {
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/article_edit";
    }

    /**
     * 文章编辑页面
     *
     * @param cid
     * @param request
     * @return
     */
    @GetRoute(value = "/:cid")
    public String editArticle(@PathParam String cid, Request request) {
        Optional<Contents> contents = contentsService.getContents(cid);
        if (!contents.isPresent()) {
            return render_404();
        }
        request.attribute("contents", contents.get());
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute("active", "article");
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/article_edit";
    }

    /**
     * 发布文章操作
     *
     * @param title
     * @param content
     * @param tags
     * @param categories
     * @param status
     * @param slug
     * @param allow_comment
     * @param allow_ping
     * @param allow_feed
     * @return
     */
    @PostRoute(value = "publish")
    @JSON
    public RestResponse publishArticle(@Param String title, @Param String content,
                                       @Param String tags, @Param String categories,
                                       @Param String status, @Param String slug,
                                       @Param String fmt_type, @Param String thumb_img,
                                       @Param Boolean allow_comment, @Param Boolean allow_ping, @Param Boolean allow_feed) {

        Users users = this.user();

        Contents contents = new Contents();
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setSlug(slug);
        contents.setType(Types.ARTICLE);
        contents.setThumb_img(thumb_img);
        contents.setFmt_type(fmt_type);
        if (null != allow_comment) {
            contents.setAllow_comment(allow_comment);
        }
        if (null != allow_ping) {
            contents.setAllow_ping(allow_ping);
        }
        if (null != allow_feed) {
            contents.setAllow_feed(allow_feed);
        }
        contents.setAuthor_id(users.getUid());
        contents.setTags(tags);
        if (StringKit.isBlank(categories)) {
            categories = "默认分类";
        }
        contents.setCategories(categories);

        try {
            Integer cid = contentsService.publish(contents);
            siteService.cleanCache(Types.C_STATISTICS);
            return RestResponse.ok(cid);
        } catch (Exception e) {
            String msg = "文章发布失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 修改文章操作
     *
     * @param cid
     * @param title
     * @param content
     * @param tags
     * @param categories
     * @param status
     * @param slug
     * @param allow_comment
     * @param allow_ping
     * @param allow_feed
     * @return
     */
    @PostRoute(value = "modify")
    @JSON
    public RestResponse modifyArticle(@Param Integer cid, @Param String title,
                                      @Param String content, @Param String fmt_type,
                                      @Param String tags, @Param String categories,
                                      @Param String status, @Param String slug,
                                      @Param String thumb_img,
                                      @Param Boolean allow_comment, @Param Boolean allow_ping, @Param Boolean allow_feed) {

        Users    users    = this.user();
        Contents contents = new Contents();
        contents.setCid(cid);
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setFmt_type(fmt_type);
        contents.setSlug(slug);
        contents.setThumb_img(thumb_img);
        if (null != allow_comment) {
            contents.setAllow_comment(allow_comment);
        }
        if (null != allow_ping) {
            contents.setAllow_ping(allow_ping);
        }
        if (null != allow_feed) {
            contents.setAllow_feed(allow_feed);
        }
        contents.setAuthor_id(users.getUid());
        contents.setTags(tags);
        contents.setCategories(categories);
        try {
            contentsService.updateArticle(contents);
            return RestResponse.ok(cid);
        } catch (Exception e) {
            String msg = "文章编辑失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    /**
     * 删除文章操作
     *
     * @param cid
     * @param request
     * @return
     */
    @Route(value = "delete")
    @JSON
    public RestResponse delete(@Param int cid, Request request) {
        try {
            contentsService.delete(cid);
            siteService.cleanCache(Types.C_STATISTICS);
            logService.save(LogActions.DEL_ARTICLE, cid + "", request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "文章删除失败";
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
