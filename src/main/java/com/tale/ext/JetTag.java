package com.tale.ext;

import com.blade.kit.StringKit;
import jetbrick.template.runtime.JetTagContext;

import java.io.IOException;

/**
 * 主题公共标签
 *
 * Created by biezhi on 2017/2/23.
 */
public class JetTag {

    public static void social(JetTagContext ctx, String name) throws IOException {
        String value = Commons.site_option("social_" + name);
        if (StringKit.isNotBlank(value)) {
            value = ctx.getBodyContent();
        }
        ctx.getWriter().print(value.toString());
    }

}
