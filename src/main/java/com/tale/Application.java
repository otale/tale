package com.tale;

import com.blade.Blade;
import com.blade.security.web.csrf.CsrfMiddleware;
import com.tale.init.TaleLoader;

/**
 * Tale启动类
 *
 * @author biezhi
 */
public class Application {

    public static void main(String[] args) {
        Blade blade = Blade.me();
        TaleLoader.init(blade);
        blade.use(new CsrfMiddleware()).start(Application.class, args);
    }

}