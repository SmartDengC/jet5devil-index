---
title: 面渣逆袭-MySQL
createTime: 2025/08/08 23:17:14
permalink: /interview/5u8rdhfj/
---

## MySQL基础

[面试逆袭-MySQL](https://javabetter.cn/sidebar/sanfene/mysql.html)

### 0、什么是mysql？

drop table删除表，creae table创建表，创建表的时候可以通过primary key设置主键。

```sql
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

```sql
select a.id, b.id from a cross join b;
```



### 2、过程遇到的问题

表A与表B字段关联，将表B的id存到表A里面：

```sql
UPDATE t_lub_inspection_task_list_detail as a
JOIN t_equ_bom as b ON a.CHILD_EQU_CODE = b.code and b.MECHANICS = 'ZY1'
SET a.CHILD_EQU_ID = b.id
where a.CHILD_EQU_ID is NULL;
```

单个表数据更新，根据名字转化成id：

```sql
UPDATE t_factory_task_list
SET WORK_TYPE = CASE 
    WHEN WORK_AREA_NAME = '设备' THEN 625572
    WHEN WORK_AREA_NAME = '功能位置' THEN 625573
    ELSE WORK_TYPE  -- 其他情况保持原值
END
WHERE WORK_TYPE is null ;  
```

1、char_length() 求字符串的长度

```sql
select tweet_id from tweets where char_length(content) > 15
```

2、性能问题

这两个sql到底是按个更快一点？

:::code-tabs

@tab Sql1

```sql
select customer_id, count(visit_id) as count_no_trans 
from visits where visit_id not in (
    select distinct visit_id from transactions
)
group by customer_id
```

@tab Sql2

```sql
select a.customer_id, count(a.customer_id) as count_no_trans 
from visits a 
left join transactions b on a.visit_id = b.visit_id
where b.transaction_id is null
group by a.customer_id;
```

:::

3、datediff(date1, date2)获取时间差

```sql
select a.id from weather as a 
join weather as b on datediff(a.recordDate, b.recordDate) = 1  
-- 这里datediff(a.recordDate, b.recordDate) = 1就表示a.date - b.date = 1
where a.temperature > b.temperature;
```

### 3、三大范式

学习使用数据库，逃不开三大范式。

- 第一范式：确保表的每一列都是不可分割的基本数据单元，比如说用户地址，应该拆分成省、市、区等字段。
- 第二范式：要求表中每一列都和主键直接相关。比如在订单表中，商品名称、单位、商品价格等字段应该拆分到商品表中。
- 第三范式：非主键列应该只依赖于主键列。比如说在设计订单信息表的时候，可以把客户名称、所属公司、联系方式等信息拆分到客户信息表中，然后在订单信息表中用客户编号进行关联。



### 4、varchar与char的区别

varchar是可变长度的字符类型，原则上最多可以容纳65535个字符。但考虑字符集，以及mysql需要1到2个自己 来表示字符串长度，所以实际最大可以容纳65533.

char是固定长度的字符类型，当定义一个char(10)的字段时，不管实际存储的字符串长度是多少，都只会占用10个字符的空间，如果小于10个字符，剩余空间用空格填充。

### 6、DATETIME和TIMESTAMP的区别

DATETIME直接存储日期和时间的完整值，与时区无关。

TIMESTAMP存储的是Unix时间戳，1970-01-01 00:00:00 UTC以来的秒数，受时区的影响。

DATETIME的默认值是null，占用8个字节；TIMESTAMP的默认值为当前时间current_timestamp，占4个字节，实际开发中更常用，因为可以自动更新。

### 7、in和exists的区别

当使用in时，mysql会先执行子查询，然后将子查询的结果用于外部查询的条件，这意味着子查询的结果需要全部加载到内存中。

而exists会对外部查询的每一行，执行一次子查询，如果子查询返回任何行，则exists条件为true，exists关注的是子查询是否返回行，而不是返回的具体值。

### 10、drop、delete和truncate的区别

drop是物理删除，用来删除整张表，包括表结构，且不能回滚

delete支持行纪删除，可以带where条件，可以删除

truncate用于清空表中所有的数据，但是会保留表结构，不能回滚 。

### 13、SQL查询语句的执行顺序

先执行from确定主表，在执行join连接，然2后是where过滤，接着是group by进行分组，having过滤聚合结果，select选择最终列，最后limit限制返回行数。

```sql
select a.id, count(1) from a 
left join  b on a.id = b.aid
where a.id > 1 
group by a.id having count(*) > 1
order by a.id
limit 10  
```

数据库操作：

- create database db_name;
- drop database db_name;
- show databases;
- use db_name

数据表操作：

- create table tb_name (列名...) 
- drop table tb_name;
- show tables;
- describe tb_name

行数据操作CURD

- insert into tb_name (column1, column2) values (value1, value2);;
- update tb_name set column1 = value1, column2=value2 where condition;
- delete from tb_name where condition;

## 数据库架构

### 21、一条查询语句是如何执行的？

![](https://cdn.tobebetterjavaer.com/stutymore/mysql-20240415102041.png)

- 第一步：客户端发送sql查询语句到mysql服务器
- 第二步：mysql服务器的连接器开始处理这个请求，跟客户端建立连接、获取权限、管理连接。
- 第三步：解析器对sql语句进行解析，检查语句是否符合sql语法规则，确保数据库、表和列都是存在的，并处理sql语句中的名称解析和权限验证。
- 第四步：优化器负责确定sql语句的执行计划，这包括选择使用那些索引，以及决定表之间的连接顺序等。
- 第五步：执行器调用存储引擎的api来进行数据的读写。
- 第六步：存储引擎负责查询数据，并将执行结果返回给客户端，客户端接受到查询结果，完成这次查询请求。



### 22、一条更新语句是如何执行的

update语句的执行过程包括读取数据页、加锁解锁、事务提交、日志记录等多个步骤。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/mysql-812fb038-39de-4204-ac9f-93d8b7448a18.jpg)
