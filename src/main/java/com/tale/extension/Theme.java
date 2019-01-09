package com.tale.extension;

import com.blade.kit.JsonKit;
import com.blade.kit.StringKit;
import com.blade.kit.json.Ason;
import com.blade.mvc.WebContext;
import com.blade.mvc.http.Request;
import com.tale.bootstrap.TaleConst;
import com.tale.model.dto.Comment;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;
import jetbrick.template.runtime.InterpretContext;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static io.github.biezhi.anima.Anima.select;

/**
 * 主题函数
 * <p>
 * Created by biezhi on 2017/2/28.
 */
public final class Theme {

    private static SiteService siteService;

    public static void setSiteService(SiteService ss) {
        siteService = ss;
    }

    /**
     * 获取header keywords
     *
     * @return
     */
    public static String meta_keywords() {
        InterpretContext ctx   = InterpretContext.current();
        Object           value = ctx.getValueStack().getValue("keywords");
        if (null != value) {
            return value.toString();
        }
        return Commons.site_option("site_keywords");
    }

    /**
     * 获取header description
     *
     * @return
     */
    public static String meta_description() {
        InterpretContext ctx   = InterpretContext.current();
        Object           value = ctx.getValueStack().getValue("description");
        if (null != value) {
            return value.toString();
        }
        return Commons.site_option("site_description");
    }

    /**
     * header title
     *
     * @return
     */
    public static String head_title() {
        InterpretContext ctx   = InterpretContext.current();
        Object           value = ctx.getValueStack().getValue("title");

        String p = "";
        if (null != value) {
            p = value.toString() + " - ";
        }
        return p + Commons.site_option("site_title", "Tale 博客");
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
     * 当前文章的分类列表
     *
     * @return
     * @since b1.3.0
     */
    public static List<String> category_list() {
        Contents contents = current_article();
        if (null != contents && StringKit.isNotBlank(contents.getCategories())) {
            return Arrays.asList(contents.getCategories().split(","));
        }
        return Collections.emptyList();
    }

    /**
     * 当前文章的标签列表
     *
     * @return
     * @since b1.3.0
     */
    public static List<String> tag_list() {
        Contents contents = current_article();
        if (null != contents && StringKit.isNotBlank(contents.getTags())) {
            return Arrays.asList(contents.getTags().split(","));
        }
        return Collections.emptyList();
    }

    /**
     * 显示分类
     *
     * @param categories
     * @return
     */
    public static String show_categories(String categories) throws UnsupportedEncodingException {
        if (StringKit.isNotBlank(categories)) {
            String[]     arr  = categories.split(",");
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
     * @param split 每个标签之间的分隔符
     * @return
     */
    public static String show_tags(String split) throws UnsupportedEncodingException {
        Contents contents = current_article();
        if (StringKit.isNotBlank(contents.getTags())) {
            String[]     arr  = contents.getTags().split(",");
            StringBuffer sbuf = new StringBuffer();
            for (String c : arr) {
                sbuf.append(split).append("<a href=\"/tag/" + URLEncoder.encode(c, "UTF-8") + "\">" + c + "</a>");
            }
            return split.length() > 0 ? sbuf.substring(split.length() - 1) : sbuf.toString();
        }
        return "";
    }

    /**
     * 显示文章浏览量
     *
     * @return
     */
    public static String views() {
        Contents contents = current_article();
        return null != contents ? contents.getHits().toString() : "0";
    }

    /**
     * 显示标签
     *
     * @return
     */
    public static String show_tags() throws UnsupportedEncodingException {
        return show_tags("");
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
     * 获取文章摘要
     *
     * @param len
     * @return
     */
    public static String excerpt(int len) {
        return intro(len);
    }

    /**
     * 获取文章摘要
     *
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
     * 截取文章摘要(返回HTML)
     *
     * @param value 文章内容
     * @return 转换 markdown 为 html
     */
    public static String intro(String value) {
        if (StringKit.isBlank(value)) {
            return null;
        }
        int pos = value.indexOf("<!--more-->");
        if (pos != -1) {
            String html = value.substring(0, pos);
            return TaleUtils.mdToHtml(html);
        } else {
            return TaleUtils.mdToHtml(value);
        }
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
        if (StringKit.isNotBlank(contents.getThumbImg())) {
            String newFileName       = TaleUtils.getFileName(contents.getThumbImg());
            String thumbnailImgUrl = (contents.getThumbImg()).replace(newFileName, "thumbnail_" + newFileName);
            return thumbnailImgUrl;
        }
        String content = article(contents.getContent());
        String img     = Commons.show_thumb(content);
        if (StringKit.isNotBlank(img)) {
            return img;
        }
        int cid  = contents.getCid();
        int size = cid % 20;
        size = size == 0 ? 1 : size;
        return "/templates/themes/default/static/img/rand/" + size + ".jpg";
    }

    /**
     * 获取当前文章的下一篇
     *
     * @return
     */
    public static Contents article_next() {
        Contents cur = current_article();
        return null != cur ? siteService.getNhContent(Types.NEXT, cur.getCreated()) : null;
    }

    /**
     * 获取当前文章的上一篇
     *
     * @return
     */
    public static Contents article_prev() {
        Contents cur = current_article();
        return null != cur ? siteService.getNhContent(Types.PREV, cur.getCreated()) : null;
    }

    /**
     * 当前文章的下一篇文章链接
     *
     * @return
     */
    public static String theNext() {
        Contents contents = article_next();
        if (null != contents) {
            return theNext(title(contents));
        }
        return "";
    }

    /**
     * 当前文章的下一篇文章链接
     *
     * @param title 文章标题
     * @return
     */
    public static String theNext(String title) {
        Contents contents = article_next();
        if (null != contents) {
            return "<a href=\"" + permalink(contents) + "\" title=\"" + title(contents) + "\">" + title + "</a>";
        }
        return "";
    }

    /**
     * 当前文章的下一篇文章链接
     *
     * @return
     */
    public static String thePrev() {
        Contents contents = article_prev();
        if (null != contents) {
            return thePrev(title(contents));
        }
        return "";
    }

    /**
     * 当前文章的下一篇文章链接
     *
     * @param title 文章标题
     * @return
     */
    public static String thePrev(String title) {
        Contents contents = article_prev();
        if (null != contents) {
            return "<a href=\"" + permalink(contents) + "\" title=\"" + title(contents) + "\">" + title + "</a>";
        }
        return "";
    }

    /**
     * 最新文章
     *
     * @param limit
     * @return
     */
    public static List<Contents> recent_articles(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
        }
        return siteService.getContens(Types.RECENT_ARTICLE, limit);
    }

    /**
     * 随机获取文章
     *
     * @param limit
     * @return
     */
    public static List<Contents> rand_articles(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
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
            return new ArrayList<>(0);
        }
        return siteService.recentComments(limit);
    }

    /**
     * 获取分类列表
     *
     * @return
     */
    public static List<Metas> categories(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
        }
        return siteService.getMetas(Types.RECENT_META, Types.CATEGORY, limit);
    }

    /**
     * 随机获取limit个分类
     *
     * @param limit
     * @return
     */
    public static List<Metas> rand_categories(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
        }
        return siteService.getMetas(Types.RANDOM_META, Types.CATEGORY, limit);
    }

    /**
     * 获取所有分类
     *
     * @return
     */
    public static List<Metas> categories() {
        return categories(TaleConst.MAX_POSTS);
    }

    /**
     * 获取标签列表
     *
     * @return
     */
    public static List<Metas> tags(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
        }
        return siteService.getMetas(Types.RECENT_META, Types.TAG, limit);
    }

    /**
     * 随机获取limit个标签
     *
     * @param limit
     * @return
     */
    public static List<Metas> rand_tags(int limit) {
        if (null == siteService) {
            return new ArrayList<>(0);
        }
        return siteService.getMetas(Types.RANDOM_META, Types.TAG, limit);
    }

    /**
     * 获取所有标签
     *
     * @return
     */
    public static List<Metas> tags() {
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
        return title(current_article());
    }

    /**
     * 返回文章标题
     *
     * @param contents
     * @return
     */
    public static String title(Contents contents) {
        return null != contents ? contents.getTitle() : Commons.site_title();
    }

    /**
     * 返回社交账号链接
     *
     * @param type
     * @return
     */
    public static String social_link(String type) {
        String id = Commons.site_option("social_" + type);
        switch (type) {
            case "github":
                return "https://github.com/" + id;
            case "weibo":
                return "http://weibo.com/" + id;
            case "twitter":
                return "https://twitter.com/" + id;
            case "zhihu":
                return "https://www.zhihu.com/people/" + id;
            default:
                return null;
        }
    }

    /**
     * 获取当前文章/页面的评论
     *
     * @param limit
     * @return
     */
    public static Page<Comment> comments(int limit) {
        Contents contents = current_article();
        if (null == contents) {
            return new Page<>();
        }
        InterpretContext ctx   = InterpretContext.current();
        Object           value = ctx.getValueStack().getValue("cp");
        int              page  = 1;
        if (null != value) {
            page = (int) value;
        }
        Page<Comment> comments = siteService.getComments(contents.getCid(), page, limit);
        return comments;
    }

    /**
     * 获取当前文章/页面的评论数量
     *
     * @return 当前页面的评论数量
     */
    public static long commentsCount() {
        Contents contents = current_article();
        if (null == contents) {
            return 0;
        }
        return siteService.getCommentCount(contents.getCid());
    }

    /**
     * 分页
     *
     * @param limit
     * @return
     */
    public static Page<Contents> articles(int limit) {
        Request request = WebContext.request();
        Integer page    = request.attribute("page_num");
        page = null == page ? request.queryInt("page", 1) : page;
        page = page < 0 || page > TaleConst.MAX_PAGE ? 1 : page;

        Page<Contents> articles = select().from(Contents.class)
                .where(Contents::getType, Types.ARTICLE)
                .and("status", Types.PUBLISH)
                .order(Contents::getCreated, OrderBy.DESC)
                .page(page, limit);

        request.attribute("articles", articles);
        if (page > 1) {
            WebContext.request().attribute("title", "第" + page + "页");
        }
        request.attribute("is_home", true);
        request.attribute("page_prefix", "/page");
        return articles;
    }

    /**
     * 获取当前上下文的文章对象
     *
     * @return
     */
    private static Contents current_article() {
        InterpretContext ctx   = InterpretContext.current();
        Object           value = ctx.getValueStack().getValue("article");
        if (null != value) {
            return (Contents) value;
        }
        return null;
    }

    /**
     * 显示评论
     *
     * @param noComment 评论为0的时候显示的文本
     * @param value     评论组装文本
     * @return
     */
    public static String comments_num(String noComment, String value) {
        Contents contents = current_article();
        if (null == contents) {
            return noComment;
        }
        return contents.getCommentsNum() > 0 ? String.format(value, contents.getCommentsNum()) : noComment;
    }

    /**
     * 返回主题设置选项
     *
     * @param key
     * @return
     */
    public static String theme_option(String key, String defaultValue) {
        String option = theme_option(key);
        if (StringKit.isBlank(option)) {
            return defaultValue;
        }
        return option;
    }

    /**
     * 返回主题设置选项
     *
     * @param key
     * @return
     */
    public static String theme_option(String key) {
        String theme = Commons.site_theme();
        return TaleConst.OPTIONS.get("theme_" + theme + "_options")
                .filter(StringKit::isNotBlank)
                .map((String json) -> {
                    Ason<?,?> ason = JsonKit.toAson(json);
                    if (!ason.containsKey(key)) {
                        return "";
                    }
                    return ason.getString(key);
                })
                .orElse("");
    }

    /**
     * 返回是否是某个页面
     *
     * @param pageName
     * @return
     */
    public static boolean is_slug(String pageName) {
        Contents contents = current_article();
        if (null != contents && Types.PAGE.equals(contents.getType()) && contents.getSlug().equals(pageName)) {
            return true;
        }
        if (TaleConst.SLUG_HOME.equals(pageName)) {
            Boolean isHome = WebContext.request().attribute("is_home");
            if (null != isHome && isHome) {
                return true;
            }
        }
        if (TaleConst.SLUG_ARCHIVES.equals(pageName)) {
            Boolean isArchives = WebContext.request().attribute("is_archive");
            if (null != isArchives && isArchives) {
                return true;
            }
        }
        if (TaleConst.SLUG_CATEGRORIES.equals(pageName)) {
            Boolean isCategory = WebContext.request().attribute("is_category");
            if (null != isCategory && isCategory) {
                return true;
            }
        }
        if (TaleConst.SLUG_TAGS.equals(pageName)) {
            Boolean isTag = WebContext.request().attribute("is_tag");
            if (null != isTag && isTag) {
                return true;
            }
        }
        return false;
    }
}
