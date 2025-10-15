---
title: List
createTime: 2025/05/04 11:11:56
permalink: /java/6qyuqzwz/
tags:
  - java源码
---

今天来学习一下List接口的源码。

List接口继承自Collection接口。

```java
public interface List<E> extends Collection<E> {
}
```

## 一、Collection接口

```java
public interface Collection <E> extends Iterable <E> {
    int size();
    boolean isEmpty();
    boolean contains(Object o);
    Object[] toArray(); 
  	<T> T[] toArray(T[] a); // 这个方法不确定
    boolean add(E e);
    boolean remove(Object o);
    boolean containsAll(Collection<?> c);
    boolean addAll(Collection<? extends E> c);
    boolean removeAll(Collection<c> c);
    void clear();
    boolean equals(Object o);
    int hashcode();
  	// 创建流
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
    default Stream<E> parallelStream() {
        return StreamSupport.stream(spliterator(), true);
    }
}
```

## 二、List接口

List接口继承自Collection接口，有许多接口定义相同。

```java
public interface List<E> extends Collection<E> {
    int size();
    boolean isEmpty();
    boolean contains(Object o);
    Object[] toArray();
    boolean add(E e);
    boolean remove(Object o);
    boolean containsAll(Collection<?> c);
    boolean addAll(Collection<? extends E > c);
    // index表示开始插入的位置
    boolean addAll(int index, Collection<? extends E> c);
    boolean removeAll(Collection<?> c);
    // 仅保留此列表中包含在指定集合中的元素，从该列表中删除指定集合中未包含的所有元素，简单来说就是求交集。
    boolean retainAll(Collection<?> c);
  	// 排序方法
    default void sort(Comparator<? super E> c) {
        Object[] a = this.toArray(); // 获取到元素
        Arrays.sort(a, (Comparator) c); // Arrays.sort排序
        ListIterator<E> i = this.listIterator();
        for (Object e: a) {
            i.next();
            i.set((E) e);
        }
    }
  	void clear();
  	boolean equals(Object o);
  	int hashcode();
  	E get(int index);
  	E set(int index, E element);
  	void add(int index, E e);
  	E remove(int index);
  	// 返回第一个等于o的元素，如果没有返回-1
  	int indexOf(Object o);
  	int lastIndexOf(Object o);
  	// 返回[fromIndex, toIndex)的元素
  	List<E> subList(int fromIndex, int toIndex);
}
```
