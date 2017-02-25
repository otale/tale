package com.tale.service;

import com.tale.dto.*;
import com.tale.model.Comments;
import com.tale.model.Contents;
import com.tale.model.Users;

import java.util.List;

/**
 * 站点服务
 *
 * Created by biezhi on 2017/2/23.
 */
public interface SiteService {

    /**
     * 初始化站点
     *
     * @param users
     * @param jdbcConf
     */
    void initSite(Users users, JdbcConf jdbcConf);

    /**
     * 最新收到的评论
     *
     * @param limit
     * @return
     */
    List<Comments> recentComments(int limit);

    /**
     * 最新发表的文章
     *
     * @param limit
     * @return
     */
    List<Contents> recentContents(int limit);

    /**
     * 获取后台统计数据
     *
     * @return
     */
    Statistics getStatistics();

    /**
     * 查询文章归档
     *
     * @return
     */
    List<Archive> getArchives();

    /**
     * 查询一条评论
     * @param coid
     * @return
     */
    Comments getComment(Integer coid);

    /**
     * 系统备份
     * @param bk_type
     * @param bk_path
     * @param fmt
     * @return
     */
    BackResponse backup(String bk_type, String bk_path, String fmt) throws Exception;

    /**
     * 获取分类/标签列表
     * @return
     */
    List<MetaDto> metas(String type, String orderBy, int limit);
}
