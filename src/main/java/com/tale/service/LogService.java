package com.tale.service;

import com.tale.model.entity.Logs;

import java.util.List;

/**
 * Created by biezhi on 2017/2/26.
 */
public interface LogService {

    /**
     * 记录日志
     * @param action
     * @param data
     * @param ip
     * @param author_id
     */
    void save(String action, String data, String ip, Integer author_id);

    /**
     * 读取日志
     * @param page
     * @param limit
     * @return
     */
    List<Logs> getLogs(int page, int limit);
}
