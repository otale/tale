package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.dto.Types;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

/**
 * 分类管理
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/category", restful = true)
public class CategoryController extends BaseController {

    @Inject
    private MetasService metasService;

    @Inject
    private SiteService siteService;

    @PostRoute("save")
    public RestResponse<?> saveCategory(@Param String cname, @Param Integer mid) {
        metasService.saveMeta(Types.CATEGORY, cname, mid);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

    @PostRoute("delete")
    public RestResponse<?> delete(@Param int mid) {
        metasService.delete(mid);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

}
