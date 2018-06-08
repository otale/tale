package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Users;
import com.tale.model.params.ArticleParam;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.validators.CommonValidator;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;

import java.util.List;
import java.util.Optional;

import static io.github.biezhi.anima.Anima.select;

/**
 * @author biezhi
 * @date 2018/6/9
 */
@Path(value = "admin", suffix = ".json", restful = true)
public class AdminApiController extends BaseController {

    @Inject
    private MetasService metasService;

    @Inject
    private ContentsService contentsService;

    @Inject
    private SiteService siteService;

    @GetRoute("articles/:cid")
    public RestResponse article(@PathParam String cid) {
        Optional<Contents> contents = contentsService.getContents(cid);
        return RestResponse.ok(contents.orElse(null));
    }

    @PostRoute("article/new")
    public RestResponse newArticle(@BodyParam Contents contents) {
        CommonValidator.valid(contents);

        Users users = this.user();
        contents.setType(Types.ARTICLE);
        contents.setAuthorId(users.getUid());
        //将点击数设初始化为0
        contents.setHits(0);
        //将评论数设初始化为0
        contents.setCommentsNum(0);
        if (StringKit.isBlank(contents.getCategories())) {
            contents.setCategories("默认分类");
        }
        Integer cid = contentsService.publish(contents);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok(cid);
    }

    @PostRoute("article/delete/:cid")
    public RestResponse<?> delete(@PathParam Integer cid) {
        contentsService.delete(cid);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

    @PostRoute("article/update")
    public RestResponse updateArticle(@BodyParam Contents contents) {
        if (null == contents || null == contents.getCid()) {
            return RestResponse.fail("缺少参数，请重试");
        }
        CommonValidator.valid(contents);
        Integer cid = contents.getCid();
        contentsService.updateArticle(contents);
        return RestResponse.ok(cid);
    }

    @GetRoute("articles")
    public RestResponse articleList(ArticleParam articleParam) {
        Page<Contents> articles = select().from(Contents.class).where(Contents::getType, Types.ARTICLE)
                .order(Contents::getCreated, OrderBy.DESC).page(articleParam.getPage(), articleParam.getLimit());
        return RestResponse.ok(articles);
    }

    @GetRoute("pages")
    public RestResponse pageList(ArticleParam articleParam) {
        Page<Contents> articles = select().from(Contents.class).where(Contents::getType, Types.PAGE)
                .order(Contents::getCreated, OrderBy.DESC).page(articleParam.getPage(), articleParam.getLimit());
        return RestResponse.ok(articles);
    }

    @GetRoute("categories")
    public RestResponse categories() {
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        return RestResponse.ok(categories);
    }

}
