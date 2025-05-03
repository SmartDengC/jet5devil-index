---
title: Deque接口
createTime: 2025/05/03 15:52:16
permalink: /java/l19k3287/
tags:
  - java源码
---

Deque也是接口，继承自Queue接口类，在Queue的基础上定义了一些额外的方法。

接口类定义：

```java
public interface Deque<E> extends Queue<E>{

}
```

### 队列的方法

```java
void addFirst(E e); // 在头部添加元素，没有返回
void addLast(E e); // 在尾部添加元素，没有返回
boolean offerFirst(E e); // 在头部添加元素，返回添加是否成功
boolean offerLast(E e); // 在尾部添加元素，返回添加是否成功
E removeFirst();
E removeLast();
E pollFirst();
E pollLast();
E getFirst();  // 同removeFirst
E getLast(); // 同removeLast
E peekFirst();
E peekLast();
```

### 栈的方法

```java
void push(E e); // 在栈顶添加元素，等同于addFirst
E pop(); // 返回并删除栈顶元素，等同于removeFirst
```

### 集合的方法

```java
boolean remove(Object o); // 删除第一个遇到的元素
boolean contains(Object o); // 判断是否包含对象o
public int size();  // 返回元素个数
```
