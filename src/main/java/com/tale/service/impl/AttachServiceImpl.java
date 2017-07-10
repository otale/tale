package com.tale.service.impl;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.blade.kit.DateKit;
import com.tale.model.entity.Attach;
import com.tale.service.AttachService;

/**
 * 附件Service实现
 * <p>
 * Created by biezhi on 2017/2/23.
 */
@Bean
public class AttachServiceImpl implements AttachService {

    @Inject
    private ActiveRecord activeRecord;

    @Override
    public Attach save(String fname, String fkey, String ftype, Integer author) {
        Attach attach = new Attach();
        attach.setFname(fname);
        attach.setAuthor_id(author);
        attach.setFkey(fkey);
        attach.setFtype(ftype);
        attach.setCreated(DateKit.nowUnix());
        activeRecord.insert(attach);
        return attach;
    }

    @Override
    public Attach byId(Integer id) {
        if (null != id) {
            return activeRecord.byId(Attach.class, id);
        }
        return null;
    }

    @Override
    public void delete(Integer id) {
        if (null != id) {
            activeRecord.delete(Attach.class, id);
        }
    }

    @Override
    public Paginator<Attach> getAttachs(Take take) {
        if (null != take) {
            return activeRecord.page(take);
        }
        return null;
    }
}
