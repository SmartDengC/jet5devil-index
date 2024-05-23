---
title: PostgreSQL中窗口函数详解
author: 邓聪的小破站
createTime: 2024/05/23 10:03:10
permalink: /article/q8catrwb/
tags:
  - pg
---

## 零、前提条件准备

略

## 一、了解 PostgreSQL 的窗口函数

聚合函数就是将一组数据合并在一起，前提是这个字段能够用聚合函数处理。
比如我们大多时候使用 AVG 就是求某个值的平均值，比如：

```sql
select AVG(price) from products;
select product_name, AVG(price) from products GROUP by product_name;
```

这个时候 avg 处理的集合就是 products.

```sql
SELECT
	product_name, price, group_name, AVG (price) OVER (PARTITION BY group_name)
FROM
	products
	INNER JOIN  product_groups USING (group_id);
```

这里你是发现 avg 函数处理的集合对象是根据 group_name 分组之后的集合。
这样我们就得到了窗口函数的定义了。

```sql
window_function(arg1, arg2,..) OVER (
   [PARTITION BY partition_expression]
   [ORDER BY sort_expression [ASC | DESC] [NULLS {FIRST | LAST }])
```

参考: [PostgreSQL 教程： 窗口函数](https://www.rockdata.net/zh-cn/tutorial/window-functions/)

## 二、ROW_NUMBER 函数

`ROW_NUMBER()`函数是一个窗口函数，它是将一个连续的整数分配给结果集中的每一行。下面是 ROW_NUMBER()函数的语法。

```sql
ROW_NUMBER() OVER(
	[PARTITION BY col1,col2...]
	[ORDER BY col1, col2...]
)
```

`PARTITION BY`将窗口划分为更小的集合。如果指定 PARTITIYON BY 子句，则每个分区的行号从 1 开始并递增 1, PARTITION BY 对 ROW_NUMBER 是可选的。OVER 子句中 ORDER BY 决定编号的分配顺序。

假如我们有一个单表的 products 的表，表字段有 id、name、price，当我们执行如下语句时：

```sql
select id, name, price, ROW_NUMBER() OVER(order by id) from products;
```

我们就会发现增加了一列 row_number 这一些的所有数据是从 1 开始的，每次递增 1.

因为我们没有使用 PARTITION BY，所以 ROW_NUMBER() 函数将整个结果集看做一个分区。

如果我们执行下面语句的话：

```sql
select id, name, price, ROW_NUMBER() OVER(PARTITION BY name ORDER BY id) from products;
```

这个时候我们会发现 row_number 列式在根据名字分组的数据分区里面从 1 开始一次递增。

参考：[PostgreSQL 教程：row_number 函数](https://www.rockdata.net/zh-cn/tutorial/function-row_number/)
