package com.tale.dto;

import com.tale.model.Contents;

import java.io.Serializable;
import java.util.List;

/**
 * Created by biezhi on 2017/2/23.
 */
public class Archive implements Serializable {

    private String date;
    private String count;
    private List<Contents> articles;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
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
