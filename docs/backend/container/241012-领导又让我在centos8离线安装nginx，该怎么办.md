---
title: 领导又让我在centos8离线安装nginx，该怎么办
createTime: 2024/10/12 17:00:57
permalink: /article/vzv6vrmh/
---

这一次是比较具有挑战性的任务。

<!-- more -->

因为是在一个离线的服务器上面装相关的运行服务，一些底层的库都需要自己找，然后自己安装。

这次需要安装的软件有nginx、docker服务（不会安装的小伙伴可以看我另外一篇文章，[Centos8离线安装Docker](./241015-Centos8离线安装Docker.md)）

## 一、安装Nginx

### 1.1、安装perl

[Pcre安装](https://blog.csdn.net/quanshiliuhao/article/details/118739931)

### 1.4 参考文章

[Centos 8安装gcc的方法 ](https://www.cnblogs.com/dyd168/p/14603495.html)

[Centos离线安装gcc-c++,make, nginx](https://segmentfault.com/a/1190000040003049)

### 1.5、包下载地址

[centos RPM 包下载地址](https://pkgs.org/search/?q=Development%2FLanguages&on=category)

[RPM resource /usr/bin/pkg-config](https://rpmfind.net/linux/rpm2html/search.php?query=%2Fusr%2Fbin%2Fpkg-config)

### 1.6 报错

#### 1.6.1、pcre问题

没有安装，或者是安装了，但是找不到问题。

```
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```

## 二、安装docker 

[Centos8离线安装Docker](./241015-Centos8离线安装Docker.md)

在网站上面下载软件，然后安装，出现了下面的问题：

```
WARN[2024-10-14T15:28:09.053129829Z] grpc: addrConn.createTransport failed to connect to {unix:///var/run/docker/containerd/containerd.sock  <nil> 0 <nil>}. Err :connection error: desc = "transport: Error while dialing dial unix:///var/run/docker/containerd/containerd.sock: timeout". Reconnecting...  module=grpc
failed to start daemon: Error initializing network controller: error obtaining controller instance: failed to create NAT chain DOCKER: iptables failed: iptables -t nat -N DOCKER: iptables v1.8.5 (nf_tables): Could not fetch rule set generation id: Permission denied (you must be root)
```

docker运行nginx容器

```
docker run --name nginx -p 9481:9481 -p 9581:9581 -v /etc/nginx:/etc/nginx -v /home/cmes/project/nginx:/home/cmes/project/nginx -itd nginx
```



## 三、检查软件是否安装成功

[检查Linux系统是否安装了gcc,pcre,zlib,openssl](https://blog.csdn.net/weixin_42389270/article/details/121553361)





## 四、运行Java docker 容器

```
docker run --name identity_resolution_java -p 8481:8481 -v /home/cmes/project/backend:/usr/src/identity-resolution -itd identity_resolution_pro
```



curl -H "Content-Type:application/json" -X POST -d '{"handleId": 370}' "http://10.165.188.153:8481/handle/selectHandleItemMap"

curl -H "Content-Type:application/json" -X POST -d '{"handleId": 370}' "http://127.0.0.1:8481/handle/selectHandleItemMap"

```
400 Request Header Or Cookie Too Large
```

curl -H "Content-Type:application/json" -X POST -d '{"handleId": 370}' "http://10.165.188.153:9481/api/handle/selectHandleItemMap"



因为是放到容器里面， 在代理后端服务的时候要用容器的ip

```
        server {
                listen      8481;
                server_name localhost;
                location / {
                        # 后端服务在容器中，代理使用容器的ip
                        proxy_pass http://172.17.0.4:8481/;
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-Forwarded-Proto $scheme;
                        proxy_buffer_size 128k;
                        proxy_buffers 32 32k;
                        proxy_busy_buffers_size 128k;
                }
        }
```

报错：connect() failed (111: Connection refused) while connecting to upstream

[Nginx报502错误，日志connect() failed (111: Connection refused) while connecting to upstream的个人有效解决方案](https://blog.csdn.net/hithedy/article/details/86693393)



400 Bad Request Request Header Or Cookie Too Large

[nginx 报 502 bad gateway 分析解决](https://blog.csdn.net/qq_36387471/article/details/105135018)



## nginx file

```
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # access_log  /var/log/nginx/access.log  main;
    access_log  /var/log/nginx/access.log  main;
    # error_log  /var/log/nginx/error_01.log  error;


    sendfile        on;
    keepalive_timeout  65;
    server_names_hash_bucket_size 128;
    client_max_body_size 10m;
    client_header_buffer_size 16k;
    types_hash_max_size 2048;

    include /etc/nginx/conf.d/*.conf;
        server {
                listen      8481;
                server_name localhost;
                location / {
                        # 后端服务在容器中，代理使用容器的ip
                        proxy_pass http://172.17.0.4:8481/;
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-Forwarded-Proto $scheme;
                        proxy_buffer_size 128k;
                        proxy_buffers 32 32k;
                        proxy_busy_buffers_size 128k;
                }
        }

        # listen pc frontend port
        server {
                listen      9481;
                # server_name  localhost;
                server_name 10.165.188.153;
                gzip on;
                gzip_static  always;
                gzip_http_version 1.0;
                gzip_proxied expired no-cache no-store private auth;
                gzip_disable "msie6";
                gzip_min_length 1k;
                gzip_buffers 4 16k;
                gzip_comp_level 3;
                gzip_types  *;
                gzip_vary on;

                client_header_buffer_size 16k;
                large_client_header_buffers 4 32k;
                location / {
                        add_header Access-Control-Allow-Origin *;
                        add_header Access-Control-Allow-Methods true;
                        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
                        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
                        if ($request_method = 'OPTIONS') {
                              return 204;
                        }
                        root /home/cmes/project/nginx/pc/dist;
                        try_files $uri $uri/ /index.html index.htm;
                        index index.html index.htm;
                }
                location ^~ /api/ {
                        add_header Access-Control-Allow-Origin *;
                        add_header Access-Control-Allow-Methods true;
                        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
                        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
                        if ($request_method = 'OPTIONS') {
                            return 204;
                        }
                        # proxy_pass http://127.0.0.1:8481/;
                        proxy_pass http://127.0.0.1:8481/;
                        proxy_buffer_size 128k;
                        proxy_buffers 32 32k;
                        proxy_busy_buffers_size 128k;
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-Forwarded-Proto $scheme;
                }
        }
        server {
                listen      9581;
                server_name  localhost;
                gzip on;
                gzip_static  always;
                gzip_http_version 1.0;
                gzip_proxied expired no-cache no-store private auth;
                gzip_disable "msie6";
                gzip_min_length 1k;
                gzip_buffers 4 16k;
                gzip_comp_level 3;
                gzip_types  *;
                gzip_vary on;
                location / {
                        add_header Access-Control-Allow-Origin *;
                        add_header Access-Control-Allow-Methods true;
                        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
                        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
                        if ($request_method = 'OPTIONS') {
                              return 204;
                        }
                        # app的root不要到index.html目录
                        root /home/cmes/project/nginx/app;
                        index  index.html index.htm;
                        try_files $uri $uri/ /index.html; # 为了处理前端路由
                }
        }

}
```





```
(base) ➜ bssyyyglpt-main (main) ✗ git fetch --all
remote: The project you were looking for could not be found or you don't have permission to view it.
fatal: repository 'https://10.165.18.224/alicloud/bssyyyglpt.git/' not found
```

Git clone http://用户名@125.01.02.03:10086/test/xiangmu.git（输入密码后即拉取代码成功）
