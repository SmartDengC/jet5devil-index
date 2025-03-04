---
title: 容器化：Docker入门知识点总结
author: 邓聪的小破站
createTime: 2024/02/15 23:13:05
permalink: /article/igkkszsc/
tags: 
  - docker
---


简单对docker使用过程中一些知识进行整理总结。

<!-- more -->

## 一、Dokcer的安装

这里参考大佬在csdn上面的文章，完美安装。[Ubuntu的docker详细安装教程](https://blog.csdn.net/weixin_50999155/article/details/119581698)

## 二、Docker的基础命令

### 2.1、Docker根据容器构建镜像

```shell
docker commit -a "cityhub" -m "cityhub_build_image_from_contain" 容器id 镜像名称:版本
# 实例
docker commit -a 'hahadeng' -m 'jupyterbook image' 0fc7a4932f59 python3.9_jupyterbook:0.0.1
```

> docker commit : 从容器创建一个新的镜像
>
> -a: 提交的镜像作者
>
> -c：使用dockerfile指令来创建镜像
>
> -m：提交时的说明文字

参考：[Docker通过容器生成镜像(通过容器提交（docker commit）成镜像)](https://blog.csdn.net/QMW19910301/article/details/88070159)

### 2.2、Docker镜像的导入导出

参考： [docker镜像压缩导入导出](https://blog.csdn.net/geol200709/article/details/127260420)

如果说镜像比较小的话，我们可以将镜像上传到dockerhub，但是有些情况，像是服务器镜像，经常包比较大；或者说服务器不能够连接到外网，这个时候，就需要将镜像压缩导出来，在其他的服务器上面使用。

导出：`docker save cityhub/mysql5.7:v0.0.1 -o docker_cityhub_mysql.tar`

导入：`docker load -i docker_cityhub_mysql.tar`

镜像压缩导入导出

压缩导出：`docker save cityhub/mysql5.7:v0.0.1 | gzip > docker_cityhub_mysql.tar.gz`

压缩导入：`gunzip -c docker_cityhub_mysql.tar.gz | docker load`

### 2.3、Docker构建通过Dockerfile构建镜像

```shell
docker build -t name:tag .
```

## 三、Docker其他内容

### 3.1、清除Docker的日志

`cat /dev/null > *-json.log`

我们想要从根本上解决docker日志大的问题，我们可以设置容器日志的上限。

### 3.2、查看Docker 容器占用磁盘大小

```shell
docker system df -v
docker ps -s
```

### 3.3、修改Docker镜像地址

很多时候我们都没有办法直接拉去到dockerhub里面的镜像，所有就需要做代理， 使用别人代理好的镜像地址：[毫秒镜像](https://1ms.run/)

[DockerHub 国内加速镜像列表](https://github.com/dongyubin/DockerHub)

```shell
echo '{"registry-mirrors": ["https://docker.1ms.run"]}' | sudo tee /etc/docker/daemon.json > /dev/null
systemctl daemon-reload
systemctl restart docker
```

Linux tee命令是用户读取标准输入的数据， 并将其内容输出成文件。

## 四、问题处理

### 4.1、[linux中docker报错：ERROR: Got permission denied while trying to connect to the Docker daemon socket。](https://blog.csdn.net/qq_45097352/article/details/116105246)

切换到root用户

```shell
su root
```

添加docker用户组，把当前用户加入到组中。

```shell
sudo groupadd docker               #添加用户组
sudo gpasswd -a username docker    #将当前用户添加至用户组
newgrp docker                      #更新用户组
```

