---
title: wc、head、sort
createTime: 2025/05/15 15:07:17
permalink: /linux/xufco7zm/
tags:
  - linuxCommand
---

Linux 中，`wc` 命令用于统计文件或标准输入的字数、行数、字符数等信息。通过与管道结合使用，可以快速分析文本文件的内容，常用于文本处理和数据分析中。

<!-- more -->

## 一、wc

在linux中，wc（word count）命令常用于计算文件的行数、字数和字节数，日常操作以及脚本编程中经常使用到。

### 1.1、常用参数

- -l，--lines：显示行数
- -w，--words：显示字数
- -m，--chars：显示字符数
- -c，--bytes：显示字节数
- -L，--max-line-length： 显示最长行的长度

### 1.2、不带参数

```shell
(base) ➜ gitee wc a.txt
     204     695    6286 a.txt
```

输出包含四项，分别代表：行数、字数、字节数、文件

### 1.3、带参数

计算行数：

```shell
(base) ➜ gitee wc -l a.txt
     204 a.txt
```

计算字数：

```shell
(base) ➜ gitee wc -w a.txt
     695 a.txt
```

计算字符数：

```shell
(base) ➜ gitee wc -m a.txt
    6286 a.txt
```

计算最长行：

```shell
(base) ➜ gitee wc -L a.txt
     160 a.txt
```

## 二、head

Linux head命令用于查看文件的开头部分的内容，有一个常用的参数-n用于显示行数，默认为10，即显示10行的内容。

### 2.1、基本参数

- -q 隐藏文件名
- -v 显示文件名
- -c<数目> 显示的字节数
- -n<行数> 显示的行数

```shell
head a.txt  // 显示文件前10行
head -n 10 a.txt // 如上
head -n 5 a.txt  // 显示文件前5行
```

### 2.2、配合管道符使用

```shell
ls | head -2  // 查看当前文件下前两个文件
```

## 三、sort

Linux sort命令用于将文本文件内容加以排序，sort可针对文本文件的内容，以行为单位来排序。

### 3.1、参数说明

- -n 依照数值的大小排序
- -r以相反的顺序来排序

```shell
sort a.txt
sort -nr a.txt
```

### 3.2、管道符

```shell
ls | sort -nr
```

