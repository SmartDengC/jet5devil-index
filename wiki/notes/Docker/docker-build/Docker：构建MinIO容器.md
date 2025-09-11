---
title: 构建MinIO容器
author: 邓聪的小破站
createTime: 2024/09/09 23:52:37
permalink: /docker/7c8owv0x/
---

最近在着手搞自己知识库，刚好有一些文件需要存储，刚好有一个阿里云的服务器，准备打算用docker跑一个minio的服务，供平时的知识库使用。

<!-- more -->

下面就简单讲讲如何安装的，如何使用？如何在我们的工作中使用到MinIO。

## 关于安装

使用的是[bitnami/minio](https://hub.docker.com/r/bitnami/minio)的镜像源，直接pull下来。

```shell
docker pull bitnami/minio
```

最简单就是直接docker run， 但是这里我们需要将端口放出来；MinIO还可以使用k8s部署，还可以结合Dockerfile这个还不熟练，先跳过，直接运行，要使用的话，我们还需要将服务器的安全策略调整一下，将9000和9001端口开放出来。

```shell
docker run --name minio -p 9000:9000 -p 9001:9001 \
    --env MINIO_ROOT_PASSWORD="xxxx" \
    -itd bitnami/minio:latest
```

后面就启动容器 `docker start minio`.

最后决定还是将图片上传到gitee上面，minio用来保存一些文件，像是视频、音频等等。

md中使用minio的地址问题。后面使用picgo来构建图床。（使用分享的连接）

![header](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202409100038794.jpg)

后面就是使用python， java操作minio的上传和下载。



## PicGo配置MinIO

参考文件：[生命在于折腾-PicGo+MinIO+Typora](https://blog.csdn.net/qq_15131581/article/details/130057796)



## Python操作MinIO

[Python MinIO 基础操作指南](https://blog.csdn.net/Dxy1239310216/article/details/141255073)

```python
from minio import Minio
import os

client = Minio(
    endpoint="8.137.124.148:9000",
    access_key='GhDg5muxxxxxx',
    secret_key='ylc3sQJRYlDfWIXXXX',
    secure=False
)
bucket_name = 'base'

file_path = '/Users/dengc4r/Pictures/default.jpg'
if client.bucket_exists(bucket_name):
    with open('file.txt', 'wb') as file_data:
        bytes_length = os.path.getsize('file.txt')
    client.put_object(bucket_name, "file.txt", file_data, bytes_length)

url = client.presigned_get_object("base", "file.txt")
print(url)
```



## Java操作MinIO

