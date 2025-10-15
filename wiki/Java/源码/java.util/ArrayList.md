---
title: ArrayList
createTime: 2025/05/06 15:36:09
permalink: /java/veasjoo2/
---

ArrayList底层是使用数组来实现的，所以特点就是查询效率高，增删效率低。

ArrayList的动态扩容原理，ArrayList实现了List的接口。

## 一、ArrayList基本方法

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

### public  E get(int index)

通过index获取到元素

```java
E elementData(int index) {
    return (E) elementData[index];
}
public E get(int index) {
  	// index<= size
    rangeCheck(index);
    return elementData(index);
}
```

### public E set(int index, E element)

```java
public E set(int index, E element) {
    rangeCheck(index);

    E oldValue = elementData(index);
    elementData[index] = element;
    return oldValue;
}
```

### public void add(int index, E element)

判断index是否合法；扩容判断，将[index,  size)的元素使用System.arraycopy向后移动一位。

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);

    ensureCapacityInternal(size + 1);  // Increments modCount!!
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    elementData[index] = element;
    size++;
}
```

### public E remove(int index)

删除指定index下标元素。

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
  	// 获取到被删除的元素，需要返回
    E oldValue = elementData(index);
		// 计算出需要移动的元素个数
    int numMoved = size - index - 1;
    if (numMoved > 0)
      	// 将index后面的元素往前移动
        System.arraycopy(elementData, index+1, elementData, index, numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
```

### public void clear()

将数组每个元素都赋值为null，优化GC回收器。

```java
public void clear() {
    modCount++;

    // clear to let GC do its work
    for (int i = 0; i < size; i++)
        elementData[i] = null;

    size = 0;
}
```

## 二、补充

### 2.1、创建List的方式

#### 2.1.1、new ArrayList<>()

new 出来的ArrayList是可以增删改的

```java
    public List<Integer> list1(){
        List<Integer> l1 = new ArrayList<>();
        l1.add(1);
        l1.add(2);
        l1.add(3);
        System.out.println("l1 = " + l1);
        return l1;
    }
```

#### 2.1.2、Arrays.asList()

Arrays.asList 出来的列表是不能修改的，因为底层是用数组保存的。

```java
    public List<Integer> list2(){
        // 不可变化
        List<Integer> list = Arrays.asList(1, 2, 3);
        // 可变化
        List<Integer> list2 = new ArrayList<>(Arrays.asList(1, 2, 3));
        list2.add(5);
        System.out.println(list2);
        return list2;
    }
```

#### 2.1.3、List匿名内部类

```java
    public List<Integer> list3(){
        // 匿名内部类
        List<Integer> list3 = new ArrayList<Integer>(){{
            add(1);
            add(2);
            add(3);
        }};
        System.out.println(list3);
        return list3;
    }
```

