package com.tale.extension;

import com.tale.bootstrap.TaleConst;
import com.tale.model.dto.Types;

/**
 * 后台公共函数
 * <p>
 * Created by biezhi on 2017/2/21.
 */
public final class AdminCommons {

    public static String attachURL(){
        return Commons.site_option(Types.ATTACH_URL, Commons.site_url());
    }

    public static int maxFileSize(){
        return TaleConst.MAX_FILE_SIZE / 1024;
    }

    public static String cdnURL(){
        return Commons.site_option(Types.CDN_URL, "/static/admin");
    }

    public static String siteTheme() {
        return Commons.site_theme();
    }

}
