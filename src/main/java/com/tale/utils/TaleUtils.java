package com.tale.utils;

import com.blade.context.WebContextHolder;
import com.blade.kit.StringKit;
import com.blade.kit.Tools;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.blade.mvc.http.wrapper.Session;
import com.tale.init.TaleConst;
import com.tale.model.Users;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by biezhi on 2017/2/21.
 */
public class TaleUtils {

    private static final int one_month = 30 * 24 * 60 * 60;

    public static void setCookie(Response response, Integer uid) {
        try {
            String val = Tools.enAes(uid.toString(), TaleConst.AES_SALT);
            boolean isSSL = TaleConst.SITE_URL.startsWith("https");
            response.cookie("/", TaleConst.USER_IN_COOKIE, val, one_month, isSSL);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Users getLoginUser() {
        Session session = WebContextHolder.session();
        if (null == session) {
            return null;
        }
        Users user = session.attribute(TaleConst.LOGIN_SESSION_KEY);
        return user;
    }

    public static void logout(Session session, Response response) {
        session.removeAttribute(TaleConst.LOGIN_SESSION_KEY);
        response.removeCookie(TaleConst.USER_IN_COOKIE);
        response.redirect(TaleConst.SITE_URL);
    }

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

    public static String rejoin(String tags) {
        String[] arr = tags.split(",");
        return rejoin(arr);
    }

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

    private static Parser parser = Parser.builder().build();

    public static String mdToHtml(String markdown) {
        Node document = parser.parse(markdown);
        HtmlRenderer renderer = HtmlRenderer.builder().build();
        return renderer.render(document);
    }

    public static String htmlToMarkdown(String html) {
        return "";
    }

    public static String htmlToText(String html) {
        if (StringKit.isNotBlank(html)) {
            return html.replaceAll("(?s)<[^>]*>(\\s*<[^>]*>)*", " ");
        }
        return "";
    }

    public static boolean isImage(File imageFile) {
        if (!imageFile.exists()) {
            return false;
        }
        Image img = null;
        try {
            img = ImageIO.read(imageFile);
            if (img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            img = null;
        }
    }

    public static final Pattern VALID_EMAIL_ADDRESS_REGEX =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    public static boolean isEmail(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr);
        return matcher.find();
    }

}
