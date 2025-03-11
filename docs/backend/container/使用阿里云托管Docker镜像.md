---
title: 使用阿里云托管Docker镜像
author: 阿聪小破站
createTime: 2024/01/19 21:24:49
permalink: /article/oonzzp0m/
tags: 
  - docker
---

今天突然发现 hub.docker.com 能够上传镜像了，这里就简单记录一下托管镜像的两种方式。

<!-- more -->

# hub.docker.com 托管

这种方式需要能够访问外网
说实话，我都快放弃这种方式了，我都已经想托管到阿里云上面的，但是今天在做反面教材的时候，突然就可以了，真的很苦笑（😂）

现在我们开始吧！

## 1、hub.docker.com 账号

我们需要有一个 hub.docker.com 的账号，如果没有的话，可以去网站申请一个；
在创建用户名的时候，自己要想一个好点的名字，我这搞了一个 cityhub， 同事看了以为是 citywalk，网上的一个梗。
因为这个用户名会是你镜像信息的一部分，比如`cityhubself_ubuntu` 这个镜像。

## 2、使用 docker login 登录

使用 docker login 的时候，可能会提示没有成功，为了安全，使用 personal access token 来登录，参考这个网址 [access-tokens](https://docs.docker.com/go/access-tokens/) 这个是官网的一个教程，简单明了，就是创建一个 access token，在登录的时候用这个 access-token 来登录，成功登录提示如下，只要有 Login Succeeded 就表示登录成功了。

```shell
(base) ➜ ~ docker login -u cityhub
Password:
Login Succeeded

Logging in with your password grants your terminal complete access to your account.
For better security, log in with a limited-privilege personal access token. Learn more at https://docs.docker.com/go/access-tokens/
```

## 3、创建 docker 仓库

在 hub.docker.com 界面创建一个仓库，这个仓库名需要后面提交的时候会在用到，我们以**self_ubuntu**为例。

Repositories -> Create repository（操作路径）

## 4、上传 docker 镜像

如下是我电脑现在存在的镜像，我们需要将 ubuntu 这个镜像托管上去。

```
(base) ➜ ~ docker images
REPOSITORY                                               TAG       IMAGE ID       CREATED        SIZE
ubuntu                                                   latest    174c8c134b2a   4 weeks ago    77.9MB
```

先打一个 tag，就是将镜像复制重名，这里就用到上面的仓库名了 **cityhub/self_ubuntu**

```
(base) ➜ ~ docker tag 174c8c134b2a cityhub/self_ubuntu:v0.1.1
174c8c134b2a 表示原来镜像的镜像id
cityhub/self_ubuntu 是用户名+仓库名 （这个命名方式后面阿里云托管也会用到）
v0.1.1是对应版本
```

然后 docker push 上去

```
(base) ➜ ~ docker push cityhub/self_ubuntu:v0.1.1
The push refers to repository [docker.io/cityhub/self_ubuntu]
a1360aae5271: Pushed
v0.1.1: digest: sha256:f958ac6f7075e036cdd6f4c99fe128955a301bcc5da654cd5b6c088cf1a5ef98 size: 529
```

# 阿里云托管

这里就因为一个参考文章吧，写的还是很清晰的，按照这个就是可以托管上去。
[# 阿里云创建 docker 免费个人容器镜像托管(私服)服务](https://blog.csdn.net/nuptaxin/article/details/124008353)

这里我简单提几点我的理解。
1、阿里云托管命名空间可以创建 3 个，仓库可以创建 3000 个，一个仓库就对应一个镜像，开始我以为所有的镜像都放到一个里面，这是错误的。
2、docker tag 是什么？如何删除构建出来的 tag 镜像？
[docker tag 详解](https://www.cnblogs.com/pzk7788/p/10180919.html) [删除 docker tag 镜像](https://blog.csdn.net/weixin_44112083/article/details/125131147)
