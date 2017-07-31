package com.tale.exception;

import com.blade.exception.ExceptionResolve;
import com.blade.ioc.annotation.Bean;
import com.blade.mvc.hook.Signature;
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
public class GolbalExceptionResolve implements ExceptionResolve {

    @Override
    public boolean handle(Exception e, Signature signature) {
        if (e instanceof ValidateException) {
            ValidateException validateException = (ValidateException) e;
            String msg = validateException.getErrMsg();
            signature.response().json(RestResponse.fail(msg));
            return false;
        }
        return true;
    }
}
