package com.tale.controller.admin;

import com.blade.Blade;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.JsonKit;
import com.blade.kit.StringKit;
import com.blade.mvc.Const;
import com.blade.mvc.annotation.GetRoute;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PathParam;
import com.blade.mvc.http.Request;
import com.blade.mvc.http.Response;
import com.tale.bootstrap.TaleConst;
import com.tale.controller.BaseController;
import com.tale.extension.Commons;
import com.tale.model.dto.ThemeDto;
import com.tale.model.dto.Types;
import com.tale.model.entity.*;
import com.tale.service.ContentsService;
import com.tale.service.MetasService;
import com.tale.service.OptionsService;
import com.tale.service.SiteService;
import io.github.biezhi.anima.enums.OrderBy;
import io.github.biezhi.anima.page.Page;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static io.github.biezhi.anima.Anima.select;

/**
 * @author biezhi
 * @date 2018/6/5
 */
@Slf4j
@Path("admin")
public class PagesController extends BaseController {

    @Inject
    private ContentsService contentsService;

    @Inject
    private MetasService metasService;

    @Inject
    private OptionsService optionsService;

    @Inject
    private SiteService siteService;

    @GetRoute("login")
    public String login(Response response) {
        if (null != this.user()) {
            response.redirect("/admin/index");
            return null;
        }
        return "admin/login";
    }

    /**
     * 文章管理首页
     *
     * @param page
     * @param limit
     * @param request
     * @return
     */
    @GetRoute("article")
    public String articleHome(@Param(defaultValue = "1") Integer page, @Param(defaultValue = "15") Integer limit,
                              Request request) {

        Page<Contents> articles = select().from(Contents.class).where(Contents::getType, Types.ARTICLE).order(Contents::getCreated, OrderBy.DESC).page(page, limit);
        request.attribute("articles", articles);
        return "admin/article_list";
    }

    /**
     * 文章发布页面
     *
     * @param request
     * @return
     */
    @GetRoute("article/publish")
    public String publishArticle(Request request) {
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        request.attribute("now", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()));
        return "admin/article_edit";
    }

    /**
     * 文章编辑页面
     *
     * @param cid
     * @param request
     * @return
     */
    @GetRoute("article/:cid")
    public String editArticle(@PathParam String cid, Request request) {
        Optional<Contents> contents = contentsService.getContents(cid);
        if (!contents.isPresent()) {
            return render_404();
        }
        request.attribute("contents", contents.get());
        List<Metas> categories = metasService.getMetas(Types.CATEGORY);
        request.attribute("categories", categories);
        request.attribute("active", "article");
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/article_edit";
    }


    /**
     * 附件页面
     *
     * @param request
     * @param page
     * @param limit
     * @return
     */
    @GetRoute("attach")
    public String attachHome(Request request, @Param(defaultValue = "1") Integer page,
                             @Param(defaultValue = "12") Integer limit) {

        Page<Attach> attachPage = select().from(Attach.class).page(page, limit);
        request.attribute("attachs", attachPage);
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        request.attribute("max_file_size", TaleConst.MAX_FILE_SIZE / 1024);
        return "admin/attach";
    }

    @GetRoute("category")
    public String categoryHome(Request request) {
        List<Metas> categories = siteService.getMetas(Types.RECENT_META, Types.CATEGORY, TaleConst.MAX_POSTS);
        List<Metas> tags       = siteService.getMetas(Types.RECENT_META, Types.TAG, TaleConst.MAX_POSTS);
        request.attribute("categories", categories);
        request.attribute("tags", tags);
        return "admin/category";
    }

    @GetRoute("comments")
    public String commentsHome(@Param(defaultValue = "1") int page,
                               @Param(defaultValue = "15") int limit, Request request) {
        Users          users       = this.user();
        Page<Comments> commentPage = select().from(Comments.class).where(Comments::getAuthorId).notEq(users.getUid()).page(page, limit);
        request.attribute("comments", commentPage);
        return "admin/comment_list";
    }


    @GetRoute("page")
    public String pageHome(Request request) {
        Page<Contents> contentsPage = select().from(Contents.class).where(Contents::getType, Types.PAGE).order(Contents::getCreated, OrderBy.DESC).page(1, TaleConst.MAX_POSTS);
        request.attribute("articles", contentsPage);
        return "admin/page_list";
    }

    @GetRoute("page/new")
    public String newPage(Request request) {
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/page_edit";
    }

    @GetRoute("page/:cid")
    public String editPage(@PathParam String cid, Request request) {
        Optional<Contents> contents = contentsService.getContents(cid);
        if (!contents.isPresent()) {
            return render_404();
        }
        request.attribute("contents", contents.get());
        request.attribute(Types.ATTACH_URL, Commons.site_option(Types.ATTACH_URL, Commons.site_url()));
        return "admin/page_edit";
    }

    @GetRoute("template")
    public String index(Request request) {
        String themePath = Const.CLASSPATH + File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + Commons.site_theme();
        try {
            List<String> files = Files.list(Paths.get(themePath))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".html"))
                    .collect(Collectors.toList());

            List<String> partial = Files.list(Paths.get(themePath + File.separatorChar + "partial"))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".html"))
                    .map(fileName -> "partial/" + fileName)
                    .collect(Collectors.toList());

            List<String> statics = Files.list(Paths.get(themePath + File.separatorChar + "static"))
                    .map(path -> path.getFileName().toString())
                    .filter(path -> path.endsWith(".js") || path.endsWith(".css"))
                    .map(fileName -> "static/" + fileName)
                    .collect(Collectors.toList());

            files.addAll(partial);
            files.addAll(statics);

            request.attribute("tpls", files);
        } catch (IOException e) {
            log.error("找不到模板路径");
        }
        return "admin/tpl_list";
    }

    @GetRoute("template/content")
    public void getContent(@Param String fileName, Response response) {
        try {
            String themePath = Const.CLASSPATH + File.separatorChar + "templates" + File.separatorChar + "themes" + File.separatorChar + Commons.site_theme();
            String filePath  = themePath + File.separatorChar + fileName;
            String content   = Files.readAllLines(Paths.get(filePath)).stream().collect(Collectors.joining("\n"));
            response.text(content);
        } catch (IOException e) {
            log.error("获取模板文件失败", e);
        }
    }

    @GetRoute("themes")
    public String themesHome(Request request) {
        // 读取主题
        String         themesDir  = AttachController.CLASSPATH + "templates/themes";
        File[]         themesFile = new File(themesDir).listFiles();
        List<ThemeDto> themes     = new ArrayList<>(themesFile.length);
        for (File f : themesFile) {
            if (f.isDirectory()) {
                ThemeDto themeDto = new ThemeDto(f.getName());
                if (Files.exists(Paths.get(f.getPath() + "/setting.html"))) {
                    themeDto.setHasSetting(true);
                }
                themes.add(themeDto);
                try {
                    Blade.me().addStatics("/templates/themes/" + f.getName() + "/screenshot.png");
                } catch (Exception e) {
                }
            }
        }
        request.attribute("current_theme", Commons.site_theme());
        request.attribute("themes", themes);
        return "admin/themes";
    }

    /**
     * 主题设置页面
     */
    @GetRoute("themes/setting")
    public String setting(Request request) {
        String currentTheme = Commons.site_theme();
        String key          = "theme_" + currentTheme + "_options";

        String              option = optionsService.getOption(key);
        Map<String, Object> map    = new HashMap<>();
        try {
            if (StringKit.isNotBlank(option)) {
                map = (Map<String, Object>) JsonKit.toAson(option);
            }
            request.attribute("theme_options", map);
        } catch (Exception e) {
            log.error("解析主题设置出现异常", e);
        }
        request.attribute("theme_options", map);
        return this.render("setting");
    }

}
