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
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.model.Contents;
import com.tale.model.Metas;
import com.tale.model.Users;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Created by biezhi on 2017/2/21.
 */
@Controller("admin/article")
public class ArticleController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ArticleController.class);

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(@QueryParam(value = "page", defaultValue = "1") int page,
                        @QueryParam(value = "limit", defaultValue = "15") int limit, Request request) {

        Paginator<Contents> contentsPaginator = contentsService.getArticles(new Take(Contents.class).eq("type", Types.ARTICLE).page(page, limit, "created desc"));
        request.attribute("articles", contentsPaginator);
        return "admin/article_list";
    }

    @Route(value = "publish", method = HttpMethod.GET)
    public String newArticle(Request request) {
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        return "admin/article_edit";
    }

    @Route(value = "/:cid", method = HttpMethod.GET)
    public String editArticle(@PathParam String cid, Request request) {
        Contents contents = contentsService.getContents(cid);
        request.attribute("contents", contents);
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute("active", "article");
        return "admin/article_edit";
    }

    @Route(value = "publish", method = HttpMethod.POST)
    @JSON
    public RestResponse publishArticle(@QueryParam String title, @QueryParam String content,
                                       @QueryParam String tags, @QueryParam String categories,
                                       @QueryParam String status, @QueryParam String slug,
                                       @QueryParam Boolean allow_comment, @QueryParam Boolean allow_ping, @QueryParam Boolean allow_feed) {

        Users users = this.user();

        Contents contents = new Contents();
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setSlug(slug);
        contents.setType(Types.ARTICLE);
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
            contentsService.publish(contents);
        } catch (Exception e) {
            String msg = "文章发布失败";
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
                                      @QueryParam String content,
                                      @QueryParam String tags, @QueryParam String categories,
                                      @QueryParam String status, @QueryParam String slug,
                                      @QueryParam Boolean allow_comment, @QueryParam Boolean allow_ping, @QueryParam Boolean allow_feed) {

        Users users = this.user();
        Contents contents = new Contents();
        contents.setCid(cid);
        contents.setTitle(title);
        contents.setContent(content);
        contents.setStatus(status);
        contents.setSlug(slug);
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
            contentsService.update(contents);
        } catch (Exception e) {
            String msg = "文章编辑失败";
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
    public RestResponse delete(@QueryParam int cid) {
        try {
            contentsService.delete(cid);
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
