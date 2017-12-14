package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.ActiveRecord;
import com.blade.jdbc.core.OrderBy;
import com.blade.jdbc.page.Page;
import com.blade.kit.BladeKit;
import com.blade.kit.DateKit;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.tale.controller.admin.AttachController;
import com.tale.exception.TipException;
import com.tale.extension.Theme;
import com.tale.init.SqliteJdbc;
import com.tale.init.TaleConst;
import com.tale.model.dto.*;
import com.tale.model.entity.*;
import com.tale.utils.MapCache;
import com.tale.utils.TaleUtils;
import com.tale.utils.ZipUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 站点Service
 *
 * @author biezhi
 * @since 1.3.1
 */
@Bean
public class SiteService {

    @Inject
    private CommentsService commentsService;

    public MapCache mapCache = new MapCache();

    /**
     * 初始化站点
     *
     * @param users 用户
     */
    public void initSite(Users users) {
        String pwd = EncryptKit.md5(users.getUsername() + users.getPassword());
        users.setPassword(pwd);
        users.setScreen_name(users.getUsername());
        users.setCreated(DateKit.nowUnix());
        Integer uid = users.save();

        try {
            String cp   = SiteService.class.getClassLoader().getResource("").getPath();
            File   lock = new File(cp + "install.lock");
            lock.createNewFile();
            TaleConst.INSTALLED = Boolean.TRUE;
            new Logs(LogActions.INIT_SITE, null, "", uid.intValue()).save();
        } catch (Exception e) {
            throw new TipException("初始化站点失败");
        }
    }

    /**
     * 最新收到的评论
     *
     * @param limit 评论数
     */
    public List<Comments> recentComments(int limit) {
        if (limit < 0 || limit > 10) {
            limit = 10;
        }
        Page<Comments> commentsPage = new Comments().page(1, limit, "created desc");
        return commentsPage.getRows();
    }

    /**
     * 根据类型获取文章列表
     *
     * @param type  最新,随机
     * @param limit 获取条数
     */
    public List<Contents> getContens(String type, int limit) {

        if (limit < 0 || limit > 20) {
            limit = 10;
        }

        // 最新文章
        if (Types.RECENT_ARTICLE.equals(type)) {
            Page<Contents> contentsPage = new Contents().where("status", Types.PUBLISH)
                    .and("type", Types.ARTICLE)
                    .page(1, limit, "created desc");
            return contentsPage.getRows();
        }

        // 随机文章
        if (Types.RANDOM_ARTICLE.equals(type)) {
            List<Integer> cids = new ActiveRecord().queryAll(Integer.class, "select cid from t_contents where type = ? and status = ? order by random() * cid limit ?", Types.ARTICLE, Types.PUBLISH, limit);
            if (BladeKit.isNotEmpty(cids)) {
                return new Contents().in("cid", cids).findAll();
            }
        }
        return new ArrayList<>();
    }

    /**
     * 获取后台统计数据
     */
    public Statistics getStatistics() {

        Statistics statistics = mapCache.get(Types.C_STATISTICS);
        if (null != statistics) {
            return statistics;
        }

        statistics = new Statistics();

        long articles   = new Contents().where("type", Types.ARTICLE).and("status", Types.PUBLISH).count();
        long pages      = new Contents().where("type", Types.PAGE).and("status", Types.PUBLISH).count();
        long comments   = new Comments().count();
        long attachs    = new Attach().count();
        long tags       = new Metas().where("type", Types.TAG).count();
        long categories = new Metas().where("type", Types.CATEGORY).count();

        statistics.setArticles(articles);
        statistics.setPages(pages);
        statistics.setComments(comments);
        statistics.setAttachs(attachs);
        statistics.setTags(tags);
        statistics.setCategories(categories);

        mapCache.set(Types.C_STATISTICS, statistics);
        return statistics;
    }

    /**
     * 查询文章归档
     */
    public List<Archive> getArchives() {
        String sql = "select strftime('%Y年%m月', datetime(created, 'unixepoch') ) as date_str, count(*) as count  from t_contents " +
                "where type = 'post' and status = 'publish' group by date_str order by date_str desc";
        List<Archive> archives = new Archive().queryAll(sql);
        if (null != archives) {
            return archives.stream()
                    .map(this::parseArchive)
                    .collect(Collectors.toList());
        }
        return Collections.EMPTY_LIST;
    }

    private Archive parseArchive(Archive archive) {
        String date_str = archive.getDate_str();
        Date   sd       = DateKit.toDate(date_str + "01", "yyyy年MM月dd");
        archive.setDate(sd);
        int      start    = DateKit.toUnix(sd);
        Calendar calender = Calendar.getInstance();
        calender.setTime(sd);
        calender.add(Calendar.MONTH, 1);
        Date endSd = calender.getTime();
        int  end   = DateKit.toUnix(endSd) - 1;
        List<Contents> contents = new Contents().where("type", Types.ARTICLE)
                .and("status", Types.PUBLISH)
                .and("created", ">", start)
                .and("created", "<", end)
                .findAll(OrderBy.desc("created"));

        archive.setArticles(contents);
        return archive;
    }

    /**
     * 查询一条评论
     *
     * @param coid 评论主键
     */
    public Comments getComment(Integer coid) {
        if (null != coid) {
            return new Comments().find(coid);
        }
        return null;
    }

    /**
     * 系统备份
     *
     * @param bkType
     * @param bkPath
     * @param fmt
     */
    public BackResponse backup(String bkType, String bkPath, String fmt) throws Exception {
        BackResponse backResponse = new BackResponse();
        if ("attach".equals(bkType)) {
            if (StringKit.isBlank(bkPath)) {
                throw new TipException("请输入备份文件存储路径");
            }
            if (!Files.isDirectory(Paths.get(bkPath))) {
                throw new TipException("请输入一个存在的目录");
            }
            String bkAttachDir = AttachController.CLASSPATH + "upload";
            String bkThemesDir = AttachController.CLASSPATH + "templates/themes";

            String fname = DateKit.toString(new Date(), fmt) + "_" + StringKit.rand(5) + ".zip";

            String attachPath = bkPath + "/" + "attachs_" + fname;
            String themesPath = bkPath + "/" + "themes_" + fname;

            ZipUtils.zipFolder(bkAttachDir, attachPath);
            ZipUtils.zipFolder(bkThemesDir, themesPath);

            backResponse.setAttach_path(attachPath);
            backResponse.setTheme_path(themesPath);
        }
        // 备份数据库
        if ("db".equals(bkType)) {
            String filePath = "upload/" + DateKit.toString(new Date(), "yyyyMMddHHmmss") + "_" + StringKit.rand(8) + ".db";
            String cp       = AttachController.CLASSPATH + filePath;
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

    /**
     * 获取分类/标签列表
     *
     * @param searchType
     * @param type
     * @param limit
     * @return
     */
    public List<Metas> getMetas(String searchType, String type, int limit) {

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
            return new Metas().queryAll(sql, type, limit);
        }

        // 随机获取项目
        if (Types.RANDOM_META.equals(searchType)) {
            List<Integer> mids = new ActiveRecord().queryAll(Integer.class, "select mid from t_metas where type = ? order by random() * mid limit ?", type, limit);
            if (BladeKit.isNotEmpty(mids)) {
                String in = TaleUtils.listToInSql(mids);
                String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                        "where a.mid in " + in + "group by a.mid order by count desc, a.mid desc";

                return new Metas().queryAll(sql);
            }
        }
        return Theme.EMPTY;
    }

    /**
     * 获取相邻的文章
     *
     * @param type 上一篇:prev | 下一篇:next
     * @param created  当前文章创建时间
     */
    public Contents getNhContent(String type, Integer created) {
        Contents contents = null;
        if (Types.NEXT.equals(type)) {
            contents = new Contents().query("SELECT * FROM t_contents WHERE type = ? AND status = ? AND created > ? ORDER BY created ASC LIMIT 1", Types.ARTICLE, Types.PUBLISH, created);
        }
        if (Types.PREV.equals(type)) {
            contents = new Contents().query("SELECT * FROM t_contents WHERE type = ? AND status = ? AND created < ? ORDER BY created DESC LIMIT 1", Types.ARTICLE, Types.PUBLISH, created);
        }
        return contents;
    }

    /**
     * 获取文章的评论
     *
     * @param cid   文章id
     * @param page  页码
     * @param limit 每页条数
     */
    public Page<Comment> getComments(Integer cid, int page, int limit) {
        return commentsService.getComments(cid, page, limit);
    }

    /**
     * 清楚缓存
     *
     * @param key 缓存key
     */
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
