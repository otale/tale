package com.tale.dto;

import com.tale.model.Contents;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by biezhi on 2017/2/23.
 */
public class Archive implements Serializable {

    private String date_str;
    private Date date;
    private String count;
    private List<Contents> articles;

    public String getDate_str() {
        return date_str;
    }

    public void setDate_str(String date_str) {
        this.date_str = date_str;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }

    public List<Contents> getArticles() {
        return articles;
    }

    public void setArticles(List<Contents> articles) {
        this.articles = articles;
    }

}
