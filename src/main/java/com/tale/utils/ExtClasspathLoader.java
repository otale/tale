package com.tale.utils;

import com.tale.controller.admin.AttachController;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;

/**
 * 根据properties中配置的路径把jar和配置文件加载到classpath中。
 *
 * @author jnbzwm
 */
public final class ExtClasspathLoader {
    /**
     * URLClassLoader的addURL方法
     */
    private static Method addURL = initAddMethod();

    //private static URLClassLoader classloader = (URLClassLoader) ClassLoader.getSystemClassLoader();
    private static URLClassLoader classloader = (URLClassLoader) AttachController.class.getClassLoader();

    /**
     * 初始化addUrl 方法.
     *
     * @return 可访问addUrl方法的Method对象
     */
    private static Method initAddMethod() {
        try {
            Method add = URLClassLoader.class.getDeclaredMethod("addURL", new Class[]{URL.class});
            add.setAccessible(true);
            return add;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 加载jar classpath。
     */
    public static void loadClasspath() {
        List<File> files = getJarFiles();
        for (File f : files) {
            loadClasspath(f);
        }
    }

    private static void loadClasspath(File file) {
        loopFiles(file);
    }

    /**
     * 循环遍历目录，找出所有的资源路径。
     *
     * @param file 当前遍历文件
     */
    private static void loopDirs(File file) {
        // 资源文件只加载路径
        if (file.isDirectory()) {
            addURL(file);
            File[] tmps = file.listFiles();
            for (File tmp : tmps) {
                loopDirs(tmp);
            }
        }
    }

    /**
     * 循环遍历目录，找出所有的jar包。
     *
     * @param file 当前遍历文件
     */
    private static void loopFiles(File file) {
        if (file.isDirectory()) {
            File[] tmps = file.listFiles();
            for (File tmp : tmps) {
                loopFiles(tmp);
            }
        } else {
            if (file.getAbsolutePath().endsWith(".jar") || file.getAbsolutePath().endsWith(".zip")) {
                addURL(file);
            }
        }
    }

    /**
     * 通过filepath加载文件到classpath。
     *
     * @param file 文件路径
     * @return URL
     * @throws Exception 异常
     */
    private static void addURL(File file) {
        try {
            addURL.invoke(classloader, new Object[]{file.toURI().toURL()});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 从配置文件中得到配置的需要加载到classpath里的路径集合。
     *
     * @return
     */
    private static List<File> getJarFiles() {
        File pluginDir = new File(AttachController.CLASSPATH + "plugins");
        if (pluginDir.isDirectory()) {
            return Arrays.asList(pluginDir.listFiles());
        }
        return new ArrayList<>(0);
    }

    /**
     * 从配置文件中得到配置的需要加载classpath里的资源路径集合
     *
     * @return
     */
    private static List<File> getResFiles() {
        File pluginDir = new File(AttachController.CLASSPATH + "plugins");
        if (pluginDir.isDirectory()) {
            return Arrays.asList(pluginDir.listFiles());
        }
        return new ArrayList<>(0);
    }

    public static void main(String[] args) {
        ExtClasspathLoader.loadClasspath();
        try {
//            Class.forName("com.tale.plugins");
            Enumeration<URL> dirs = ExtClasspathLoader.class.getClassLoader().getResources("com/tale/plugins");
            if(dirs.hasMoreElements()){
                String url = dirs.nextElement().toString();
                System.out.println(url);
                System.out.println(url.indexOf(".jar!") != -1 || url.indexOf(".zip!") != -1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}