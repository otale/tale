package com.tale.service;


import com.tale.model.Contents;

import java.util.List;

/**
 * Created by lzd on 17-6-1.
 */
public interface MenuService {
    Contents getById(int id);

    List<Contents> getMenus();

    void saveMenu(Contents menu);

    void delMenu(int id);



}
