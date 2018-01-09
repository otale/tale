package com.tale.init;

import com.blade.Environment;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.DriverManager;

/**
 * 标题：DBInit<br>
 * 功能说明：数据库初始化<br>
 * 系统版本：v1.0<br>
 * 开发人员： ganxiang <br>
 * 开发时间：2018年01月08日 22:24<br>
 */
@Slf4j
@NoArgsConstructor
public class DBInit {

    public static String className;
    public static String user;
    public static String password;
    public static String url;

    /**
     * jdbc连接测试
     *
     * @param environment 服务设置
     */
    public static void jdbcTest(Environment environment) {
        try {
            className = environment.get("jdbc.driverClassName", "com.mysql.jdbc.Driver");
            user = environment.get("jdbc.user", "tale");
            password = environment.get("jdbc.password", "123456");
            url = environment.get("jdbc.url", "jdbc:mysql://127.0.0.1:3306/tale?useUnicode=true&characterEncoding=UTF-8");

            //加载驱动类
            Class.forName(className);
            //获取连接
            Connection con =
                    DriverManager.getConnection(url, user, password);

            log.info("db schema:", con.getSchema());
        } catch (Exception e) {
            log.error("load dataSource error :", e);
        }

    }
}
