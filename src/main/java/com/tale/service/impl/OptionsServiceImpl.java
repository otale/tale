package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.StringKit;
import com.tale.model.entity.Options;
import com.tale.service.OptionsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 配置选项Service实现
 *
 * @author biezhi
 */
@Bean
public class OptionsServiceImpl implements OptionsService {

    @Override
    public void saveOptions(Map<String, List<String>> options) {
        if (null != options && !options.isEmpty()) {
            options.forEach((k, v) -> saveOption(k, v.get(0)));
        }
    }

    @Override
    public void saveOption(String key, String value) {
        if (StringKit.isNotBlank(key) && StringKit.isNotBlank(value)) {
            Options options = new Options();
            options.setName(key);

            long count = options.count();
            if (count == 0) {
                options = new Options();
                options.setName(key);
                options.setValue(value);
                options.save();
            } else {
                options = new Options();
                options.setValue(value);
                options.update(key);
            }
        }
    }

    @Override
    public Map<String, String> getOptions() {
        return getOptions(null);
    }

    @Override
    public Map<String, String> getOptions(String key) {
        Map<String, String> options = new HashMap<>();

        Options activeRecord = new Options();
        if (StringKit.isNotBlank(key)) {
            activeRecord.like("name", key + "%");
        }
        List<Options> optionsList = activeRecord.findAll();
        if (null != optionsList) {
            optionsList.forEach(option -> options.put(option.getName(), option.getValue()));
        }
        return options;
    }

    @Override
    public void deleteOption(String key) {
        if (StringKit.isNotBlank(key)) {
            new Options().like("name", key + "%").delete();
        }
    }
}
