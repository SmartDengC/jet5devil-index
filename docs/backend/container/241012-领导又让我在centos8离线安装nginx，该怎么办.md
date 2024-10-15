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



