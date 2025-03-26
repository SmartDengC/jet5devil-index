---
title: 项目：PH（摄影小站）建站记录
createTime: 2025/01/08 13:35:39
permalink: /self/r5lqd03f/
---

大学毕业设计的一个简单的项目。

分为前后端，前端使用 vue 编写，后端使用 java 编写。

## ph_java

### Dockerfile

```
FROM openjdk:8-jre-slim
MAINTAINER xuxueli
WORKDIR /home/dengcong/project/ph/ph_java
COPY sh_*.jar ./app.jar
ENV PARAMS=""
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install -y fontconfig libfreetype6 && rm -rf /var/lib/apt/lists/*
EXPOSE 9171
ENTRYPOINT ["sh","-c","java -jar ${JAVA_OPTS} app.jar $PARAMS"]
```

```
docker build -t ph_java:1.0 .
docker run --name ph_java -p 9171:9171 -p 9999:9999  -itd ph_java:1.0 /bin/bash
```

9999 是因为要用 xxljob 的一个端口

## ph_vue

### Nginx.conf

```
        server {
                listen 8090;
                server_name 132.232.xxx.xxx;
                location / {
                        autoindex on;
                        root /home/dengcong/project/ph/ph_vue/dist;
                        index index.html index.htm;
                }
                location /api/ {
                        # 需要在最后添加 /
                        proxy_pass http://0.0.0.0:9171/;
                }
                location /exposedir {
                    autoindex on;
                    # 如果文件或目录有中文，则使用字符编码使用utf-8
                    charset utf-8;
                    #默认为on，显示出文件的确切大小，单位是bytes。
                    #改为off后，显示出文件的大概大小，单位是kB或者MB或者GB
                    autoindex_exact_size off;
                    #默认为off，显示的文件时间为GMT时间。
                    #改为on后，显示的文件时间为文件的服务器时间
                    autoindex_localtime on;
                    root /home/dengcong;
                }
        }
```

[NoClassDefFoundError: Could not initialize class sun.awt.X11FontManager](https://stackoverflow.com/questions/55454036/noclassdeffounderror-could-not-initialize-class-sun-awt-x11fontmanager)
