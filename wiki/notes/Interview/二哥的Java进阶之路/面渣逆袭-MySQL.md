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

