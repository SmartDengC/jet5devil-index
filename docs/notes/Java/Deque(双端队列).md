---
title: Depue(双端队列)
author: 邓聪的小破站
createTime: 2024/06/14 12:49:22
permalink: /java/2zgsqd4a/
tags: 
  - java
  - java数据结构
---

Deque是一个双端队列接口，继承自Queue接口，Deque的实现类是LinkedList， ArrayDeque、LinkedBlockingDeque，其中LinkedList是最常用的。



<!-- more -->

## Deque三种用途

普通队列（一段进一段出）

Queue queue = new LinkedList(); 或者 Deque deque = new LinkedList();

双端队列（两段都可以进入）

Deque queue = new LinkedList();

堆栈

Deque deque = new LinkedList();



## 操作API

插入

插入头部：addFirst(e)， 插入尾部： addLast(e)

删除

删除头部：removeFirst()， 删除尾部：removeLast()

```java
Deque<Integer> st = new ArrayList<>();
st.isEmpty();  // 判断是否为空
st.pop();  // 获取栈顶元素，并出栈栈顶元素
st.push(e);   // 入栈元素
st.peek(); // 获取栈顶元素 不出栈
```













[【Java】Java双端队列Deque使用详解](https://blog.csdn.net/devnn/article/details/82716447)
