package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.PageRow;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.model.dto.Types;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.entity.Contents;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;

import java.util.List;
import java.util.Optional;

/**
 * 内容Service实现
 *
 * @author biezhi
 */
@Bean
public class ContentsServiceImpl implements ContentsService {

    @Inject
    private ActiveRecord activeRecord;

    @Inject
    private MetasService metasService;

    @Override
    public Optional<Contents> getContents(String id) {
        if (StringKit.isNotBlank(id)) {
            if (StringKit.isNumber(id)) {
                return Optional.ofNullable(activeRecord.byId(Contents.class, id));
            } else {
                return Optional.ofNullable(activeRecord.one(new Take(Contents.class).eq("slug", id)));
            }
        }
        return Optional.empty();
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
    public Integer publish(Contents contents) {
        if (null == contents)
            throw new TipException("文章对象为空");
        if (StringKit.isBlank(contents.getTitle()))
            throw new TipException("文章标题不能为空");
        if (contents.getTitle().length() > TaleConst.MAX_TITLE_COUNT) {
            throw new TipException("文章标题最多可以输入" + TaleConst.MAX_TITLE_COUNT + "个字符");
        }

        if (StringKit.isBlank(contents.getContent()))
            throw new TipException("文章内容不能为空");
        // 最多可以输入5w个字
        int len = contents.getContent().length();
        if (len > TaleConst.MAX_TEXT_COUNT)
            throw new TipException("文章内容最多可以输入" + TaleConst.MAX_TEXT_COUNT + "个字符");
        if (null == contents.getAuthor_id())
            throw new TipException("请登录后发布文章");

        if (StringKit.isNotBlank(contents.getSlug())) {
            if (contents.getSlug().length() < 5) {
                throw new TipException("路径太短了");
            }
            if (!TaleUtils.isPath(contents.getSlug())) throw new TipException("您输入的路径不合法");

            int count = activeRecord.count(new Take(Contents.class).eq("type", contents.getType()).eq("slug", contents.getSlug()));
            if (count > 0) throw new TipException("该路径已经存在，请重新输入");
        }

        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));

        int time = (int) DateKit.nowUnix();
        contents.setCreated(time);
        contents.setModified(time);

        String tags       = contents.getTags();
        String categories = contents.getCategories();

        Integer cid = activeRecord.insert(contents);

        metasService.saveMetas(cid, tags, Types.TAG);
        metasService.saveMetas(cid, categories, Types.CATEGORY);

        return cid;
    }

    @Override
    public void updateArticle(Contents contents) {
        if (null == contents || null == contents.getCid()) {
            throw new TipException("文章对象不能为空");
        }
        if (StringKit.isBlank(contents.getTitle())) {
            throw new TipException("文章标题不能为空");
        }
        if (contents.getTitle().length() > TaleConst.MAX_TITLE_COUNT) {
            throw new TipException("文章标题最多可以输入" + TaleConst.MAX_TITLE_COUNT + "个字符");
        }
        if (StringKit.isBlank(contents.getContent())) {
            throw new TipException("文章内容不能为空");
        }
        if (contents.getContent().length() > TaleConst.MAX_TEXT_COUNT)
            throw new TipException("文章内容最多可以输入" + TaleConst.MAX_TEXT_COUNT + "个字符");
        if (null == contents.getAuthor_id()) {
            throw new TipException("请登录后发布文章");
        }
        contents.setModified(DateKit.nowUnix());

        Integer cid = contents.getCid();

        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));

        activeRecord.update(contents);

        if (null != contents.getType() && !contents.getType().equals(Types.PAGE)) {
            String sql = "delete from t_relationships where cid = ?";
            activeRecord.execute(sql, cid);
        }

        metasService.saveMetas(cid, contents.getTags(), Types.TAG);
        metasService.saveMetas(cid, contents.getCategories(), Types.CATEGORY);
    }

    @Override
    public void update(Contents contents) {
        if (null != contents && null != contents.getCid()) {
            activeRecord.update(contents);
        }
    }

    @Override
    public void delete(int cid) {
        Optional<Contents> contents = this.getContents(cid + "");
        contents.ifPresent(content -> {
            activeRecord.delete(Contents.class, cid);
            activeRecord.execute("delete from t_relationships where cid = ?", cid);
        });
    }

    @Override
    public Paginator<Contents> getArticles(Integer mid, int page, int limit) {
        String countSql = "select count(0) from t_contents a left join t_relationships b on a.cid = b.cid " +
                "where b.mid = ? and a.status = 'publish' and a.type = 'post'";
        int total = activeRecord.one(Integer.class, countSql, mid);

        PageRow             pageRow   = new PageRow(page, limit);
        Paginator<Contents> paginator = new Paginator<>(total, pageRow.getPage(), pageRow.getLimit());

        String sql = "select a.* from t_contents a left join t_relationships b on a.cid = b.cid " +
                "where b.mid = ? and a.status = 'publish' and a.type = 'post' order by a.created desc limit " + pageRow.getOffSet() + "," + limit;

        List<Contents> list = activeRecord.list(Contents.class, sql, mid);
        if (null != list) {
            paginator.setList(list);
        }
        return paginator;
    }

}
