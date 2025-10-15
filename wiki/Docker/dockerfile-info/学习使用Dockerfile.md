---
title: 学习使用Dockerfile
createTime: 2025/05/17 23:13:32
permalink: /docker/3q70zxcd/
tags:
  - docker
  - Dockerfile
---

学习使用 Dockerfile 可以帮助我们自动化构建 Docker 镜像。通过编写 Dockerfile 脚本，定义镜像的基础环境、依赖、配置和执行命令，简化应用程序部署与发布过程，提高开发效率和系统的可移植性。

<!-- more -->

## 一、Dockerfile基础信息





## 二、Dockerfile相关命令

[初识dockerFile之RUN和WORKDIR](https://developer.aliyun.com/article/1651061)

### 2.1、RUN

RUN指令用于在镜像构建过程中执行命令。每个RUN指令都会在当前镜像的基础上执行命令，并将结果提交为新的镜像层。因此，RUN指令常用于安装软件包、配置环境等。

- shell格式

```dockerfile
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
RUN apt-get update && apt-get install -y vim

# 更新包列表并安装curl
RUN apt-get update && apt-get install -y curl

# 创建一个目录并进入该目录
RUN mkdir -p /app && cd /app

# 下载一个文件
RUN curl -o /app/file.txt http://example.com/file.txt
```

- excel格式

```dockerfile
RUN ["apt-get", "update"]
```

### 2.2、WORKDIR

WORKDIR指令用于设置工作目录。之后的RUN、CMD、COPY和ADD等将以此目录为基础。如果WORKDIR目录不存在，docker会自动创建它。

```dockerfile
# 使用Node.js基础镜像
FROM node:14

# 设置工作目录为/app
WORKDIR /app

# 复制当前目录下的所有文件到容器的/app目录
COPY . .

# 安装项目依赖
RUN npm install

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 2.3、CMD

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

## 三、Dockerfile构建

```shell
docker build -t image_name .
```

## 四、问题描述

### 4.1、Dockerfile WORKDIR /app 和 RUN cd /app的区别

WORKDIR /app 之后所有的操作都是以app为工作目录

RUN cd /app 只是这次操作进入到了app目录，但是后面的其他操作还是在WORKDIR目录下。
