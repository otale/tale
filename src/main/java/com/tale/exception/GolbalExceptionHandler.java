package com.tale.exception;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Bean;
import com.blade.mvc.WebContext;
import com.blade.mvc.handler.DefaultExceptionHandler;
import com.blade.mvc.ui.RestResponse;

/**
 * 全局异常处理
 * <p>
 * Created by biezhi on 10/07/2017.
 */
@Bean
public class GolbalExceptionHandler extends DefaultExceptionHandler {

    @Override
    public void handle(Exception e) {
        if (e instanceof ValidatorException) {
            ValidatorException validatorException = (ValidatorException) e;

            String msg = validatorException.getMessage();
            WebContext.response().json(RestResponse.fail(msg));
        } else {
            super.handle(e);
        }
    }

}
