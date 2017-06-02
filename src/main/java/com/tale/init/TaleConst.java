package com.tale.init;

import com.blade.kit.CollectionKit;
import com.blade.kit.base.Config;
import com.tale.dto.PluginMenu;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Tale 常量存储
 *
 * @author biezhi
 */
public class TaleConst {

    public static final String USER_IN_COOKIE = "S_L_ID";
    public static String AES_SALT = "0123456789abcdef";
    public static String LOGIN_SESSION_KEY = "login_user";
    public static Config OPTIONS = new Config();
    public static Boolean INSTALL = false;
    public static Config BCONF = null;

    /**
     * 最大页码
     */
    public static final int MAX_PAGE = 100;

    /**
     * 最大获取文章条数
     */
    public static final int MAX_POSTS = 9999;

    /**
     * 文章最多可以输入的文字数
     */
    public static final int MAX_TEXT_COUNT = 200000;

    /**
     * 文章标题最多可以输入的文字个数
     */
    public static final int MAX_TITLE_COUNT = 200;

    /**
     * 点击次数超过多少更新到数据库
     */
    public static final int HIT_EXCEED = 10;

    /**
     * 插件菜单
     */
    public static final List<PluginMenu> plugin_menus = CollectionKit.newArrayList(8);

    /**
     * 上传文件最大20M
     */
    public static Integer MAX_FILE_SIZE = 204800;

    /**
     * 要过滤的ip列表
     */
    public static final Set<String> BLOCK_IPS = new HashSet<>(16);

}