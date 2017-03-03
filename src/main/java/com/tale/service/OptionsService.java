package com.tale.service;

import java.util.Map;

public interface OptionsService {

    /**
     * 保存一组配置
     *
     * @param options
     */
    void saveOptions(Map<String, String> options);

    /**
     * 保存配置
     * @param key
     * @param value
     */
    void saveOption(String key, String value);

    /**
     * 获取系统配置
     * @return
     */
    Map<String, String> getOptions();

    /**
     * 根据key删除配置项
     * @param key
     */
    void deleteOption(String key);
}
