package com.tale.controller;


import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.wrapper.Session;
import com.blade.mvc.view.RestResponse;
import com.tale.dto.Archive;
import com.tale.dto.Comment;
import com.tale.dto.MetaDto;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.model.Metas;
import com.tale.service.CommentsService;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Controller
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
    @Route(value = "/", method = HttpMethod.GET)
    public String index(Request request, @QueryParam(value = "limit", defaultValue = "12") int limit) {
        return this.index(request, 1, limit);
    }

    /**
     * 自定义页面
     */
    @Route(value = "/:pagename", method = HttpMethod.GET)
    public String page(@PathParam String pagename, Request request) {
        Contents contents = contentsService.getContents(pagename);
        if (null == contents) {
            return this.render_404();
        }
        if (contents.getAllow_comment()) {
            int cp = request.queryInt("cp", 1);
            Paginator<Comment> commentsPaginator = commentsService.getComments(contents.getCid(), cp, 6);
            request.attribute("comments", commentsPaginator);
        }
        request.attribute("article", contents);
        Integer hits = cache.hget("page", "hits");
        hits = null == hits ? 1 : hits + 1;
        if (hits >= TaleConst.HIT_EXCEED) {
            Contents temp = new Contents();
            temp.setCid(contents.getCid());
            temp.setHits(contents.getHits() + hits);
            contentsService.update(temp);
            cache.hset("page", "hits", 1);
        } else {
            cache.hset("page", "hits", hits);
        }
        return this.render("page");
    }

    /**
     * 首页分页
     *
     * @param request
     * @param p
     * @param limit
     * @return
     */
    @Route(value = "page/:p", method = HttpMethod.GET)
    public String index(Request request, @PathParam int p, @QueryParam(value = "limit", defaultValue = "12") int limit) {
        p = p < 0 || p > TaleConst.MAX_PAGE ? 1 : p;
        Take take = new Take(Contents.class).eq("type", Types.ARTICLE)
                .eq("status", Types.PUBLISH).page(p, limit, "created desc");
        Paginator<Contents> articles = contentsService.getArticles(take);
        request.attribute("articles", articles);
        if (p > 1) {
            this.title(request, "第" + p + "页");
        }
        return this.render("index");
    }

    /**
     * 文章页
     */
    @Route(value = "article/:cid", method = HttpMethod.GET)
    public String post(Request request, @PathParam String cid) {
        Contents contents = contentsService.getContents(cid);
        if (null == contents) {
            return this.render_404();
        }
        request.attribute("article", contents);
        request.attribute("is_post", true);
        if (contents.getAllow_comment()) {
            int cp = request.queryInt("cp", 1);
            Paginator<Comment> commentsPaginator = commentsService.getComments(contents.getCid(), cp, 6);
            request.attribute("comments", commentsPaginator);
        }
        Integer hits = cache.hget("article", "hits");
        hits = null == hits ? 1 : hits + 1;
        if (hits >= TaleConst.HIT_EXCEED) {
            Contents temp = new Contents();
            temp.setCid(contents.getCid());
            temp.setHits(contents.getHits() + hits);
            contentsService.update(temp);
            cache.hset("article", "hits", 1);
        } else {
            cache.hset("article", "hits", hits);
        }
        return this.render("post");
    }

    /**
     * 分类页
     *
     * @return
     */
    @Route(value = "category/:keyword", method = HttpMethod.GET)
    public String categories(Request request, @PathParam String keyword, @QueryParam(value = "limit", defaultValue = "12") int limit) {
        return this.categories(request, keyword, 1, limit);
    }

    @Route(value = "category/:keyword/:page", method = HttpMethod.GET)
    public String categories(Request request, @PathParam String keyword,
                             @PathParam int page, @QueryParam(value = "limit", defaultValue = "12") int limit) {
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

        return this.render("page-category");
    }

    /**
     * 标签页
     *
     * @param name
     * @return
     */
    @Route(value = "tag/:name", method = HttpMethod.GET)
    public String tags(Request request, @PathParam String name, @QueryParam(value = "limit", defaultValue = "12") int limit) {
        return this.tags(request, name, 1, limit);
    }

    /**
     * 标签分页
     * @param request
     * @param name
     * @param page
     * @param limit
     * @return
     */
    @Route(value = "tag/:name/:page", method = HttpMethod.GET)
    public String tags(Request request, @PathParam String name, @PathParam int page, @QueryParam(value = "limit", defaultValue = "12") int limit) {

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

        return this.render("page-category");
    }

    /**
     * 搜索页
     *
     * @param keyword
     * @return
     */
    @Route(value = "search/:keyword", method = HttpMethod.GET)
    public String search(Request request, @PathParam String keyword, @QueryParam(value = "limit", defaultValue = "12") int limit) {
        return this.search(request, keyword, 1, limit);
    }

    @Route(value = "search/:keyword/:page", method = HttpMethod.GET)
    public String search(Request request, @PathParam String keyword, @PathParam int page, @QueryParam(value = "limit", defaultValue = "12") int limit) {

        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        Take take = new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH)
                .like("title", "%" + keyword + "%").page(page, limit, "created desc");

        Paginator<Contents> articles = contentsService.getArticles(take);
        request.attribute("articles", articles);

        request.attribute("type", "搜索");
        request.attribute("keyword", keyword);
        return this.render("page-category");
    }

    /**
     * 归档页
     *
     * @return
     */
    @Route(value = "archives", method = HttpMethod.GET)
    public String archives(Request request) {
        List<Archive> archives = siteService.getArchives();
        request.attribute("archives", archives);
        return this.render("archives");
    }

    /**
     * 友链页
     *
     * @return
     */
    @Route(value = "links", method = HttpMethod.GET)
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
    @Route(value = {"feed", "feed.xml"}, method = HttpMethod.GET)
    public void feed(Response response) {
        Paginator<Contents> contentsPaginator = contentsService.getArticles(new Take(Contents.class)
                .eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).eq("allow_feed", true).page(1, TaleConst.MAX_POSTS, "created desc"));
        try {
            String xml = TaleUtils.getRssXml(contentsPaginator.getList());
            response.xml(xml);
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
    @Route("logout")
    public void logout(Session session, Response response) {
        TaleUtils.logout(session, response);
    }

    /**
     * 评论操作
     */
    @Route(value = "comment", method = HttpMethod.POST)
    @JSON
    public RestResponse comment(Request request,
                                @QueryParam Integer cid, @QueryParam Integer coid,
                                @QueryParam String author, @QueryParam String mail,
                                @QueryParam String url, @QueryParam String text) {

        Comments comments = new Comments();
        comments.setAuthor(author);
        comments.setCid(cid);
        comments.setContent(text);
        comments.setIp(request.address());
        comments.setUrl(url);
        comments.setMail(mail);
        comments.setParent(coid);
        try {
            commentsService.saveComment(comments);
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
