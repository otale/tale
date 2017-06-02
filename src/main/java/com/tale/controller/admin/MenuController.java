package com.tale.controller.admin;

import com.alibaba.fastjson.JSON;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.tale.controller.BaseController;
import com.tale.dto.Types;
import com.tale.init.TaleConst;
import com.tale.model.Contents;
import com.tale.service.ContentsService;
import com.tale.service.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Type;
import java.util.List;

/**
 * Created by lzd on 17-6-1.
 */
@Controller("admin/menu")
public class MenuController extends BaseController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MenuController.class);


    @Inject
    private ContentsService contentsService;

    @Inject
    private MenuService menuService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(Request request) {

        List<Contents> contentsPaginator = menuService.getMenus();
        String jsonMenu = JSON.toJSONString(contentsPaginator);
        request.attribute("articles", jsonMenu);
//
        return "admin/menu";
    }
}
