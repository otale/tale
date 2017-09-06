package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.model.dto.Types;
import com.tale.model.entity.Metas;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 友链管理
 *
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin/links")
public class LinksController extends BaseController {

    @Inject
    private MetasService metasService;

    @Inject
    private SiteService siteService;

    @GetRoute(value = "")
    public String index(Request request) {
        List<Metas> metass = metasService.getMetas(Types.LINK);
        request.attribute("links", metass);
        return "admin/links";
    }

    @PostRoute(value = "save")
    @JSON
    public RestResponse saveLink(@Param String title, @Param String url,
                                 @Param String logo, @Param Integer mid,
                                 @Param(defaultValue = "0") int sort) {
        try {
            Metas metas = new Metas();
            metas.setName(title);
            metas.setSlug(url);
            metas.setDescription(logo);
            metas.setSort(sort);
            metas.setType(Types.LINK);
            if (null != mid) {
                metas.setMid(mid);
                metasService.update(metas);
            } else {
                metasService.saveMeta(metas);
            }
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "友链保存失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "delete")
    @JSON
    public RestResponse delete(@Param int mid) {
        try {
            metasService.delete(mid);
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "友链删除失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
