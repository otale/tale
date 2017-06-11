package com.tale.service;


import com.tale.model.Contents;

import java.util.List;

/**
 * Created by lzd on 17-6-1.
 */
public interface MenuService {

    List<Contents> getMenus();
    List<Contents> getPages();

    void saveMenu(Contents menu);

    void delMenu(Contents contents);





}
