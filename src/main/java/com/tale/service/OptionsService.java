package com.tale.service;

import java.util.Map;

public interface OptionsService {

    void saveOptions(Map<String, String> options);

    void saveOption(String key, String value);

    Map<String, String> getOptions();

}
