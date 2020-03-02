package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.StringKit;
import com.tale.model.entity.Options;
import io.github.biezhi.anima.core.AnimaQuery;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.github.biezhi.anima.Anima.delete;
import static io.github.biezhi.anima.Anima.select;

/**
 * 配置Service
 *
 * @author biezhi
 * @since 1.3.1
 */
@Bean
public class OptionsService {

    /**
     * 保存配置
     *
     * @param key   配置key
     * @param value 配置值
     */
    public void saveOption(String key, String value) {
        if (StringKit.isNotBlank(key) && StringKit.isNotBlank(value)) {
            Options options = new Options();
            options.setName(key);

            long count = select().from(Options.class).where(Options::getName, key).count();

            if (count == 0) {
                options = new Options();
                options.setName(key);
                options.setValue(value);
                options.save();
            } else {
                options = new Options();
                options.setValue(value);
                options.updateById(key);
            }
        }
    }

    /**
     * 获取系统配置
     */
    public Map<String, String> getOptions() {
        Map<String, String> options = new HashMap<>();
        AnimaQuery<Options> animaQuery = select().from(Options.class);
        List<Options> optionsList = animaQuery.all();
        if (null != optionsList) {
            optionsList.forEach(option -> options.put(option.getName(), option.getValue()));
        }
        return options;
    }

    public String getOption(String key) {
        Options options = select().from(Options.class).byId(key);
        if (null != options) {
            return options.getValue();
        }
        return null;
    }

    /**
     * 根据key删除配置项
     *
     * @param key 配置key
     */
    public void deleteOption(String key) {
        if (StringKit.isNotBlank(key)) {
            delete().from(Options.class).where(Options::getName).like(key + "%").execute();
        }
    }
}
