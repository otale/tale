package com.tale.utils;

import com.blade.ioc.Ioc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HockAdminTUtils {
    private HockAdminTUtils() {
    }

    private static HockAdminTUtils instence = null;
    private final Map<String, List<String>> AdminHockCache = new HashMap<>();

    private static final HockAdminTUtils getInstence() {
        synchronized (HockAdminTUtils.class) {
            if (instence == null) {
                synchronized (HockAdminTUtils.class) {
                    if (instence == null) {
                        instence = new HockAdminTUtils();
                    }
                }
            }

        }
        return instence;
    }

    public static final void HOCK(ADMINPATH key, String path) {
        if (getInstence().AdminHockCache.containsKey(key.name())) {
            getInstence().AdminHockCache.get(key.name()).add(path);
        } else {
            List<String> paths = new ArrayList<>();
            paths.add(path);
            getInstence().AdminHockCache.put(key.name(), paths);
        }
    }

    public static final List<String> getHockPaths(String path) {
        if (ADMINPATH.inAdminPath(path)) {
            if (getInstence().AdminHockCache.containsKey(path)) {
                return getInstence().AdminHockCache.get(path);
            }
        }
        return null;
    }

    public static enum ADMINPATH {
        article_edit("article_edit"),
        article_list("article_list"),
        attach("attach"),
        category("category"),
        comment_list("comment_list"),
        index("index"),
        login("login"),
        page_edit("page_edit"),
        page_list("page_list"),
        profile("profile"),
        setting("setting"),
        themes("themes"),
        tpl_list("tpl_list");

        private String name;

        private ADMINPATH(String name){
            this.name = name;
        }

        public static boolean inAdminPath(String path) {
            for (ADMINPATH adminpath : ADMINPATH.values()) {
                if (path.equals(adminpath.name)) {
                    return true;
                }
            }
            return false;

        }

    }
}
