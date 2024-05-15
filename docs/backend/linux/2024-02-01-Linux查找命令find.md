---
title: Linux查找命令find
author: 阿聪小破站
createTime: 2024/02/01 13:29:40
permalink: /article/13aje4is/
tags: 
  - linux
---

作为后端开发者，了解 linux 的一些简单操作还是很有必要的，因为不是所有的地方都会有服务器运维的人员的，这个时候就需要自己来了。
今天就简单的聊一下find这个命令在日常工作中的一些简单用途

- 磁盘占用100%时查找占用空间比较大的文件
- 在目录下找到指定内容的文件

## 一、磁盘占用100%时查找占用空间比较大的文件

其实很多时候，你需要了解的当前系统下存在哪些大文件，如果超多 1G 或者 100M 的文件；那么如何把这些大文件搜索出来呢？

下面命令我们只能看到超过 800M 大小的文件名称，但是对文件的详细信息一无所知。

`find . -type f -size +800M` 



当我们只需要找到超过 800M 的文件，并显示查找出来的文件的具体大小的时候，可以用下面命令：

`find . -type f -size +800M -print0 | xargs -0 du -h`



如果我们需要对查找的结果按照文件的大小排序，那么可以使用下面命令
`find . -type f -size +800M -print0 | xargs -0 du -h | sort -nr`

### 1.1如何查找 Linux 下的大目录

有的时候我们需要看下那个目录占用的总空间大， 我们用 `ls -alh` 只能看到当前一层的大小，我们可以用 du 来实现， 这里有一个--max-depth 的参数，就是只输出一层记录：`du -h --max-depth=1`
如果想要排序可以加上 sort -n 的参数， 例如`du -h --max-depth=1 | sort -nr `  r表示从小到大输出

## 二、在目录下找到指定内容的文件

这个时候我们需要在文件的内部进行搜索，这个使用使用find就很好。

`find ./ -name '*' -type f | xrags grep "hello world"`

大概得意思就是搜索当前目录下，类型是文件的所有文件，输出包含hello world文本的文件。

## 三、扩展内容说明

### 3.1 find 扩展说明

```shell
# 在某个路径下查找文件。在/etc下查找'*.log'的文件
find /etc -name '*.log'
# 扩展：列出某个路径下所有的文件，包括子目录
find /etc -name '*'
# find 使用正则表达式
find ./ -name '[a-z][0-9].log'
find ./ -type d(f)
find ./ -size +800M
```

### 3.2 find -print0 和 xargs -0 原理及用法

我们为什么要配套使用 `-print0` 和 `xargs -0`?

 有些文件名称中间是带有空格的，这样的话原本的find就会看成是两个文件，但是它是一个文件。

```shell
(base) ➜ a find . -name '*.log'
./file a.log
(base) ➜ a find . -name '*.log'  | xargs rm
rm: ./file: No such file or directory
rm: a.log: No such file or directory
(base) ➜ a find . -name '*.log'  -print0 | xargs -0 rm
```

---

我们单独使用find的时候，find会在输出的每一条结果后面加一个`\n`，就是加一个换行符，这样我们看到的才是一行一行的，比如这样：

```shell
(base) ➜ guide (dev0) ✗ find . -name '*' -type f
./ubuntu系统创建用户及赋予权限.md
./2024-3-21-整合三个项目的过程和思路.md
./2024-01-31-Nginx详解.md
./2024-01-19-UWSGI线上优化.md
```

但是这样我们不好处理，所以使用`-print0`将输出的内容置换到一行，本质上`-print0`是在每一行后面添加NULL字符，而不是换行符：

```shell
(base) ➜ guide (dev0) ✗ find . -name '*' -type f -print0
./ubuntu系统创建用户及赋予权限.md./2024-3-21-整合三个项目的过程和思路.md./2024-01-31-Nginx详解.md./2024-01-19-UWSGI线上优化.md
```

然后`xargs -0` 表示 xargs 用 NULL 来作为分隔符。这样前后搭配就不会出现空格和换行符的错误。选择 null 作为分隔符，是因为一般编程语言把 NULL 作为字符串结束的标志，所以文件不可能以 NULL 结尾，这样确保万无一失。

---
