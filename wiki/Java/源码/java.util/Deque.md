---
title: Deque
createTime: 2025/05/03 15:52:16
permalink: /java/l19k3287/
tags:
  - java源码
---

Deque也是接口，继承自Queue接口类，在Queue的基础上定义了一些额外的方法，Deque是双端队列的接口，可以在对首或者队尾添加元素。

## 一、Deque基础信息

接口类定义：

```java
public interface Deque<E> extends Queue<E>{

}
```

### 1.1、队列的方法

```java
void addFirst(E e); // 在队列头部添加元素，没有返回，如果队列已满，会抛出IllegalStateException
void addLast(E e); // 在尾部添加元素，没有返回，对于普通队列，相当于add(e)
boolean offerFirst(E e); // 在头部添加元素，返回添加是否成功，不会抛出异常
boolean offerLast(E e); // 在尾部添加元素，返回添加是否成功，不会抛出异常
E removeFirst();  // 移除并返回队列头部的元素，队列为空抛出异常NoSuchElementException
E removeLast();  // 移除并返回队列尾部的元素，队列为空抛出异常NoSuchElementException
E pollFirst();  // 移除并返回队列头部的元素
E pollLast();  // 移除并返回队列尾部的元素
E getFirst();  // 同removeFirst
E getLast(); // 同removeLast
E peekFirst();  
E peekLast();
```

### 1.2、栈的方法

```java
void push(E e); // 在栈顶添加元素，等同于addFirst
E pop(); // 返回并删除栈顶元素，等同于removeFirst
```

### 1.3、集合的方法

```java
boolean remove(Object o); // 删除第一个遇到的元素
boolean contains(Object o); // 判断是否包含对象o
public int size();  // 返回元素个数
```

## 二、Deque简单说明

Deque是一个双端队列接口，继承自Queue接口，Deque的实现类是LinkedList， ArrayDeque、LinkedBlockingDeque，其中LinkedList是最常用的。

### Deque三种用途

- 普通队列（一端进一端出）

```java
Queue queue = new LinkedList();  // 使用offer, add, poll, remove, peek
Deque deque = new LinkedList();  // 相同的使用offerLast, pollFirst等方法
```

- 双端队列（两端都可以进入）

```java
Deque queue = new LinkedList();  // 使用offerFirst， offerLast, pollFirst, pollLast等方法
```

- 堆栈

```java
Deque deque = new LinkedList();  // 使用push、pop, peek等方法
```

#### 操作API

插入头部：addFirst(e)， 插入尾部： addLast(e)

删除头部：removeFirst()， 删除尾部：removeLast()

```java
Deque<Integer> st = new ArrayList<>();
st.isEmpty();  // 判断是否为空
st.pop();  // 获取栈顶元素，并出栈栈顶元素
st.push(e);   // 入栈元素
st.peek(); // 获取栈顶元素 不出栈
```

[【Java】Java双端队列Deque使用详解](https://blog.csdn.net/devnn/article/details/82716447)
