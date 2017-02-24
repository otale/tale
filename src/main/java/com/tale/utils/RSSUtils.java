package com.tale.utils;

import com.blade.kit.DateKit;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Content;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.WireFeedOutput;
import com.tale.ext.Commons;
import com.tale.init.TaleConst;
import com.tale.model.Contents;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by biezhi on 2017/2/24.
 */
public class RSSUtils {

    public static String getRssXml(List<Contents> articles) throws FeedException {
        //选择一个协议标准
        Channel channel = new Channel("rss_2.0");
        //网站名称
        channel.setTitle(TaleConst.OPTIONS.get("site_title"));
        //网站地址
        channel.setLink(Commons.site_url());
        //网站描述
        channel.setDescription(TaleConst.OPTIONS.get("site_description"));
        channel.setLanguage("zh-CN");

        //一个Item就是一篇文章
        List<Item> items = new ArrayList<>();
        articles.forEach(post -> {
            Item item = new Item();
            item.setTitle(post.getTitle());
            Content content = new Content();
            content.setValue(Commons.article(post.getContent()));
            item.setContent(content);
            item.setLink(Commons.permalink(post.getCid(), post.getSlug()));
            item.setPubDate(DateKit.getDateByUnixTime(post.getCreated()));
            items.add(item);
        });
        channel.setItems(items);
        WireFeedOutput out = new WireFeedOutput();
        //输出成字符串
        String xml = out.outputString(channel);
        return xml;
    }

}
