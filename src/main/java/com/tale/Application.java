package com.tale;

import com.blade.config.BConfig;
import com.blade.kit.FileKit;
import com.tale.controller.admin.AttachController;

import java.io.File;

import static com.blade.Blade.$;

public class Application {

    public static void main(String[] args) {
        BConfig bConfig = $().bConfig();
        String themeDir = AttachController.CLASSPATH + "templates/themes";
        File[] dir = new File(themeDir).listFiles();
        for(File f : dir){
            if(f.isDirectory() && FileKit.isDirectory(f.getPath() + "/static")){
                bConfig.addStatic(new String[]{"/templates/themes/"+ f.getName() +"/static"});
            }
        }
        $().start(Application.class);
    }

}