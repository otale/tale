package com.tale.init;

import com.blade.config.BConfig;
import com.blade.context.WebContextListener;
import com.blade.ioc.BeanProcessor;
import com.blade.ioc.Ioc;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.ar.SampleActiveRecord;
import com.blade.kit.FileKit;
import com.blade.kit.StringKit;
import com.blade.mvc.view.ViewSettings;
import com.blade.mvc.view.template.JetbrickTemplateEngine;
import com.tale.controller.BaseController;
import com.tale.controller.admin.AttachController;
import com.tale.dto.Types;
import com.tale.ext.AdminCommons;
import com.tale.ext.Commons;
import com.tale.ext.JetTag;
import com.tale.ext.Theme;
import com.tale.model.ExtSql2o;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import jetbrick.template.JetGlobalContext;
import jetbrick.template.resolver.GlobalResolver;

import javax.servlet.ServletContext;
import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Tale初始化进程
 *
 * @author biezhi
 */
public class WebContext implements BeanProcessor, WebContextListener {

    @Inject
    private OptionsService optionsService;

    @Override
    public void init(BConfig bConfig, ServletContext sec) {
        JetbrickTemplateEngine templateEngine = new JetbrickTemplateEngine();

        List<String> macros = new ArrayList<>(8);
        macros.add("/comm/macros.html");
        // 扫描主题下面的所有自定义宏
        String themeDir = AttachController.CLASSPATH + "templates/themes";
        try {
            themeDir = new URI(themeDir).getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        File[] dir = new File(themeDir).listFiles();
        for (File f : dir) {
            if (f.isDirectory() && FileKit.exist(f.getPath() + "/macros.html")) {
                String macroName = "/themes/" + f.getName() + "/macros.html";
                macros.add(macroName);
            }
        }
        StringBuffer macroBuf = new StringBuffer();
        macros.forEach(s -> macroBuf.append(',').append(s));
        templateEngine.addConfig("jetx.import.macros", macroBuf.substring(1));

        GlobalResolver resolver = templateEngine.getGlobalResolver();
        resolver.registerFunctions(Commons.class);
        resolver.registerFunctions(Theme.class);
        resolver.registerFunctions(AdminCommons.class);
        resolver.registerTags(JetTag.class);

        JetGlobalContext context = templateEngine.getGlobalContext();
        context.set("version", bConfig.config().get("app.version", "v1.0"));

        TaleConst.MAX_FILE_SIZE = bConfig.config().getInt("app.max-file-size", 20480);

        ViewSettings.$().templateEngine(templateEngine);
        
        TaleConst.AES_SALT = bConfig.config().get("app.salt", "0123456789abcdef");
        TaleConst.OPTIONS.addAll(optionsService.getOptions());
        BaseController.THEME = "themes/" + Commons.site_option("site_theme");

        String ips = TaleConst.OPTIONS.get(Types.BLOCK_IPS, "");
        if (StringKit.isNotBlank(ips)) {
            TaleConst.BLOCK_IPS.addAll(Arrays.asList(StringKit.split(ips, ",")));
        }
        if (FileKit.exist(AttachController.CLASSPATH + "install.lock")) {
            TaleConst.INSTALL = Boolean.TRUE;
        }
        TaleConst.BCONF = bConfig.config();
    }

    @Override
    public void register(Ioc ioc) {
        SqliteJdbc.importSql();
        ExtSql2o sql2o = new ExtSql2o(SqliteJdbc.DB_SRC);
        ActiveRecord activeRecord = new SampleActiveRecord(sql2o);
        ioc.addBean(activeRecord);
        Commons.setSiteService(ioc.getBean(SiteService.class));
    }

}