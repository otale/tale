package com.tale.service;

import com.tale.dto.MetaDto;
import com.tale.model.Metas;

import java.util.List;

public interface MetasService {

    /**
     * 根据类型和名字查询项
     *
     * @param type
     * @param name
     * @return
     */
    MetaDto getMeta(String type, String name);

    /**
     * 根据类型查询项目列表，带项目下面的文章数
     * @param types
     * @return
     */
    List<MetaDto> getMetaList(String types);

    /**
     * 根据类型查询项目列表
     * @param types
     * @return
     */
    List<Metas> getMetas(String types);

    /**
     * 保存多个项目
     * @param cid
     * @param names
     * @param type
     */
    void saveMetas(Integer cid, String names, String type);

    /**
     * 删除项目
     * @param mid
     */
    void delete(int mid);

    /**
     * 保存项目
     * @param type
     * @param name
     * @param mid
     */
    void saveMeta(String type, String name, Integer mid);

    /**
     * 保存项目
     * @param metas
     */
    void saveMeta(Metas metas);

    /**
     * 更新项目
     * @param metas
     */
    void update(Metas metas);

}
