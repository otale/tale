--
-- 由SQLiteStudio v3.1.1 产生的文件 周六 3月 4 01:05:21 2017
--
-- 文本编码：UTF-8
--

PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- 表：t_attach
DROP TABLE IF EXISTS t_attach;

CREATE TABLE t_attach (
  id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  fname     VARCHAR(100)                      NOT NULL,
  ftype     VARCHAR(50),
  fkey      VARCHAR(100)                      NOT NULL,
  author_id INTEGER(10)                       NOT NULL,
  created   INTEGER(10)                       NOT NULL
);

-- 表：t_comments
DROP TABLE IF EXISTS t_comments;
CREATE TABLE t_comments (
  coid      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  cid       INTEGER     DEFAULT (0) NOT NULL,
  created   INTEGER(10)                       NOT NULL,
  author    VARCHAR(200)                      NOT NULL,
  author_id INTEGER(10) DEFAULT (0),
  owner_id  INTEGER(10) DEFAULT (0),
  mail      VARCHAR(200)                      NOT NULL,
  url       VARCHAR(200),
  ip        VARCHAR(64),
  agent     VARCHAR(200),
  content   TEXT                              NOT NULL,
  type      VARCHAR(16),
  status    VARCHAR(16),
  parent    INTEGER(10) DEFAULT (0)
);

-- 表：t_contents
DROP TABLE IF EXISTS t_contents;


CREATE TABLE t_contents (
  cid           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  title         VARCHAR(255)                      NOT NULL,
  slug          VARCHAR(255) CONSTRAINT idx_u_slug UNIQUE,
  thumb_img     VARCHAR(255),
  created       INTEGER(10)                       NOT NULL,
  modified      INTEGER(10),
  content       TEXT,
  author_id     INTEGER(10)                       NOT NULL,
  type          VARCHAR(16)                       NOT NULL,
  status        VARCHAR(16)                       NOT NULL,
  fmt_type      VARCHAR(16) DEFAULT ('markdown'),
  tags          VARCHAR(200),
  -- 如果为0则不是菜单，值为1是菜单
  menu          INTEGER     DEFAULT (0),
  categories    VARCHAR(200),
  hits          INTEGER(10) DEFAULT (0),
  comments_num  INTEGER(1)  DEFAULT (0),
  allow_comment INTEGER(1)  DEFAULT (1),
  allow_ping    INTEGER(1),
  allow_feed    INTEGER(1)
);

INSERT INTO t_contents (cid, title, slug, created, modified, content, author_id, type, status, tags,menu, categories, hits, comments_num, allow_comment, allow_ping, allow_feed)
VALUES (1, '关于', 'about', 1487853610, 1487872488, '### Hello World


这是我的关于页面

### 当然还有其他

具体你来写点什么吧', 1, 'page', 'publish', NULL,1, NULL, 0, 0, 1, 1, 1);
INSERT INTO t_contents (cid, title, slug, created, modified, content, author_id, type, status, tags, menu, categories, hits, comments_num, allow_comment, allow_ping, allow_feed)
VALUES (2, '第一篇文章', NULL, 1487861184, 1487872798, '## Hello  World.

> 第一篇文章总得写点儿什么?...

----------


<!--more-->

```java
public static void main(String[] args){
    System.out.println(\"Hello Tale.\");
}

```', 1, 'post', 'publish', '',0, '默认分类', 10, 0, 1, 1, 1);

-- 表：t_logs
DROP TABLE IF EXISTS t_logs;
CREATE TABLE t_logs (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, "action" VARCHAR (100) NOT NULL, data VARCHAR (2000), author_id INTEGER (10) NOT NULL, ip VARCHAR (20), created INTEGER (10) NOT NULL);

-- 表：t_metas
DROP TABLE IF EXISTS t_metas;
CREATE TABLE t_metas (mid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, name VARCHAR (200) NOT NULL, slug VARCHAR (200), type VARCHAR (32) NOT NULL, description VARCHAR (255), sort INTEGER (4) DEFAULT (0), parent INTEGER (10) DEFAULT (0));
INSERT INTO t_metas (mid, name, slug, type, description, sort, parent) VALUES (1, '默认分类', NULL, 'category', NULL, 0, 0);
INSERT INTO t_metas (mid, name, slug, type, description, sort, parent) VALUES (6, '王爵的技术博客', 'http://biezhi.me', 'link', NULL, 0, 0);

-- 表：t_options
DROP TABLE IF EXISTS t_options;
CREATE TABLE t_options (name VARCHAR (100) PRIMARY KEY UNIQUE NOT NULL, value TEXT, description VARCHAR (255));

INSERT INTO t_options (name, value, description) VALUES ('site_title', 'Tale博客系统', '');
INSERT INTO t_options (name, value, description) VALUES ('social_weibo', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_zhihu', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_github', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('social_twitter', '', NULL);
INSERT INTO t_options (name, value, description) VALUES ('allow_install', '0', '是否允许重新安装博客');
INSERT INTO t_options (name, value, description) VALUES ('site_theme', 'default', NULL);
INSERT INTO t_options (name, value, description) VALUES ('site_keywords', '博客系统,Blade框架,Tale', NULL);
INSERT INTO t_options (name, value, description) VALUES ('site_description', '博客系统,Blade框架,Tale', NULL);
INSERT INTO t_options (name, value, description) VALUES ('allow_zimg', '0', '是否支持zimg图片服务器');
INSERT INTO t_options (name, value, description) VALUES ('zimg_address', 'http://127.0.0.1:4869', 'zimg访问地址');

-- 表：t_relationships
DROP TABLE IF EXISTS t_relationships;
CREATE TABLE t_relationships (
  cid INTEGER(10) NOT NULL,
  mid INTEGER(10) NOT NULL
);

-- 表：t_users
DROP TABLE IF EXISTS t_users;
CREATE TABLE t_users (
  uid         INTEGER PRIMARY KEY UNIQUE NOT NULL,
  username    VARCHAR(64) UNIQUE         NOT NULL,
  password    VARCHAR(64)                NOT NULL,
  email       VARCHAR(100),
  home_url    VARCHAR(255),
  screen_name VARCHAR(100),
  created     INTEGER(10)                NOT NULL,
  activated   INTEGER(10),
  logged      INTEGER(10),
  group_name  VARCHAR(16)
);

COMMIT TRANSACTION;
PRAGMA foreign_keys = ON;
