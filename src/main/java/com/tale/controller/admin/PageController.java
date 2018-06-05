package com.tale.controller.admin;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.dto.LogActions;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Logs;
import com.tale.model.entity.Users;
import com.tale.service.ContentsService;
import com.tale.service.SiteService;
import com.tale.validators.CommonValidator;
import lombok.extern.slf4j.Slf4j;

/**
 * 页面管理
 * <p>
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/page", restful = true)
public class PageController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private SiteService siteService;

    @Route(value = "publish", method = HttpMethod.POST)
    public RestResponse<?> publishPage(Contents contents) {

        CommonValidator.valid(contents);

        Users users = this.user();
        contents.setType(Types.PAGE);
        contents.setAllowPing(true);
        contents.setAuthorId(users.getUid());
        try {
            contentsService.publish(contents);
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "页面发布失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "modify", method = HttpMethod.POST)
    public RestResponse<?> modifyArticle(Contents contents) {
        CommonValidator.valid(contents);

        if (null == contents || null == contents.getCid()) {
            return RestResponse.fail("缺少参数，请重试");
        }
        try {
            Integer cid = contents.getCid();
            contents.setType(Types.PAGE);
            contentsService.updateArticle(contents);
            return RestResponse.ok(cid);
        } catch (Exception e) {
            String msg = "页面编辑失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

    @Route(value = "delete")
    public RestResponse<?> delete(@Param int cid, Request request) {
        try {
            contentsService.delete(cid);
            siteService.cleanCache(Types.C_STATISTICS);
            new Logs(LogActions.DEL_PAGE, cid + "", request.address(), this.getUid()).save();
        } catch (Exception e) {
            String msg = "页面删除失败";
            if (e instanceof ValidatorException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

}
