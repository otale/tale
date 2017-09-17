package com.tale.service;

import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;

import java.util.List;
import java.util.Map;

public interface MetasService {

    /**
     * 根据类型和名字查询项
     *
     * @param type
     * @param name
     * @return
     */
    Metas getMeta(String type, String name);

    /**
     * 根据类型查询项目列表
     *
     * @param types
     * @return
     */
    List<Metas> getMetas(String types);

    /**
     * 查询项目映射
     *
     * @param types
     * @return
     */
    Map<String, List<Contents>> getMetaMapping(String types);

    /**
     * 保存多个项目
     *
     * @param cid
     * @param names
     * @param type
     */
    void saveMetas(Integer cid, String names, String type);

    /**
     * 删除项目
     *
     * @param mid
     */
    void delete(int mid);

    /**
     * 保存项目
     *
     * @param type
     * @param name
     * @param mid
     */
    void saveMeta(String type, String name, Integer mid);


}
