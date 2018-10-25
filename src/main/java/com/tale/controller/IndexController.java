package com.tale.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.RouteContext;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.tale.bootstrap.TaleConst;
import com.tale.model.dto.Archive;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.params.PageParam;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import static io.github.biezhi.anima.Anima.select;

/**
 * 首页、归档、Feed、评论
 *
 * @author biezhi
 * @since 1.3.1
 */
@Path
@Slf4j
public class IndexController extends BaseController {

    @Inject
    private SiteService siteService;

    /**
     * 首页
     *
     * @return
     */
    @GetRoute
    public String index(Request request, PageParam pageParam) {
        return this.index(request, 1, pageParam.getLimit());
    }

    /**
     * 首页分页
     *
     * @param request
     * @param page
     * @param limit
     * @return
     */
    @GetRoute(value = {"page/:page", "page/:page.html"})
    public String index(Request request, @PathParam int page, @Param(defaultValue = "12") int limit) {
        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        if (page > 1) {
            this.title(request, "第" + page + "页");
        }
        request.attribute("page_num", page);
        request.attribute("limit", limit);
        request.attribute("is_home", true);
        request.attribute("page_prefix", "/page");
        return this.render("index");
    }


    /**
     * 搜索页
     *
     * @param keyword
     * @return
     */
    @GetRoute(value = {"search/:keyword", "search/:keyword.html"})
    public String search(Request request, @PathParam String keyword, @Param(defaultValue = "12") int limit) {
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(value = {"search", "search.html"})
    public String search(Request request, @Param(defaultValue = "12") int limit) {
        String keyword = request.query("s").orElse("");
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(value = {"search/:keyword/:page", "search/:keyword/:page.html"})
    public String search(Request request, @PathParam String keyword, @PathParam int page, @Param(defaultValue = "12") int limit) {

        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;

        Page<Contents> articles = select().from(Contents.class)
                .where(Contents::getType, Types.ARTICLE)
                .and(Contents::getStatus, Types.PUBLISH)
                .like(Contents::getTitle, "%" + keyword + "%")
                .order(Contents::getCreated, OrderBy.DESC)
                .page(page, limit);

        request.attribute("articles", articles);
        request.attribute("type", "搜索");
        request.attribute("keyword", keyword);
        request.attribute("page_prefix", "/search/" + keyword);
        return this.render("page-category");
    }

    /**
     * 归档页
     *
     * @return
     */
    @GetRoute(value = {"archives", "archives.html"})
    public String archives(Request request) {
        List<Archive> archives = siteService.getArchives();
        request.attribute("archives", archives);
        request.attribute("is_archive", true);
        return this.render("archives");
    }

    /**
     * feed页
     *
     * @return
     */
    @GetRoute(value = {"feed", "feed.xml", "atom.xml"})
    public void feed(Response response) {

        List<Contents> articles = select().from(Contents.class)
                .where(Contents::getType, Types.ARTICLE)
                .and(Contents::getStatus, Types.PUBLISH)
                .and(Contents::getAllowFeed, true)
                .order(Contents::getCreated, OrderBy.DESC)
                .all();

        try {
            String xml = TaleUtils.getRssXml(articles);
            response.contentType("text/xml; charset=utf-8");
            response.body(xml);
        } catch (Exception e) {
            log.error("生成 rss 失败", e);
        }
    }

    /**
     * sitemap 站点地图
     *
     * @return
     */
    @GetRoute(value = {"sitemap", "sitemap.xml"})
    public void sitemap(Response response) {
        List<Contents> articles = select().from(Contents.class)
                .where(Contents::getType, Types.ARTICLE)
                .and(Contents::getStatus, Types.PUBLISH)
                .and(Contents::getAllowFeed, true)
                .order(Contents::getCreated, OrderBy.DESC)
                .all();
        try {
            String xml = TaleUtils.getSitemapXml(articles);
            response.contentType("text/xml; charset=utf-8");
            response.body(xml);
        } catch (Exception e) {
            log.error("生成 sitemap 失败", e);
        }
    }

    /**
     * 注销
     */
    @Route(value = "logout")
    public void logout(RouteContext context) {
        TaleUtils.logout(context);
    }

}