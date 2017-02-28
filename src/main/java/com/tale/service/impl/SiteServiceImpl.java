package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ar.SampleActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.*;
import com.tale.controller.admin.AttachController;
import com.tale.dto.*;
import com.tale.exception.TipException;
import com.tale.ext.Theme;
import com.tale.init.TaleConst;
import com.tale.init.TaleJdbc;
import com.tale.model.*;
import com.tale.service.LogService;
import com.tale.service.MetasService;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import com.tale.utils.MapCache;
import com.tale.utils.TaleUtils;
import com.tale.utils.ZipUtils;
import com.tale.utils.backup.Backup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.util.*;

/**
 * Created by biezhi on 2017/2/23.
 */
@Service
public class SiteServiceImpl implements SiteService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SiteService.class);

    @Inject
    private SampleActiveRecord activeRecord;

    @Inject
    private OptionsService optionsService;

    @Inject
    private LogService logService;

    @Inject
    private MetasService metasService;

    public MapCache mapCache = new MapCache();

    @Override
    public void initSite(Users users, JdbcConf jdbcConf) {
        String pwd = Tools.md5(users.getUsername() + users.getPassword());
        users.setPassword(pwd);
        users.setScreen_name(users.getUsername());
        users.setCreated(DateKit.getCurrentUnixTime());
        Long uid = activeRecord.insert(users);

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

            logService.save(LogActions.INIT_SITE, null, "", uid.intValue());
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
    public List<Contents> getContens(String type, int limit) {

        if (limit < 0 || limit > 20) {
            limit = 10;
        }

        Paginator<Contents> cp = new Paginator<>(1, 1);

        // 最新文章
        if (Types.RECENT_ARTICLE.equals(type)) {

            cp = activeRecord.page(new Take(Contents.class)
                    .eq("status", Types.PUBLISH).eq("type", Types.ARTICLE).page(1, limit, "created"));
        }

        Statistics statistics = this.getStatistics();

        // 随机文章
        if (Types.RANDOM_ARTICLE.equals(type)) {
            int max = statistics.getArticles();
            int[] cids = TaleUtils.random(max, limit);
            cp = activeRecord.page(new Take(Contents.class)
                    .in("cid", cids).eq("status", Types.PUBLISH)
                    .eq("type", Types.ARTICLE).page(1, limit));
        }
        return cp.getList();
    }

    @Override
    public Statistics getStatistics() {

        Statistics statistics = mapCache.get(Types.C_STATISTICS);
        if (null != statistics) {
            return statistics;
        }

        statistics = new Statistics();
        int articles = activeRecord.count(new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH));
        int pages = activeRecord.count(new Take(Contents.class).eq("type", Types.PAGE).eq("status", Types.PUBLISH));
        int comments = activeRecord.count(new Take(Comments.class));
        int attachs = activeRecord.count(new Take(Attach.class));
        int links = activeRecord.count(new Take(Metas.class).eq("type", Types.LINK));
        int tags = activeRecord.count(new Take(Metas.class).eq("type", Types.TAG));
        int categories = activeRecord.count(new Take(Metas.class).eq("type", Types.CATEGORY));

        statistics.setArticles(articles);
        statistics.setPages(pages);
        statistics.setComments(comments);
        statistics.setAttachs(attachs);
        statistics.setLinks(links);
        statistics.setTags(tags);
        statistics.setCategories(categories);

        mapCache.set(Types.C_STATISTICS, statistics);
        return statistics;
    }

    @Override
    public List<Archive> getArchives() {
        List<Archive> archives = activeRecord.list(Archive.class, "select FROM_UNIXTIME(created, '%Y年%m月') as date, count(*) as count from t_contents where type = 'post' and status = 'publish' group by date order by date desc");
        if (null != archives) {
            archives.forEach(archive -> {
                String date = archive.getDate();
                Date sd = DateKit.dateFormat(date, "yyyy年MM月");
                int start = DateKit.getUnixTimeByDate(sd);
                int end = DateKit.getUnixTimeByDate(DateKit.dateAdd(DateKit.INTERVAL_MONTH, sd, 1)) - 1;
                List<Contents> contentss = activeRecord.list(new Take(Contents.class)
                        .eq("type", Types.ARTICLE)
                        .eq("status", Types.PUBLISH)
                        .gt("created", start).lt("created", end).orderby("created desc"));
                archive.setArticles(contentss);
            });
        }
        return archives;
    }

    @Override
    public Comments getComment(Integer coid) {
        if (null != coid) {
            return activeRecord.byId(Comments.class, coid);
        }
        return null;
    }

    @Override
    public BackResponse backup(String bk_type, String bk_path, String fmt) throws Exception {
        BackResponse backResponse = new BackResponse();
        if (bk_type.equals("attach")) {
            if (StringKit.isBlank(bk_path)) {
                throw new TipException("请输入备份文件存储路径");
            }
            if (!FileKit.isDirectory(bk_path)) {
                throw new TipException("请输入一个存在的目录");
            }
            String bkAttachDir = AttachController.CLASSPATH + "upload";
            String bkThemesDir = AttachController.CLASSPATH + "templates/themes";

            String fname = DateKit.dateFormat(new Date(), fmt) + "_" + StringKit.getRandomNumber(5) + ".zip";

            String attachPath = bk_path + "/" + "attachs_" + fname;
            String themesPath = bk_path + "/" + "themes_" + fname;

            ZipUtils.zipFolder(bkAttachDir, attachPath);
            ZipUtils.zipFolder(bkThemesDir, themesPath);

            backResponse.setAttach_path(attachPath);
            backResponse.setTheme_path(themesPath);
        }
        if (bk_type.equals("db")) {

            String bkAttachDir = AttachController.CLASSPATH + "upload/";
            if (!FileKit.isDirectory(bkAttachDir)) {
                FileKit.createDir(bkAttachDir, false);
            }
            String sqlFileName = "tale_" + DateKit.dateFormat(new Date(), fmt) + "_" + StringKit.getRandomNumber(5) + ".sql";
            String zipFile = sqlFileName.replace(".sql", ".zip");

            Backup backup = new Backup(activeRecord.getSql2o().getDataSource().getConnection());
            String sqlContent = backup.execute();

            File sqlFile = new File(bkAttachDir + sqlFileName);
            IOKit.write(sqlContent, sqlFile, "UTF-8");

            String zip = bkAttachDir + zipFile;
            ZipUtils.zipFile(sqlFile.getPath(), zip);

            if (!sqlFile.exists()) {
                throw new TipException("数据库备份失败");
            }
            sqlFile.delete();

            backResponse.setSql_path(zipFile);

            // 10秒后删除备份文件
            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    new File(zip).delete();
                }
            }, 10 * 1000);
        }
        return backResponse;
    }

    @Override
    public List<MetaDto> getMetas(String searchType, String type, int limit) {

        if (StringKit.isBlank(searchType) || StringKit.isBlank(type)) {
            return Theme.EMPTY;
        }

        if (limit < 1 || limit > TaleConst.MAX_POSTS) {
            limit = 10;
        }

        // 获取最新的项目
        if (Types.RECENT_META.equals(searchType)) {
            String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                    "where a.type = ? group by a.mid order by count desc, a.mid desc limit ?";
            return activeRecord.list(MetaDto.class, sql, type, limit);
        }

        // 随机获取项目
        if (Types.RANDOM_META.equals(searchType)) {
            List<Integer> mids = activeRecord.list(Integer.class, "select mid from t_metas where type = ? order by rand() * mid limit ?", type, limit);
            if (CollectionKit.isNotEmpty(mids)) {
                Integer[] inMids = mids.toArray(new Integer[mids.size()]);
                String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                        "where a.mid in (?) group by a.mid order by count desc, a.mid desc";
                return activeRecord.list(MetaDto.class, sql, inMids, limit);
            }
        }
        return Theme.EMPTY;
    }

    @Override
    public void cleanCache(String key) {
        if (StringKit.isNotBlank(key)) {
            if ("*".equals(key)) {
                mapCache.clean();
            } else {
                mapCache.del(key);
            }
        }
    }
}
