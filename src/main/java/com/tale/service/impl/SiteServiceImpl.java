package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ar.SampleActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.BladeKit;
import com.blade.kit.DateKit;
import com.blade.kit.EncrypKit;
import com.blade.kit.StringKit;
import com.tale.controller.admin.AttachController;
import com.tale.exception.TipException;
import com.tale.extension.Theme;
import com.tale.init.SqliteJdbc;
import com.tale.init.TaleConst;
import com.tale.model.dto.*;
import com.tale.model.entity.*;
import com.tale.service.*;
import com.tale.utils.MapCache;
import com.tale.utils.TaleUtils;
import com.tale.utils.ZipUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * 站点Service实现
 * <p>
 * Created by biezhi on 2017/2/23.
 */
@Bean
public class SiteServiceImpl implements SiteService {

    @Inject
    private SampleActiveRecord activeRecord;

    @Inject
    private LogService logService;

    @Inject
    private CommentsService commentsService;

    public MapCache mapCache = new MapCache();

    @Override
    public void initSite(Users users) {
        String pwd = EncrypKit.md5(users.getUsername() + users.getPassword());
        users.setPassword(pwd);
        users.setScreen_name(users.getUsername());
        users.setCreated((int) DateKit.nowUnix());
        Integer uid = activeRecord.insert(users);

        try {
            String cp = SiteServiceImpl.class.getClassLoader().getResource("").getPath();
            File lock = new File(cp + "install.lock");
            lock.createNewFile();
            TaleConst.INSTALL = Boolean.TRUE;
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
                    .eq("status", Types.PUBLISH).eq("type", Types.ARTICLE).page(1, limit, "created desc"));
        }

        // 随机文章
        if (Types.RANDOM_ARTICLE.equals(type)) {
            List<Integer> cids = activeRecord.list(Integer.class, "select cid from t_contents where type = ? and status = ? order by rand() * cid limit ?", Types.ARTICLE, Types.PUBLISH, limit);
            if (BladeKit.isNotEmpty(cids)) {
                Integer[] inCids = cids.toArray(new Integer[cids.size()]);
                return activeRecord.list(new Take(Contents.class).in("cid", inCids));
            }
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

        String sql = "select strftime('%Y年%m月', datetime(created, 'unixepoch') ) as date_str, count(*) as count  from t_contents\n" +
                "where type = 'post' and status = 'publish' group by date_str order by date_str desc";

        List<Archive> archives = activeRecord.list(Archive.class, sql);
        if (null != archives) {
            archives.forEach(archive -> {
                String date_str = archive.getDate_str();
                Date sd = DateKit.toDate(date_str + "01", "yyyy年MM月dd");
                archive.setDate(sd);

                int start = (int) DateKit.toUnix(sd);

                Calendar calender = Calendar.getInstance();
                calender.setTime(sd);
                calender.add(Calendar.MONTH, 1);
                Date endSd = calender.getTime();

                int end = DateKit.toUnix(endSd) - 1;
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
        if ("attach".equals(bk_type)) {
            if (StringKit.isBlank(bk_path)) {
                throw new TipException("请输入备份文件存储路径");
            }
            if (!Files.isDirectory(Paths.get(bk_path))) {
                throw new TipException("请输入一个存在的目录");
            }
            String bkAttachDir = AttachController.CLASSPATH + "upload";
            String bkThemesDir = AttachController.CLASSPATH + "templates/themes";

            String fname = DateKit.toString(new Date(), fmt) + "_" + StringKit.rand(5) + ".zip";

            String attachPath = bk_path + "/" + "attachs_" + fname;
            String themesPath = bk_path + "/" + "themes_" + fname;

            ZipUtils.zipFolder(bkAttachDir, attachPath);
            ZipUtils.zipFolder(bkThemesDir, themesPath);

            backResponse.setAttach_path(attachPath);
            backResponse.setTheme_path(themesPath);
        }
        // 备份数据库
        if ("db".equals(bk_type)) {
            String filePath = "upload/" + DateKit.toString(new Date(), "yyyyMMddHHmmss") + "_" + StringKit.rand(8) + ".db";
            String cp = AttachController.CLASSPATH + filePath;
            Files.createDirectory(Paths.get(cp));
            Files.copy(Paths.get(SqliteJdbc.DB_PATH), Paths.get(cp));
            backResponse.setSql_path("/" + filePath);
            // 10秒后删除备份文件
            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    new File(cp).delete();
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
            if (BladeKit.isNotEmpty(mids)) {
                String in = TaleUtils.listToInSql(mids);
                String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                        "where a.mid in " + in + "group by a.mid order by count desc, a.mid desc";
                return activeRecord.list(MetaDto.class, sql);
            }
        }
        return Theme.EMPTY;
    }

    @Override
    public Contents getNhContent(String type, Integer cid) {
        if (Types.NEXT.equals(type)) {
            return activeRecord.one(new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).gt("cid", cid));
        }
        if (Types.PREV.equals(type)) {
            return activeRecord.one(new Take(Contents.class).eq("type", Types.ARTICLE).eq("status", Types.PUBLISH).lt("cid", cid));
        }
        return null;
    }

    @Override
    public Paginator<Comment> getComments(Integer cid, int page, int limit) {
        return commentsService.getComments(cid, page, limit);
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
