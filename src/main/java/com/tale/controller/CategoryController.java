package com.tale.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PathParam;
import com.blade.mvc.http.Request;
import com.tale.init.TaleConst;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 分类、标签控制器
 *
 * @author biezhi
 * @date 2017/9/17
 */
@Slf4j
@Path
public class CategoryController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    /**
     * 分类列表页
     *
     * @since 1.3.1
     */
    @GetRoute(value = {"categories", "categories.html"})
    public String categories(Request request) {
        Map<String, List<Contents>> mapping    = metasService.getMetaMapping(Types.CATEGORY);
        Set<String>                 categories = mapping.keySet();
        request.attribute("categories", categories);
        request.attribute("mapping", mapping);
        return this.render("categories");
    }

    /**
     * 某个分类详情页
     */
    @GetRoute(value = {"category/:keyword", "category/:keyword.html"})
    public String categories(Request request, @PathParam String keyword, @Param(defaultValue = "12") int limit) {
        return this.categories(request, keyword, 1, limit);
    }

    /**
     * 某个分类详情页分页
     */
    @GetRoute(value = {"category/:keyword/:page", "category/:keyword/:page.html"})
    public String categories(Request request, @PathParam String keyword,
                             @PathParam int page, @Param(defaultValue = "12") int limit) {
        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        Metas metaDto = metasService.getMeta(Types.CATEGORY, keyword);
        if (null == metaDto) {
            return this.render_404();
        }

        Page<Contents> contentsPage = contentsService.getArticles(metaDto.getMid(), page, limit);
        request.attribute("articles", contentsPage);
        request.attribute("meta", metaDto);
        request.attribute("type", "分类");
        request.attribute("keyword", keyword);
        request.attribute("is_category", true);
        request.attribute("page_prefix", "/category/" + keyword);

        return this.render("page-category");
    }

    /**
     * 标签列表页面
     * <p>
     * 渲染所有的标签和文章映射
     *
     * @since 1.3.1
     */
    @GetRoute(value = {"tags", "tags.html"})
    public String tags(Request request) {
        Map<String, List<Contents>> mapping = metasService.getMetaMapping(Types.TAG);
        Set<String>                 tags    = mapping.keySet();
        request.attribute("tags", tags);
        request.attribute("mapping", mapping);
        return this.render("tags");
    }

    /**
     * 标签详情页
     *
     * @param name 标签名
     */
    @GetRoute(value = {"tag/:name", "tag/:name.html"})
    public String tagPage(Request request, @PathParam String name, @Param(defaultValue = "12") int limit) {
        return this.tags(request, name, 1, limit);
    }

    /**
     * 标签下文章分页
     */
    @GetRoute(value = {"tag/:name/:page", "tag/:name/:page.html"})
    public String tags(Request request, @PathParam String name, @PathParam int page, @Param(defaultValue = "12") int limit) {
        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;
        Metas metaDto = metasService.getMeta(Types.TAG, name);
        if (null == metaDto) {
            return this.render_404();
        }

        Page<Contents> contentsPage = contentsService.getArticles(metaDto.getMid(), page, limit);
        request.attribute("articles", contentsPage);
        request.attribute("meta", metaDto);
        request.attribute("type", "标签");
        request.attribute("keyword", name);
        request.attribute("is_tag", true);
        request.attribute("page_prefix", "/tag/" + name);

        return this.render("page-category");
    }

}