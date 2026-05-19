---
title: AtomicInteger
createTime: 2025/06/16 19:02:22
permalink: /java/re78hyde/
---

[Atomic 原子类总结](https://javaguide.cn/java/concurrent/atomic-classes.html)

基本类型原子类

- AtomicInteger：整型原子类
- AtomicLog：长整型原子类
- AtomicBoolean：布尔型原子类



上面三个类提供的方法几乎相同，以AtomicInteger为例说明。



常用方法：

```java
public final int get();
public final int getAndSet(int newValue);
public final int getAndIncreament();  // 获取当前值，并自增
public final int getAndDecrement();
public final int getAndAdd(int delta);  // 获取当前值并加上预期值
boolean compareAndSet(int exepct, int update); // 如果输入等于预期值
public final void lazySet(int newValue);  // 最终设置为newValue
```

