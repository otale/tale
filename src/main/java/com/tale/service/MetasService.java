package com.tale.service;

import com.tale.dto.MetaDto;
import com.tale.model.Metas;

import java.util.List;

public interface MetasService {

    MetaDto getMeta(String type, String name);

    List<MetaDto> getMetaList(String types);

    List<Metas> getMetas(String types);

    void saveMetas(Integer cid, String names, String type);

    void updateCount(String type, String[] names, int count);

    void delete(int mid);

    void saveMeta(String type, String name, Integer mid);

    void saveMeta(Metas metas);

    void update(Metas metas);

}
