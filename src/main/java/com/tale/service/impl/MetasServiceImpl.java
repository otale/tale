package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.kit.StringKit;
import com.tale.model.dto.MetaDto;
import com.tale.model.dto.Types;
import com.tale.exception.TipException;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Relationships;
import com.tale.service.MetasService;

import java.util.List;

/**
 * 元数据Service实现
 *
 * @author biezhi
 */
@Bean
public class MetasServiceImpl implements MetasService {

    @Inject
    private ActiveRecord activeRecord;

    @Override
    public List<Metas> getMetas(String types) {
        if (StringKit.isNotBlank(types)) {
            return activeRecord.list(new Take(Metas.class).eq("type", types).orderby("sort desc, mid desc"));
        }
        return null;
    }

    @Override
    public MetaDto getMeta(String type, String name) {
        if (StringKit.isNotBlank(type) && StringKit.isNotBlank(name)) {
            String sql = "select a.*, count(b.cid) as count from t_metas a left join `t_relationships` b on a.mid = b.mid " +
                    "where a.type = ? and a.name = ? group by a.mid";
            return activeRecord.one(MetaDto.class, sql, type, name);
        }
        return null;
    }

    @Override
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
        Metas metas = activeRecord.one(new Take(Metas.class).eq("name", name).eq("type", type));
        int mid = 0;
        if (null != metas) {
//            Metas temp = new Metas();
//            temp.setMid(metas.getMid());
//            activeRecord.update(temp);
            mid = metas.getMid();
        } else {
            metas = new Metas();
            metas.setSlug(name);
            metas.setName(name);
            metas.setType(type);
            mid = activeRecord.insert(metas);
        }
        if (mid != 0) {
            int count = activeRecord.count(new Take(Relationships.class).eq("cid", cid).eq("mid", mid));
            if (count == 0) {
                Relationships relationships = new Relationships();
                relationships.setCid(cid);
                relationships.setMid(mid);
                activeRecord.insert(relationships);
            }
        }
    }

    @Override
    public void delete(int mid) {
        Metas metas = activeRecord.byId(Metas.class, mid);
        if (null != metas) {

            String type = metas.getType();
            String name = metas.getName();

            activeRecord.delete(Metas.class, mid);

            List<Relationships> rlist = activeRecord.list(new Take(Relationships.class).eq("mid", mid));
            if (null != rlist) {
                for (Relationships r : rlist) {
                    Contents contents = activeRecord.byId(Contents.class, r.getCid());
                    if (null != contents) {
                        boolean isUpdate = false;
                        Contents temp = new Contents();
                        temp.setCid(r.getCid());
                        if (type.equals(Types.CATEGORY)) {
                            temp.setCategories(reMeta(name, contents.getCategories()));
                            isUpdate = true;
                        }
                        if (type.equals(Types.TAG)) {
                            temp.setTags(reMeta(name, contents.getTags()));
                            isUpdate = true;
                        }
                        if (isUpdate) {
                            activeRecord.update(temp);
                        }
                    }
                }
            }
            activeRecord.delete(new Take(Relationships.class).eq("mid", mid));
        }
    }

    @Override
    public void saveMeta(String type, String name, Integer mid) {
        if (StringKit.isNotBlank(type) && StringKit.isNotBlank(name)) {
            Metas metas = activeRecord.one(new Take(Metas.class).eq("type", type).eq("name", name));
            if (null != metas) {
                throw new TipException("已经存在该项");
            } else {
                if (null != mid) {
                    metas = new Metas();
                    metas.setMid(mid);
                    metas.setName(name);
                    activeRecord.update(metas);
                } else {
                    metas = new Metas();
                    metas.setType(type);
                    metas.setName(name);
                    activeRecord.insert(metas);
                }
            }
        }
    }

    @Override
    public void saveMeta(Metas metas) {
        if (null != metas) {
            activeRecord.insert(metas);
        }
    }

    @Override
    public void update(Metas metas) {
        if (null != metas && null != metas.getMid()) {
            activeRecord.update(metas);
        }
    }

    private String reMeta(String name, String metas) {
        String[] ms = metas.split(",");
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
