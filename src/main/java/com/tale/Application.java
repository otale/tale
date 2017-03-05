package com.tale;

import com.blade.Blade;
import com.tale.init.TaleLoader;

import java.io.File;

import static com.blade.Blade.$;

public class Application {

    public static void main(String[] args) throws Exception {
        TaleLoader.init();
        TaleLoader.loadPlugin(Blade.$().bConfig(), new File("/Users/biezhi/workspace/projects/java/plugin_upyun/target/plguin_upyun.jar"));
        $().start(Application.class);
    }

}