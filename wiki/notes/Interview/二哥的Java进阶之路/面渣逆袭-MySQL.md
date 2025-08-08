---
title: 面渣逆袭-MySQL
createTime: 2025/08/08 23:17:14
permalink: /interview/5u8rdhfj/
---

## MySQL基础

### 0、什么是mysql？

drop table删除表，creae table创建表，创建表的时候可以通过primary key设置主键。

```mysql
create table user(
  id int auto_increment,
  name varchar(100) not null,
  primary key(id)
)
```

多个字段排序 order by salary desc, name asc;

通常情况下，添加索引就能解决大部分性能问题，对于一些热点数据，可以通过增加redis缓存来减轻数据库的访问压力。



### 1、两张表的连接

内连接inner join，只有那些两个表中都存在的记录才会出现在查询结果中。

左外连接，返回左表符合条件的数据，如果右表有匹配的记录就会返回，如果没有就返回null

右外连接，与左外连接相反。

交叉连接，会返沪两张表的笛卡尔积，也就是将组表的每一行与右表的每一行进行组合，返回的行数是两张表行数的乘积。

```mysql
select a.id, b.id from a cross join b;
```

