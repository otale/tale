package com.tale.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.OrderBy;
import com.blade.jdbc.page.Page;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.blade.mvc.ui.RestResponse;
import com.blade.security.web.csrf.CsrfToken;
import com.blade.validator.annotation.Valid;
import com.tale.exception.TipException;
import com.tale.extension.Commons;
import com.tale.init.TaleConst;
import com.tale.model.dto.Archive;
import com.tale.model.dto.ErrorCode;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.service.CommentsService;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;

import java.net.URLEncoder;
import java.util.List;
import java.util.Optional;

/**
 * 首页、归档、Feed、评论
 *
 * @author biezhi
 * @since 1.3.1
 */
@Slf4j
@Path
public class IndexController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private CommentsService commentsService;

    @Inject
    private SiteService siteService;

    /**
     * 首页
     *
     * @return
     */
    @GetRoute
    public String index(Request request, @Param(defaultValue = "12") int limit) {
        return this.index(request, 1, limit);
    }

    /**
     * 自定义页面
     */
    @CsrfToken(newToken = true)
    @GetRoute(value = {"/:cid", "/:cid.html"})
    public String page(@PathParam String cid, Request request) {
        Optional<Contents> contentsOptional = contentsService.getContents(cid);
        if (!contentsOptional.isPresent()) {
            return this.render_404();
        }
        Contents contents = contentsOptional.get();
        if (contents.getAllowComment()) {
            int cp = request.queryInt("cp", 1);
            request.attribute("cp", cp);
        }
        request.attribute("article", contents);
        Contents temp = new Contents();
        temp.setHits(contents.getHits() + 1);
        temp.update(contents.getCid());
        if (Types.ARTICLE.equals(contents.getType())) {
            return this.render("post");
        }
        if (Types.PAGE.equals(contents.getType())) {
            return this.render("page");
        }
        return this.render_404();
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
     * 文章页
     */
    @CsrfToken(newToken = true)
    @GetRoute(value = {"article/:cid", "article/:cid.html"})
    public String post(Request request, @PathParam String cid) {
        Optional<Contents> contentsOptional = contentsService.getContents(cid);
        if (!contentsOptional.isPresent()) {
            return this.render_404();
        }
        Contents contents = contentsOptional.get();
        if (Types.DRAFT.equals(contents.getStatus())) {
            return this.render_404();
        }
        request.attribute("article", contents);
        request.attribute("is_post", true);
        if (contents.getAllowComment()) {
            int cp = request.queryInt("cp", 1);
            request.attribute("cp", cp);
        }
        Contents temp = new Contents();
        temp.setHits(contents.getHits() + 1);
        temp.update(contents.getCid());
        return this.render("post");
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

        Page<Contents> articles = new Contents().where("type", Types.ARTICLE).and("status", Types.PUBLISH)
                .like("title", "%" + keyword + "%").page(page, limit, "created desc");

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

        List<Contents> articles = new Contents().where("type", Types.ARTICLE).and("status", Types.PUBLISH)
                .and("allow_feed", true)
                .findAll(OrderBy.desc("created"));

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
        List<Contents> articles = new Contents().where("type", Types.ARTICLE).and("status", Types.PUBLISH)
                .and("allow_feed", true)
                .findAll(OrderBy.desc("created"));

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
     *
     * @param session
     * @param response
     */
    @Route(value = "logout")
    public void logout(Session session, Response response) {
        TaleUtils.logout(session, response);
    }

    /**
     * 评论操作
     */
    @CsrfToken(valid = true)
    @PostRoute(value = "comment")
    @JSON
    public RestResponse comment(Request request, Response response,
                                @HeaderParam String Referer, @Valid Comments comments) {

        if (StringKit.isBlank(Referer)) {
            return RestResponse.fail(ErrorCode.BAD_REQUEST);
        }

        if (!Referer.startsWith(Commons.site_url())) {
            return RestResponse.fail("非法评论来源");
        }

        String  val   = request.address() + ":" + comments.getCid();
        Integer count = cache.hget(Types.COMMENTS_FREQUENCY, val);
        if (null != count && count > 0) {
            return RestResponse.fail("您发表评论太快了，请过会再试");
        }

        comments.setAuthor(TaleUtils.cleanXSS(comments.getAuthor()));
        comments.setContent(TaleUtils.cleanXSS(comments.getContent()));

        comments.setAuthor(EmojiParser.parseToAliases(comments.getAuthor()));
        comments.setContent(EmojiParser.parseToAliases(comments.getContent()));
        comments.setIp(request.address());
        comments.setParent(comments.getCoid());

        try {
            commentsService.saveComment(comments);
            response.cookie("tale_remember_author", URLEncoder.encode(comments.getAuthor(), "UTF-8"), 7 * 24 * 60 * 60);
            response.cookie("tale_remember_mail", URLEncoder.encode(comments.getMail(), "UTF-8"), 7 * 24 * 60 * 60);
            if (StringKit.isNotBlank(comments.getUrl())) {
                response.cookie("tale_remember_url", URLEncoder.encode(comments.getUrl(), "UTF-8"), 7 * 24 * 60 * 60);
            }

            // 设置对每个文章30秒可以评论一次
            cache.hset(Types.COMMENTS_FREQUENCY, val, 1, 30);
            siteService.cleanCache(Types.C_STATISTICS);

            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "评论发布失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}