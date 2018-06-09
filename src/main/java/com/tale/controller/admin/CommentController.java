package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.BodyParam;
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
import com.tale.validators.CommonValidator;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;

import static io.github.biezhi.anima.Anima.select;

/**
 * 评论管理
 * <p>
 * Created by biezhi on 2017/2/26.
 */
@Slf4j
@Path(value = "admin/api/comment", restful = true)
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
    public RestResponse<?> reply(@BodyParam Comments comments, Request request) {
        CommonValidator.validAdmin(comments);

        Comments c = select().from(Comment.class).byId(comments.getCoid());
        if (null == c) {
            return RestResponse.fail("不存在该评论");
        }
        Users users = this.user();
        comments.setContent(TaleUtils.cleanXSS(comments.getContent()));
        comments.setContent(EmojiParser.parseToAliases(comments.getContent()));
        comments.setAuthor(users.getUsername());
        comments.setAuthorId(users.getUid());
        comments.setCid(c.getCid());
        comments.setIp(request.address());
        comments.setUrl(users.getHomeUrl());

        if (StringKit.isNotBlank(users.getEmail())) {
            comments.setMail(users.getEmail());
        }
        comments.setParent(comments.getCoid());
        comments.setCoid(null);
        commentsService.saveComment(comments);
        siteService.cleanCache(Types.C_STATISTICS);
        return RestResponse.ok();
    }

}
