package com.tale.init;

import com.blade.Blade;
import com.tale.controller.admin.AttachController;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Paths;


/**
 * Created by biezhi on 2017/3/1.
 */
public final class TaleLoader {

    private TaleLoader() {
    }

    private static Blade blade;

    public static void init(Blade blade_) {
        blade = blade_;
        loadPlugins();
        loadThemes();
    }

    public static void loadThemes() {
        String themeDir = AttachController.CLASSPATH + "templates" + File.separatorChar + "themes";
//        try {
//            themeDir = new URI(themeDir).getPath();
//        } catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
        File[] dir = new File(themeDir).listFiles();
        for (File f : dir) {
            if (f.isDirectory() && Files.isDirectory(Paths.get(f.getPath() + File.separatorChar + "static"))) {
                String themePath = File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + f.getName();
                blade.addStatics(new String[]{themePath + File.separatorChar + "style.css", themePath + File.separatorChar + "screenshot.png", themePath + File.separatorChar + "static"});
            }
        }
    }

    public static void loadTheme(String themePath) {
        blade.addStatics(themePath + File.separatorChar + "style.css", themePath + File.separatorChar + "screenshot.png", themePath + File.separatorChar + "static");
    }

    public static void loadPlugins() {
        File pluginDir = new File(AttachController.CLASSPATH + "plugins");
        if (pluginDir.exists() && pluginDir.isDirectory()) {
            File[] plugins = pluginDir.listFiles();
            for (File plugin : plugins) {
                loadPlugin(plugin);
            }
        }
    }

    /**
     * 加载某个插件jar包
     *
     * @param pluginFile 插件文件
     */
    public static void loadPlugin(File pluginFile) {
        try {
            if (pluginFile.isFile() && pluginFile.getName().endsWith(".jar")) {
                URLClassLoader classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
                Method         add         = URLClassLoader.class.getDeclaredMethod("addURL", new Class[]{URL.class});
                add.setAccessible(true);
                add.invoke(classLoader, pluginFile.toURI().toURL());

                String pluginName = pluginFile.getName().substring(6);
                blade.addStatics(new String[]{File.separatorChar+"templates"+File.separatorChar+"plugins" + File.separatorChar + pluginName + File.separatorChar + "static"});
            }
        } catch (Exception e) {
            throw new RuntimeException("插件 [" + pluginFile.getName() + "] 加载失败");
        }
    }

}
