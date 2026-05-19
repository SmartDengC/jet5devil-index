---
title: LinkedList
createTime: 2025/05/03 23:24:50
permalink: /java/tc210ixv/
---

因为LinkedList实现了List、Deque等接口，暂时先往后放一放，先把List学习了。

底层比较重要的方法有：

- linkFirst(E e)
- linkLast(E e)
- linkBefore(E e, Node\<E> succ)
- unlinkFirst()
- unlinkLast()

## 一、Link Operations

LinkedList底层是通过链条实现的，所以它的特点就是插入、删除效率高，但是查询效率低，因为需要从头遍历查找对应的元素。


```java
public class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E>, Cloneable, java.io.Serializable{
  	transient int size;
  	transient Node<E> first;  // first节点
  	transient Node<E> last;  // last节点
}
```

transient修饰的字段将不被序列化，字段的生命周期仅存在于调用者的内存中，而不会被写道磁盘中。

节点Node类的定义：

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

### private void linkFirst(E e)

是私有方法，在first节点之前插入一个节点。

维护fist节点，方便后面通过getFirst方法获取元素。

```java
private void linkFirst(E e) {
    final Node<E> f = first;
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;
    if (f == null)
        last = newNode;
    else
        f.prev = newNode;
    size++;
    modCount++;
}
```

### void linkLast(E e)

在last节点后面添加节点。

维护last节点，后面方便getLast方法直接返回最后一个元素

```java
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```

### void linkBefore(E e, Node\<E> succ)

在节点succ前面添加元素e

```java
void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

### private E unlinkFirst(Node \<E> f)

将first指向first.next， f.item = null;  f.next = null; first = next;

```java
private E unlinkFirst(Node<E> f) {
    // assert f == first && f != null;
    final E element = f.item;
    final Node<E> next = f.next;
    f.item = null;
    f.next = null; // help GC
    first = next;
    if (next == null)
        last = null;
    else
        next.prev = null;
    size--;
    modCount++;
    return element;
}
```

### private E unlinkLast(Node\<E> l)

l.item = null; f.prev = null;

```java
private E unlinkLast(Node<E> l) {
    // assert l == last && l != null;
    final E element = l.item;
    final Node<E> prev = l.prev;
    l.item = null;
    l.prev = null; // help GC
    last = prev;
    if (prev == null)
        first = null;
    else
        prev.next = null;
    size--;
    modCount++;
    return element;
}
```

### public E getFirst()

返回链表第一个节点元素值

```java
public E getFirst() {
    final Node<E> f = first;
    if (f == null)
        throw new NoSuchElementException();
    return f.item;
}
```

### public E getLast()

返回链表最后一个节点元素值

```java
public E getLast() {
    final Node<E> l = last;
    if (l == null)
        throw new NoSuchElementException();
    return l.item;
}
```

### public E removeFirst()

删除第一个节点

```java
public E removeFirst() {
    final Node<E> f = first;
    if (f == null)
        throw new NoSuchElementException();
    return unlinkFirst(f);
}
```

### public E removeLast()

删除最后一个节点

```java
public E removeLast() {
    final Node<E> l = last;
    if (l == null)
        throw new NoSuchElementException();
    return unlinkLast(l);  // 就是把最后一个元素删除掉 
}
```

### public void addFirst(E e)

在列表最前面添加一个元素

```java
public void addFirst(E e) {
    linkFirst(e);
}
```

### public void addLast(E e)

在列表最后添加一个节点

```java
public void addLast(E e) {
    linkLast(e);
}
```

### public boolean contains(Object o)

判断元素是否在列表中，indexOf返回所在的下标，列表不包含元素返回-1

```java
public boolean contains(Object o) {
    return indexOf(o) != -1;
}

public int indexOf(Object o) {
    int index = 0;
  	// 当Object为空的时候，循环遍历判断item==null的元素
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null)
                return index;
            index++;
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
          	// 使用equals判断元素是否相同
            if (o.equals(x.item))
                return index;
            index++;
        }
    }
    return -1;
}
```

### public int size()

```java
public int size() {
    return size;
}
```

### public boolean add(E e)

默认在列表最后添加元素

```java
public boolean add(E e) {
  	// 调用linkLast方法添加元素
    linkLast(e);  
    return true;
}
```

### public boolean remove(Object o)

删除指定元素

```java
public boolean remove(Object o) {
  	// object为空和不为空分开判断
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {  // 一个使用 == ，一个使用equals
                unlink(x);
                return true;
            }
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}
```

### public boolean addAll(Collection<?> c)

```java
public boolean addAll(int index, Collection<? extends E> c) {
  	// 判断index是否在正常范围内 index >= 0 && index <= size
    checkPositionIndex(index);

    Object[] a = c.toArray();
    int numNew = a.length;
    if (numNew == 0)
        return false;

    Node<E> pred, succ;
    if (index == size) {
        succ = null;
        pred = last;
    } else {
      	// 获取到指定index位置的node，通过 index < (size >> 1) 就是index离对首近，还是离队尾近
        succ = node(index);
        pred = succ.prev;
    }

    for (Object o : a) {
        @SuppressWarnings("unchecked") E e = (E) o;
        Node<E> newNode = new Node<>(pred, e, null);
        if (pred == null)
            first = newNode;
        else
            pred.next = newNode;
        pred = newNode;
    }

    if (succ == null) {
        last = pred;
    } else {
        pred.next = succ;
        succ.prev = pred;
    }

    size += numNew;
    modCount++;
    return true;
}
```

### public void clear()

```java
public void clear() {
    // Clearing all of the links between nodes is "unnecessary", but:
    // - helps a generational GC if the discarded nodes inhabit
    //   more than one generation
    // - is sure to free memory even if there is a reachable Iterator
    for (Node<E> x = first; x != null; ) {
        Node<E> next = x.next;
        x.item = null;
        x.next = null;
        x.prev = null;
        x = next;
    }
    first = last = null;
    size = 0;
    modCount++;
}
```

### public E get(int index)

```java
public E get(int index) {
  	// 校验index是否合法， index >= 0 && index < size
    checkElementIndex(index);
    return node(index).item;
}
```

### public E set(int index, E element)

校验index， node(index)，因为需要返回oldVal，x.item = element;

```java
public E set(int index, E element) {
    checkElementIndex(index);
    Node<E> x = node(index);
    E oldVal = x.item;
    x.item = element;
    return oldVal;
}
```

### public int indexOf(Object o)

从前往后遍历，返回匹配的一个元素的下标，未匹配返回-1

```java
public int indexOf(Object o) {
    int index = 0;
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null)
                return index;
            index++;
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item))
                return index;
            index++;
        }
    }
    return -1;
}
```

### public int lastIndexOf(Object o)

从后往前匹配，返回匹配的第一个元素的下标，未匹配返回-1

```java
public int lastIndexOf(Object o) {
    int index = size;
    if (o == null) {
        for (Node<E> x = last; x != null; x = x.prev) {
            index--;
            if (x.item == null)
                return index;
        }
    } else {
        for (Node<E> x = last; x != null; x = x.prev) {
            index--;
            if (o.equals(x.item))
                return index;
        }
    }
    return -1;
}
```

## 二、Queue Operations

队列相关的操作。

### public E peek()

返回队列的第一个元素。

```java
public E peek() {
    final Node<E> f = first;
    return (f == null) ? null : f.item;
}
```

### public E element

返回队列的第一个元素

```java
public E element() {
    return getFirst();
}
```

### public E poll()

返回列表第一个元素后删除

```java
public E poll() {
    final Node<E> f = first;
    return (f == null) ? null : unlinkFirst(f);
}
```

### public E remove()

同poll

```java
public E remove() {
    return removeFirst();
}
```

### public boolean offer(E e)

在队尾添加元素

```java
public boolean offer(E e) {
    return add(e);
}
```

### public boolean offerFirst(E e)

同deque，双端队列，可以在对首添加元素

```java
public boolean offerFirst(E e) {
    addFirst(e);
    return true;
}
```

### public boolean offerLast(E e)

在队尾添加元素

```java
public boolean offerFirst(E e) {
    addFirst(e);
    return true;
}
```

### public E peekFirst()

peekFirst 同 peek

```java
public E peekFirst() {
    final Node<E> f = first;
    return (f == null) ? null : f.item;
 }
public E peekLast() {
    final Node<E> l = last;
    return (l == null) ? null : l.item;
}
```

### public E pollFirst()	

pollFirst 同poll

```java
public E pollFirst() {
    final Node<E> f = first;
    return (f == null) ? null : unlinkFirst(f);
}
public E pollLast() {
    final Node<E> l = last;
    return (l == null) ? null : unlinkLast(l);
}
```

## 三、Stack Operations

Java堆栈Stack类已经过时了，Java官方推荐使用Deque替代Stack使用。Deque堆栈操作方法为：push, pop, peek

### public void push(E e)

在栈顶添加元素

```java
public void push(E e) {
    addFirst(e);
}
```

### public E pop()

弹出栈顶元素

```java
public E pop() {
    return removeFirst();
}
```

### public E peek()

```java
public E peek() {
    final Node<E> f = first;
    return (f == null) ? null : f.item;
}
```

