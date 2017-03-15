package com.tale.init;

import com.blade.Blade;
import com.blade.config.BConfig;
import com.blade.kit.FileKit;
import com.tale.controller.admin.AttachController;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;

import static com.blade.Blade.$;

/**
 * Created by biezhi on 2017/3/1.
 */
public final class TaleLoader {

    private TaleLoader() {
    }

    public static void init() {
        BConfig bConfig = $().bConfig();
        loadPlugins(bConfig);
        loadThemes(bConfig);
    }

    public static void loadThemes(BConfig bConfig) {

        String themeDir = AttachController.CLASSPATH + "templates/themes";
        try {
            themeDir = new URI(themeDir).getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        File[] dir = new File(themeDir).listFiles();
        for (File f : dir) {
            if (f.isDirectory() && FileKit.isDirectory(f.getPath() + "/static")) {
                String themePath = "/templates/themes/" + f.getName();
                bConfig.addStatic(new String[]{themePath + "/style.css", themePath + "/screenshot.png", themePath + "/static"});
            }
        }
    }

    public static void loadTheme(String themePath){
        Blade.$().embedServer().addStatic(themePath + "/style.css", themePath + "/screenshot.png", themePath + "/static");
    }

    public static void loadPlugins(BConfig bConfig) {
        File pluginDir = new File(AttachController.CLASSPATH + "plugins");
        if (pluginDir.exists() && pluginDir.isDirectory()) {
            File[] plugins = pluginDir.listFiles();
            for (File plugin : plugins) {
                loadPlugin(bConfig, plugin);
            }
        }
    }

    /**
     * 加载某个插件jar包
     *
     * @param pluginFile 插件文件
     */
    public static void loadPlugin(BConfig bConfig, File pluginFile) {
        try {
            if (pluginFile.isFile() && pluginFile.getName().endsWith(".jar")) {
                URLClassLoader classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
                Method add = URLClassLoader.class.getDeclaredMethod("addURL", new Class[]{URL.class});
                add.setAccessible(true);
                add.invoke(classLoader, pluginFile.toURI().toURL());

                String pluginName = pluginFile.getName().substring(6);
                bConfig.addStatic(new String[]{"/templates/plugins/" + pluginName + "/static"});
            }
        } catch (Exception e) {
            throw new RuntimeException("插件 [" + pluginFile.getName() + "] 加载失败");
        }
    }

}
