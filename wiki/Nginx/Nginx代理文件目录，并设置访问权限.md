---
title: 代理文件目录并设置访问权限
createTime: 2025/05/17 23:56:08
permalink: /nginx/y7d2zubb/
tags: 
  - nginx
---

[nginx代理文件目录、下载站点](https://blog.csdn.net/HBliucheng/article/details/132339300?utm_source=miniapp_weixin)

```nginx
server {

    listen 8090;
    server_name 127.0.0.01;
    #配置跨域
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    add_header Access-Control-Allow-Headers Content-Type,Authorization;

    location / {

        #代理的本地文件夹
        root /home/crea;
        #开启目录浏览功能；
        autoindex on;
        #关闭详细文件大小统计，让文件大小显示MB，GB单位，默认为b；
        autoindex_exact_size off;
        #开启以服务器本地时区显示文件修改日期！
        autoindex_localtime on;
        auth_basic "Auth access Blog Input your Passwd!";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

## 一、为用户设置登录密码

使用`htpasswd`工具生成密码

如果没有安装，可以安装一下，我这里使用的ubuntu的系统，操作如下：

```shell
sudo apt -y install apache2-utils
```

给用户dengcong创建密码

```shell
sudo htpasswd -c /etc/nginx/.htpasswd dengcong
```

-c 参数表示创建一个新的文件。如果要添加更多用户，只需要省略-c参数：

```shell
sudo htpasswd /etc/nginx/.htpasswd dengcong
```

## 二、配置nginx.conf

```nginx
auth_basic "Auth access Blog Input your Passwd!";
auth_basic_user_file /etc/nginx/.htpasswd;
```

如果想使用wget 来下载文件改怎么办？

```shell
wget -c --http-user=用户名 --http-passwd=密码 http://x.xx.xx.x:8090/deploy/docker-20.10.9.tgz
```

