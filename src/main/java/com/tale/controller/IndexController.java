package com.tale.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.PatternKit;
import com.blade.kit.StringKit;
import com.blade.mvc.Const;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.blade.mvc.ui.RestResponse;
import com.tale.dto.Archive;
import com.tale.dto.ErrorCode;
import com.tale.dto.MetaDto;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.model.Metas;
import com.tale.service.CommentsService;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;
import java.util.List;

@Path
public class IndexController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

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
    @GetRoute(values = {"/:cid", "/:cid.html"})
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
    @GetRoute(values = {"page/:page", "page/:page.html"})
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
    @GetRoute(values = {"article/:cid", "article/:cid.html"})
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
    @GetRoute(values = {"category/:keyword", "category/:keyword.html"})
    public String categories(Request request, @PathParam String keyword, @QueryParam(defaultValue = "12") int limit) {
        return this.categories(request, keyword, 1, limit);
    }

    @GetRoute(values = {"category/:keyword/:page", "category/:keyword/:page.html"})
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
    @GetRoute(values = {"tag/:name", "tag/:name.html"})
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
    @GetRoute(values = {"tag/:name/:page", "tag/:name/:page.html"})
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
    @GetRoute(values = {"search/:keyword", "search/:keyword.html"})
    public String search(Request request, @PathParam String keyword, @QueryParam(defaultValue = "12") int limit) {
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(values = {"search", "search.html"})
    public String search(Request request, @QueryParam(defaultValue = "12") int limit) {
        String keyword = request.query("s").orElse("");
        return this.search(request, keyword, 1, limit);
    }

    @GetRoute(values = {"search/:keyword/:page", "search/:keyword/:page.html"})
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
    @GetRoute(values = {"archives", "archives.html"})
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
    @GetRoute(values = {"links", "links.html"})
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
    @GetRoute(values = {"feed", "feed.xml"})
    public void feed(Response response) {
        Paginator<Contents> contentsPaginator = contentsService.getArticles(new Take(Contents.class)
                .eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).eq("allow_feed", true).page(1, TaleConst.MAX_POSTS, "created desc"));
        try {
            String xml = TaleUtils.getRssXml(contentsPaginator.getList());
            response.contentType(Const.CONTENT_TYPE_XML);
            response.body(xml);
        } catch (Exception e) {
            LOGGER.error("生成RSS失败", e);
        }
    }

    /**
     * 注销
     *
     * @param session
     * @param response
     */
    @Route(values = "logout")
    public void logout(Session session, Response response) {
        TaleUtils.logout(session, response);
    }

    /**
     * 评论操作
     */
    @PostRoute(values = "comment")
    @JSON
    public RestResponse comment(Request request, Response response,
                                @QueryParam Integer cid, @QueryParam Integer coid,
                                @QueryParam String author, @QueryParam String mail,
                                @QueryParam String url, @QueryParam String text,
                                @QueryParam String _csrf_token) {

        String ref = request.header("Referer");
        if (StringKit.isBlank(ref) || StringKit.isBlank(_csrf_token)) {
            return RestResponse.fail(ErrorCode.BAD_REQUEST);
        }

        if (!ref.startsWith(Commons.site_url())) {
            return RestResponse.fail("非法评论来源");
        }

        String token = cache.hget(Types.CSRF_TOKEN, _csrf_token);
        if (StringKit.isBlank(token)) {
            return RestResponse.fail(ErrorCode.BAD_REQUEST);
        }

        if (null == cid || StringKit.isBlank(author) || StringKit.isBlank(mail) || StringKit.isBlank(text)) {
            return RestResponse.fail("请输入完整后评论");
        }

        if (author.length() > 50) {
            return RestResponse.fail("姓名过长");
        }

        if (!TaleUtils.isEmail(mail)) {
            return RestResponse.fail("请输入正确的邮箱格式");
        }

        if (StringKit.isNotBlank(url) && !PatternKit.isURL(url)) {
            return RestResponse.fail("请输入正确的URL格式");
        }

        if (text.length() > 200) {
            return RestResponse.fail("请输入200个字符以内的评论");
        }

        String val = request.address() + ":" + cid;
        Integer count = cache.hget(Types.COMMENTS_FREQUENCY, val);
        if (null != count && count > 0) {
            return RestResponse.fail("您发表评论太快了，请过会再试");
        }

        author = TaleUtils.cleanXSS(author);
        text = TaleUtils.cleanXSS(text);

        author = EmojiParser.parseToAliases(author);
        text = EmojiParser.parseToAliases(text);

        Comments comments = new Comments();
        comments.setAuthor(author);
        comments.setCid(cid);
        comments.setIp(request.address());
        comments.setUrl(url);
        comments.setContent(text);
        comments.setMail(mail);
        comments.setParent(coid);
        try {
            commentsService.saveComment(comments);
            response.cookie("tale_remember_author", URLEncoder.encode(author, "UTF-8"), 7 * 24 * 60 * 60);
            response.cookie("tale_remember_mail", URLEncoder.encode(mail, "UTF-8"), 7 * 24 * 60 * 60);
            if (StringKit.isNotBlank(url)) {
                response.cookie("tale_remember_url", URLEncoder.encode(url, "UTF-8"), 7 * 24 * 60 * 60);
            }
            // 设置对每个文章30秒可以评论一次
            cache.hset(Types.COMMENTS_FREQUENCY, val, 1, 30);
            siteService.cleanCache(Types.C_STATISTICS);
            request.attribute("del_csrf_token", token);
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "评论发布失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }
}
