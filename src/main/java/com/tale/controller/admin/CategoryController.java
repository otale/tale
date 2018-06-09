package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.*;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.controller.BaseController;
import com.tale.model.dto.Types;
import com.tale.model.params.MetaParam;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

/**
 * 分类管理
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/api/category", restful = true)
public class CategoryController extends BaseController {

    @Inject
    private MetasService metasService;

    @Inject
    private SiteService siteService;

    @SysLog("保存分类")
    @PostRoute("save")
    public RestResponse<?> saveCategory(@BodyParam MetaParam metaParam) {
        metasService.saveMeta(Types.CATEGORY, metaParam.getCname(), metaParam.getMid());
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

    @SysLog("删除分类")
    @PostRoute("delete/:mid")
    public RestResponse<?> delete(@PathParam Integer mid) {
        metasService.delete(mid);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

}
