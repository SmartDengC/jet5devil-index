---
title: HashSet
createTime: 2025/07/02 20:30:20
permalink: /java/n2vgk6jm/
---

今天来简单学习一下Set其中一个实现类。

HashSet：基于哈希表实现，具有快速的插入、删除和查找的操作，但是不保证元素的顺序。

```java
public int[] intersection(int[] nums1, int[] nums2) {
    Set<Integer> st = Arrays.stream(nums1).boxed().collect(Collectors.toSet());
    return Arrays.stream(nums2).filter(st::remove).toArray();
}
```

今天在做算法的时候，遇到这样一段代码，就是求两个数组的交集，在后面用到了set的remove方法。



## HashSet定义

```java
public class HashSet<E> extends AbstractSet<E> implements Set<E>, Cloneable, Serializable {}
```

## HashSet源码解析

### public boolean remove(Object o)

Set的remove方法用于删除Set集合中的指定元素。该方法返回值为boolean类型，如果Set集合中包含参数o指定的对象，则返回true，否则返回false。

这样也就解释了上面的问题，当`st::remove`返回`true`时，表示st中存在当前元素，因为filter值为true，所以保存下来了当前值。

```java
public boolean remove(Object o) {
    return this.map.remove(o) == PRESENT;
}
```
