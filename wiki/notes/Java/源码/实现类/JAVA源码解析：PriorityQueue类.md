---
title: 读：PriorityQueue类
createTime: 2025/05/03 18:08:46
permalink: /java/f5wt3h1s/
tags:
  - java源码
---

## 一、优先级队列基础信息了解

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

LinkedList实现了多个接口，暂时先放一放，我们先来学习优先级队列，就是PriorityQueue类

类定义：

```java
public class PriorityQueue<E> extends AbstractQueue<E> implements java.io.Serializable{
  // 初时大小为11
  private static final int DEFAULT_INITIAL_CAPACITY = 11;
}
```

### 二、PriorityQueue源码解读

### public PriorityQueue()

```java
// 无参构造，默认初时大小DEFAULT_INITAL_CAPACITY
public PriorityQueue() {
    this(DEFAULT_INITIAL_CAPACITY, null);
}
// 自定义初时大小 initCapacity
public PriorityQueue(int initialCapacity) {
    this(initialCapacity, null);
}
// 创建时传入一个comparator
public PriorityQueue(Comparator<? super E> comparator) {
    this(DEFAULT_INITIAL_CAPACITY, comparator);
}
// 传入初时大小和一个comparator
public PriorityQueue(int initialCapacity,Comparator <? super E> comparator) {
    // Note: This restriction of at least one is not actually needed,
    // but continues for 1.5 compatibility
    if (initialCapacity < 1)
        throw new IllegalArgumentException();
    this.queue = new Object[initialCapacity];
    this.comparator = comparator;
}
```

PriorityQueue默认时小顶堆，也可以创建成大顶堆，比如：` Queue<Integer> q = new PriorityQueue<>((a, b) -> b - a);`

### private void grow(int minCapacity)

实现队列的扩容

```java
private void grow(int minCapacity) {
    int oldCapacity = queue.length;
    // Double size if small; else grow by 50%
  	// 如果旧容量小于64，容量就增加oldCapacity + 2, 否则的话就增加 oldCapacity / 2
    int newCapacity = oldCapacity + ((oldCapacity < 64) ? (oldCapacity + 2): (oldCapacity >> 1));
    // overflow-conscious code
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    queue = Arrays.copyOf(queue, newCapacity);
}
// 防止容量溢出
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

### public boolean add(E e)

直接调用offer的方法

```java
public boolean add(E e) {
    return offer(e);
}
```

### public boolean offer(E e)

```java
    public boolean offer(E e) {
        if (e == null)
            throw new NullPointerException();
        modCount++;
        // size表示当前队列的大小
        int i = size;
        // 如果i大于或等于queue.length 就表示需要扩容
        if (i >= queue.length)
            grow(i + 1);
        // size先加一
        size = i + 1;
        if (i == 0)
            queue[0] = e;
        else
          	// 将元素e放到堆合适的位置
            siftUp(i, e);
        return true;
    }
    private void siftUp(int k, E x) {
        if (comparator != null)
          	// 当比较器不为空的时候
            siftUpUsingComparator(k, x);
        else
            siftUpComparable(k, x);
    }

    @SuppressWarnings("unchecked")
    private void siftUpComparable(int k, E x) {
        Comparable<? super E> key = (Comparable<? super E>) x;
        while (k > 0) {
            int parent = (k - 1) >>> 1;
            Object e = queue[parent];
            if (key.compareTo((E) e) >= 0)
                break;
            queue[k] = e;
            k = parent;
        }
        queue[k] = key;
    }

    @SuppressWarnings("unchecked")
    private void siftUpUsingComparator(int k, E x) {
        while (k > 0) {
          	// 堆是完全二叉树，获取到父节点位置，相当于(k-1)/2,
            int parent = (k - 1) >>> 1;
            Object e = queue[parent];
          	// 与父节点相比，如果小于父节点，就调整两个元素的位置，称之为上滤
            if (comparator.compare(x, (E) e) >= 0)
                break;
            queue[k] = e;
            k = parent;
        }
        queue[k] = x;
    }
```

- << 表示左移运算符，例如8<<1，表示将8左移一位，低位补0，结果为16
- \>\>表示右移运算符，例如8>>1, 表示将8右移一位，高位补0， 结果为4
- \>\>\>表示无符号右移运算符，高位补0
  - 正数的左右移管它是有符号还是无符号，直接在原码的基础上移动，并求结果就好
  - 负数的左右移区别在有符号和无符号左右移动
    - 有符号的左右移：第一步求出负数的补码，第二步将补码左右移动，第三步高位不变其余取反，最后一位在加1
    - 无符号的左右移：第一步求出负数的补码，第二步将补码左右移，第三步直接求结果。

### public E peek()

只返回队首的元素。

```java
public E peek() {
    return (size == 0) ? null : (E) queue[0];
}
```

### public boolean remove(Object o)

删除指定元素，为了保持堆的特性，会自动调整元素的位置。

```java
    // 循环获取到元素o所在的下标i，如果不存在元素o，直接返回-1
    private int indexOf(Object o) {
        if (o != null) {
            for (int i = 0; i < size; i++)
                if (o.equals(queue[i]))
                    return i;
        }
        return -1;
    }

    public boolean remove(Object o) {
      	// 获取到元素的下标，不存返回-1
        int i = indexOf(o);
        if (i == -1)
            return false;
        else {
          	// 删除元素并调整剩下元素位置
            removeAt(i);
            return true;
        }
    }
    private E removeAt(int i) {
        // assert i >= 0 && i < size;
        modCount++;
        int s = --size;
        if (s == i) // removed last element
            queue[i] = null;
        else {
            E moved = (E) queue[s];
            queue[s] = null;
            siftDown(i, moved);
            if (queue[i] == moved) {
                siftUp(i, moved);
                if (queue[i] != moved)
                    return moved;
            }
        }
        return null;
    }
```

### public boolean contains(Object o)

判断是否存在元素o，通过循环返回下标来实现，indexOf不等于-1就表示存在元素。

```java
public boolean contains(Object o) {
    return indexOf(o) != -1;
}
```

### public Object[] toArray()

```java
public Object[] toArray() {
    return Arrays.copyOf(queue, size);
}
```

### public E poll()

如果队列为空，直接返回null；如果不为空，先获取到对首的元素queue[0]，然后将队列最后一个元素通过临时变量保存，把queue[s]置为空，然后在通过下滤操作实现队序性，siftDown(0, x)，就是把刚才提出来的最后一个元素放到对首之后，保持堆性质。

```java
public E poll() {
    if (size == 0)
        return null;
    int s = --size;
    modCount++;
    E result = (E) queue[0];
    E x = (E) queue[s];
    queue[s] = null;
    if (s != 0)
      	// 时间复杂度O(logN)
        siftDown(0, x);
    return result;
}
```

## 三、在算法中优先级队列的使用

### [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)（20250503更新）

> 给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

简单来说就是返回出现频率前k的数组。通过优先级队列的队序性，对数组元素出现次数进行排序。

:::code-tabs

@tab Java

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> mp = new HashMap<>();
        for (int x : nums) {
            mp.merge(x, 1, Integer::sum);
        }
        // 用小顶堆，把大的元素留下来
        PriorityQueue<int[]> q = new PriorityQueue<>(k, (a, b) -> {
            return a[1] - b[1];
        });
        for (Map.Entry<Integer, Integer> entry : mp.entrySet()) {
            int num = entry.getKey(), cnt = entry.getValue();
            // 判断队顶元素是否需要poll
            if (q.size() == k) {
                if (q.peek()[1] < cnt) {
                    q.poll();
                    q.offer(new int[] { num, cnt });
                }
            } else {
                q.offer(new int[] { entry.getKey(), entry.getValue() });
            }
        }

        int[] ans = new int[k];
        for (int i = 0; i < k; i++) {
            ans[i] = q.poll()[0];
        }
        return ans;

    }
}
```

@tab Python

```python

```

:::
