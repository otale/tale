package com.tale.service;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.DateKit;
import com.tale.model.entity.Logs;

import java.util.List;

/**
 * Created by biezhi on 2017/2/26.
 */
@Bean
public class LogService {

    /**
     * 记录日志
     *
     * @param action
     * @param data
     * @param ip
     * @param author_id
     */
    public void save(String action, String data, String ip, Integer author_id) {
        Logs logs = new Logs();
        logs.setAction(action);
        logs.setData(data);
        logs.setIp(ip);
        logs.setAuthor_id(author_id);
        logs.setCreated(DateKit.nowUnix());
        logs.save();
    }

}
