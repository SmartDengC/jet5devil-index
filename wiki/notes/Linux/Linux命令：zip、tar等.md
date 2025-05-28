---
title: zip、tar
createTime: 2025/05/24 21:13:47
permalink: /linux/8nxojefa/
tags:
  - linuxCommand
---


这里主要记录linux压缩和解压相关的命令



## 一、zip

zip命令最简单的使用方法就是：

```shell
zip archive.zip file.txt  // 压缩单个文件
zip archive.zip file1.txt file2.txt // 压缩多个文件
```

下面简单举几个例子说明

```shell
zip -r archive.zip dir_name  // 压缩一个目录以及所有的子目录文件
```

- -r：递归压缩文件夹

```shell
zip -r archive.zip dir_name -x "*.log"  // 压缩dir_name目录下除了以log结尾的文件
```

- -x：排除文件（不压缩进去）

```shell
zip -u archive.zip file.txt  // 更新压缩文件，将file.txt压缩到archive.zip文件下
```

- -u：更新压缩文件

```shell
zip -l archive.zip // 查看压缩文件的内容
```

- -l：列出文件内容

```shell
zip -9 archive.zip file.txt file.txt // 指定压缩级别，-0为无压缩，-9为最高压缩
```

- -0：无压缩
- -9：最高压缩

```shell
zip -qm dist.zip dist
```

- -q：表示quiet，即静默模式，执行压缩时不会显示额外的输出信息，只有在错误时才会显示信息
- -m：表示move，将原始文件移动到压缩文件中，而不是仅仅复制，这意味这压缩文件会包含所有文件的内容，但原始文件会被删除。

## 二、unzip

unzip解压zip文件的命令

```shell
unzip archive.zip // 解压到当前文件
unzip -d /tmp archive.zip // 解压到指定目录/tmp下面
```

- -d：指定将解压后的文件存放目录

```shell
unzip -n -d /tmp archive.zip // -n 表示不覆盖存在的命令
```

- -n：不覆盖存在的文件

```shell
unzip -l archive.zip  // 查看一下压缩文件里面有哪些文件，不解压
```

- -l：列出文件内容

```shell
unzip -t archive.zip // 查看压缩文件是否受损
```

- -t：检查文件是否受损

```shell
unzip -o -d /tmp archive.zip // 将文件解压到/tmp目录，如果存在相同文件，要求覆盖存在的文件
```

- -o：覆盖存在的文件