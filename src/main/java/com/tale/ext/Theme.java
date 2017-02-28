package com.tale.ext;

import com.blade.kit.StringKit;
import com.tale.dto.MetaDto;
import com.tale.dto.Types;
import com.tale.init.TaleConst;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import jetbrick.template.runtime.InterpretContext;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 主题函数
 * <p>
 * Created by biezhi on 2017/2/28.
 */
public final class Theme {

    private static SiteService siteService;

    public static final List EMPTY = new ArrayList(0);

    private static final Random rand = new Random();

    public static void setSiteService(SiteService ss) {
        siteService = ss;
    }

    /**
     * 返回文章链接地址
     *
     * @return
     */
    public static String permalink() {
        Contents contents = current_article();
        return null != contents ? permalink(contents) : "";
    }

    /**
     * 返回文章链接地址
     *
     * @param contents
     * @return
     */
    public static String permalink(Contents contents) {
        return permalink(contents.getCid(), contents.getSlug());
    }

    /**
     * 返回文章链接地址
     *
     * @param cid
     * @param slug
     * @return
     */
    public static String permalink(Integer cid, String slug) {
        return Commons.site_url("/article/" + (StringKit.isNotBlank(slug) ? slug : cid.toString()));
    }

    /**
     * 显示文章创建日期
     *
     * @param fmt
     * @return
     */
    public static String created(String fmt) {
        Contents contents = current_article();
        if (null != contents) {
            return Commons.fmtdate(contents.getCreated(), fmt);
        }
        return "";
    }

    /**
     * 获取文章最后修改时间
     *
     * @param fmt
     * @return
     */
    public static String modified(String fmt) {
        Contents contents = current_article();
        if (null != contents) {
            return Commons.fmtdate(contents.getModified(), fmt);
        }
        return "";
    }

    /**
     * 返回文章评论数
     *
     * @return
     */
    public static Integer comments_num() {
        Contents contents = current_article();
        return null != contents ? contents.getComments_num() : 0;
    }

    /**
     * 返回文章浏览数
     *
     * @return
     */
    public static Integer hits() {
        Contents contents = current_article();
        return null != contents ? contents.getHits() : 0;
    }

    /**
     * 显示分类
     *
     * @return
     */
    public static String show_categories() throws UnsupportedEncodingException {
        Contents contents = current_article();
        if (null != contents) {
            return show_categories(contents.getCategories());
        }
        return "";
    }

    /**
     * 显示分类
     *
     * @param categories
     * @return
     */
    public static String show_categories(String categories) throws UnsupportedEncodingException {
        if (StringKit.isNotBlank(categories)) {
            String[] arr = categories.split(",");
            StringBuffer sbuf = new StringBuffer();
            for (String c : arr) {
                sbuf.append("<a href=\"/category/" + URLEncoder.encode(c, "UTF-8") + "\">" + c + "</a>");
            }
            return sbuf.toString();
        }
        return show_categories("默认分类");
    }

    /**
     * 显示标签
     *
     * @param tags
     * @return
     */
    public static String show_tags(String tags) throws UnsupportedEncodingException {
        if (StringKit.isNotBlank(tags)) {
            String[] arr = tags.split(",");
            StringBuffer sbuf = new StringBuffer();
            for (String c : arr) {
                sbuf.append("<a href=\"/tag/" + URLEncoder.encode(c, "UTF-8") + "\">" + c + "</a>");
            }
            return sbuf.toString();
        }
        return "";
    }

    /**
     * 显示标签
     *
     * @return
     */
    public static String show_tags() throws UnsupportedEncodingException {
        Contents contents = current_article();
        return null != contents ? show_tags(contents.getTags()) : "";
    }

    /**
     * 显示文章内容，格式化markdown后的
     *
     * @return
     */
    public static String show_content() {
        Contents contents = current_article();
        return null != contents ? article(contents.getContent()) : "";
    }

    /**
     * @param len
     * @return
     */
    public static String intro(int len) {
        Contents contents = current_article();
        if (null != contents) {
            return intro(contents.getContent(), len);
        }
        return "";
    }

    /**
     * 截取文章摘要
     *
     * @param value 文章内容
     * @param len   要截取文字的个数
     * @return
     */
    public static String intro(String value, int len) {
        int pos = value.indexOf("<!--more-->");
        if (pos != -1) {
            String html = value.substring(0, pos);
            return TaleUtils.htmlToText(TaleUtils.mdToHtml(html));
        } else {
            String text = TaleUtils.htmlToText(TaleUtils.mdToHtml(value));
            if (text.length() > len) {
                return text.substring(0, len);
            }
            return text;
        }
    }

    /**
     * 显示文章内容，转换markdown为html
     *
     * @param value
     * @return
     */
    public static String article(String value) {
        if (StringKit.isNotBlank(value)) {
            value = value.replace("<!--more-->", "\r\n");
            return TaleUtils.mdToHtml(value);
        }
        return "";
    }

    /**
     * 显示文章缩略图，顺序为：文章第一张图 -> 随机获取
     *
     * @return
     */
    public static String show_thumb(Contents contents) {
        if (null == contents) {
            return "";
        }
        String content = article(contents.getContent());
        String img = Commons.show_thumb(content);
        if (StringKit.isNotBlank(img)) {
            return img;
        }
        int cid = contents.getCid();
        int size = cid % 20;
        size = size == 0 ? 1 : size;
        return "/static/user/img/rand/" + size + ".jpg";
    }

    /**
     * 最新文章
     *
     * @param limit
     * @return
     */
    public static List<Contents> recent_articles(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getContens(Types.RECENT_ARTICLE, limit);
    }

    /**
     * 随机获取文章
     * @param limit
     * @return
     */
    public static List<Contents> rand_articles(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getContens(Types.RANDOM_ARTICLE, limit);
    }

    /**
     * 最新评论
     *
     * @param limit
     * @return
     */
    public static List<Comments> recent_comments(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.recentComments(limit);
    }

    /**
     * 获取分类列表
     *
     * @return
     */
    public static List<MetaDto> categries(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getMetas(Types.RECENT_META, Types.CATEGORY, limit);
    }

    /**
     * 随机获取limit个分类
     * @param limit
     * @return
     */
    public static List<MetaDto> rand_categries(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getMetas(Types.RANDOM_META, Types.CATEGORY, limit);
    }

    /**
     * 获取所有分类
     *
     * @return
     */
    public static List<MetaDto> categries() {
        return categries(TaleConst.MAX_POSTS);
    }

    /**
     * 获取标签列表
     *
     * @return
     */
    public static List<MetaDto> tags(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getMetas(Types.RECENT_META, Types.TAG, limit);
    }

    /**
     * 随机获取limit个标签
     * @param limit
     * @return
     */
    public static List<MetaDto> rand_tags(int limit) {
        if (null == siteService) {
            return EMPTY;
        }
        return siteService.getMetas(Types.RANDOM_META, Types.TAG, limit);
    }

    /**
     * 获取所有标签
     *
     * @return
     */
    public static List<MetaDto> tags() {
        return tags(TaleConst.MAX_POSTS);
    }

    /**
     * 获取评论at信息
     *
     * @param coid
     * @return
     */
    public static String comment_at(Integer coid) {
        if (null == siteService) {
            return "";
        }
        Comments comments = siteService.getComment(coid);
        if (null != comments) {
            return "<a href=\"#comment-" + coid + "\">@" + comments.getAuthor() + "</a>";
        }
        return "";
    }

    private static final String[] ICONS = {"bg-ico-book", "bg-ico-game", "bg-ico-note", "bg-ico-chat", "bg-ico-code", "bg-ico-image", "bg-ico-web", "bg-ico-link", "bg-ico-design", "bg-ico-lock"};

    /**
     * 显示文章图标
     *
     * @return
     */
    public static String show_icon() {
        Contents contents = current_article();
        if (null != contents) {
            return show_icon(contents.getCid());
        }
        return show_icon(1);
    }

    /**
     * 显示文章图标
     *
     * @param cid
     * @return
     */
    public static String show_icon(int cid) {
        return ICONS[cid % ICONS.length];
    }

    /**
     * 显示文章标题
     *
     * @return
     */
    public static String title() {
        Contents contents = current_article();
        return null != contents ? contents.getTitle() : "";
    }

    /**
     * 获取当前上下文的文章对象
     *
     * @return
     */
    private static Contents current_article() {
        InterpretContext ctx = InterpretContext.current();
        Object value = ctx.getValueStack().getValue("article");
        if (null != value) {
            return (Contents) value;
        }
        return null;
    }
}
