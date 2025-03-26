---
title: Nginx HTTPS配置二级域名
createTime: 2025/03/12 23:20:49
permalink: /nginx/39k5ckqi/
tags:
  - nginx
  - 二级域名
---

为什么我们需要二级域名？

假如我们申请一个域名，那么我们就只有一个一级域名，那么这样的话，我们配置代理就特别有限，但是我们配置二级域名的话，我们只需要在一级域名的基础上随便设置二级域名，这样的话，我们在建站的时候就能灵活很多，满足更多的业务。

## 一、配置HTTPS

如果我们使用HTTPS，我们就需要申请一个SSL证书，因为HTTP + SSL才是HTTPS，我的证书是在阿里云上面申请的，用来测试的话，每三个月可以申请一次，每次最多可以申请20个SSL的证书。

![image-20250312232850177](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202503122328255.png)

申请之后，然后下载下来，放到Nginx的服务器上面，然后参考下面内容进行配置：

```nginx
server {
    listen 443;
    server_name localhost;
    ssl on;
    ssl_certificate /home/xxx/ssl/xxx.cn.pem;
    ssl_certificate_key /home/xxx/ssl/xxx.cn.key;

    location / {
        root /home/xxx/project/blog/wiki/docs/.vuepress/dist;
        index index.html index.htm;
    }
}
```

## 二、二级域名HTTPS代理

前面只是讲了一级域名HTTPS的请求。配置二级HTTPS和一级是一样的，只要后面新建一个新的server就可以了。（注意：一定是在第一个server的后面新建server）。比如：

```nginx
server {
    listen 443;
    server_name localhost;
    ssl on;
    ssl_certificate /home/xxx/ssl/xxx.cn.pem;
    ssl_certificate_key /home/xxx/ssl/xxx.cn.key;

    location / {
        root /home/xxx/project/blog/wiki/docs/.vuepress/dist;
        index index.html index.htm;
    }
}

server {
    listen 443 ssl;
    server_name wiki.xxx.cn;  # 二级域名

    ssl_certificate /home/xxx/ssl/wiki.xxx.cn.pem;  # 这里根据不同的二级域名申请不同的证书
    ssl_certificate_key /home/xxx/ssl/wiki.xxx.cn.key;

    location / {
        root /home/xxx/project/blog/wiki/docs/.vuepress/dist;
        index index.html index.htm;
    }
}
```

这样的话，就可以使用二级域名访问了， 以上面为例的话，就是访问https://wiki.xxx.cn网址。
