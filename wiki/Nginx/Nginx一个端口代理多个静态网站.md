---
title: Nginx一个端口代理多个静态网站
createTime: 2025/06/08 23:00:09
permalink: /nginx/04h6qg54/

---

Nginx 通过一个端口代理不同的项目，有两种方式，一种是通过不同的后缀匹配，一种是通过子域名来实现。

## 一、匹配不同后缀

比如下面配置：

- http://8.xxx.xxx.148:9271 
- http://8.xxx.xxx.148:9271/wiki
- http://8.xxx.xxx.148:9271/iron

```nginx
server {
    listen 9271;
    server_name 8.xxx.xxx.148;

    location / {
        root /home/dengcong/project/blog;
        index index.html index.htm;
    }

    location /wiki {
        alias /home/dengcong/project/blog/wiki/dist;
        try_files $uri $uri/ /wiki/dist/index.html;
        index index.html index.htm;
    }

    location /iron {
        alias /home/dengcong/project/blog/iron/dist;
        try_files $uri $uri/ /iron/dist/index.html;
        index index.html index.htm;
    }
}
```

## 二、子域名实现

```nginx
server {
    listen 443 ssl;
    server_name wiki.hahadeng.cn;
    ssl_certificate /home/dengcong/ssl/wiki.hahadeng.cn.pem;
    ssl_certificate_key /home/dengcong/ssl/wiki.hahadeng.cn.key;

    location / {
        root /home/dengcong/project/blog/wiki/dist;
        try_files $uri $uri/ /wiki/dist/index.html;
        index index.html index.htm;
    }
}
server {
    listen 443 ssl;
    server_name iron.hahadeng.cn;
    ssl_certificate /home/dengcong/ssl/iron.hahadeng.cn.pem;
    ssl_certificate_key /home/dengcong/ssl/iron.hahadeng.cn.key;

    location / {
        root /home/dengcong/project/blog/iron/dist;
        try_files $uri $uri/ /iron/dist/index.html;
        index index.html index.htm;
    }
}
server {
    listen 443 ssl;
    server_name sci.hahadeng.cn;
    ssl_certificate /home/dengcong/ssl/sci.hahadeng.cn.pem;
    ssl_certificate_key /home/dengcong/ssl/sci.hahadeng.cn.key;

    location / {
        root /home/dengcong/project/blog/sci/dist;
        try_files $uri $uri/ /sci/dist/index.html;
        index index.html index.htm;
    }
}
```



