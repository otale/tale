package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.LogActions;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.ext.Commons;
import com.tale.model.Contents;
import com.tale.model.Metas;
import com.tale.model.Users;
import com.tale.service.ContentsService;
import com.tale.service.LogService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * 文章管理控制器
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin/article")
public class ArticleController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ArticleController.class);

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
    @Route(value = "", method = HttpMethod.ALL)
    public String index(@QueryParam(value = "page", defaultValue = "1") int page,
                        @QueryParam(value = "limit", defaultValue = "15") int limit,
                        @QueryParam(value = "category",defaultValue = "") String category,
                        Request request) {
        //获取分类
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));

        request.attribute("category",category);

        //文章
        Paginator<Contents> contentsPaginator = contentsService.getArticles(new Take(Contents.class).eq("type", Types.ARTICLE).page(page, limit, "created desc"));


        if (!"".equals(category)) {
            List list = contentsService.siftCategory(contentsPaginator.getList(),category);
            contentsPaginator.setList(list);
        }


        request.attribute("articles", contentsPaginator);

        return "admin/article_list";
    }

    /**
     * 文章发布页面
     *
     * @param request
     * @return
     */
    @Route(value = "publish", method = HttpMethod.GET)
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
    @Route(value = "/:cid", method = HttpMethod.GET)
    public String editArticle(@PathParam String cid, Request request) {
        Contents contents = contentsService.getContents(cid);
        request.attribute("contents", contents);
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
    @Route(value = "publish", method = HttpMethod.POST)
    @JSON
    public RestResponse publishArticle(@QueryParam String title, @QueryParam String content,
                                       @QueryParam String tags, @QueryParam String categories,
                                       @QueryParam String status, @QueryParam String slug,
                                       @QueryParam String fmt_type, @QueryParam String thumb_img,
                                       @QueryParam Boolean allow_comment, @QueryParam Boolean allow_ping, @QueryParam Boolean allow_feed) {

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
                LOGGER.error(msg, e);
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
    @Route(value = "modify", method = HttpMethod.POST)
    @JSON
    public RestResponse modifyArticle(@QueryParam Integer cid, @QueryParam String title,
                                      @QueryParam String content, @QueryParam String fmt_type,
                                      @QueryParam String tags, @QueryParam String categories,
                                      @QueryParam String status, @QueryParam String slug,
                                      @QueryParam String thumb_img,
                                      @QueryParam Boolean allow_comment, @QueryParam Boolean allow_ping, @QueryParam Boolean allow_feed) {

        Users users = this.user();
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
                LOGGER.error(msg, e);
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
    public RestResponse delete(@QueryParam int cid, Request request) {
        try {
            contentsService.delete(cid);
            siteService.cleanCache(Types.C_STATISTICS);
            logService.save(LogActions.DEL_ARTICLE, cid + "", request.address(), this.getUid());
        } catch (Exception e) {
            String msg = "文章删除失败";
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
