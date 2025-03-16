---
title: Docker：构建Mysql 8.0.41 Docker容器
createTime: 2025/02/11 22:44:17
permalink: /article/fatjfebz/
tags:
  - docker
  - mysql8
  - docker容器构建
---

最近接到了新的项目，相较于其他，不同的地方就是使用的Mysql的版本的不同，以前的是经典的5.7的版本，现在改成用mysql8的版本。

尝试在服务器创建Docker容器。

[Docker部署MySQL 8.3.0（保姆级图文教程）](https://blog.csdn.net/donkor_/article/details/139879575)

不知道为什么，我阿里云的服务器就是下载不下来mysql的镜像，我用另外的服务器下载，然后做的离线。

具体的操作如下：

```shell
docker save mysql:8.0.41 | gzip >  mysql_8.0.41.tar.gz   // 能下载的服务器操作
gunzip -c mysql_8.0.41.tar.gz | docker load  // 离线导入的服务器操作
```

创建conf、data、log目录

```shell
mkdir -p  /home/dengcong/db/mysql8/{conf,data,log}
```

创建配置文件：

```shell
cd /home/dengcong/db/mysql8/conf
vim my.cnf
```

my.cnf内容如下：

```
[client]
#设置客户端默认字符集utf8mb4
default-character-set=utf8mb4
[mysql]
#设置服务器默认字符集为utf8mb4
default-character-set=utf8mb4
[mysqld]
#配置服务器的服务号，具备日后需要集群做准备
server-id = 1
#开启MySQL数据库的二进制日志，用于记录用户对数据库的操作SQL语句，具备日后需要集群做准备
log-bin=mysql-bin
#设置清理超过30天的日志，以免日志堆积造过多成服务器内存爆满。2592000秒等于30天的秒数
binlog_expire_logs_seconds = 2592000
#解决MySQL8.0版本GROUP BY问题
sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'
#允许最大的连接数
max_connections=1000
# 禁用符号链接以防止各种安全风险
symbolic-links=0
# 设置东八区时区
default-time_zone = '+8:00'
```

通过下面运行容器：

```shell
docker run \
-p 3307:3306 \
--restart=always \
--name mysql8.0.41 \
--privileged=true \
-v /home/dengcong/db/mysql8/log:/var/log/mysql \
-v /home/dengcong/db/mysql8/data:/var/lib/mysql \
-v /home/dengcong/db/mysql8/conf/my.cnf:/etc/mysql/my.cnf \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:8.0.41
```

- -p 宿主机端口:容器端口
- --restart=always 表示容器退出时总是重启
- --name表示容器名称
- --privileged=true表示赋予容器权限修改宿主文件权利
- -v表示目录映射
- -e MYSQL_ROOT_PASSWORD=password表示设置mysql的root用户密码，建议用强密码
- -d表示后台运行

