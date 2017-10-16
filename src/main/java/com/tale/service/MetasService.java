package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.jdbc.core.OrderBy;
import com.blade.kit.StringKit;
import com.tale.exception.TipException;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Relationships;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 分类、标签Service
 *
 * @author biezhi
 * @since 1.3.1
 */
@Bean
public class MetasService {

    /**
     * 根据类型查询项目列表
     *
     * @param type 类型，tag or category
     */
    public List<Metas> getMetas(String type) {
        if (StringKit.isNotBlank(type)) {
            return new Metas().where("type", type).findAll(OrderBy.of("sort desc, mid desc"));
        }
        return null;
    }

    /**
     * 查询项目映射
     *
     * @param type 类型，tag or category
     */
    public Map<String, List<Contents>> getMetaMapping(String type) {
        if (StringKit.isNotBlank(type)) {
            List<Metas> metas = getMetas(type);
            if (null != metas) {
                return metas.stream().collect(Collectors.toMap(Metas::getName, this::getMetaContents));
            }
        }
        return new HashMap<>();
    }

    private List<Contents> getMetaContents(Metas m) {
        Integer             mid           = m.getMid();
        List<Relationships> relationships = new Relationships().where("mid", mid).findAll();
        if (null == relationships || relationships.size() == 0) {
            return new ArrayList<>();
        }
        List<Integer>  cidList  = relationships.stream().map(Relationships::getCid).collect(Collectors.toList());
        List<Contents> contents = new Contents().queryAll("select * from t_contents where cid in (" + cidList.stream().map(Object::toString).collect(Collectors.joining(",")) + ") order by created desc");
        return contents;
    }

    /**
     * 根据类型和名字查询项
     *
     * @param type 类型，tag or category
     * @param name 类型名
     */
    public Metas getMeta(String type, String name) {
        if (StringKit.isNotBlank(type) && StringKit.isNotBlank(name)) {
            String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                    "where a.type = ? and a.name = ? group by a.mid";

            return new Metas().query(sql, type, name);
        }
        return null;
    }

    /**
     * 保存多个项目
     *
     * @param cid   文章id
     * @param names 类型名称列表
     * @param type  类型，tag or category
     */
    public void saveMetas(Integer cid, String names, String type) {
        if (null == cid) {
            throw new TipException("项目关联id不能为空");
        }
        if (StringKit.isNotBlank(names) && StringKit.isNotBlank(type)) {
            String[] nameArr = names.split(",");
            for (String name : nameArr) {
                this.saveOrUpdate(cid, name, type);
            }
        }
    }

    private void saveOrUpdate(Integer cid, String name, String type) {
        Metas metas = new Metas().where("name", name).and("type", type).find();
        int   mid;
        if (null != metas) {
            mid = metas.getMid();
        } else {
            metas = new Metas();
            metas.setSlug(name);
            metas.setName(name);
            metas.setType(type);
            mid = metas.save();
        }
        if (mid != 0) {
            long count = new Relationships().where("cid", cid).and("mid", mid).count();
            if (count == 0) {
                Relationships relationships = new Relationships();
                relationships.setCid(cid);
                relationships.setMid(mid);
                relationships.save();
            }
        }
    }

    /**
     * 删除项目
     *
     * @param mid 项目id
     */
    public void delete(int mid) {
        Metas metas = new Metas().find(mid);
        if (null == metas) {
            return;
        }

        String type = metas.getType();
        String name = metas.getName();
        metas.delete(mid);

        List<Relationships> relationships = new Relationships().where("mid", mid).findAll();
        if (null != relationships) {
            relationships.stream()
                    .map(r -> new Contents().<Contents>find(r.getCid()))
                    .filter(Objects::nonNull)
                    .forEach(contents -> {
                        Integer  cid      = contents.getCid();
                        boolean  isUpdate = false;
                        Contents temp     = new Contents();
                        if (type.equals(Types.CATEGORY)) {
                            temp.setCategories(reMeta(name, contents.getCategories()));
                            isUpdate = true;
                        }
                        if (type.equals(Types.TAG)) {
                            temp.setTags(reMeta(name, contents.getTags()));
                            isUpdate = true;
                        }
                        if (isUpdate) {
                            temp.update(cid);
                        }
                    });
        }
        new Relationships().delete("mid", mid);
    }

    /**
     * 保存项目
     *
     * @param type
     * @param name
     * @param mid
     */
    public void saveMeta(String type, String name, Integer mid) {
        if (StringKit.isNotBlank(type) && StringKit.isNotBlank(name)) {
            Metas metas = new Metas().where("type", type).and("name", name).find();
            if (null != metas) {
                throw new TipException("已经存在该项");
            } else {
                if (null != mid) {
                    metas = new Metas();
                    metas.setMid(mid);
                    metas.setName(name);
                    metas.update();
                } else {
                    metas = new Metas();
                    metas.setType(type);
                    metas.setName(name);
                    metas.save();
                }
            }
        }
    }

    private String reMeta(String name, String metas) {
        String[]      ms  = metas.split(",");
        StringBuilder sba = new StringBuilder();
        for (String m : ms) {
            if (!name.equals(m)) {
                sba.append(",").append(m);
            }
        }
        if (sba.length() > 0) {
            return sba.substring(1);
        }
        return "";
    }

}
