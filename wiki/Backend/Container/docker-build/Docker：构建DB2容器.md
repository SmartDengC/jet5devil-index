---
title: Docker：构建DB2容器
createTime: 2025/05/26 22:10:21
permalink: /article/cr5ftd8v/
tags:
  - docker容器构建
  - db2
  - docker源
---

### 下载镜像：

下载db2响应的镜像。

```shell
docker pull ibmcom/db2express-c:latest
```

如果下载不下来，可以调整一下docker的源地址，调整之后需要重启一下docker，`systemctl restart docker`

```shell
(base) ➜ ~ cat  /etc/docker/daemon.json
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

### 运行容器：

```shell
docker run -d \
  --name db2 \
  --privileged=true \
  -p 50000:50000 \
  -e DB2INST1_PASSWORD=db2admin \
  -e LICENSE=accept \
  ibmcom/db2express-c \
  db2start
```

- -p 50000:50000：将宿主机的 50000 端口映射到容器的 50000 端口。这样，外部可以通过宿主机的 `50000` 端口访问容器中的 Db2 数据库服务。**（需要在云服务器上面开放50000端口）**
- --privileged=true：使得容器内的 root 拥有真正的 root 权限。
- -e DB2INST1_PASSWORD=db2admin：通过环境变量 `DB2INST1_PASSWORD` 设置数据库实例 `DB2INST1` 的密码为 `db2admin`。`DB2INST1` 是 IBM Db2 的默认数据库实例名称。
- LICENSE=accept：通过环境变量 `LICENSE` 设置为 `accept`，表示接受 IBM 的许可证。这通常是为了合规性，在运行 IBM 的产品时，用户需要明确同意其许可证条款。
- db2start：在容器启动后，执行 `db2start` 命令，这会启动 Db2 数据库实例。这是 Db2 启动数据库的常用命令。

### 实际操作

```shell
docker exec -it db2 /bin/bash // 进入到容器

su db2inst1 // 切换用户的命令
db2sampl // 执行创建示例库的命令
db2 list db directory  // 执行查看示例库的数据库名称命令
```

### 通过客户端连接

![image-20250526224850913](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202505262248067.png)



补充命令，不必须运行。

```shell
[root@e4e66f664273 /]# su - db2inst1   // 切换到用户db2inst1
Last login: Mon May 26 14:17:01 UTC 2025 on pts/0

[db2inst1@e4e66f664273 ~]$ db2start  // 启动数据库
SQL1026N  The database manager is already active.

[db2inst1@e4e66f664273 ~]$  db2pd -  // 查看运行状态
Database Member 0 -- Active -- Up 0 days 00:23:20 -- Date 2025-05-26-14.35.31.740547

[db2inst1@e4e66f664273 ~]$ db2level  // 查看数据库和补丁版本
DB21085I  This instance or install (instance name, where applicable: 
"db2inst1") uses "64" bits and DB2 code release "SQL10055" with level 
identifier "0606010E".
Informational tokens are "DB2 v10.5.0.5", "s141128", "IP23633", and Fix Pack 
"5".
Product is installed at "/home/db2inst1/sqllib".
```

参考：

- [傻瓜式部署教程5：docker搭建db2数据库](https://devpress.csdn.net/cloudnative/66d58a850bfad230b8b38d86.html)
