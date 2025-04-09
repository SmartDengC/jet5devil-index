---
title: Java知识点｜Stream流
author: 邓聪的小破站
createTime: 2024/09/06 15:28:22
permalink: /java/cf5jpw4k/
tags: 
  - java
  - stream
---

快速简单学习使用Java8提供的新特性：Stream。

[Java 8 stream的详细用法](https://blog.csdn.net/y_k_y/article/details/84633001)



## 一、了解Stream内部的基本流程





## 二、Stream实例说明

### 问：java列表对象， 需要对某一个字段进行排序，但是这个字段里面有一些会存在空值的情况。处理代码如下：

```java
batches.sort(Comparator.comparing(TCutBatch::getDaySeq, Comparator.nullsFirst(Integer::compareTo)).thenComparing(TCutBatch::getCreateTime).reversed());
```

`Compartor.comparing(TCutBatch::getDaySeq)`对dayseq字段进行排序，`Compartor.nullsFirst(Integer::compareTo)`表示如果有空值的话就放到列表的首位； `.themComparing(TCutBatch::getCreateTime)`先根据dayseq排序，在根据createTime排序，最后在反转数据。

### 问：java列表转字典的时候，如果存在相同的key的话，就会出现多个value值的报错。

处理这个问题一般有三种方式，一个是用那个值，第二个就是将所有值进行合并， 第三个就是value用列表来存。

```java
reportSegmentCells.stream().collect(Collectors.toMap(
		TReportSegmentCell::getCellId, Function.identity(), (v1,v2)->{return v1;}
));
```

`(v1,v2)->{retur v1;}`表示用前值；`(v1,v2`)->{return v2;}`就表示用后值覆盖前值。

### 问：从对象列表中获取到某个属性集合，并去重

```java
List<Long> equModelIdList = equList.stream()
                .map(TEqu::getEquModelId).distinct().collect(Collectors.toList());
// .map() 获取到所有的属性值
// .distinct() 去重
// .collect() 转成对应结构
```

### 问：获取数组的最小值，获取数组不同值的个数

```java
int min = Arrays.stream(nums).min().getAsInt();
int distinceCount = (int) Arrays.stream(nums).distinct().count();
```

