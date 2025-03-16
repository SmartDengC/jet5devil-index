---
title: Docker：构建Mongo Docker容器
createTime: 2025/03/15 10:53:33
permalink: /article/0u2noqlo/
tags:
  - docker
  - mongo
  - docker容器构建
---

MongoDB是一个分布式文件存储的非关系型数据库，适用于高并发读写、海量数据存储和高可用扩展性的场景。

[MongoDB官网](https://account.mongodb.com/account/login?signedOut=true)

<!-- more -->

## 一、部署mongo并链接数据库

### 1.1、部署mongodb数据库

创建镜像很简单，大概流程就是，1拉取镜像，2运行镜像

```shell
# 拉取mongo最新的镜像
docker pull mongo:latest
# 启动mongo容器，映射27017端口
docker run --name mongo  -p 27017:27017 -itd mongo
```

### 1.2、查看mongodb版本

```shell
root@fca118094daa:/# mongod --version
db version v8.0.5
Build Info: {
    "version": "8.0.5",  # mongo版本
    "gitVersion": "cb9e2e5e552ee39dea1e39d7859336456d0c9820",
    "openSSLVersion": "OpenSSL 3.0.13 30 Jan 2024",
    "modules": [],
    "allocator": "tcmalloc-google",
    "environment": {
        "distmod": "ubuntu2404",
        "distarch": "x86_64",
        "target_arch": "x86_64"
    }
}
```

### 1.3、连接mongodb

连接mongodb可以通过多种方式实现，1命令行；2mongodb compass；3VS Code

#### 1.3.1、命令行连接

```shell
mongosh 
mongod --version
```

#### 1.3.2、mongodb compass

从[MongoDB Compass Download (GUI)](https://www.mongodb.com/try/download/compass)下载对应系统的安装软件，我使用的是Mac，下载了1.45.4(Stable)的版本，macOS arm64(M1)(11.0+)架构的安装包。

## 二、通过代码测试是否配置成功

```js
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://dengcong:<password>@cluster0.83t1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri);

const conn = mongoose.connection;

conn.on("open", () => {
  console.log("ok");
});

conn.on("error", (err) => {
  console.log(err);
});

module.exports = mongoose;

// node ./index.js 运行文件
```

