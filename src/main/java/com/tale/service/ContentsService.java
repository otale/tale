package com.tale.service;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Relationships;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import io.github.biezhi.anima.Anima;
import io.github.biezhi.anima.page.Page;

import java.util.Optional;

import static com.tale.bootstrap.TaleConst.SQL_QUERY_ARTICLES;
import static io.github.biezhi.anima.Anima.deleteById;
import static io.github.biezhi.anima.Anima.select;

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
                return Optional.ofNullable(select().from(Contents.class).byId(id));
            } else {
                return Optional.ofNullable(select().from(Contents.class).where(Contents::getSlug, id).one());
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
        if (null == contents.getAuthorId()) {
            throw new ValidatorException("请登录后发布文章");
        }

        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));

        int time = DateKit.nowUnix();
        contents.setCreated(time);
        contents.setModified(time);

        String tags       = contents.getTags();
        String categories = contents.getCategories();

        Integer cid = contents.save().asInt();

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
        contents.setCreated(contents.getCreated());
        contents.setModified(DateKit.nowUnix());
        contents.setContent(EmojiParser.parseToAliases(contents.getContent()));
        contents.setTags(contents.getTags() != null ? contents.getTags() : "");
        contents.setCategories(contents.getCategories() != null ? contents.getCategories() : "");

        String  tags       = contents.getTags();
        String  categories = contents.getCategories();
        Integer cid        = contents.getCid();

        contents.updateById(cid);

        if (null != contents.getType() && !contents.getType().equals(Types.PAGE)) {
            Anima.delete().from(Relationships.class).where(Relationships::getCid, cid).execute();
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
            deleteById(Contents.class, cid);
            Anima.delete().from(Relationships.class).where(Relationships::getCid, cid).execute();
            Anima.delete().from(Comments.class).where(Comments::getCid, cid).execute();
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
        return select().bySQL(Contents.class, SQL_QUERY_ARTICLES, mid).page(page, limit);
    }

}
