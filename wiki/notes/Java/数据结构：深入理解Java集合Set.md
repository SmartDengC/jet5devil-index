---
title: 深入理解Java集合Set
createTime: 2024/12/06 11:31:35
permalink: /java/hdipp844/
tags:
  - java
  - set
---

[关于java集合，你看这一篇就够了，由浅到深给你讲的明明白白！](https://segmentfault.com/a/1190000039853210)

Java的集合可以和List放到一起将，他们两个都继承自Collection。（单列集合Collection， 双列集合Map）

List的特点是有序，但是可重复；Set的特点就是无序，但是不能重复。

Set有三个实现类，分别是HashSet、LinkedSet、TreeSet。

Collection存在的API：

size(), isEmpty(), contains(), toArray(), add(), remove(), containsAll(), addAll(), removeAll(), clear(), equals(), hashCode()

上面的这些API，List和Set都是存在的，但是List和Set有一些他们单独的API

### HashSet

HashSet根据对象的哈希值来确定元素集合中存储的位置，因此具有良好的存取和查找性能。

HashSet集合中添加元素时，先调用hashcode方法来确定元素的存储位置，然后在调用元素对象的equal方法来确保该位置没有重复的元素。

### TreeSet

TreeSet则以二叉树的方式来存储元素，他可以实现对集合元素的排序。

TreeSet采用平衡二叉树来存储元素， 这样的结构可以保证TreeSet集合中没有重复的元素，且可以排序。集合中的元素在进行比较是，都是调用compareTo()方法，该方法是Comparable定义的。在向TreeSet传入自定义数据时，没有实现Comparable接口，为了解决这个问题，java提供了两种方式分别为自然排序和定制排序。

```java
// 倒叙
TreeSet<Integer> integers = new TreeSet<>((v1, v2) -> v2 - v1);
```



