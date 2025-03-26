---
title: 忘记了MySql的密码该怎么办？
createTime: 2025/01/02 16:28:02
permalink: /article/mi7mm21e/
tags:
  - mysql
---

忘记了MySql的密码该怎么办？

<!-- more -->

## 一、知道密码修改密码

知道密码的话，登陆到mysql的命令行里面去，执行下面语句：

方法一：

```shell
mysql> alter user 'root'@'localhost' identified by '123';
```

方法二：

```shell
mysql> set password for 'root'@'localhost'=password('123');
```

记得最后刷新权限：

```shell
mysql> flush privileges;
```

## 二、忘记密码修改密码

不知道密码的话，我们先要跳过mysql的密码验证，然后在设置密码，最后在把跳过密码验证去掉

### 2.1、设置mysql跳过密码验证

打开mysql的配置文件my.cnf，

```
vi /etc/mysql/my.cnf
```

在mysqld下面添加skip-grant-tables

```mysql
[mysqld]
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
datadir         = /var/lib/mysql
secure-file-priv= NULL
default_authentication_plugin = mysql_native_password
character-set-server = utf8
collation-server = utf8_general_ci
init-connect='SET NAMES utf8'
skip-character-set-client-handshake
max_allowed_packet=500M
skip-grant-tables
```

然后重启mysql， 我是用的docker， 直接 `docker restart mysql`

### 2.2、修改对应用户密码

然后就可以使用 `mysql -uroot -p` 直接回程进到命令行里面。

```shell
mysql> select user from user;
+----------+
| user     |
+----------+
| dengcong |
| root     |
+----------+
2 rows in set (0.00 sec)

mysql> update user set authentication_string="123" where user="root";
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

修改完了之后在把上面的`skip-grant-tables`注释调，然后重启，mysql就可以用密码登录了。

过程中出现这个问题，参考下面文章，修改之后重启一下：

[【Navicat 1130】Navicat远程连接数据库 出现 1130- Host xxx is not allowed to connect to this MySQL server错误](https://blog.csdn.net/qq_42774234/article/details/124337976)

[解决ERROR 1819 (HY000): Your password does not satisfy the current policy requirements](https://www.cnblogs.com/baby123/p/12221405.html)
