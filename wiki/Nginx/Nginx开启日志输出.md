---
title: 开启日志输出
createTime: 2025/05/23 21:31:32
permalink: /nginx/j4u1o0rk/
---



修改了nginx.conf之后，有的时候时候老是不能如愿，这个时候就需要查看nginx的日志了。



nginx的日志默认存放在/var/log/nginx目录下面。



全局日志



局部日志



但是我发现，访问错误的信息，错误日志里面是看不到的。



这里面为空、notice、info的含义是什么？

```
# error_log  logs/error.log;
# error_log  logs/error.log  notice;
# error_log  logs/error.log  info;
# error_log /usr/local/etc/nginx/logs/error.log;
```

日志格式问题？

```
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;
    access_log /usr/local/etc/nginx/logs/access.log main;
```

