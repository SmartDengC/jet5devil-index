---
title: ubuntu系统创建用户及赋予权限
author: 阿聪小破站
createTime: 2024/02/05 11:25:06
permalink: /article/cuwyuo5e/
tags: 
  - ubuntu
  - linux_server
---

今天阿里云给我推送了一条消息，说是有优惠，然后我就购买了一台便宜的服务器，正好也有这个计划，就购买了。

现在就是简单的构建。

首先需要做的就是创建一个自己使用的角色，平常用 root 来没啥问题，我们还是正规一点，当做线上服务器来用，创建一个用户，那我们开始吧。

## 1、创建新用户

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# sudo useradd -r -m -s /bin/bash dengc4r
```

其中参数的意义如下：

- -r 建立系统账号
- -m 自动建立用户的登入目录
- -s 指定用户登入后所使用的 shell

这个时候我们`ls /home` 就可以看到创建的用户目录了。

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# ls /home/
dengc4r
```

## 2、在 ubuntu18.04 中不会在创建用户的时候自动提示设置密码，需要手动执行

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# sudo passwd dengc4r
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

## 3、修改用户权限（添加 root 权限）

这里采取修改`/etc/sudoers`文件的方式来分配用户权限，因为文件只有只读权限，在改动之前我们需要增加修改权限，改动之后，在去掉修改权限

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# sudo chmod +w /etc/sudoers
root@iZ2vc34h4mxsxearc36g2yZ:~# vim /etc/sudoers
root@iZ2vc34h4mxsxearc36g2yZ:~# sudo chmod -w /etc/sudoers
```

修改成如下内容：

```shell
# User privilege specification
root    ALL=(ALL:ALL) ALL
dengc4r ALL=(ALL:ALL) ALL
```

这个时候我们的用户就创建成功了。

## 4、增加用户到某个用户组里（可选）

在创建完用户之后，系统会默认创建一个和用户名一样额用户组，这里我想新建用户组，然后将用户添加进来。

### 新建用户组

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# groupadd self  // self为用户组名
```

### 添加用户到用户组

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# usermod -g self dengc4r  // dengc4r为用户名
```

这个时候我们用`id dengc4r`就可以看到用户的信息。uid 为用户 id， groups 表示用户组的 id

```
uid=999(dengc4r) gid=1000(self) groups=1000(self)
```

## 5、补充

1、 这里额外说一个点，就是`su dengc4r` 和`su - dengc4r`之间有什么区别，区别就是使用`su - dengc4r`会默认进入到当前用户的家目录，如果不带 `- `的话默认是进入到`/root`目录

2、查看存在的用户组

```shell
dengc4r@iZ2vc34h4mxsxearc36g2yZ:~$ cat /etc/group
dengc4r:x:999:
self:x:1000:
```

3、查看用户信息

dengc4r 为用户名， x 表示密码，999 表示用户 id， 1000 表示用户组 id，`/home/dengc4r`是用户 home 目录， `/bin/bash`是 shell 命令所在的目录

```shell
dengc4r@iZ2vc34h4mxsxearc36g2yZ:~$ cat /etc/passwd | grep dengc4r
dengc4r:x:999:1000::/home/dengc4r:/bin/bash
```

参考：

[ubuntu 下添加新用户（详细教程）](https://blog.csdn.net/BigData_Mining/article/details/104986203)
