package com.tale.test.service;

import com.blade.ioc.annotation.Inject;
import com.tale.service.OptionsService;
import com.tale.test.BaseTest;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author biezhi
 * @date 2018/6/3
 */
public class OptionsServiceTest extends BaseTest {

    @Inject
    private OptionsService optionsService;

    @Test
    public void testSaveOption() {
        optionsService.saveOption("hello2", "world2");

        String value = optionsService.getOption("hello2");
        Assert.assertEquals("world2", value);
    }

    @Test
    public void testGetOption() {
        optionsService.saveOption("hello3", "world3");
        optionsService.deleteOption("hello3");
        String value = optionsService.getOption("hello3");
        Assert.assertNull(value);
    }

}
