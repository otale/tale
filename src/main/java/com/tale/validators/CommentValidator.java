package com.tale.validators;

import com.blade.kit.StringKit;
import com.blade.validator.Validators;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.param.LoginParam;

import static com.tale.init.TaleConst.MAX_TEXT_COUNT;
import static com.tale.init.TaleConst.MAX_TITLE_COUNT;

/**
 * @author biezhi
 * @date 2018/6/3
 */
public class CommentValidator {

    public static void valid(Comments param) {
        Validators.notEmpty().test(param.getAuthor()).throwIfInvalid("评论作者");
        Validators.moreThan(30).test(param.getAuthor()).throwIfInvalid("姓名");

        Validators.notEmpty().test(param.getMail()).throwIfInvalid("电子邮箱");
        Validators.isEmail().test(param.getMail()).throwIfInvalid("电子邮箱");

        if (StringKit.isNotBlank(param.getUrl())) {
            Validators.isURL().test(param.getUrl()).throwIfInvalid("网址");
        }

        Validators.notEmpty().test(param.getContent()).throwIfInvalid("内容");
        Validators.between(5, 2000).test(param.getContent()).throwIfInvalid("内容");

        Validators.notNull().test(param.getCid()).throwIfInvalid("评论文章");

    }

    public static void valid(Contents param) {
        Validators.notEmpty().test(param.getTitle()).throwIfInvalid("文章标题");
        Validators.moreThan(MAX_TITLE_COUNT).test(param.getTitle()).throwIfInvalid("文章标题");

        Validators.notEmpty().test(param.getContent()).throwIfInvalid("文章内容");
        Validators.moreThan(MAX_TEXT_COUNT).test(param.getContent()).throwIfInvalid("文章内容");
    }

    public static void valid(LoginParam param){
        Validators.notEmpty().test(param.getUsername()).throwIfInvalid("用户名");
        Validators.notEmpty().test(param.getPassword()).throwIfInvalid("密码");
    }

}
