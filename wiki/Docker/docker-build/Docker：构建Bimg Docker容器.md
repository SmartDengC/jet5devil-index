---
title: 构建Bimg容器
createTime: 2025/03/17 11:32:44
permalink: /docker/wbl7xn2f/
tags:
  - docker容器构建
  - fastapi
---

容器的构建也是比较简单，参考以前构建fastapi的容器。

<!-- more -->

## 一、项目目录结构

```shell
dengcong@VM-0-8-ubuntu:~/project/bimg$ tree -L 2
.
├── app
│   ├── api
│   ├── bing_wallpaper_api
│   ├── cdn.py
│   ├── commit.sh
│   ├── data
│   ├── Dockerfile
│   ├── LICENSE
│   ├── README.md
│   ├── requirements.txt
│   └── vercel.json
├── app.zip
├── Dockerfile
└── requirements.txt

4 directories, 10 files
```

## 二、requirement.txt内容

使用pip freeze生成requirement.txt

```shell
pip3 freeze > requirements.txt
```

## 三、Dockerfile内容

[容器中的FastAPI-Docker](https://fastapi.tiangolo.com/zh/deployment/docker/#docker)

```dockerfile
# 从官方Python基础镜像开始
FROM python:3.9

# 将当前工作目录设置为/code
WORKDIR /code

# 将符合要求的文件复制到/code目录中
COPY ./requirements.txt /code/requirements.txt

# 安装需求文件的包依赖项
# --no-cache-dir 表示pip不要在本地保存下载的包，因为只有当pip再次运行以安装相同的包时才会这样，但在与容器一起工作时情况并非如此
# --upgrade 表示告诉pip升级软件包，如果已经安装
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 将./app目录复制到/code目录中
# 由于其中包含更改最频繁的所有代码，因此docker缓存不会疫情用于此操作或者任何后续步骤，因此，将其放在Dockerfile接近最后的位置非常重要，以优化容器镜像的构建时间
COPY ./app /code/app

# 设置命令来运行uvicorn服务区，CMD接受一个字符串列表，每个字符串都是你在命令行中输入的内容，并用空格分割
# 该命令将从当前工作目录运行，即你上面使用WORKDIR /code设置的同一/code目录
CMD ["uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建镜像

```shell
docker build -t bimg .
docker run --name bimg -p 9127:8000 -itd bimg
```

- --restart=always 
- MONGODB_URI=xxx

```shell
http://xxx.xxx.xxx.223:9127/today?w=1920&h=1080&uhd=False&mkt=zh-CN
http://xxx.xxx.xxx.223:9127/random?w=1920&h=1080&uhd=False&mkt=zh-CN
http://xxx.xxx.xxx.223:9127/total 
http://xxx.xxx.xxx.223:9127/all
```

但是通过接口的调用，时间是会增加的，还需要改进

- random 1796ms

- today 1349ms

- 原来接口：348ms
