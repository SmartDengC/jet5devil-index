---
title: Queue接口
createTime: 2025/05/03 15:36:36
permalink: /java/nu58hexo/
tags:
  - java源码
---

今天了解一下队列相关的接口和实现类的代码。

Deque是一个双端队列接口，继承自Queue接口，Deque的实现类有LinkedList，ArrayDeque，其中LinkedList是最常见的。

## 一、Queue接口

我们都知道队列是一种先进先出的数据结构。

接口定义：

```java
public interface Queue<E> extends Collection<E>{

}
```

方法定义：

```java
boolean add(E e); // 在队尾添加元素
boolean offer(E e);  // 在队尾添加元素
E remove();  // 返回队首元素并删除，不同于poll的是，当队列为空时，remove会抛出异常
E poll(); // 返回队首元素并删除，当队列为空时返回null
E element(); // 仅返回队首元素，和peek不同的是，当队列为空时，element会抛出异常
E peek(); // 仅返回对首元素，当队列为空时，返回null
```
