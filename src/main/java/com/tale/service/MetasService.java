package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.jdbc.core.OrderBy;
import com.blade.kit.StringKit;
import com.tale.exception.TipException;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Relationships;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Bean
public class MetasService {

    /**
     * 根据类型查询项目列表
     *
     * @param types
     * @return
     */
    public List<Metas> getMetas(String types) {
        if (StringKit.isNotBlank(types)) {
            return new Metas().where("type", types).findAll(OrderBy.of("sort desc, mid desc"));
        }
        return null;
    }

    /**
     * 查询项目映射
     *
     * @param types
     * @return
     */
    public Map<String, List<Contents>> getMetaMapping(String types) {
        if (StringKit.isNotBlank(types)) {
            List<Metas> metas = getMetas(types);
            if (null != metas) {
                return metas.stream()
                        .collect(Collectors.toMap(Metas::getName, (m) -> {
                            Integer             mid           = m.getMid();
                            List<Relationships> relationships = new Relationships().where("mid", mid).findAll();
                            List<Integer>       cids          = relationships.stream().map(Relationships::getCid).collect(Collectors.toList());

                            String         inCids   = cids.stream().map(Object::toString).collect(Collectors.joining(","));
                            List<Contents> contents = new Contents().where("cid", "in", "(" + inCids + ")").findAll(OrderBy.desc("created"));
                            return contents;
                        }));
            }
        }
        return new HashMap<>();
    }

    /**
     * 根据类型和名字查询项
     *
     * @param type
     * @param name
     * @return
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
     * @param cid
     * @param names
     * @param type
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
     * @param mid
     */
    public void delete(int mid) {
        Metas metas = new Metas().find(mid);
        if (null != metas) {

            String type = metas.getType();
            String name = metas.getName();

            metas.delete(mid);

            List<Relationships> rlist = new Relationships().where("mid", mid).findAll();
            if (null != rlist) {
                for (Relationships r : rlist) {

                    Contents contents = new Contents().find(r.getCid());
                    if (null != contents) {
                        boolean  isUpdate = false;
                        Contents temp     = new Contents();
                        temp.setCid(r.getCid());
                        if (type.equals(Types.CATEGORY)) {
                            temp.setCategories(reMeta(name, contents.getCategories()));
                            isUpdate = true;
                        }
                        if (type.equals(Types.TAG)) {
                            temp.setTags(reMeta(name, contents.getTags()));
                            isUpdate = true;
                        }
                        if (isUpdate) temp.update();
                    }
                }
            }
            new Relationships().delete("mid", mid);
        }
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
        String[]     ms   = metas.split(",");
        StringBuffer sbuf = new StringBuffer();
        for (String m : ms) {
            if (!name.equals(m)) {
                sbuf.append(",").append(m);
            }
        }
        if (sbuf.length() > 0) {
            return sbuf.substring(1);
        }
        return "";
    }

}
