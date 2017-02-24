package com.tale.init;

import com.blade.config.BConfig;
import com.blade.context.WebContextListener;
import com.blade.ioc.BeanProcessor;
import com.blade.ioc.Ioc;
import com.blade.ioc.annotation.Inject;
import com.blade.mvc.view.ViewSettings;
import com.blade.mvc.view.template.JetbrickTemplateEngine;
import com.tale.ext.AdminCommons;
import com.tale.ext.Commons;
import com.tale.ext.JetTag;
import com.tale.service.OptionsService;
import jetbrick.template.resolver.GlobalResolver;

import javax.servlet.ServletContext;

/**
 * Tale初始化进程
 *
 * @author biezhi
 */
public class WebContext implements BeanProcessor, WebContextListener {

    @Inject
    private OptionsService optionsService;

    private static boolean dbIsOk = false;

    @Override
    public void init(BConfig bConfig, ServletContext sec) {
        JetbrickTemplateEngine templateEngine = new JetbrickTemplateEngine();
        templateEngine.addConfig("jetx.import.macros", "/comm/macros.html");
        GlobalResolver resolver = templateEngine.getGlobalResolver();
        resolver.registerFunctions(Commons.class);
        resolver.registerFunctions(AdminCommons.class);
        resolver.registerTags(JetTag.class);

        ViewSettings.$().templateEngine(templateEngine);
        if (dbIsOk) {
            TaleConst.OPTIONS.addAll(optionsService.getOptions());
            TaleConst.INSTALL = true;
        }
    }

    @Override
    public void register(Ioc ioc) {
        dbIsOk = TaleJdbc.injection(ioc);
    }

}