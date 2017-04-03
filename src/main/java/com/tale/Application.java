package com.tale;

import com.tale.init.TaleLoader;

import static com.blade.Blade.$;

public class Application {

    public static void main(String[] args) throws Exception {
        TaleLoader.init();
        $().start(Application.class);
    }
}