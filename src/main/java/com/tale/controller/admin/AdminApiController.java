package com.tale.controller.admin;

import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.ui.RestResponse;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.params.ArticleParam;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;

import static io.github.biezhi.anima.Anima.select;

/**
 * @author biezhi
 * @date 2018/6/9
 */
@Path(value = "admin", suffix = ".json", restful = true)
public class AdminApiController {

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

}
