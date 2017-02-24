package com.tale.service;

import com.tale.dto.JdbcConf;
import com.tale.model.Users;

/**
 * Created by biezhi on 2017/2/23.
 */
public interface SiteService {

    void initSite(Users users, JdbcConf jdbcConf);

}
