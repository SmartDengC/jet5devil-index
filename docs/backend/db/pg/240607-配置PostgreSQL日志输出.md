---
title: 配置PostgreSQL日志输出
author: 邓聪的小破站
createTime: 2024/06/07 11:37:36
permalink: /article/rkyu7sio/
tags: 
  - pg
  - db
---

今天别人找到我，说系统访问不了了，一看截图内容，是数据连不上了；果断开始找日志文件， 结果日志功能没有开。

<!-- more -->

数据库掉了，但是之前没有开日志，这会也看不到是因为什么导致的，只有打开pg的日志功能，后面还有相同的问题的话，好排查错误。

`connection to server ad xxx, port2345 failed: server closed the connecton unexpectedly Tihs probably means the server terminated abnormally before or while processing the request.`



1 找到pg对应的配置文件，如果记不到，可以在运行pg的服务器上面执行如下指令，这个需要确保pg数据库在运行中。

```shell
# su postgres
# psql -c "show config_file"
               config_file               
-----------------------------------------
 /etc/postgresql/13/main/postgresql.conf
(1 row)
```

2 修改`postgresql.conf`文件中的参数

- `logging_collector = on`， 表示开启日志收集功能
- `log_destination = 'stderr'`，表示将日志输出到标准错误流
- `log_statement = 'ddl'`，设置日志的级别，可选的值有none， ddl， mod， all， ddl表示仅记录DDL语句，mod表示记录DDL和DML语句，all表示记录所有的sql语句

3 保存postgresql.conf之后进行重启 ` sudo systemctl restart postgresql`

4 我们可以在pg的数据目录下面找到一个log文件夹，输出的文件就在这里里面



---

什么是pg的数据目录， 这个在配置文件里面有说明，可以在文件的最上方 找到`data_directory = '/var/lib/postgresql/13/main'` 这个就是pg的数据目录。

