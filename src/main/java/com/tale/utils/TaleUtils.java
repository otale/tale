package com.tale.utils;

import com.blade.context.WebContextHolder;
import com.blade.kit.DateKit;
import com.blade.kit.StringKit;
import com.blade.kit.Tools;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.wrapper.Session;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Content;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.WireFeedOutput;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.model.Contents;
import com.tale.model.Users;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Tale工具类
 * <p>
 * Created by biezhi on 2017/2/21.
 */
public class TaleUtils {

    /**
     * 一个月
     */
    private static final int one_month = 30 * 24 * 60 * 60;

    /**
     * markdown解析器
     */
    private static Parser parser = Parser.builder().build();

    /**
     * 匹配邮箱正则
     */
    private static final Pattern VALID_EMAIL_ADDRESS_REGEX =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    private static final Pattern SLUG_REGEX = Pattern.compile("^[A-Za-z0-9_-]{5,100}$", Pattern.CASE_INSENSITIVE);

    /**
     * 设置记住密码cookie
     *
     * @param response
     * @param uid
     */
    public static void setCookie(Response response, Integer uid) {
        try {
            String val = Tools.enAes(uid.toString(), TaleConst.AES_SALT);
            boolean isSSL = Commons.site_url().startsWith("https");
            response.cookie("/", TaleConst.USER_IN_COOKIE, val, one_month, isSSL);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 返回当前登录用户
     *
     * @return
     */
    public static Users getLoginUser() {
        Session session = WebContextHolder.session();
        if (null == session) {
            return null;
        }
        Users user = session.attribute(TaleConst.LOGIN_SESSION_KEY);
        return user;
    }

    /**
     * 退出登录状态
     *
     * @param session
     * @param response
     */
    public static void logout(Session session, Response response) {
        session.removeAttribute(TaleConst.LOGIN_SESSION_KEY);
        response.removeCookie(TaleConst.USER_IN_COOKIE);
        response.redirect(Commons.site_url());
    }

    /**
     * 获取cookie中的用户id
     *
     * @param request
     * @return
     */
    public static Integer getCookieUid(Request request) {
        if (null != request) {
            String value = request.cookie(TaleConst.USER_IN_COOKIE);
            if (StringKit.isNotBlank(value)) {
                try {
                    String uid = Tools.deAes(value, TaleConst.AES_SALT);
                    return StringKit.isNotBlank(uid) && StringKit.isNumber(uid) ? Integer.valueOf(uid) : null;
                } catch (Exception e) {
                }
            }
        }
        return null;
    }

    /**
     * 重新拼接字符串
     *
     * @param arr
     * @return
     */
    public static String rejoin(String[] arr) {
        if (null == arr) {
            return "";
        }
        if (arr.length == 1) {
            return "'" + arr[0] + "'";
        }
        String a = StringKit.join(arr, "','");
        a = a.substring(2) + "'";
        return a;
    }

    /**
     * markdown转换为html
     *
     * @param markdown
     * @return
     */
    public static String mdToHtml(String markdown) {
        if (StringKit.isBlank(markdown)) {
            return "";
        }
        Node document = parser.parse(markdown);
        HtmlRenderer renderer = HtmlRenderer.builder().build();
        String content = renderer.render(document);
        // 支持网易云音乐输出
        if (TaleConst.BCONF.getBoolean("app.support_163_music", true) && content.contains("[mp3:")) {
            content = content.replaceAll("\\[mp3:(\\d+)\\]", "<iframe frameborder='no' border='0' marginwidth='0' marginheight='0' width=330 height=86 src='http://music.163.com/outchain/player?type=2&id=$1&auto=0&height=66'></iframe>");
        }
        // 支持gist代码输出
        if (TaleConst.BCONF.getBoolean("app.support_gist", true) && content.contains("https://gist.github.com/")) {
            content = content.replaceAll("&lt;script src=\"https://gist.github.com/(\\w+)/(\\w+)\\.js\">&lt;/script>", "<script src=\"https://gist.github.com/$1/$2\\.js\"></script>");
        }
        return content;
    }

    /**
     * 提取html中的文字
     *
     * @param html
     * @return
     */
    public static String htmlToText(String html) {
        if (StringKit.isNotBlank(html)) {
            return html.replaceAll("(?s)<[^>]*>(\\s*<[^>]*>)*", " ");
        }
        return "";
    }

    /**
     * 判断文件是否是图片类型
     *
     * @param imageFile
     * @return
     */
    public static boolean isImage(File imageFile) {
        if (!imageFile.exists()) {
            return false;
        }
        try {
            Image img = ImageIO.read(imageFile);
            if (img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 判断是否是邮箱
     *
     * @param emailStr
     * @return
     */
    public static boolean isEmail(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr);
        return matcher.find();
    }

    /**
     * 判断是否是合法路径
     *
     * @param slug
     * @return
     */
    public static boolean isPath(String slug) {
        if (StringKit.isNotBlank(slug)) {
            if (slug.contains("/") || slug.contains(" ") || slug.contains(".")) {
                return false;
            }
            Matcher matcher = SLUG_REGEX.matcher(slug);
            return matcher.find();
        }
        return false;
    }

    /**
     * 获取RSS输出
     *
     * @param articles
     * @return
     * @throws FeedException
     */
    public static String getRssXml(java.util.List<Contents> articles) throws FeedException {
        Channel channel = new Channel("rss_2.0");
        channel.setTitle(TaleConst.OPTIONS.get("site_title"));
        channel.setLink(Commons.site_url());
        channel.setDescription(TaleConst.OPTIONS.get("site_description"));
        channel.setLanguage("zh-CN");
        java.util.List<Item> items = new ArrayList<>();
        articles.forEach(post -> {
            Item item = new Item();
            item.setTitle(post.getTitle());
            Content content = new Content();
            content.setValue(Commons.article(post.getContent()));
            item.setContent(content);
            item.setLink(Commons.permalink(post.getCid(), post.getSlug()));
            item.setPubDate(DateKit.getDateByUnixTime(post.getCreated()));
            items.add(item);
        });
        channel.setItems(items);
        WireFeedOutput out = new WireFeedOutput();
        return out.outputString(channel);
    }

    /**
     * 替换HTML脚本
     * @param value
     * @return
     */
    public static String cleanXSS(String value){
        //You'll need to remove the spaces from the html entities below
        value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        value = value.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
        value = value.replaceAll("'", "&#39;");
        value = value.replaceAll("eval\\((.*)\\)", "");
        value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
        value = value.replaceAll("script", "");
        return value;
    }

    /**
     * 过滤XSS注入
     *
     * @param value
     * @return
     */
    public static String filterXSS(String value) {
        String cleanValue = null;
        if (value != null) {
            cleanValue = Normalizer.normalize(value, Normalizer.Form.NFD);
            // Avoid null characters
            cleanValue = cleanValue.replaceAll("\0", "");

            // Avoid anything between script tags
            Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid anything in a src='...' type of expression
            scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Remove any lonesome </script> tag
            scriptPattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Remove any lonesome <script ...> tag
            scriptPattern = Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid eval(...) expressions
            scriptPattern = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid expression(...) expressions
            scriptPattern = Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid javascript:... expressions
            scriptPattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid vbscript:... expressions
            scriptPattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

            // Avoid onload= expressions
            scriptPattern = Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
            cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
        }
        return cleanValue;
    }

}
