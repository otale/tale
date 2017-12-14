package com.tale.init;

import com.blade.Blade;
import com.blade.Environment;
import com.blade.event.BeanProcessor;
import com.blade.ioc.Ioc;
import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.Base;
import com.blade.kit.StringKit;
import com.blade.mvc.view.template.JetbrickTemplateEngine;
import com.tale.controller.BaseController;
import com.tale.controller.admin.AttachController;
import com.tale.extension.AdminCommons;
import com.tale.extension.Commons;
import com.tale.extension.JetTag;
import com.tale.extension.Theme;
import com.tale.model.dto.Types;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import jetbrick.template.JetGlobalContext;
import jetbrick.template.resolver.GlobalResolver;
import org.sql2o.Sql2o;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Tale初始化进程
 *
 * @author biezhi
 */
@Bean
public class WebContext implements BeanProcessor {

    @Inject
    private OptionsService optionsService;

    @Inject
    private Environment environment;

    @Override
    public void preHandle(Blade blade) {
        Ioc ioc = blade.ioc();

        boolean devMode = true;
        if (blade.environment().hasKey("app.dev")) {
            devMode = blade.environment().getBoolean("app.dev", true);
        }
        if (blade.environment().hasKey("app.devMode")) {
            devMode = blade.environment().getBoolean("app.devMode", true);
        }
        SqliteJdbc.importSql(devMode);

        Sql2o sql2o = new Sql2o(SqliteJdbc.DB_SRC, null, null);
        Base.open(sql2o);
        Commons.setSiteService(ioc.getBean(SiteService.class));
    }

    @Override
    public void processor(Blade blade) {
        JetbrickTemplateEngine templateEngine = new JetbrickTemplateEngine();

        List<String> macros = new ArrayList<>(8);
        macros.add(File.separatorChar + "comm" + File.separatorChar + "macros.html");
        // 扫描主题下面的所有自定义宏
        String themeDir = AttachController.CLASSPATH + "templates" + File.separatorChar + "themes";
        File[] dir      = new File(themeDir).listFiles();
        for (File f : dir) {
            if (f.isDirectory() && Files.exists(Paths.get(f.getPath() + File.separatorChar + "macros.html"))) {
                String macroName = File.separatorChar + "themes" + File.separatorChar + f.getName() + File.separatorChar + "macros.html";
                macros.add(macroName);
            }
        }
        StringBuffer sbuf = new StringBuffer();
        macros.forEach(s -> sbuf.append(',').append(s));
        templateEngine.addConfig("jetx.import.macros", sbuf.substring(1));

        GlobalResolver resolver = templateEngine.getGlobalResolver();
        resolver.registerFunctions(Commons.class);
        resolver.registerFunctions(Theme.class);
        resolver.registerFunctions(AdminCommons.class);
        resolver.registerTags(JetTag.class);

        JetGlobalContext context = templateEngine.getGlobalContext();
        context.set("version", environment.get("app.version", "v1.0"));
        context.set("enableCdn", environment.getBoolean("app.enableCdn", false));

        blade.templateEngine(templateEngine);

        TaleConst.ENABLED_CDN = environment.getBoolean("app.enableCdn", false);
        TaleConst.MAX_FILE_SIZE = environment.getInt("app.max-file-size", 20480);

        TaleConst.AES_SALT = environment.get("app.salt", "012c456789abcdef");
        TaleConst.OPTIONS.addAll(optionsService.getOptions());
        String ips = TaleConst.OPTIONS.get(Types.BLOCK_IPS, "");
        if (StringKit.isNotBlank(ips)) {
            TaleConst.BLOCK_IPS.addAll(Arrays.asList(ips.split(",")));
        }
        if (Files.exists(Paths.get(AttachController.CLASSPATH + "install.lock"))) {
            TaleConst.INSTALLED = Boolean.TRUE;
        }

        BaseController.THEME = "themes/" + Commons.site_option("site_theme");

        TaleConst.BCONF = environment;
    }
}
