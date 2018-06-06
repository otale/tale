package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.controller.BaseController;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Users;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.SiteService;
import com.tale.validators.CommonValidator;
import lombok.extern.slf4j.Slf4j;

/**
 * 文章管理控制器
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path(value = "admin/article", restful = true)
public class ArticleController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private SiteService siteService;

    /**
     * 发布文章操作
     */
    @SysLog("发布文章")
    @PostRoute("publish")
    public RestResponse<?> publish(Contents contents) {

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

    /**
     * 修改文章操作
     */
    @SysLog("修改文章")
    @PostRoute("modify")
    public RestResponse<?> modify(Contents contents, @Param String createTime) {
        if (null == contents || null == contents.getCid()) {
            return RestResponse.fail("缺少参数，请重试");
        }
        CommonValidator.valid(contents);

        if (StringKit.isNotBlank(createTime)) {
            int unixTime = DateKit.toUnix(createTime, "yyyy-MM-dd HH:mm");
            contents.setCreated(unixTime);
        }
        Integer cid = contents.getCid();
        contentsService.updateArticle(contents);
        return RestResponse.ok(cid);
    }

    /**
     * 删除文章操作
     */
    @SysLog("删除文章")
    @PostRoute("delete")
    public RestResponse<?> delete(@Param int cid) {
        contentsService.delete(cid);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

}
