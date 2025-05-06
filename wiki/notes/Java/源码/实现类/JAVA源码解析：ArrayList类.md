---
title: ArrayList类
createTime: 2025/05/06 15:36:09
permalink: /java/veasjoo2/
---

ArrayList底层是使用数组来实现的，所以特点就是查询效率高，增删效率低。

ArrayList的动态扩容原理，ArrayList实现了List的接口。

```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
  	// 初时大小为10
  	private static final int DEFAULT_CAPACITY = 10;
  	// 保存元素的数据结构
  	transient Object[] elementData; // non-private to simplify nested class access
  	// 属性size
    private int size;
}
```

### public void trimToSize()

调整数组大小

```java
public void trimToSize() {
    modCount++;
    if (size < elementData.length) {
      	// size是否等于0，等于0使用初始化大小，否则的话，将elementData调整成size大小
        elementData = (size == 0)? EMPTY_ELEMENTDATA: Arrays.copyOf(elementData, size);
    }
}
```

### private void grow(int minCapacity)

扩容的底层私有方法

```java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
  	// 增加原来数组大小的一半。
  	// oldCapacity >> 1 等价于 oldCapacity / 2
    int newCapacity = oldCapacity + (oldCapacity >> 1);  
  	// 比较传入的minCapacity和数组一半的大小
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```
