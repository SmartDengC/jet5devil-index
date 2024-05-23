---
title: Docker创建PostgreSQL容器
author: 邓聪的小破站
createTime: 2024/05/23 11:27:59
permalink: /article/j4wcbzyl/
tags:
  - pg
  - docker
---

学习的过程中难免会使用到数据库，这里在自己的学习服务器上面使用 docker 创建 pg 数据库的容器，记录创建和使用过程。

1、拉取指定版本的 pg 的 docker 镜像
`docker pull postgres:13.15`

2、运行

```shell
docker run -d --name product_pg -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -e PGDATA=/var/lib/postgresql/data/pgdata -v /home/xxx/pgdata:/var/lib/postgresql/data postgres:13.15
```

-p 端口映射， 将宿主机的 5432 端口映射到容器的 5432 端口
-v 地址映射 将宿主机的`/home/xxx/pgdata` 目录映射到`/var/lib/postgresql/data` 上
-e `POSTGRES_PASSWORD` 这个就是 postgres 的用户密码
