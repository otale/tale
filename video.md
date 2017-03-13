# Tale 视频教程

1. 开发环境快速开始
    - [IDEA](https://v.qq.com/x/page/b0379xmo0ad.html)
    - [Eclipse](https://v.qq.com/x/page/x0379l5ttpq.html)
2. [部署到服务器](https://v.qq.com/x/page/b0379544hqe.html)
3. 常见问题解决

## 视频中的脚本

```bash
create user 'tale_test'@'127.0.0.1' identified by 'gZ3F}u%br]9uVb_hOuL:';

create database `tale_test` default character set utf8 collate utf8_general_ci;

grant select,insert,update,delete on tale_test.* to tale_test@'%' Identified by "gZ3F}u%br]9uVb_hOuL:";

grant all privileges on tale_test.* to tale_test@'%' identified by "gZ3F}u%br]9uVb_hOuL:";

flush privileges;
```

```nginx
server {
    listen 80;
	server_name  tale.writty.me;

	location / {
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_pass http://127.0.0.1:9025;
		client_max_body_size 10m;
    }
}

```