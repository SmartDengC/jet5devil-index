---
title: Collections
createTime: 2025/05/06 09:47:33
permalink: /java/ecsunld6/
---

## 一、Collections方法源代码

### public static \<T extends Comparable<? super T>> void sort(List\<T> list)

排序方法，底层使用的是列表的排序方法，可以传入一个Comparator的参数。

相同方法：

`public static <T> void sort(List<T> list, Comparator<? super T> c)`

```java
public static <T extends Comparable<? super T>> void sort(List<T> list) {
    list.sort(null);
}
```

### public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)

循环比较，也可以传入比较器

```java
public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) {
    Iterator<? extends T> i = coll.iterator();
    T candidate = i.next();

    while (i.hasNext()) {
        T next = i.next();
        if (next.compareTo(candidate) > 0)
            candidate = next;
    }
    return candidate;
}
```

### public static final \<T> List\<T> emptyList()

返回一个空的不可变的list，这个list是一个内部类的对象。

同理的还有emptyMap， emptySet

```java
public static final Set EMPTY_SET = new EmptySet();
public static final List EMPTY_LIST = new EmptyList();
public static final Map EMPTY_MAP = new EmptyMap();

public static final < T > List < T > emptyList() {
    return EMPTY_LIST;
}

private static class EmptyList < E > extends AbstractList < E > implements RandomAccess, Serializable {
    private static final long serialVersionUID = 8842843931221139166 L;
    private EmptyList() {}
}

private static class EmptyMap < K, V > extends AbstractMap < K, V > implements Serializable {
    private static final long serialVersionUID = 6428348081105594320 L;
    private EmptyMap() {}
}

private static class EmptySet < E > extends AbstractSet < E > implements Serializable {
    private static final long serialVersionUID = 1582296315990362920 L;
    private EmptySet() {}
}
```



排序：

- sort

查找：

- binarySearch

最大值最小值

- max
- min



## 二、所遇问题

### 1、为什么`Arrays.asList()`提示我要用`Collections.singletonList()`替换？

通过Arrays.asList()源码我们可以看到，Arrays.asList()返回的是一个内部类的对象，其默认的存储长度是10，浪费 存储空间；singletonList的话，其参数只有一个元素，因此可以做到分配内存最小化。

Arrays.asList(o)返回对象只能调用set方法，不能调用add方法；Collections.singletonList(o)返回值即不能调用add方法，也不能调用set方法。

