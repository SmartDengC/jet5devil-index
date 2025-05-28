---
title: 简单聊聊PostgreSql的灾备方案
createTime: 2025/05/24 22:12:09
permalink: /article/p1bfpjoh/
tags:
  - pg
  - 数据库灾备
---


今天在处理数据库备份的时候，遇到了一点问题。

就是数据库现在越来越大，占用磁盘越来越大，现在通过pg_dump的脚本文件备份出来的文件也越来越大，在使用zip压缩文件过程中也出现了问题。

你不知道文件有多大，足足有350个G，没错就是将近350G。

![image-20250524221559723](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202505242215826.png)

简简单单就能给服务搞出“No Space Left on Device”，现在需要结合实际情况重新考虑灾备方案。