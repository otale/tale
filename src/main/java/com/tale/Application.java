package com.tale;

import com.tale.init.TaleLoader;
import com.tale.utils.ExtClasspathLoader;

import java.io.File;

import static com.blade.Blade.$;

public class Application {

    public static void main(String[] args) throws Exception {
        TaleLoader.init();
        TaleLoader.loadPlugin(new File("/Users/biezhi/workspace/projects/java/plugin_upyun/target/plguin_upyun.jar"));
        $().start(Application.class);
    }

}