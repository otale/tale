package com.tale.exception;

import com.blade.ioc.annotation.Bean;
import com.blade.mvc.WebContext;
import com.blade.mvc.handler.DefaultExceptionHandler;
import com.blade.mvc.ui.RestResponse;
import com.blade.validator.exception.ValidateException;
import lombok.extern.slf4j.Slf4j;

/**
 * 全局异常处理
 * <p>
 * Created by biezhi on 10/07/2017.
 */
@Slf4j
@Bean
public class GolbalExceptionHandler extends DefaultExceptionHandler {

    @Override
    public void handle(Exception e) {
        if (e instanceof ValidateException) {
            ValidateException validateException = (ValidateException) e;
            String            msg               = validateException.getErrMsg();
            WebContext.response().json(RestResponse.fail(msg));
        } else {
            super.handle(e);
        }
    }

}
