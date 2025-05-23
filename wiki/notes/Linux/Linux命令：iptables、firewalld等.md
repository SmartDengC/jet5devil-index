---
title: iptables、firewalld等
createTime: 2025/05/17 21:51:12
permalink: /linux/d4gq8mhe/
tags:
  - linuxCommand
---

Linux 中，`iptables` 和 `firewalld` 是常用的防火墙管理工具。`iptables` 提供基于规则的网络流量控制，而 `firewalld` 提供更加简洁和动态的防火墙管理方式，支持区域和服务配置，适合不同的网络安全需求。

<!-- more -->

今天遇到一个线上的问题，就是某一个ip连接数据库的时候，占用了很多的数据库连接，需要控制这个ip对数据库的连接。

开始想的就是通过防火墙，把这个ip墙掉。

后面是通过pg库修改ip的最大链接数，这里还是扩展记录一下linux的防火墙命令的使用。

```sql
ALTER USER "test" CONNECTION LIMIT 100;  -- 修改某个用户的连接数，开始的时候用户没有加双引号，找不到用户
SELECT rolconnlimit FROM pg_roles WHERE rolname = 'test';  -- 查看用户的连接数
```

## 一、iptables

查看是否安装了iptables

```
which iptables
whereis iptables
```

iptables相关命令：

```shell
iptables -L //查看现有的规则，-L是列出当前规则的参数，默认显示规则连

iptables -A INPUT -s ip地址  -j DROP
```

## 二、firewalld



查看防火墙状态

```
systemctl status firewalld 
# 或
firewall-cmd --state
```



[Linux查看防火墙状态及开启关闭命令](https://blog.csdn.net/qq_36640713/article/details/106553833)



## 三、问题

### 3.1、iptables和firewalld是什么关系？如何配合使用？那个用的多？

