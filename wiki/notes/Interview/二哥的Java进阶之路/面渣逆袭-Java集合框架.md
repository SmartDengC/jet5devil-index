---
title: 面渣逆袭-Java集合框架
createTime: 2025/08/05 00:09:05
permalink: /interview/lj5rei0h/
---

[面渣逆袭-Java集合框架](https://javabetter.cn/sidebar/sanfene/collection.html)



## 引言

### 1、说说有哪些常见的集合框架？

- 推荐阅读：[二哥的 Java 进阶之路：Java 集合框架](https://javabetter.cn/collection/gailan.html)
- 推荐阅读：[阻塞队列 BlockingQueue](https://javabetter.cn/thread/BlockingQueue.html)。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/collection/gailan-01.png)





### 2、ArrayList和LinkedList有什么区别？

底层实现的数据结构不同。

他两个特点，ArrayList利于查询， LinkedList利于增删





## Map

### 8、能说一下HashMap的底层数据结构吗？

推荐阅读：[二哥的 Java 进阶之路：详解 HashMap](https://javabetter.cn/collection/hashmap.html)

JDK8中，HashMap的数据结构是： 数组+链表+红黑树

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/collection-8.png)

数组用来存储键值对，每个键值对可以通过索引直接拿到，索引是通过对键的哈希值进行进一步的hash()处理得到的。

当多个键经过哈希处理后得到相同的索引时，需要通过链表来解决哈希冲突-将具有相同索引的键值对通过链表存储起来。

不过，链表过长时，查询效率会比较低，于是当链表长度超过8（且数组的长度大于64），链表就会转化成红黑树，红黑树的查询效率是O(logn)，比链表的O(n)要快。

HashMap的初始容量是16，map扩容，阈值capacity * loadFactor， capacity为容量，loadFactor为负载因子，默认是0.75，扩容的数组大小是原来的2倍，然后把原来的元素重新计算哈希值，放到新的数组里面。
