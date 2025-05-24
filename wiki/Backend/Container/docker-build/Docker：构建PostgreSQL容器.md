---
title: Docker：构建PostgreSQL容器
author: 邓聪的小破站
createTime: 2024/05/23 11:27:59
permalink: /article/j4wcbzyl/
tags: 
  - pg
  - docker
---

学习的过程中难免会使用到数据库，这里在自己的学习服务器上面使用 docker 创建 pg 数据库的容器，记录创建和使用过程。

<!-- more -->

### 1、拉取指定版本的 pg 的 docker 镜像

````shell
docker pull postgres:13.15
````

### 2、运行

```shell
docker run -d \
  --name product_pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /home/xxx/pgdata:/var/lib/postgresql/data \
  postgres:13.15
```

- -p 端口映射， 将宿主机的 5432 端口映射到容器的 5432 端口  
- -v 地址映射 将宿主机的`/home/xxx/pgdata` 目录映射到`/var/lib/postgresql/data` 上  
- -e `POSTGRES_PASSWORD` 这个就是 postgres 的用户密码

### 3、服务器安全组
如果是运行在外网的服务器的话， 需要配置服务器的安全组，要允许端口访问，我这里是 5432.

### 4、参考：
[Dockerhub Postgres 详情地址](https://hub.docker.com/_/postgres)

### 5、补充：
1、运行容器的时候默认是启动了 PG 数据库的，如果没有启动的话可以手动启动。
2、手动启动

```shell
cd /usr/lib/postgresql/13/bin ./pg_ctrl -D /var/lib/postgresql/data/ restart
```

- -D 表示 PG 的数据存放的主目录， 在 pg 的配置文件里面能找到。  配置文件地址`/var/lib/postgresql/data/pgdata`
