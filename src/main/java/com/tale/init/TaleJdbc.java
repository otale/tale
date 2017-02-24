package com.tale.init;

import com.alibaba.druid.pool.DruidDataSourceFactory;
import com.blade.ioc.Ioc;
import com.blade.jdbc.ar.SampleActiveRecord;
import com.tale.exception.TipException;
import com.tale.utils.ScriptRunner;
import org.sql2o.Sql2o;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

/**
 * 数据库操作
 * Created by biezhi on 2017/2/23.
 */
public final class TaleJdbc {

    private static final Properties jdbc_prop = new Properties();

    private TaleJdbc() {
    }

    static {
        jdbc_prop.put("driverClassName", "com.mysql.jdbc.Driver");
        jdbc_prop.put("initialSize", "5");
        jdbc_prop.put("maxActive", "10");
        jdbc_prop.put("minIdle", "3");
        jdbc_prop.put("maxWait", "60000");
        jdbc_prop.put("removeAbandoned", "true");
        jdbc_prop.put("removeAbandonedTimeout", "180");
        jdbc_prop.put("timeBetweenEvictionRunsMillis", "60000");
        jdbc_prop.put("minEvictableIdleTimeMillis", "300000");
        jdbc_prop.put("validationQuery", "SELECT 1 FROM DUAL");
        jdbc_prop.put("testWhileIdle", "true");
        jdbc_prop.put("testOnBorrow", "false");
        jdbc_prop.put("testOnReturn", "false");
        jdbc_prop.put("poolPreparedStatements", "true");
        jdbc_prop.put("maxPoolPreparedStatementPerConnectionSize", "50");
        jdbc_prop.put("filters", "stat");

        InputStream in = TaleJdbc.class.getClassLoader().getResourceAsStream("jdbc.properties");
        Properties props = new Properties();
        try {
            props.load(in);
            String db_host = props.get("db_host").toString();
            String db_name = props.get("db_name").toString();
            if (!isNull(db_host) && !isNull(db_name)) {

                String username = props.get("db_user").toString();
                String password = props.get("db_pass").toString();

                String url = "jdbc:mysql://" + db_host + "/" + db_name;

                put("url", url);
                put("username", username);
                put("password", password);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void put(String key, String value) {
        jdbc_prop.remove(key);
        jdbc_prop.put(key, value);
    }

    /**
     * 注入数据库查询对象到ioc容器
     *
     * @param ioc
     * @return
     */
    public static boolean injection(Ioc ioc) {
        if (jdbc_prop.containsKey("url") && jdbc_prop.containsKey("username") && jdbc_prop.containsKey("password")) {
            DataSource dataSource;
            try {
                dataSource = DruidDataSourceFactory.createDataSource(jdbc_prop);
            } catch (Exception e) {
                throw new TipException("数据库连接失败, 请检查数据库配置");
            }
            SampleActiveRecord sampleActiveRecord = ioc.getBean(SampleActiveRecord.class);
            if (null != sampleActiveRecord) {
                sampleActiveRecord.setSql2o(new Sql2o(dataSource));
            } else {
                SampleActiveRecord activeRecord = new SampleActiveRecord(dataSource);
                ioc.addBean(activeRecord);
            }
            return true;
        }
        ioc.addBean(new SampleActiveRecord());
        return false;
    }

    /**
     * 测试连接并导入数据库
     */
    public static void testConn() {
        if (jdbc_prop.containsKey("url") && jdbc_prop.containsKey("username") && jdbc_prop.containsKey("password")) {
            try {
                Class.forName("com.mysql.jdbc.Driver"); //MYSQL驱动
                Connection con = DriverManager.getConnection(jdbc_prop.getProperty("url"), jdbc_prop.getProperty("username"), jdbc_prop.getProperty("password"));
                ScriptRunner runner = new ScriptRunner(con, false, true);
                String cp = TaleJdbc.class.getClassLoader().getResource("").getPath();
                runner.runScript(new BufferedReader(new FileReader(new File(cp + "schema.sql"))));
                con.close();
            } catch (Exception e) {
                e.printStackTrace();
                throw new TipException("数据库连接失败, 请检查数据库配置");
            }
        }
    }

    private static boolean isNull(Object value) {
        return null == value || "null".equals(value.toString()) || "".equals(value.toString());
    }
}
