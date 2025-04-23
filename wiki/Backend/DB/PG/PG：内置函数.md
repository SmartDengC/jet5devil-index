---
title: PG：内置函数
createTime: 2025/04/23 16:35:18
permalink: /article/n251zyat/
---

```sql
select CURRENT_DATE; // 2025-04-23
select CURRENT_TIMESTAMP;  // 2025-04-23 17:05:17.439889+08
```

```sql
select * from plan where plan_date >= current_date - N;   // 查询N天前的数据
select * from plan where plan_date >= current_date;  // 查询当天的数据
```

