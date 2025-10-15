---
title: Nginx配置error_page
createTime: 2025/08/11 16:10:21
permalink: /nginx/rxk98dy1/

---

当访问的资源不存在的时候，或者系统内部错误的时候，也就是我们常见的一些http返回码，像是400， 403，404，500这些，我们想展示自定义的界面该怎么办？

这个时候就用到了ngixn的error_page功能。

我们需要知道，nginx默认展示的那个index.html是存放在哪里的，存放在`/usr/share/nginx/html`文件目录下。



1、在location反向代理部分，添加这条命令，开启自定义错误页面的开关。

```nginx
proxy_intercept_errors on;
```

2、将自定义的页面放到指定目录，然后就可以访问了。

```nginx
proxy_intercept_errors on; # 如果配置了不生效，需要添加这一行

error_page 500 /500.html;
# error_page  502 503 504 /50x.html;
error_page 403 /403.html;
error_page 404 /404.html;

location /500.html {

    root /usr/share/nginx/html; # 表示文件放置的目录
}
location /403.html {

    root /usr/share/nginx/html;
}
location /404.html {

    root /usr/share/nginx/html;
}
```
