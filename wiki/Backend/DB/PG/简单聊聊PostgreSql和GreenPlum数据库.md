---
title: 简单聊聊PostgreSql和GreenPlum数据库
author: 邓聪的小破站
createTime: 2024/05/11 15:39:28
permalink: /article/oi94xtte/
tags: 
  - db
  - postgresql
  - greenplum
---

终于得解决了一个这个问题了，记录一下心酸的过程；有这样一个需求，就是因为没有做分布式存储，现在项目只有一个数据库，需要对运行的数据库做数据备份，使用的是 pg_dump 和 pg_restroe 两个命令。

开始的时候是在本机数据库服务器上面做的备份，但是吧，有的时候会因为意外导致备份中途失败，导致存留这大量的过程文件，导致服务器磁盘占满，但是不备份又不行，因为数据库会存在被勒索的风险，还是要做备份，只能做异机备份，就想着在另外的服务器上面装一个 pg_dump 的命令来实现，这个时候出现了第一个问题，就是服务器是 ubuntu18.04 的，apt 最高支持的 pg 版本是 10，项目使用的是版本 13 的 pg，导致两个版本不相同，直接装也装不上，没办法只能够在 docker 里面装一个 22.04 版本的 ubuntu 来实现，下面就是具体的操作。

## 一、安装 docker 环境并构建 ubuntu22.04 镜像

在 ubuntu 里面安装 docker 这个都很容易，直接运行如下命令即可：

```shell
apt install docker.io
```

然后就遇到一个问题，项目是运行在内网环境，使用`docker pull ubuntu:22.04`没办法直接从互联网上面下载下来，只能在外网服务器拉取镜像，在拷贝到项目服务器

## 1、拉取 ubuntu22.04 镜像并运行

```shell
docker pull ubuntu:22.04  # 拉取镜像
docker run --name ubuntu-pg -itd ubuntu:22.04  # 运行容器
```

## 2、在容器中安装 postgresql-13 服务

因为目标数据是 postgresql-13 的，这里在容器里面也要装版本为 13 的 pg， 但是 ubuntu 22.04 默认没有带 postgresql-13 的 apt 源，我们这里需要根据 pg 官网提供的来操作。

参考：[wiki.postgresql.org](https://wiki.postgresql.org/wiki/Apt)

主要的思路就是在 apt 的源里面添加 pg-13 的源。

```shell
install -d /usr/share/postgresql-common/pgdg  #  创建文件夹
curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc # 下载秘钥
sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'  # 写入apt源, 这句话就是将deb...pgdg main 这个源写到/etc/apt/source.list.d/pgdg.list里面，apt update的时候会从这个里面找
apt update  # 更新
apt-cache madison postgresql # 查看版本
apt install postgresql-13 # 下载postgresql-13数据库
```

lsb_release -cs 用来查看 ubuntu 内核版本的。

这里简单说一下 pg_dump 命令的参数

```shell
pg_dump -h xxx.xx.148.82 -p xx -U testuser -d xxx --schema=xxx -t schema.xx -f a.dump --verbose
```

我们看到这一句，`-h`表示目标服务器的地址， `-p`表示 pg 数据运行的端口，`-d`端口号， `--schema`表示模式，`-t`表示包含的表，前面需要带模式，--verbose 输出过程信息

## 3、将运行的容器构建成镜像并打包成 tar 文件上传到目标服务器

参考[Docker 使用-将容器打成镜像](https://blog.csdn.net/weixin_45505313/article/details/125020076)

查看现在运行的 docker 容器。

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# docker ps
CONTAINER ID   IMAGE          COMMAND       CREATED       STATUS       PORTS     NAMES
60621dd43301   ubuntu:22.04   "/bin/bash"   3 hours ago   Up 3 hours             ubuntu22.04
7f2f45191f6c   ubuntu:20.04   "/bin/bash"   3 hours ago   Up 3 hours             ubuntu20.04
```

将容器构建成 docker 镜像，-a 指定作者， -m 说明星系， 60621dd43301 就是容器的 id， ubuntu-pg:22.04 就是构建出来镜像的名称以及版本。

```shell
docker commit -a "denh" -m "pg back up image" 60621dd43301 ubuntu-pg:22.04
```

将镜像打包成 tar 文件，`-o`指定输出到的文件，这个文件就可以离线的上传到服务器了。`ubuntu-pg:22.04.tar`就是文件的名称

```shell
docker save -o ubuntu-pg:22.04.tar ubuntu-pg:22.04
```

如果恢复的话，使用如下命令, `-i`指定载入的镜像文件

```shell
docker load -i ubuntu-pg:22.04.tar
```

这样的话，我们就有一个能用的镜像了，然后就是镜像的使用。

## 4、目标服务器运行容器

```shell
docker run --name ubuntu-pg -v /home/xxx/postgresql:/home/xxx/postgresql -v /tmp/postgresql-backup-logs:/tmp/postgresql-backup-logs -p 5432:5432 -itd ubuntu-pg:22.04 -itd ubuntu-pg:22.04
```

## 5、编写 linux 中 crontab 定时任务信息

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# crontab -l 查看现在存在的定时任务
root@iZ2vc34h4mxsxearc36g2yZ:~# crontab -e 编辑定时任务，可能会要求选择编辑器
root@iZ2vc34h4mxsxearc36g2yZ:~# crontab -e

Select an editor.  To change later, run 'select-editor'.
  1. /bin/nano        <---- easiest
  2. /usr/bin/vim.basic
  3. /usr/bin/vim.tiny
  4. /bin/ed

Choose 1-4 [1]: 2  # 选择 basic vim 这个我熟
crontab: installing new crontab
```

（补充：如果没有让你选编辑器类型，可以使用`select-editor`来编辑）

在最后写入如下信息，大概得意思就是说没 12 个小时执行命令 `/bin/bash  /home/xxx/backup_dump_pgsql.sh >>/tmp/backup_dump_pgsql.log`， 后面就是备份的脚本 ，这里替换自己的备份脚本

```shell
# pg backup schedule task
0 */12 * * * /bin/bash  /home/xxx/backup_dump_pgsql.sh >>/tmp/backup_dump_pgsql.log
```

然后重启 cron 服务，使 crontab 文件生效

```shell
service cron restart   # 重启cron服务，是crontab文件生效
```

## 6、补充知识点

### 1、查看 docker 容器的大小

`docker system df -v`

### 2、ubuntu 查看包存在版本

`apt-cache madison package  # 查看包存在的版本`

### 3、PostgreSql 简单操作

- 查看 pg 数据库的版本：`select version();`
- \l 列出 database
- \dt 列出所有表
- \c databasename 切换数据库
- \du 列出用户以及权限

`psql -d jdbc -h localhost -p 5432 -U postgres -f /home/sql/test.dmp`

-d 数据库名称，-h ip 地址， -p 端口号， -U 用户， -f sql 文件路径

### 4、dns

`改了/etc/resolv.conf 之后需要 sudo /etc/init.d/networking restart 重启网络服务`

### 5、使用 pg 的二进制文件进行安装

参考如下连接：

[一、postgresql 安装与配置](https://developer.aliyun.com/article/1080171)

[文件下载地址](https://www.postgresql.org/ftp/source/v13.6/)

### 6、mac 的下载 ubuntu 的 iso 镜像

下载的时候需要注意 是下载 arm 的， 在官网没有 arm 结构的 iso，需要从网上找。

[在 m1 芯片的 MacBook 上安装 ubuntu18.04](https://blog.csdn.net/zphj1987/article/details/121110741)

### 7、Linux：vim 内中文乱码问题解决办法

[Linux：vim 内中文乱码问题解决办法](https://blog.csdn.net/qq_21238607/article/details/119425831)

### 8、bash: xxx: command not found

`apt-get install -y lsb-release`安装 lsb-release 包

`apt-get install telnet -y` 安装 telnet

### 9、【Linux】一步一步学 Linux——apt-key 命令(279)

[Linux apt-key 命令](https://blog.csdn.net/dengjin20104042056/article/details/102367999)

sudo apt-key add -

### 10、wget 命令

[Linux 下载文件命令 wget 的一些用法](https://blog.csdn.net/weixin_39509073/article/details/113440514)

### 11、Ubuntu 下 crontab 的安装和使用

[Ubuntu 下 Crontab 的安装和使用](https://blog.csdn.net/longgeaisisi/article/details/90477975)
