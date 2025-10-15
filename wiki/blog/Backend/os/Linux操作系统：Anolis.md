---
title: Linux操作系统：Anolis
createTime: 2025/05/13 15:06:50
permalink: /article/ycjpc05v/
---

Anolis 是一个基于 Linux 的开源操作系统，旨在提供稳定、安全、高效的使用体验。它继承了 CentOS 的传统，兼容 RHEL，适用于企业级应用，具有良好的性能优化和安全性，适合服务器和开发环境使用。

<!-- more -->

现在阿里很多系统都使用上龙蜥系统了，我现在就遇到了两回了，这里简单做一个了解。

[龙蜥社区](https://openanolis.cn/)



## 一、dnf

```
# 查看 dnf版本
dnf --version
# 查看已安装的软件
dnf list installed
# 查看所有安装包
dnf list
```



## 二、yum

yum是和centos是相同的，不多了解





docker镜像

https://hub.docker.com/r/openanolis/anolisos

docker pull anolis-registry.cn-zhangjiakou.cr.aliyuncs.com/openanolis/anolisos

https://openanolis.cn/sig/container-images
