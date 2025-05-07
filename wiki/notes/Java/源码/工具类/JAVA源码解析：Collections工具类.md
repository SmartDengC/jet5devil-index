---
title: 读：Collections工具类
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

排序：

- sort

查找：

- binarySearch

最大值最小值

- max
- min

