package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Param;
import com.blade.mvc.annotation.Path;
import com.blade.mvc.annotation.PostRoute;
import com.blade.mvc.http.Request;
import com.blade.mvc.ui.RestResponse;
import com.tale.annotation.SysLog;
import com.tale.controller.BaseController;
import com.tale.model.dto.Comment;
import com.tale.model.dto.Types;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Users;
import com.tale.service.CommentsService;
import com.tale.service.SiteService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;

import static io.github.biezhi.anima.Anima.select;

/**
 * 评论管理
 * <p>
 * Created by biezhi on 2017/2/26.
 */
@Slf4j
@Path(value = "admin/comments", restful = true)
public class CommentController extends BaseController {

    @Inject
    private CommentsService commentsService;

    @Inject
    private SiteService siteService;

    @SysLog("删除评论")
    @PostRoute("delete")
    public RestResponse<?> delete(@Param Integer coid) {
        Comments comments = select().from(Comment.class).byId(coid);
        if (null == comments) {
            return RestResponse.fail("不存在该评论");
        }
        commentsService.delete(coid, comments.getCid());
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

    @SysLog("修改评论状态")
    @PostRoute("status")
    public RestResponse<?> delete(@Param Integer coid, @Param String status) {
        Comments comments = new Comments();
        comments.setCoid(coid);
        comments.setStatus(status);
        comments.update();
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

    @SysLog("回复评论")
    @PostRoute
    public RestResponse<?> reply(@Param Integer coid, @Param String content, Request request) {
        if (null == coid || StringKit.isBlank(content)) {
            return RestResponse.fail("请输入完整后评论");
        }

        if (content.length() > 2000) {
            return RestResponse.fail("请输入2000个字符以内的回复");
        }
        Comments c = select().from(Comment.class).byId(coid);
        if (null == c) {
            return RestResponse.fail("不存在该评论");
        }
        Users users = this.user();
        content = TaleUtils.cleanXSS(content);
        content = EmojiParser.parseToAliases(content);

        Comments comments = new Comments();
        comments.setAuthor(users.getUsername());
        comments.setAuthorId(users.getUid());
        comments.setCid(c.getCid());
        comments.setIp(request.address());
        comments.setUrl(users.getHomeUrl());
        comments.setContent(content);
        if (StringKit.isNotBlank(users.getEmail())) {
            comments.setMail(users.getEmail());
        } else {
            comments.setMail("support@tale.me");
        }
        comments.setParent(coid);
        commentsService.saveComment(comments);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

}
