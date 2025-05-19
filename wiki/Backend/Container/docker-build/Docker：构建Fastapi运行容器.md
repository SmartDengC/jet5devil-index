---
title: Docker：构建Fastapi运行容器
createTime: 2025/02/25 11:10:38
permalink: /article/lp6he6rc/
tags:
  - docker
  - fastapi
---

项目使用Python作为编程语言，使用FastAPI作为Web框架，现在需要将写好的项目代码部署到服务器，使用Docker快速部署

<!-- more -->

[容器中的FastAPI-Docker](https://fastapi.tiangolo.com/zh/deployment/docker/#docker)

## 一、项目目录结构

```shell
├── app
│   ├── dto
│   ├── forecast
│   ├── main.py
│   ├── __pycache__
│   ├── requirements.txt
│   ├── test
│   └── test_main.http
├── Dockerfile
└── requirements.txt
```

## 二、requirement.txt内容

~~使用pipreqs来生成requirement.txt文件~~

~~pip install pipreqs~~

~~pipreqs --ignore .venv --force~~

~~--ignore: 忽略执行~~
~~--force : 强制覆盖requirements.txt的内容~~

项目使用的是Python Venv的虚拟环境，环境依赖文件直接放到项目中的.venv目录下，开始使用pipreqs来生产requirement.txt，尝试之后没有成功，最后还是切换到当前虚拟环境，使用pip freeze生成requirement.txt.

```shell
pip3 freeze > requirements.txt
```

## 三、Dockerfile内容

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
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 将./app目录复制到/code目录中
# 由于其中包含更改最频繁的所有代码，因此docker缓存不会疫情用于此操作或者任何后续步骤，因此，将其放在Dockerfile接近最后的位置非常重要，以优化容器镜像的构建时间
COPY ./app /code/app

# 设置命令来运行uvicorn服务区，CMD接受一个字符串列表，每个字符串都是你在命令行中输入的内容，并用空格分割
# 该命令将从当前工作目录运行，即你上面使用WORKDIR /code设置的同一/code目录
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建镜像

```shell
docker build -t elm_model .
docker run --name elm_model -p 8000:8000 -itd elm_model

--restart=always # 设置自动重启
--security-opt seccomp:unconfined  # 处理打镜像的docker版本和使用镜像的docker版本不同问题，比如这次，打镜像的是20.10.21的docker，使用镜像的是20.10.9的docker
```

## 四、问题

1、如果服务器没有办法联网，就没有办法通过pip install来安装依赖包，怎么办？

就直接把依赖包都上传上去，不下载。

在有网络的环境上打镜像，然后把镜像丢到正式环境上面。

[解决Docker容器运行OpenBLAS blas_thread_init: pthread_create failed for thread 1 of 32: Operation not ...](https://zhuanlan.zhihu.com/p/700521014)

