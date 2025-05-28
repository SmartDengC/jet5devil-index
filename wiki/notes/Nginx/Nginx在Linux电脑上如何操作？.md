---
title: 在Linux电脑上如何操作？
createTime: 2025/05/26 22:05:36
permalink: /nginx/q9bjhx1j/
---

## Nginx

直接在容器的内部安装使用nginx

### ubuntu安装nginx

```sh
sudo apt install nginx
```

### nginx基本操作

nginx的基本操作命令总结：

```sh
service nginx start/stop/restart
nginx -t
nginx -s reload
```

使用这种方式安装的nginx的一些基本信息

```sh
nginx 配置文件路径 /etc/nginx/nginx.conf
nginx 日志路径 /var/log/nginx/
```

[Nginx从入门到精通(超级详细)（上）](https://developer.aliyun.com/article/1343512)
