package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.model.entity.Attach;

/**
 * Created by biezhi on 2017/2/23.
 */
public interface AttachService {

    /**
     * 保存附件
     *
     * @param fname
     * @param fkey
     * @param ftype
     * @param author
     */
    Attach save(String fname, String fkey, String ftype, Integer author);

    /**
     * 删除附件
     * @param id
     */
    void delete(Integer id);

    /**
     * 分页查询附件
     * @param take
     * @return
     */
    Paginator<Attach> getAttachs(Take take);

    /**
     * 根据附件id查询附件
     * @param id
     * @return
     */
    Attach byId(Integer id);
}
