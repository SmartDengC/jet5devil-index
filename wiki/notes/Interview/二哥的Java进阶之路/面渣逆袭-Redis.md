---
title: 面渣逆袭-Redis
createTime: 2025/08/11 22:40:02
permalink: /interview/txwcurok/
---

## 基础

### 1、说说什么是Redis？

Redis是一种基于键值对的NoSQL数据库。

主要特点是把数据放在内存当中，相当于直接访问磁盘的关系型数据库，读写速度快，基本上达到微秒级别。

所以对一些高性能要求很高的场景，比如缓存热点数据、防止接口爆刷，都会用到redis。

**Redis和Mysql的区别？**

redis是非关系型数据库，mysql是关系型数据库。

在开发中，mysql作为主存储，redis作为缓存，通过线查询redis，未命中在查mysql并写回redis的方式来提高系统的整体性能。

其中比较有挑战的一个应用是，通过lua脚本封装redis的setnex命令来实现分布式锁，以保证在高并发场景下，热点文章在短时间内的高频访问不会被击穿。



### 2、Redis可以用来干什么？

redis可以用来做缓存，比如说把高频访问的文章详情、商品信息、用户信息放入到redis中，并通过设置过期时间来保证数据一致性，这样就可以减轻数据库的访问压力。

https://www.vdcc.cn/

https://vdcc.cn/
