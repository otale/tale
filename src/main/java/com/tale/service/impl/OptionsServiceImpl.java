package com.tale.service.impl;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.kit.StringKit;
import com.tale.model.Options;
import com.tale.service.OptionsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OptionsServiceImpl implements OptionsService {

    @Inject
    private ActiveRecord activeRecord;

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
        Map<String, String> options = new HashMap<>();
        List<Options> optionsList = activeRecord.list(new Options());
        for (Options option : optionsList) {
            options.put(option.getName(), option.getValue());
        }
        return options;
    }
}
