---
title: Docker：构建Jenkins Docker容器
createTime: 2025/03/07 13:03:50
permalink: /article/zsh7iss4/
tags:
  - docker
  - jenkins
  - docker容器构建
---

Jenkins 是一个开源的持续集成工具，用于自动化构建、测试和部署软件。它通过支持Git、cron、Tars等多种任务，帮助开发团队高效管理项目流程。Jenkins 提供丰富的插件，支持构建、测试、部署和监控，能够显著提升开发效率，是现代软件开发中不可或缺的工具。

<!-- more -->

我们为什么要使用jenkins呢？简单来说，就是它可以帮我们省去很多重复性的部署的动作，帮助我们节省在项目部署这块的时间。

这里我是用docker来部署jenkins，使用docker的优点我这里就不说了，简单一个字就是快，然后就是将环境隔离，避免了服务对其他本机服务的污染。

然后我们就开始吧！！！

## 一、拉取镜像

```shell
docker pull jenkins/jenkins
```

jenkins官网中有写关于如何使用docker来安装jenkins，它推荐是使用[jenkinsci/blueocea](https://hub.docker.com/r/jenkinsci/blueocean/)作为镜像，但是这里我随便找了一个镜像，但是关系不大，都是jenkins的镜像。

[安装Jenkins](https://www.jenkins.io/zh/doc/book/installing/)

## 二、启动容器

```shell
# 运行jenkins容器
docker run --name jenkins -p 8091:8080 -v /home/dengcong/project/jenkins_home:/home/jenkins_home -itd jenkins/jenkins

# 如果容器停止了，可以用下面命令启动，前提是你要有jenkins的容器
docker start jenkins
```

这里我将宿主机的8091端口映射到容器的8080端口，将目录`/home/dengcong/project/jenkins_home`映射到`/home/jenkins_home`上

如果想要设置jenkins开机自动启动，可以执行下面命令：

```shell
# 开机启动docker
systemctl enable docker
# 设置docker启动式启动jenkins, 这里jenkins时容器的名称
docker update --restart=always jenkins
```

然后就可以通过浏览器访问8091端口使用jenkins的web界面了。



