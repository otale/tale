package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.Base;
import com.blade.jdbc.page.Page;
import com.blade.jdbc.page.PageRow;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Relationships;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;

import java.util.Optional;

/**
 * 文章Service
 *
 * @author biezhi
 * @since 1.3.1
 */
@Bean
public class ContentsService {

    @Inject
    private MetasService metasService;

    /**
     * 根据id或slug获取文章
     *
     * @param id 唯一标识
     */
    public Optional<Contents> getContents(String id) {
        if (StringKit.isNotBlank(id)) {
            if (StringKit.isNumber(id)) {
                return Optional.ofNullable(new Contents().find(id));
            } else {
                return Optional.ofNullable(new Contents().where("slug", id).find());
            }
        }
        return Optional.empty();
    }

    /**
     * 发布文章
     *
     * @param contents 文章对象
     */
    public Integer publish(Contents contents) {
        if (null == contents) {
            throw new TipException("文章对象为空");
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
        // 最多可以输入5w个字
        int len = contents.getContent().length();
        if (len > TaleConst.MAX_TEXT_COUNT) {
            throw new TipException("文章内容最多可以输入" + TaleConst.MAX_TEXT_COUNT + "个字符");
        }
        if (null == contents.getAuthorId()) {
            throw new TipException("请登录后发布文章");
        }

        if (StringKit.isNotBlank(contents.getSlug())) {
            if (contents.getSlug().length() < 5) {
                throw new TipException("路径太短了");
            }
            if (!TaleUtils.isPath(contents.getSlug())) {
                throw new TipException("您输入的路径不合法");
            }

            long count = new Contents().where("type", contents.getType()).and("slug", contents.getSlug()).count();
            if (count > 0) {
                throw new TipException("该路径已经存在，请重新输入");
            }
        }

        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));

        int time = DateKit.nowUnix();
        contents.setCreated(time);
        contents.setModified(time);

        String tags       = contents.getTags();
        String categories = contents.getCategories();

        Integer cid = contents.save();

        metasService.saveMetas(cid, tags, Types.TAG);
        metasService.saveMetas(cid, categories, Types.CATEGORY);

        return cid;
    }

    /**
     * 编辑文章
     *
     * @param contents 文章对象
     */
    public void updateArticle(Contents contents) {
        contents.setModified(DateKit.nowUnix());
        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));
        contents.setTags(contents.getTags() != null ? contents.getTags() : "");
        contents.setCategories(contents.getCategories() != null ? contents.getCategories() : "");

        String  tags       = contents.getTags();
        String  categories = contents.getCategories();
        Integer cid        = contents.getCid();

        contents.update(cid);

        if (null != contents.getType() && !contents.getType().equals(Types.PAGE)) {
            new Relationships().delete("cid", cid);
        }

        metasService.saveMetas(cid, tags, Types.TAG);
        metasService.saveMetas(cid, categories, Types.CATEGORY);
    }

    /**
     * 根据文章id删除
     *
     * @param cid 文章id
     */
    public void delete(int cid) {
        Optional<Contents> contents = this.getContents(cid + "");
        contents.ifPresent(content -> {
            new Contents().delete(cid);
            new Relationships().delete("cid", cid);
        });
    }

    /**
     * 查询分类/标签下的文章归档
     *
     * @param mid   分类、标签id
     * @param page  页码
     * @param limit 每页条数
     * @return
     */
    public Page<Contents> getArticles(Integer mid, int page, int limit) {

        String sql = "select a.* from t_contents a left join t_relationships b on a.cid = b.cid " +
                "where b.mid = ? and a.status = 'publish' and a.type = 'post'";

        return new Contents().page(new PageRow(page, limit), sql, "a.created desc", mid);
    }

}
