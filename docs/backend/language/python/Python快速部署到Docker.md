---
title: Python快速部署到Docker
createTime: 2025/02/25 11:10:38
permalink: /article/lp6he6rc/
---

现在需要将写好的python代码运行在服务器，使用docker快速部署



## 1、requirement.txt

 使用pipreqs来生成requirement.txt文件

```
# 安装
pip install pipreqs
# 在当前目录生成
pipreqs --ignore .venv --force

--ignore: 忽略执行
--force : 强制覆盖requirements.txt的内容


# 上面方式一直在报错
```

最后还是使用的是，切换到对应的虚拟环境，然后`pip3 freeze > requirements.txt`来生成的requirements.txt文件

## 2、Dockerfile

[容器中的FastAPI-Docker](https://fastapi.tiangolo.com/zh/deployment/docker/#docker)

```dockerfile
# 从官方Python基础镜像开始
FROM python:3.9

# 将当前工作目录设置为/code
WORKDIR /code

# 将符合要求的文件复制到/code目录中
COPY ./requirements.txt /code/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 安装需求文件的包依赖项
# --no-cache-dir 表示pip不要在本地保存下载的包，因为只有当pip再次运行以安装相同的包时才会这样，但在与容器一起工作时情况并非如此
# --upgrade 表示告诉pip升级软件包，如果已经安装
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 将./app目录复制到/code目录中
# 由于其中包含更改最频繁的所有代码，因此docker缓存不会疫情用于此操作或者任何后续步骤，因此，将其放在Dockerfile接近最后的位置非常重要，以优化容器镜像的构建时间
COPY ./app /code/app

# 设置命令来运行uvicorn服务区，CMD接受一个字符串列表，每个字符串都是你在命令行中输入的内容，并用空格分割
# 该命令将从当前工作目录运行，即你上面使用WORKDIR /code设置的同一/code目录
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

构建镜像

```
docker build -t elm_model .
docker run --name elm_model -p 8000:8000 -itd elm_model
```



