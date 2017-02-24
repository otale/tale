package com.tale.controller;

import com.blade.kit.StringKit;
import com.blade.mvc.http.Request;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import com.tale.utils.TaleUtils;

/**
 * Created by biezhi on 2017/2/21.
 */
public abstract class BaseController {

    public static String THEME = "themes/default";

    public String render(String viewName) {
        return THEME + "/" + viewName;
    }

    public BaseController title(Request request, String title) {
        request.attribute("title", title);
        return this;
    }

    public BaseController keywords(Request request, String keywords) {
        request.attribute("keywords", keywords);
        return this;
    }

    public Users user() {
        return TaleUtils.getLoginUser();
    }

    public String render_404(){
        return "/comm/error_404";
    }

}
