package com.tale.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.StringKit;
import com.blade.mvc.Const;
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
import com.tale.model.dto.MetaDto;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.service.CommentsService;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;

import java.net.URLEncoder;
import java.util.List;

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
    public String index(Request request, @QueryParam(defaultValue = "12") int limit) {
        return this.index(request, 1, limit);
    }

    /**
     * 自定义页面
     */
    @CsrfToken(newToken = true)
    @GetRoute(value = {"/:cid", "/:cid.html"})
    public String page(@PathParam String cid, Request request) {
        Contents contents = contentsService.getContents(cid);
        if (null == contents) {
            return this.render_404();
        }
        if (contents.getAllow_comment()) {
            int cp = request.queryInt("cp", 1);
            request.attribute("cp", cp);
        }
        request.attribute("article", contents);
        updateArticleHit(contents.getCid(), contents.getHits());
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
    public String index(Request request, @PathParam int page, @QueryParam(defaultValue = "12") int limit) {

        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        Take take = new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).page(page, limit, "created desc");
        Paginator<Contents> articles = contentsService.getArticles(take);
        request.attribute("articles", articles);
        if (page > 1) {
            this.title(request, "第" + page + "页");
        }
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
        Contents contents = contentsService.getContents(cid);
        if (null == contents || Types.DRAFT.equals(contents.getStatus())) {
            return this.render_404();
        }
        request.attribute("article", contents);
        request.attribute("is_post", true);
        if (contents.getAllow_comment()) {
            int cp = request.queryInt("cp", 1);
            request.attribute("cp", cp);
        }
        updateArticleHit(contents.getCid(), contents.getHits());
        return this.render("post");
    }

    private void updateArticleHit(Integer cid, Integer chits) {
        Integer hits = cache.hget(Types.C_ARTICLE_HITS, cid.toString());
        hits = null == hits ? 1 : hits + 1;
        if (hits >= TaleConst.HIT_EXCEED) {
            Contents temp = new Contents();
            temp.setCid(cid);
            temp.setHits(chits + hits);
            contentsService.update(temp);
            cache.hset(Types.C_ARTICLE_HITS, cid.toString(), 1);
        } else {
            cache.hset(Types.C_ARTICLE_HITS, cid.toString(), hits);
        }
    }

    /**
     * 分类页
     *
     * @return
     */
    @GetRoute(value = {"category/:keyword", "category/:keyword.html"})
    public String categories(Request request, @PathParam String keyword, @QueryParam(defaultValue = "12") int limit) {
        return this.categories(request, keyword, 1, limit);
    }

    @GetRoute(value = {"category/:keyword/:page", "category/:keyword/:page.html"})
    public String categories(Request request, @PathParam String keyword,
                             @PathParam int page, @QueryParam(defaultValue = "12") int limit) {
        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        MetaDto metaDto = metasService.getMeta(Types.CATEGORY, keyword);
        if (null == metaDto) {
            return this.render_404();
        }

        Paginator<Contents> contentsPaginator = contentsService.getArticles(metaDto.getMid(), page, limit);

        request.attribute("articles", contentsPaginator);
        request.attribute("meta", metaDto);
        request.attribute("type", "分类");
        request.attribute("keyword", keyword);
        request.attribute("is_category", true);
        request.attribute("page_prefix", "/category/" + keyword);

        return this.render("page-category");
    }

    /**
     * 标签页
     *
     * @param name
     * @return
     */
    @GetRoute(value = {"tag/:name", "tag/:name.html"})
    public String tags(Request request, @PathParam String name, @QueryParam(defaultValue = "12") int limit) {
        return this.tags(request, name, 1, limit);
    }

    /**
     * 标签分页
     *
     * @param request
     * @param name
     * @param page
     * @param limit
     * @return
     */
    @GetRoute(value = {"tag/:name/:page", "tag/:name/:page.html"})
    public String tags(Request request, @PathParam String name, @PathParam int page, @QueryParam(defaultValue = "12") int limit) {

        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        MetaDto metaDto = metasService.getMeta(Types.TAG, name);
        if (null == metaDto) {
            return this.render_404();
        }

        Paginator<Contents> contentsPaginator = contentsService.getArticles(metaDto.getMid(), page, limit);
        request.attribute("articles", contentsPaginator);
        request.attribute("meta", metaDto);
        request.attribute("type", "标签");
        request.attribute("keyword", name);
        request.attribute("is_tag", true);
        request.attribute("page_prefix", "/tag/" + name);

        return this.render("page-category");
    }

    /**
     * 搜索页
     *
     * @param keyword
     * @return
     */
    @GetRoute(value = {"search/:keyword", "search/:keyword.html"})
    public String search(Request request, @PathParam String keyword, @QueryParam(defaultValue = "12") int limit) {
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(value = {"search", "search.html"})
    public String search(Request request, @QueryParam(defaultValue = "12") int limit) {
        String keyword = request.query("s").orElse("");
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(value = {"search/:keyword/:page", "search/:keyword/:page.html"})
    public String search(Request request, @PathParam String keyword, @PathParam int page, @QueryParam(defaultValue = "12") int limit) {

        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        Take take = new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH)
                .like("title", "%" + keyword + "%").page(page, limit, "created desc");

        Paginator<Contents> articles = contentsService.getArticles(take);
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
     * 友链页
     *
     * @return
     */
    @CsrfToken(newToken = true)
    @GetRoute(value = {"links", "links.html"})
    public String links(Request request) {
        List<Metas> links = metasService.getMetas(Types.LINK);
        request.attribute("links", links);
        return this.render("links");
    }

    /**
     * feed页
     *
     * @return
     */
    @GetRoute(value = {"feed", "feed.xml"})
    public void feed(Response response) {
        Paginator<Contents> contentsServiceArticles = contentsService.getArticles(new Take(Contents.class)
                .eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).eq("allow_feed", true).page(1, TaleConst.MAX_POSTS, "created desc"));
        try {
            String xml = TaleUtils.getRssXml(contentsServiceArticles.getList());
            response.contentType(Const.CONTENT_TYPE_XML);
            response.body(xml);
        } catch (Exception e) {
            log.error("生成RSS失败", e);
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

        String val = request.address() + ":" + comments.getCid();
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
