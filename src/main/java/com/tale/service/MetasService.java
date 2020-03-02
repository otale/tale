package com.tale.service;

import com.blade.exception.ValidatorException;
import com.blade.ioc.annotation.Bean;
import com.blade.kit.StringKit;
import com.tale.model.dto.Types;
import com.tale.model.entity.Contents;
import com.tale.model.entity.Metas;
import com.tale.model.entity.Relationships;
import io.github.biezhi.anima.Anima;
import io.github.biezhi.anima.enums.OrderBy;

import java.util.*;
import java.util.stream.Collectors;

import static com.tale.bootstrap.TaleConst.SQL_QUERY_METAS;
import static io.github.biezhi.anima.Anima.select;

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
            return select().from(Metas.class).where(Metas::getType, type)
                    .order(Metas::getSort, OrderBy.DESC)
                    .order(Metas::getMid, OrderBy.DESC)
                    .all();
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
        Integer mid = m.getMid();

        List<Relationships> relationships = select().from(Relationships.class).where(Relationships::getMid, mid).all();
        if (null == relationships || relationships.size() == 0) {
            return new ArrayList<>();
        }
        List<Integer> cidList = relationships.stream().map(Relationships::getCid).collect(Collectors.toList());
        return select().from(Contents.class).in(Contents::getCid, cidList).order(Contents::getCreated, OrderBy.DESC).all();
    }

    /**
     * 根据类型和名字查询项
     *
     * @param type 类型，tag or category
     * @param name 类型名
     */
    public Metas getMeta(String type, String name) {
        if (StringKit.isNotBlank(type) && StringKit.isNotBlank(name)) {
            return select().bySQL(Metas.class, SQL_QUERY_METAS, type, name).one();
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
            throw new ValidatorException("项目关联id不能为空");
        }
        if (StringKit.isNotBlank(names) && StringKit.isNotBlank(type)) {
            String[] nameArr = names.split(",");
            for (String name : nameArr) {
                this.saveOrUpdate(cid, name, type);
            }
        }
    }

    private void saveOrUpdate(Integer cid, String name, String type) {
        Metas metas = select().from(Metas.class).where(Metas::getName, name).and(Metas::getType, type).one();
        int   mid;
        if (null != metas) {
            mid = metas.getMid();
        } else {
            metas = new Metas();
            metas.setSlug(name);
            metas.setName(name);
            metas.setType(type);
            mid = metas.save().asInt();
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
        Metas metas = select().from(Metas.class).byId(mid);
        if (null == metas) {
            return;
        }

        String type = metas.getType();
        String name = metas.getName();
        Anima.deleteById(Metas.class, mid);

        List<Relationships> list = select().from(Relationships.class).where(Relationships::getMid, mid).all();
        if (null != list) {
            list.stream()
                    .map(r -> select().from(Contents.class).byId(r.getCid()))
                    .filter(Objects::nonNull)
                    .forEach(contents -> exec(type, name, contents));
        }
        Anima.delete().from(Relationships.class).where(Relationships::getMid, mid).execute();
    }

    private void exec(String type, String name, Contents contents) {
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
            temp.updateById(cid);
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
        if (StringKit.isEmpty(type) || StringKit.isEmpty(name)) {
            return;
        }
        Metas metas = select().from(Metas.class).where(Metas::getType, type).and(Metas::getName, name).one();
        if (null != metas) {
            throw new ValidatorException("已经存在该项");
        } else {
            metas = new Metas();
            metas.setName(name);
            if (null != mid) {
                metas.updateById(mid);
            } else {
                metas.setType(type);
                metas.save();
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
