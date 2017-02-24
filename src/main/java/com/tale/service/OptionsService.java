package com.tale.service;

import java.util.Map;

public interface OptionsService {
	
    void saveOption(String key, String value);

    Map<String, String> getOptions();

}
