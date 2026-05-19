---
title: Docker入门知识点总结
author: 邓聪的小破站
createTime: 2024/02/15 23:13:05
permalink: /docker/igkkszsc/
tags: 
  - docker
---


简单对docker使用过程中一些知识进行整理总结。

<!-- more -->

## 一、Dokcer的安装

这里参考大佬在csdn上面的文章，完美安装。[Ubuntu的docker详细安装教程](https://blog.csdn.net/weixin_50999155/article/details/119581698)

docker 使用的源：

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://i3nc9nvv.mirror.aliyuncs.com",
    "https://docker.m.daocloud.io",
    "https://dockerhub.timeweb.cloud",
    "https://dockerpull.com",
    "https://docker.anyhub.us.kg",
    "https://dockerhub.jobcher.com",
    "https://dockerhub.icu",
    "https://docker.awsl9527.cn"
  ]
}
```

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

### 2.4、Docker查看日志操作

日志查看语法：

```shell
docker logs [OPTIONS] CONTAINER
```

OPTIONS说明：

- -f：跟踪日志输出
- --since： 显示某个开始时间的所有日志
- -t：显示时间戳
- --tail：仅列出最新的N条容器日志

```shell
docker logs -f 容器ID
docker logs -f --tail=100 容器ID  # 实时查看最后100条日志
docker logs --since 30m 容器ID  # 查看最近30分钟的日志
docker logs --since="2025-05-02" --tail=500 容器ID  # 查看某时间之后的日志的最新500条日志
docker logs --since="2025-05-02T00:00:00" 容器ID # 查看某时间之后的日志
docker logs -t --since="2025-05-02T00:00:00" --until "2025-05-02T12:00:00" 容器ID # 查看某时间段日志
```



## 三、Docker其他内容

### 3.1、清除Docker的日志

`cat /dev/null > *-json.log`

我们想要从根本上解决docker日志大的问题，我们可以设置容器日志的上限。

### 3.2、查看Docker 容器占用磁盘大小

```shell
docker system df -v
docker ps -s
# 查看容器内存、CPU使用情况等
docker stats --no-stream 
docker container stats
```

参考：[获取Docker容器的内存使用情况](https://blog.csdn.net/twx843571091/article/details/113635187)

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

### 4.2、docker-ce、docker-ce-cli、containerd的关系



### 4.3、docker的rootless model

[Rootless mode](https://docs.docker.com/engine/security/rootless/)



很多次出现服务器上面的磁盘占用爆满的问题，主要是docker相关内容占用磁盘，还有一些其他的内容

### 4.4、Docker中，diff和merged这两个文件夹的作用？

[Docker中，`diff`和`merged`这两个文件夹的作用](https://blog.csdn.net/wykqh/article/details/130260314)

**1、diff文件夹**

diff文件夹包含了容器文件系统的改变。每当你向容器中添加、删除或修改文件时，diff文件夹中都会生成相应的增量改变。因此diff文件夹记录了容器文件系统的修改历史。

**2、merged文件夹**

merged文件夹是容器文件系统的真实映像。它包含了容器中所有的文件和目录，包括初始镜像和diff文件夹中的增量变化，当你启动一个容器时，docker会将初始化镜像和diff文件夹中的增量改变合并到一起，形成一个完整的文件系统，并将其挂载到merges文件夹下面。

#### Linux 系统 /var/log/journal/ 垃圾日志清理

[Linux 系统 /var/log/journal/ 垃圾日志清理](https://blog.csdn.net/ithomer/article/details/89530790)

[Big /var/log/journal](https://askubuntu.com/questions/1238214/big-var-log-journal)

/var/log/journal 就是linux存放日志的地方。

>  You can diminish the size of the journal by means of these commands:
>
>  ```
>  sudo journalctl --vacuum-size=100M
>  ```
>
>  This will retain the most recent 100M of data.
>
>  ```
>  sudo journalctl --vacuum-time=10d
>  ```
>
>  will delete everything but the last 10 days.





参考文章: [docker部署项目，/var/lib/docker/overlay2目录满了如何清理？ ](https://www.cnblogs.com/tk-bolg/p/18120787)
