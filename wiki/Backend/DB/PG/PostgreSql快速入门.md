---
title: PostgreSql快速入门
createTime: 2025/05/17 23:03:02
permalink: /article/hemnei8z/
---

PostgreSQL 是一个功能强大的开源关系数据库管理系统。快速入门包括安装 PostgreSQL、创建数据库与表、插入数据、执行查询等基本操作。通过掌握 SQL 语句和数据库管理，可以高效地进行数据存储与处理。

<!-- more -->



## 一、PostgreSql的基础信息





## 二、PostgreSql的命令



### 2.1、PG操作用户

[Postgres限制每个用户只能连接指定数量的session，防止服务器资源紧张](https://blog.csdn.net/lk_db/article/details/78376466)

```sql
select * from pg_user;  -- 查看所有用户
select * from pg_roles;  -- 查看所有角色
select * from information_schema.table_privileges where grantee='testuser';   -- 查看用户权限
ALTER USER "test" CONNECTION LIMIT 100;  -- 修改某个用户的连接数
SELECT rolconnlimit FROM pg_roles WHERE rolname = 'test';  -- 查看用户的连接数
```

### 2.2、PG连接数、进程

```sql
-- 查询死锁数据
SELECT * FROM pg_stat_activity WHERE  wait_event_type = 'Lock';  
-- 断开死锁连接
-- state 有的选项 'idle', 'idle in transaction'...
select pg_terminate_backend(pid) FROM pg_stat_activity WHERE wait_event_type = 'Lock';
select pg_cancel_backend(pid) from pg_stat_activity where client_addr = '127.0.0.1'  
select pg_cancel_backend(pid) from pg_stat_activity where state = 'idle in transaction'

select pg_cancel_backend('35361');  -- 只能杀掉select
select pg_terminate_backend('52046');  -- 杀掉delete update 这些
select * from pg_locks where granted='f';

-- 断开库所有连接,除了本机连接
SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname='platform' AND pid<>pg_backend_pid(); 
```

