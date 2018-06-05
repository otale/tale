package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.http.Request;
import com.tale.controller.BaseController;
import com.tale.model.dto.Statistics;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Logs;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import static io.github.biezhi.anima.Anima.select;

/**
 * 后台控制器
 * Created by biezhi on 2017/2/21.
 */
@Slf4j
@Path("admin")
public class IndexController extends BaseController {

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    /**
     * 仪表盘
     */
    @GetRoute(value = {"/", "index"})
    public String index(Request request) {
        List<Comments> comments   = siteService.recentComments(5);
        List<Contents> contents   = siteService.getContens(Types.RECENT_ARTICLE, 5);
        Statistics     statistics = siteService.getStatistics();
        // 取最新的20条日志
        Page<Logs> logsPage = select().from(Logs.class).order(Logs::getId, OrderBy.DESC).page(1, 20);
        List<Logs> logs     = logsPage.getRows();

        request.attribute("comments", comments);
        request.attribute("articles", contents);
        request.attribute("statistics", statistics);
        request.attribute("logs", logs);
        return "admin/index";
    }

    /**
     * 系统设置
     */
    @GetRoute("setting")
    public String setting(Request request) {
        Map<String, String> options = optionsService.getOptions();
        request.attribute("options", options);
        return "admin/setting";
    }

    /**
     * 个人设置页面
     */
    @GetRoute("profile")
    public String profile() {
        return "admin/profile";
    }

}
