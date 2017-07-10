package com.tale;

import com.blade.Blade;
import com.tale.init.TaleLoader;

/**
 * Tale启动类
 *
 * @author biezhi
 */
public class Application {

    public static void main(String[] args) throws Exception {
        Blade blade = Blade.me();
        TaleLoader.init(blade);
        blade.start(Application.class, args);
    }

}