package com.tale.dto;

/**
 * Created by biezhi on 2017/2/23.
 */
public class JdbcConf {

    private String db_host;
    private String db_name;
    private String db_user;
    private String db_pass;

    public JdbcConf(String db_host, String db_name, String db_user, String db_pass) {
        this.db_host = db_host;
        this.db_name = db_name;
        this.db_user = db_user;
        this.db_pass = db_pass;
    }

    public String getDb_host() {
        return db_host;
    }

    public void setDb_host(String db_host) {
        this.db_host = db_host;
    }

    public String getDb_name() {
        return db_name;
    }

    public void setDb_name(String db_name) {
        this.db_name = db_name;
    }

    public String getDb_user() {
        return db_user;
    }

    public void setDb_user(String db_user) {
        this.db_user = db_user;
    }

    public String getDb_pass() {
        return db_pass;
    }

    public void setDb_pass(String db_pass) {
        this.db_pass = db_pass;
    }
}
