package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.PageRow;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.dto.Archive;
import com.tale.dto.Types;
import com.tale.exception.TipException;
import com.tale.model.Contents;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;

import java.util.Date;
import java.util.List;

@Service
public class ContentsServiceImpl implements ContentsService {

    @Inject
    private ActiveRecord activeRecord;

    @Inject
    private MetasService metasService;

    @Override
    public Contents getContents(String id) {
        if (StringKit.isNotBlank(id)) {
            if (StringKit.isNumber(id)) {
                return activeRecord.byId(Contents.class, id);
            } else {
                return activeRecord.one(new Take(Contents.class).eq("slug", id));
            }
        }
        return null;
    }

    @Override
    public Contents getPage(String slug) {
        if (StringKit.isNotBlank(slug)) {
            return activeRecord.one(new Take(Contents.class).eq("slug", slug));
        }
        return null;
    }

    public Paginator<Contents> getContentsPage(Take take) {
        if (null != take) {
            return activeRecord.page(take);
        }
        return null;
    }

    public Paginator<Contents> getArticles(Take take) {
        return this.getContentsPage(take);
    }

    @Override
    public void publish(Contents contents) {
        if (null == contents) {
            throw new TipException("文章对象为空");
        }
        if (StringKit.isBlank(contents.getTitle())) {
            throw new TipException("文章标题不能为空");
        }
        if (StringKit.isBlank(contents.getContent())) {
            throw new TipException("文章内容不能为空");
        }
        if (contents.getTitle().length() > 200) {
            throw new TipException("文章标题过长");
        }
        if (contents.getContent().length() > 10000) {
            throw new TipException("文章内容过长");
        }
        if (null == contents.getAuthor_id()) {
            throw new TipException("请登录后发布文章");
        }

        int time = DateKit.getCurrentUnixTime();
        contents.setCreated(time);
        contents.setModified(time);

        String tags = contents.getTags();
        String categories = contents.getCategories();

        Long cid_ = activeRecord.insert(contents);
        Integer cid = cid_.intValue();

        metasService.saveMetas(cid, tags, Types.TAG);
        metasService.saveMetas(cid, categories, Types.CATEGORY);
    }

    @Override
    public void update(Contents contents) {
        if (null == contents || null == contents.getCid()) {
            throw new TipException("文章对象不能为空");
        }
        if (StringKit.isBlank(contents.getTitle())) {
            throw new TipException("文章标题不能为空");
        }
        if (StringKit.isBlank(contents.getContent())) {
            throw new TipException("文章内容不能为空");
        }
        if (contents.getTitle().length() > 200) {
            throw new TipException("文章标题过长");
        }
        if (contents.getContent().length() > 10000) {
            throw new TipException("文章内容过长");
        }
        if (null == contents.getAuthor_id()) {
            throw new TipException("请登录后发布文章");
        }
        int time = DateKit.getCurrentUnixTime();
        contents.setModified(time);

        Integer cid = contents.getCid();

        activeRecord.update(contents);

        String sql = "delete from t_relationships where cid = ?";
        activeRecord.execute(sql, cid);

        metasService.saveMetas(cid, contents.getTags(), Types.TAG);
        metasService.saveMetas(cid, contents.getCategories(), Types.CATEGORY);
    }

    @Override
    public void delete(int cid) {
        Contents contents = this.getContents(cid + "");
        if (null != contents) {
            String tags = contents.getTags();
            String categories = contents.getCategories();
            activeRecord.delete(Contents.class, cid);
            activeRecord.execute("delete from t_relationships where cid = ?", cid);
            if (StringKit.isNotBlank(tags)) {
                metasService.updateCount(Types.TAG, tags.split(","), -1);
            }
            if (StringKit.isNotBlank(categories)) {
                metasService.updateCount(Types.CATEGORY, categories.split(","), -1);
            }
        }
    }

    @Override
    public Paginator<Contents> getArticles(Integer mid, int page, int limit) {

        String countSql = "select count(0) from t_contents a left join t_relationships b on a.cid = b.cid " +
                "where b.mid = ? and a.status = 'publish' and a.type = 'post'";

        int total = activeRecord.one(Integer.class, countSql, mid);

        PageRow pageRow = new PageRow(page, limit);

        Paginator<Contents> paginator = new Paginator<>(total, pageRow.getPage(), pageRow.getLimit());

        String sql = "select a.* from t_contents a left join t_relationships b on a.cid = b.cid " +
                "where b.mid = ? and a.status = 'publish' and a.type = 'post' order by a.created desc limit " + pageRow.getOffSet() + "," + limit;

        List<Contents> list = activeRecord.list(Contents.class, sql, mid);
        if (null != list) {
            paginator.setList(list);
        }
        return paginator;
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
}
