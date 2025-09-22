---
title: 我在Java的时间里面迷迷糊糊
createTime: 2025/09/19 14:42:13
permalink: /java/9dkhq1sr/
---

遇到难题了，不会用Java的时间转换。



现在有许多的时间的对象，像是Date，LocalDateTime， LocalDate,  Calendar,  DateTime...各种各样的，有的是java提供的，像是Date 和LocalDate，还有的是第三方包提供的，比如像是Hutool的DateTime，如果实现流畅的切换，成了我现在要解决的问题。



## 一、对时间的基本了解

### 1.1、Hutool DateTime

Hutool的DateTime是继承自Java的Date对象，所以使用DateTime的地方，都可以使用Date，看是否满足里氏替换原则（LSP）：所有引用基类的地方必须可以使用其子类对象。

```java
public class DateTime extends Date {}
```

所以在一些下面两种情况都是可以的：

```java
DateTime dateTime = DateUtil.date();
Date date = DateUtil.date();
```



## 二、问题合集，问问自己能写出来相关代码吗？

### 2.1、DateTime与LocalDateTime转换

```java
Date date = new Date();
// DateTime与LocalDateTime转换
LocalDateTime localDateTime = DateUtil.toLocalDateTime(date);
DateTime dateTime = new DateTime(localDateTime);
```

