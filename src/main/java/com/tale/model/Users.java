package com.tale.model;

import com.blade.jdbc.annotation.Table;

import java.io.Serializable;

//
@Table(name = "t_users", pk = "uid")
public class Users implements Serializable {

    private static final long serialVersionUID = 1L;

    // user表主键
    private Integer uid;

    // 用户名称
    private String username;

    // 用户密码
    private String password;

    // 用户的邮箱
    private String email;

    // 用户的主页
    private String home_url;

    // 用户显示的名称
    private String screen_name;

    // 用户注册时的GMT unix时间戳
    private Integer created;

    // 最后活动时间
    private Integer activated;

    // 上次登录最后活跃时间
    private Integer logged;

    // 用户组
    private String group_name;

    public Users() {
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHome_url() {
        return home_url;
    }

    public void setHome_url(String home_url) {
        this.home_url = home_url;
    }

    public String getScreen_name() {
        return screen_name;
    }

    public void setScreen_name(String screen_name) {
        this.screen_name = screen_name;
    }

    public Integer getCreated() {
        return created;
    }

    public void setCreated(Integer created) {
        this.created = created;
    }

    public Integer getActivated() {
        return activated;
    }

    public void setActivated(Integer activated) {
        this.activated = activated;
    }

    public Integer getLogged() {
        return logged;
    }

    public void setLogged(Integer logged) {
        this.logged = logged;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }
}