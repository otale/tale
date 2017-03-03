package com.tale.init;

import com.blade.kit.IOKit;
import com.tale.exception.TipException;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * 数据库操作
 * Created by biezhi on 2017/2/23.
 */
public final class SqliteJdbc {

    private SqliteJdbc() {
    }

    private static final String DB_NAME = "tale.db";
    public static String DB_PATH = SqliteJdbc.class.getClassLoader().getResource("").getPath() + DB_NAME;

    public static final String DB_SRC = "jdbc:sqlite://" + DB_PATH;

    static {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 测试连接并导入数据库
     */
    public static void importSql() {
        try {
            Connection con = DriverManager.getConnection(DB_SRC);
            Statement statement = con.createStatement();
            ResultSet rs = statement.executeQuery("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='t_options'");
            int count = rs.getInt(1);
            if (count == 0) {
                String cp = SqliteJdbc.class.getClassLoader().getResource("").getPath();
                InputStreamReader isr = new InputStreamReader(new FileInputStream(cp + "schema.sql"), "UTF-8");
                String sql = IOKit.toString(isr);
                statement.executeUpdate(sql);
            }
            rs.close();
            statement.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new TipException("数据库连接失败, 请检查数据库配置");
        }
    }

}
