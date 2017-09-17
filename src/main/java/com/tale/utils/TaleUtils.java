package com.tale.utils;

import com.blade.kit.DateKit;
import com.blade.kit.Hashids;
import com.blade.kit.StringKit;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.Session;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Content;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.WireFeedOutput;
import com.tale.controller.admin.AttachController;
import com.tale.extension.Commons;
import com.tale.extension.Theme;
import com.tale.init.TaleConst;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Users;
import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.*;
import java.util.List;
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
    private static final int     one_month  = 30 * 24 * 60 * 60;
    private static final Random  r          = new Random();
    private static final Hashids hashIds    = new Hashids(TaleConst.AES_SALT);
    private static final long[]  hashPrefix = {-1, 2, 0, 1, 7, 0, 9};

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
            hashPrefix[0] = uid;
            String val = hashIds.encode(hashPrefix);
            hashPrefix[0] = -1;
//            String  val   = new String(EncrypKit.encryptAES(uid.toString().getBytes(), TaleConst.AES_SALT.getBytes()));
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
        Session session = com.blade.mvc.WebContext.request().session();
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
            Optional<String> c = request.cookie(TaleConst.USER_IN_COOKIE);
            if (c.isPresent()) {
                try {
                    String value = c.get();
                    long[] ids   = hashIds.decode(value);
                    if (null != ids && ids.length > 0) {
                        return Long.valueOf(ids[0]).intValue();
                    }
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
        String a = String.join("','", arr);
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

        List<Extension> extensions = Arrays.asList(TablesExtension.create());
        Parser          parser     = Parser.builder().extensions(extensions).build();
        Node            document   = parser.parse(markdown);
        HtmlRenderer    renderer   = HtmlRenderer.builder().extensions(extensions).build();
        String          content    = renderer.render(document);
        content = Commons.emoji(content);

        // 支持网易云音乐输出
        if (TaleConst.BCONF.getBoolean("app.support_163_music", true) && content.contains("[mp3:")) {
            content = content.replaceAll("\\[mp3:(\\d+)\\]", "<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=350 height=106 src=\"//music.163.com/outchain/player?type=2&id=$1&auto=0&height=88\"></iframe>");
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

    private static final Pattern pattern = Pattern.compile("[0x1f]*");

    /**
     * 获取RSS输出
     *
     * @param articles
     * @return
     * @throws FeedException
     */
    public static String getRssXml(java.util.List<Contents> articles) throws FeedException {
        Channel channel = new Channel("rss_2.0");
        channel.setTitle(TaleConst.OPTIONS.get("site_title", ""));
        channel.setLink(Commons.site_url());
        channel.setDescription(TaleConst.OPTIONS.get("site_description", ""));
        channel.setLanguage("zh-CN");
        java.util.List<Item> items = new ArrayList<>();
        articles.forEach(post -> {
            Item item = new Item();
            item.setTitle(post.getTitle());
            Content content = new Content();
            String  value   = Theme.article(post.getContent());

            char[] xmlChar = value.toCharArray();
            for (int i = 0; i < xmlChar.length; ++i) {
                if (xmlChar[i] > 0xFFFD) {
                    //直接替换掉0xb
                    xmlChar[i] = ' ';
                } else if (xmlChar[i] < 0x20 && xmlChar[i] != 't' & xmlChar[i] != 'n' & xmlChar[i] != 'r') {
                    //直接替换掉0xb
                    xmlChar[i] = ' ';
                }
            }

            value = new String(xmlChar);

            content.setValue(value);
            item.setContent(content);
            item.setLink(Theme.permalink(post.getCid(), post.getSlug()));
            item.setPubDate(DateKit.toDate(post.getCreated()));
            items.add(item);
        });
        channel.setItems(items);
        WireFeedOutput out = new WireFeedOutput();
        return out.outputString(channel);
//        try {
//            return out.outputString(channel);
//        } catch (org.jdom.IllegalDataException e) {
//            //e.printStackTrace();
//
//        } catch (Exception e) {
//            throw e;
//        }
    }

    /**
     * 替换HTML脚本
     *
     * @param value
     * @return
     */
    public static String cleanXSS(String value) {
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

    public static void download(Response response, String filePath) throws Exception {
        File file = new File(filePath);
        response.download(file.getName(), file);
    }

    /**
     * 获取某个范围内的随机数
     *
     * @param max 最大值
     * @param len 取多少个
     * @return
     */
    public static int[] random(int max, int len) {
        int values[] = new int[max];
        int temp1, temp2, temp3;
        for (int i = 0; i < values.length; i++) {
            values[i] = i + 1;
        }
        //随机交换values.length次
        for (int i = 0; i < values.length; i++) {
            temp1 = Math.abs(r.nextInt()) % (values.length - 1); //随机产生一个位置
            temp2 = Math.abs(r.nextInt()) % (values.length - 1); //随机产生另一个位置
            if (temp1 != temp2) {
                temp3 = values[temp1];
                values[temp1] = values[temp2];
                values[temp2] = temp3;
            }
        }
        return Arrays.copyOf(values, len);
    }

    /**
     * 将list转为 (1, 2, 4) 这样的sql输出
     *
     * @param list
     * @param <T>
     * @return
     */
    public static <T> String listToInSql(java.util.List<T> list) {
        StringBuffer sbuf = new StringBuffer();
        list.forEach(item -> sbuf.append(',').append(item.toString()));
        sbuf.append(')');
        return '(' + sbuf.substring(1);
    }

    public static final String upDir = AttachController.CLASSPATH.substring(0, AttachController.CLASSPATH.length() - 1);

    public static String getFileKey(String name) {
        String prefix = "/upload/" + DateKit.toString(new Date(), "yyyy/MM");
        String dir    = upDir + prefix;
        if (!Files.exists(Paths.get(dir))) {
            new File(dir).mkdirs();
        }
        return prefix + "/" + com.blade.kit.UUID.UU32() + "." + StringKit.fileExt(name);
    }
}
