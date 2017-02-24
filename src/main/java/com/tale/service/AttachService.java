package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.model.Attach;

import java.io.File;

/**
 * Created by biezhi on 2017/2/23.
 */
public interface AttachService {

    void save(String fname, String fkey, String ftype, Integer author);

    void delete(Integer id);

    Paginator<Attach> getAttachs(Take take);
}
