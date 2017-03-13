package com.tale.model;

import org.sql2o.Connection;
import org.sql2o.Sql2o;

/**
 * Created by biezhi on 2017/3/4.
 */
public class ExtSql2o extends Sql2o {

    private int defaultTransactionIsolationLevel;

    public ExtSql2o(String url) {
        this(url, null, null);
    }

    public ExtSql2o(String url, String user, String pass) {
        super(url, user, pass);
        this.defaultTransactionIsolationLevel = java.sql.Connection.TRANSACTION_SERIALIZABLE;
    }

    public Connection beginTransaction() {
        return this.beginTransaction(defaultTransactionIsolationLevel);
    }

}
