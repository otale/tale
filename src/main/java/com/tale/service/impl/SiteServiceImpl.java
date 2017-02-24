package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.DateKit;
import com.blade.kit.Tools;
import com.tale.dto.*;
import com.tale.exception.TipException;
import com.tale.init.TaleJdbc;
import com.tale.model.*;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;
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
    public void initSite(Users users, JdbcConf jdbcConf) {
        String pwd = Tools.md5(users.getUsername() + users.getPassword());
        users.setPassword(pwd);
        users.setScreen_name(users.getUsername());
        users.setCreated(DateKit.getCurrentUnixTime());
        activeRecord.insert(users);

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
            throw new TipException("初始化站点失败");
        }
    }

    @Override
    public List<Comments> recentComments(int limit) {
        if (limit < 0 || limit > 10) {
            limit = 10;
        }
        Paginator<Comments> cp = activeRecord.page(new Take(Comments.class).page(1, limit, "created desc"));
        return cp.getList();
    }

    @Override
    public List<Contents> recentContents(int limit) {
        if (limit < 0 || limit > 10) {
            limit = 10;
        }
        Paginator<Contents> cp = activeRecord.page(new Take(Contents.class)
                .eq("status", Types.PUBLISH).eq("type", Types.ARTICLE).page(1, limit, "created"));
        return cp.getList();
    }

    @Override
    public Statistics getStatistics() {
        Statistics statistics = new Statistics();
        int articles = activeRecord.count(new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH));
        int comments = activeRecord.count(new Take(Comments.class));
        int attachs = activeRecord.count(new Take(Attach.class));
        int links = activeRecord.count(new Take(Metas.class).eq("type", Types.LINK));
        statistics.setArticles(articles);
        statistics.setComments(comments);
        statistics.setAttachs(attachs);
        statistics.setLinks(links);
        return statistics;
    }

    @Override
    public List<Archive> getArchives() {
        List<Archive> archives = activeRecord.list(Archive.class, "select FROM_UNIXTIME(created, '%Y年%m月') as date, count(*) as count from t_contents where type = 'post' and status = 'publish' group by date");
        if (null != archives) {
            for (Archive archive : archives) {
                String date = archive.getDate();
                Date sd = DateKit.dateFormat(date, "yyyy年MM月");
                int start = DateKit.getUnixTimeByDate(sd);
                int end = DateKit.getUnixTimeByDate(DateKit.dateAdd(DateKit.INTERVAL_MONTH, sd, 1)) - 1;
                List<Contents> contentss = activeRecord.list(new Take(Contents.class)
                        .eq("type", Types.ARTICLE)
                        .eq("status", Types.PUBLISH)
                        .gt("created", start).lt("created", end).orderby("created desc"));
                archive.setArticles(contentss);
            }
        }
        return archives;
    }

    @Override
    public Comments getComment(Integer coid) {
        if(null != coid){
            return activeRecord.byId(Comments.class, coid);
        }
        return null;
    }
}
