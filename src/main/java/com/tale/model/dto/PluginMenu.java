package com.tale.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by biezhi on 2017/3/1.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PluginMenu {

    private String name;
    private String slug;
    private String icon;

}
