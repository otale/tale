package com.tale.validators;

import com.blade.exception.ValidatorException;
import com.blade.kit.StringKit;
import com.blade.validator.Validators;
import com.tale.model.entity.Comments;
import com.tale.model.entity.Contents;
import com.tale.model.params.InstallParam;
import com.tale.model.params.LoginParam;
import com.tale.utils.TaleUtils;

import static com.tale.bootstrap.TaleConst.MAX_TEXT_COUNT;
import static com.tale.bootstrap.TaleConst.MAX_TITLE_COUNT;
import static io.github.biezhi.anima.Anima.select;

/**
 * 验证器
 *
 * @author biezhi
 * @date 2018/6/3
 */
public class CommonValidator {

    public static void valid(Comments param) {
        Validators.notEmpty().test(param.getAuthor()).throwIfInvalid("评论作者");
        Validators.lessThan(30).test(param.getAuthor()).throwIfInvalid("姓名");

        Validators.notEmpty().test(param.getMail()).throwIfInvalid("电子邮箱");
        Validators.isEmail().test(param.getMail()).throwIfInvalid("电子邮箱");

        if (StringKit.isNotBlank(param.getUrl())) {
            Validators.isURL().test(param.getUrl()).throwIfInvalid("网址");
        }

        Validators.notEmpty().test(param.getContent()).throwIfInvalid("内容");
        Validators.moreThan(5).test(param.getContent()).throwIfInvalid("内容");
        Validators.lessThan(2000).test(param.getContent()).throwIfInvalid("内容");

        Validators.notNull().test(param.getCid()).throwIfInvalid("评论文章");

    }

    public static void validAdmin(Comments param) {
        Validators.notNull().test(param.getCoid()).throwIfInvalid("评论ID");

        Validators.notEmpty().test(param.getContent()).throwIfInvalid("内容");
        Validators.moreThan(5).test(param.getContent()).throwIfInvalid("内容");
        Validators.lessThan(2000).test(param.getContent()).throwIfInvalid("内容");
    }

    public static void valid(Contents param) {
        Validators.notEmpty().test(param.getTitle()).throwIfInvalid("文章标题");
        Validators.lessThan(MAX_TITLE_COUNT).test(param.getTitle()).throwIfInvalid("文章标题");

        Validators.notEmpty().test(param.getContent()).throwIfInvalid("文章内容");
        Validators.lessThan(MAX_TEXT_COUNT).test(param.getContent()).throwIfInvalid("文章内容");

        if (StringKit.isNotEmpty(param.getSlug())) {
            if (param.getSlug().length() < 2) {
                throw new ValidatorException("路径太短了");
            }
            if (!TaleUtils.isPath(param.getSlug())) {
                throw new ValidatorException("您输入的路径不合法");
            }

            Contents temp = select().from(Contents.class).where(Contents::getType, param.getType()).and(Contents::getSlug, param.getSlug()).one();
            if (null != temp && !temp.getCid().equals(param.getCid())) {
                throw new ValidatorException("该路径已经存在，请重新输入");
            }
        } else {
            param.setSlug(null);
        }
    }

    public static void valid(LoginParam param) {
        Validators.notEmpty().test(param.getUsername()).throwIfInvalid("用户名");
        Validators.notEmpty().test(param.getPassword()).throwIfInvalid("登录密码");

        Validators.moreThan(4).test(param.getUsername()).throwIfInvalid("用户名");
        Validators.lessThan(20).test(param.getUsername()).throwIfInvalid("用户名");
        Validators.moreThan(6).test(param.getPassword()).throwIfInvalid("登录密码");
        Validators.lessThan(14).test(param.getPassword()).throwIfInvalid("登录密码");
    }

    public static void valid(InstallParam param) {
        Validators.notEmpty().test(param.getSiteTitle()).throwIfInvalid("网站标题");
        Validators.notEmpty().test(param.getSiteUrl()).throwIfInvalid("网站URL");
        Validators.notEmpty().test(param.getAdminUser()).throwIfInvalid("管理员账户");
        Validators.moreThan(4).test(param.getAdminUser()).throwIfInvalid("管理员账户");
        Validators.lessThan(20).test(param.getAdminUser()).throwIfInvalid("管理员账户");

        Validators.notEmpty().test(param.getAdminPwd()).throwIfInvalid("管理员密码");

        Validators.moreThan(6).test(param.getAdminPwd()).throwIfInvalid("请输入6-14位密码");
        Validators.lessThan(14).test(param.getAdminPwd()).throwIfInvalid("请输入6-14位密码");
        if (StringKit.isNotEmpty(param.getAdminEmail())) {
            Validators.isEmail().test(param.getAdminEmail()).throwIfInvalid("电子邮箱");
        }
    }

}
