package com.tale.controller.admin;

import com.alibaba.fastjson.JSON;
import com.blade.ioc.annotation.Inject;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.model.Contents;
import com.tale.model.MenuEntity;
import com.tale.service.ContentsService;
import com.tale.service.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

        List<Contents> contentsPaginator = menuService.getPages();
        String jsonMenu = JSON.toJSONString(contentsPaginator);
        request.attribute("articles", jsonMenu);
//
        return "admin/menu";
    }

    @Route(value = "save", method = HttpMethod.POST)
    @com.blade.mvc.annotation.JSON
    public RestResponse saveMenuPage(@QueryParam String pageData, @QueryParam String menuData) {
        List<MenuEntity> pageEntityList = JSON.parseArray(pageData, MenuEntity.class);
        List<MenuEntity> menuEntityList = JSON.parseArray(menuData, MenuEntity.class);
        try {
            for (MenuEntity page : pageEntityList) {
                Contents contents = new Contents();
                contents.setCid(Integer.decode(page.id));
                menuService.delMenu(contents);
            }
            int a = 1;
            for (MenuEntity menu : menuEntityList) {
                Contents contents = new Contents();
                contents.setCid(Integer.decode(menu.id));
                contents.setMenu(a);
                menuService.saveMenu(contents);
                a++;
            }
        } catch (Exception e) {
            LOGGER.info("save menu error: {}", e.getMessage());
            return RestResponse.fail("修改菜单失败");
        }
        return RestResponse.ok("修改成功");
    }
}





























