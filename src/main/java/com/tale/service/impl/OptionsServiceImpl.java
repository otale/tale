package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.kit.StringKit;
import com.tale.model.Options;
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

    @Inject
    private ActiveRecord activeRecord;

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
            int count = activeRecord.count(options);
            if (count == 0) {
                options.setValue(value);
                activeRecord.insert(options);
            } else {
                options.setValue(value);
                activeRecord.update(options);
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
        Take take = new Take(Options.class);
        if(StringKit.isNotBlank(key)){
            take.like("name", key + "%");
        }
        List<Options> optionsList = activeRecord.list(take);
        if(null != optionsList){
            optionsList.forEach(option -> options.put(option.getName(), option.getValue()));
        }
        return options;
    }

    @Override
    public void deleteOption(String key) {
        if(StringKit.isNotBlank(key)){
            activeRecord.delete(new Take(Options.class).like("name", key + "%"));
        }
    }
}
