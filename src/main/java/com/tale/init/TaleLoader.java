package com.tale.init;

import com.blade.config.BConfig;
import com.blade.kit.FileKit;
import com.tale.controller.admin.AttachController;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

import static com.blade.Blade.$;

/**
 * Created by biezhi on 2017/3/1.
 */
public final class TaleLoader {

    private TaleLoader(){
    }

    public static void init(){
        loadPlugins();
        loadThemes();
    }

    public static void loadThemes(){
        BConfig bConfig = $().bConfig();
        String themeDir = AttachController.CLASSPATH + "templates/themes";
        File[] dir = new File(themeDir).listFiles();
        for(File f : dir){
            if(f.isDirectory() && FileKit.isDirectory(f.getPath() + "/static")){
                bConfig.addStatic(new String[]{"/templates/themes/"+ f.getName() +"/static"});
            }
        }
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
            URLClassLoader classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
            Method add = URLClassLoader.class.getDeclaredMethod("addURL", new Class[]{URL.class});
            add.setAccessible(true);
            add.invoke(classLoader, pluginFile.toURI().toURL());
        } catch (Exception e) {
            throw new RuntimeException("插件 [" + pluginFile.getName() + "] 加载失败");
        }
    }

}
