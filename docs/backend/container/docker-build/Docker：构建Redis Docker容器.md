---
title: Docker：构建Redis Docker容器
createTime: 2025/02/12 00:38:02
permalink: /article/xdgufaxn/
tags:
  - docker
  - redis
  - docker容器构建
---

使用Docker技术，快速创建Redis服务。

<!-- more -->

[docker安装redis并配置密码](https://blog.csdn.net/qq_43324779/article/details/123561461)

## 一、方法一：容器启动时设置密码

在启动容器的时候，设置密码。

```shell
# 拉取redis镜像
docker pull redis

# 启动容器的时候，并为其设置密码
docker run -d --name myredis -p 6379:6379 redis --requirepass "123456"
```



## 二、方法二：容器启动后，在设置密码

```shell
# 拉取redis镜像
docker pull redis

# 启动容器
docker run -d -p 6366:6379 --name redis-test redis

# 查看运行的redis，并记下它的 CONTAINER ID
docker ps 

# 通过容器id，进入redis
docker exec -it CONTAINER_ID /bin/bash

# 运行redis客户端
redis-cli

# 查看redis的密码
config get requirepass

# 设置redis的密码
config set requirepass yourPassword

# 认证
auth yourPassword
```

