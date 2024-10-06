---
title: docker部署nocos
createTime: 2024/10/02 22:37:21
permalink: /article/8ooxozmn/
tags:
  - docker	
  - nocos
---





docker pull  nacos/nacos-server:v2.3.0





docker run --name nacos-server -d nacos/nacos-server:v2.3.0



```
docker cp nacos-server:/home/nacos/conf /home/dengcong/project/nacos/
docker cp nacos-server:/home/nacos/logs /home/dengcong/project/nacos/
docker cp nacos-server:/home/nacos/bin /home/dengcong/project/nacos/
docker cp nacos-server:/home/nacos/data /home/dengcong/project/nacos/
```







```
docker stop nacos-server
docker rm nacos-server
```





vim /home/dengcong/project/nacos/conf/application.properties





```
# 端口
server.port=8848
spring.datasource.platform=mysql
# 数据库数量，如果mysql配置了主从就设置为 2
db.num=1
# mysql连接
db.url.0=jdbc:mysql://8.137.124.148:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai
# 如果db.num=1，则将db.url.1屏蔽；反之则配置db.url.1
#db.url.1=
# mysql用户名
db.user=dengcong
# mysql密码
db.password=1qaz@WSX

### 开启登录验证
nacos.core.auth.enabled=true
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security
# 自定义指定生成JWT的密钥，使用BASE64进行编码，编码前的key长度必须不小于32个字符
nacos.core.auth.plugin.nacos.token.secret.key=

```





```
docker  run \
--name nacos-server -d \
--privileged=true \
--restart=always \
-p 8848:8848 \
-p 9848:9848 \
-p 9849:9849 \
-e MODE=standalone \
-e PREFER_HOST_MODE=hostname \
-v /home/dengcong/project/nacos/logs:/home/nacos/logs \
-v /home/dengcong/project/nacos/data:/home/nacos/data \
-v /home/dengcong/project/nacos/conf:/home/nacos/conf \
-v /home/dengcong/project/nacos/bin:/home/nacos/bin \
nacos/nacos-server:v2.3.0

```





docker run --name nacos -d nacos/nacos-server:v2.3.0





问题：

Internal system. Not exposed to the public network

