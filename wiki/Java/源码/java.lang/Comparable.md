---
title: Comparable
createTime: 2025/08/12 23:28:04
permalink: /java/r1rdga1k/
---

今天在写算法题的时候，遇到了需要给Map<Integer, Integer>的容器排序的情况，故此来学习回顾一下。



[Java Comparable和Comparator的区别](https://javabetter.cn/basic-extra-meal/comparable-omparator.html)

## 一、Comparable

源码：

```java
package java.lang;
import java.util.*;
public interface Comparable<T> {
    public int compareTo(T o);
}
```

Comparable是接口，类实现Comparable接口的话，需要重写compareTo()方法。
