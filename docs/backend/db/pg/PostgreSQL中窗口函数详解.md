---
title: PostgreSQL中窗口函数详解
author: 邓聪的小破站
createTime: 2024/05/23 10:03:10
permalink: /article/q8catrwb/
tags: 
  - pg
---



## 一、ROW_NUMBER函数

`ROW_NUMBER()`函数是一个窗口函数，它是将一个连续的整数分配给结果集中的每一行。下面是ROW_NUMBER()函数的语法。

```sql
ROW_NUMBER() OVER(
	[PARTITION BY col1,col2...]
	[ORDER BY col1, col2...]
)
```

`PARTITION BY`将窗口划分为更小的集合。如果指定PARTITIYON BY子句，则每个分区的行号从1开始并递增1, PARTITION BY对ROW_NUMBER是可选的。OVER子句中ORDER BY决定编号的分配顺序。



假如我们有一个单表的products的表，表字段有id、name、price，当我们执行如下语句时：

```sql
select id, name, price, ROW_NUMBER() OVER(order by id) from products;
```

我们就会发现增加了一列row_number这一些的所有数据是从1开始的，每次递增1.

因为我们没有使用PARTITION BY，所以ROW_NUMBER() 函数将整个结果集看做一个分区。

如果我们执行下面语句的话：

```sql
select id, name, price, ROW_NUMBER() OVER(PARTITION BY name ORDER BY id) from products;
```

这个时候我们会发现row_number列式在根据名字分组的数据分区里面从1开始一次递增。

参考：[PostgreSQL教程：row_number函数](https://www.rockdata.net/zh-cn/tutorial/function-row_number/)

