package com.tale.controller.admin;

import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.StringKit;
import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.JSON;
import com.blade.mvc.annotation.QueryParam;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.view.RestResponse;
import com.tale.controller.BaseController;
import com.tale.dto.Comment;
import com.tale.exception.TipException;
import com.tale.model.Comments;
import com.tale.model.Users;
import com.tale.service.CommentsService;
import com.tale.utils.TaleUtils;
import com.vdurmont.emoji.EmojiParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by biezhi on 2017/2/26.
 */
@Controller("admin/comments")
public class CommentController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CommentController.class);

    @Inject
    private CommentsService commentsService;

    @Route(value = "", method = HttpMethod.GET)
    public String index(@QueryParam(value = "page", defaultValue = "1") int page,
                        @QueryParam(value = "limit", defaultValue = "15") int limit, Request request) {
        Users users = this.user();
        Paginator<Comments> commentsPaginator = commentsService.getComments(new Take(Comments.class).notEq("author_id", users.getUid()).page(page, limit, "coid desc"));
        request.attribute("comments", commentsPaginator);
        return "admin/comment_list";
    }

    /**
     * 删除一条评论
     * @param coid
     * @return
     */
    @Route(value = "delete", method = HttpMethod.POST)
    @JSON
    public RestResponse delete(@QueryParam Integer coid) {
        try {
            Comments comments = commentsService.byId(coid);
            if(null == comments){
                return RestResponse.fail("不存在该评论");
            }
            commentsService.delete(coid, comments.getCid());
        } catch (Exception e) {
            String msg = "评论删除失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "status", method = HttpMethod.POST)
    @JSON
    public RestResponse delete(@QueryParam Integer coid, @QueryParam String status) {
        try {
            Comments comments = new Comments();
            comments.setCoid(coid);
            comments.setStatus(status);
            commentsService.update(comments);
        } catch (Exception e) {
            String msg = "操作失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
        return RestResponse.ok();
    }

    @Route(value = "", method = HttpMethod.POST)
    @JSON
    public RestResponse reply(@QueryParam Integer coid, @QueryParam String content, Request request) {
        if(null == coid || StringKit.isBlank(content)){
            return RestResponse.fail("请输入完整后评论");
        }

        if(content.length() > 2000){
            return RestResponse.fail("请输入2000个字符以内的回复");
        }
        Comments c = commentsService.byId(coid);
        if(null == c){
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
        if(StringKit.isNotBlank(users.getEmail())){
            comments.setMail(users.getEmail());
        } else {
            comments.setMail("support@tale.me");
        }
        comments.setParent(coid);
        try {
            commentsService.saveComment(comments);
            return RestResponse.ok();
        } catch (Exception e) {
            String msg = "回复失败";
            if (e instanceof TipException) {
                msg = e.getMessage();
            } else {
                LOGGER.error(msg, e);
            }
            return RestResponse.fail(msg);
        }
    }

}
