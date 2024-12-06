---
title: 深入理解Java队列Queue
author: 邓聪的小破站
createTime: 2024/03/04 12:48:09
permalink: /java/19q0m2sx/
tags: 
  - java
  - java数据结构
---

## PriorityQueue(优先级队列)

今天抽空来学习一下java里面的优先级队列，在很多竞赛题里面，如果使用java作为解题语言的话，就需要用到这个数据结构相关的API

翻译过来就是优先级队列，本质上是一个堆，默认情况下堆顶每次都保留最小值，每次插入一个元素，仍动态维护堆顶为最小值，我们可以叫这个堆为小顶堆，相反的，还有堆顶为最大值的情况，这种叫做最大堆。

### 初始化

> PriorityQueue() 使用默认的初始容量（11）创建一个PriorityQueue，并根据其自然顺序对元素进行排序

```java
PriorityQueue<Integer> queue = new PriorityQueue<>();
```

### 常用函数

```java
PriorityQueue<Integer> queue = new PriorityQueue<>();
queue.add(E e);  // 将指定的元素插入到队列里面
queue.clear();  // 清空队列
queue.contains(Object o); // 是否包含元素，如果包含指定元素返回true
queue.offer(E e);  // 将指定元素插入到优先队列
queue.peek(); // 获取第一个元素，及最小或者最大元素
queue.poll();  // 获取并移除第一个元素
queue.size();  // 返回元素个数
```

### 实现大根堆的两种方式

因为java中的优先队列默认是小根堆，要实现大根堆可以用一下两种方式：

1、使用自定义比较器

2、将所有的数据变为之前自身的负数之后在插入，因为添加负号就相当于逆序了， 1<2<3 -> -1>-2>-3

```java
import java.util.PriorityQueue;
public class SelfPriorityQueue {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        for(int i=0;i<10;i++){
            queue.add(-i);  // 保存的时候取反
        }
        int size = queue.size();
        for(int i=0;i<size;i++){
            System.out.print(-queue.poll()+", ");  // 输出的时候也取反，这样就能从大到小的输出了
        }
    }
}
// 输出： 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 
```



## Duque(双端队列)

Deque是一个双端队列接口，继承自Queue接口，Deque的实现类是LinkedList， ArrayDeque、LinkedBlockingDeque，其中LinkedList是最常用的。

### Deque三种用途

普通队列（一段进一段出）

Queue queue = new LinkedList(); 或者 Deque deque = new LinkedList();

双端队列（两段都可以进入）

Deque queue = new LinkedList();

堆栈

Deque deque = new LinkedList();

#### 操作API

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
