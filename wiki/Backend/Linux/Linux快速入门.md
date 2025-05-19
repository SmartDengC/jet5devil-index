---
title: Linux快速入门
createTime: 2025/05/17 23:42:58
permalink: /article/9lbk5fti/
tags:
  - linux
---

Linux 快速入门包括基本操作如文件管理、权限设置、用户管理、软件安装和系统监控。掌握常用命令，如 `ls`、`cd`、`cp`、`rm`、`ps` 等，可以帮助用户高效使用 Linux 系统，提升操作和管理能力。

<!-- more -->

## 二、基础业务

### 2.1、Linux用户组相关

```shell
groupadd test # 创建组
usermod -aG docker $USER  # 修改用户组
```

### 三、问题描述

### 3.1、新建的用户授予root权限

```shell
# 修改/etc/sudoers为可编辑
chmod -v u+w /etc/sudoers

# vim /etc/sudoers, 修改文件内容，NOPASSWD表示在使用sudo的时候不用输密码
test ALL=(ALL)       NOPASSWD:ALL

# 将文件修改成只读
chmod -v u-w /etc/sudoers
```

[修改用户为root权限](https://blog.csdn.net/wngpenghao/article/details/105568894)

### 3.2、修改文件、文件夹的所有者

```
chown newuser filename
chown newuser directoryname  # 只修改directoryname这一个文件的拥有者
chown -R newuser directoryname  # 修改directoryname文件夹及其下所有文件的拥有者
```

### 3.3、查看文件目录大小

```shell
du -sh directoryname // 查看某一文件夹的大小
du -h --max-depth=1 directoryname // 查看某个文件夹及其子目录的大小
```

### 3.4、zip压缩

zip 压缩文件排除文件夹 `zip -r elm_model.zip elm_model -x 'elm_model/.venv/*'`
