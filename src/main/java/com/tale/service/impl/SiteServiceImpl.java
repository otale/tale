package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.kit.DateKit;
import com.blade.kit.Tools;
import com.tale.dto.JdbcConf;
import com.tale.init.TaleJdbc;
import com.tale.model.Users;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Properties;

/**
 * Created by biezhi on 2017/2/23.
 */
@Service
public class SiteServiceImpl implements SiteService {

    @Inject
    private ActiveRecord activeRecord;

    @Inject
    private OptionsService optionsService;

    @Override
    public void initSite(Users users, JdbcConf jdbcConf, String site_title) {
        String pwd = Tools.md5(users.getUsername() + users.getPassword());
        users.setPassword(pwd);
        users.setScreen_name(users.getUsername());
        users.setCreated(DateKit.getCurrentUnixTime());
        activeRecord.insert(users);
        optionsService.saveOption("site_title", site_title);

        try {
            Properties props = new Properties();
            String cp = TaleJdbc.class.getClassLoader().getResource("").getPath();

            FileOutputStream fos = new FileOutputStream(cp + "jdbc.properties");

            props.setProperty("db_host", jdbcConf.getDb_host());
            props.setProperty("db_name", jdbcConf.getDb_name());
            props.setProperty("db_user", jdbcConf.getDb_user());
            props.setProperty("db_pass", jdbcConf.getDb_pass());
            props.store(fos, "update jdbc info.");
            fos.close();

            File lock = new File(cp + "install.lock");
            lock.createNewFile();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
