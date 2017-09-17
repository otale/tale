package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.page.Page;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.*;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.controller.BaseController;
import com.tale.exception.TipException;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Users;
import com.tale.service.CommentsService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;

/**
 * 评论管理
 * <p>
 * Created by biezhi on 2017/2/26.
 */
@Slf4j
@Path("admin/comments")
public class CommentController extends BaseController {

    @Inject
    private CommentsService commentsService;

    @Inject
    private SiteService siteService;

    @GetRoute(value = "")
    public String index(@Param(defaultValue = "1") int page,
                        @Param(defaultValue = "15") int limit, Request request) {
        Users users = this.user();

        Page<Comments> commentPage = new Comments().where("author_id", "<>", users.getUid()).page(page, limit);
        request.attribute("comments", commentPage);
        return "admin/comment_list";
    }

    /**
     * 删除一条评论
     *
     * @param coid
     * @return
     */
    @PostRoute(value = "delete")
    @JSON
    public RestResponse delete(@Param Integer coid) {
        try {
            Comments comments = commentsService.byId(coid);
            if (null == comments) {
                return RestResponse.fail("不存在该评论");
            }
            commentsService.delete(coid, comments.getCid());
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "评论删除失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @PostRoute(value = "status")
    @JSON
    public RestResponse delete(@Param Integer coid, @Param String status) {
        try {
            Comments comments = new Comments();
            comments.setCoid(coid);
            comments.setStatus(status);
            comments.update();
            siteService.cleanCache(Types.C_STATISTICS);
        } catch (Exception e) {
            String msg = "操作失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @PostRoute(value = "")
    @JSON
    public RestResponse reply(@Param Integer coid, @Param String content, Request request) {
        if (null == coid || StringKit.isBlank(content)) {
            return RestResponse.fail("请输入完整后评论");
        }

        if (content.length() > 2000) {
            return RestResponse.fail("请输入2000个字符以内的回复");
        }
        Comments c = commentsService.byId(coid);
        if (null == c) {
            return RestResponse.fail("不存在该评论");
        }
        Users users = this.user();
        content = TaleUtils.cleanXSS(content);
        content = EmojiParser.parseToAliases(content);

        Comments comments = new Comments();
        comments.setAuthor(users.getUsername());
        comments.setAuthor_id(users.getUid());
        comments.setCid(c.getCid());
        comments.setIp(request.address());
        comments.setUrl(users.getHome_url());
        comments.setContent(content);
        if (StringKit.isNotBlank(users.getEmail())) {
            comments.setMail(users.getEmail());
        } else {
            comments.setMail("support@tale.me");
        }
        comments.setParent(coid);
        try {
            commentsService.saveComment(comments);
            siteService.cleanCache(Types.C_STATISTICS);
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "回复失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                log.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}
