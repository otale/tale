package com.tale.extension;

import com.blade.jdbc.page.Page;
import com.blade.kit.*;
import com.tale.controller.BaseController;
import com.tale.init.TaleConst;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 公共函数
 * <p>
 * Created by biezhi on 2017/2/21.
 */
public final class Commons {

    private static SiteService siteService;

    private static final String TEMPLATES = "/templates/";

    public static void setSiteService(SiteService ss) {
        siteService = ss;
        Theme.setSiteService(ss);
    }

    /**
     * 判断分页中是否有数据
     *
     * @param paginator
     * @return
     */
    public static boolean is_empty(Page paginator) {
        return null == paginator || BladeKit.isEmpty(paginator.getRows());
    }

    /**
     * 判断字符串不为空
     *
     * @param str
     * @return
     */
    public static boolean not_empty(String str) {
        return StringKit.isNotBlank(str);
    }

    /**
     * 返回网站首页链接，如：http://tale.biezhi.me
     *
     * @return
     */
    public static String site_url() {
        return site_url("");
    }

    /**
     * 返回当前主题名称
     *
     * @return
     */
    public static String site_theme() {
        return site_option("site_theme", "default");
    }

    /**
     * 返回网站链接下的全址
     *
     * @param sub 后面追加的地址
     * @return
     */
    public static String site_url(String sub) {
        return site_option("site_url") + sub;
    }

    /**
     * 网站标题
     *
     * @return
     */
    public static String site_title() {
        return site_option("site_title");
    }

    /**
     * 网站子标题
     *
     * @return
     */
    public static String site_subtitle() {
        return site_option("site_subtitle");
    }

    /**
     * 网站配置项
     *
     * @param key
     * @return
     */
    public static String site_option(String key) {
        return site_option(key, "");
    }

    /**
     * 网站配置项
     *
     * @param key
     * @param defalutValue 默认值
     * @return
     */
    public static String site_option(String key, String defalutValue) {
        if (StringKit.isBlank(key)) {
            return "";
        }
        return TaleConst.OPTIONS.get(key, defalutValue);
    }

    /**
     * 返回站点设置的描述信息
     *
     * @return
     */
    public static String site_description() {
        return site_option("site_description");
    }

    /**
     * 截取字符串
     *
     * @param str
     * @param len
     * @return
     */
    public static String substr(String str, int len) {
        if (str.length() > len) {
            return str.substring(0, len);
        }
        return str;
    }

    /**
     * 返回主题URL
     *
     * @return
     */
    public static String theme_url() {
        return Commons.site_url(TEMPLATES + BaseController.THEME);
    }

    /**
     * 返回主题下的文件路径
     *
     * @param sub
     * @return
     */
    public static String theme_url(String sub) {
        return Commons.site_url(TEMPLATES + BaseController.THEME + sub);
    }


    /**
     * 返回gravatar头像地址
     *
     * @param email
     * @return
     */
    public static String gravatar(String email) {
        if (!TaleConst.ENABLED_CDN) {
            return "/static/admin/images/unicorn.png";
        }
        String avatarUrl = "https://cn.gravatar.com/avatar";
        if (StringKit.isBlank(email)) {
            return avatarUrl;
        }
        String hash = EncryptKit.md5(email.trim().toLowerCase());
        return avatarUrl + "/" + hash;
    }

    /**
     * 格式化unix时间戳为日期
     *
     * @param unixTime
     * @return
     */
    public static String fmtdate(Integer unixTime) {
        return fmtdate(unixTime, "yyyy-MM-dd");
    }

    /**
     * 格式化日期
     *
     * @param date
     * @param fmt
     * @return
     */
    public static String fmtdate(Date date, String fmt) {
        return DateKit.toString(date, fmt);
    }

    /**
     * 格式化unix时间戳为日期
     *
     * @param unixTime
     * @param patten
     * @return
     */
    public static String fmtdate(Integer unixTime, String patten) {
        if (null != unixTime && StringKit.isNotBlank(patten)) {
            return DateKit.toString(unixTime, patten);
        }
        return "";
    }

    /**
     * 获取随机数
     *
     * @param max
     * @param str
     * @return
     */
    public static String random(int max, String str) {
        return UUID.random(1, max) + str;
    }

    /**
     * An :grinning:awesome :smiley:string &#128516;with a few :wink:emojis!
     * <p>
     * 这种格式的字符转换为emoji表情
     *
     * @param value
     * @return
     */
    public static String emoji(String value) {
        return EmojiParser.parseToUnicode(value);
    }

    private static final Pattern SRC_PATTERN = Pattern.compile("src\\s*=\\s*\'?\"?(.*?)(\'|\"|>|\\s+)");
    /**
     * 获取文章第一张图片
     *
     * @return
     */
    public static String show_thumb(String content) {
        content = TaleUtils.mdToHtml(content);
        if (content.contains("<img")) {
            String  img       = "";
            String  regEx_img = "<img.*src\\s*=\\s*(.*?)[^>]*?>";
            Pattern p_image   = Pattern.compile(regEx_img, Pattern.CASE_INSENSITIVE);
            Matcher m_image   = p_image.matcher(content);
            if (m_image.find()) {
                img = img + "," + m_image.group();
                // //匹配src
                Matcher m = SRC_PATTERN.matcher(img);
                if (m.find()) {
                    return m.group(1);
                }
            }
        }
        return "";
    }

}
