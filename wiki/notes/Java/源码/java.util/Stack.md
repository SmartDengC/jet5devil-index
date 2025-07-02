---
title: Stack
createTime: 2025/07/02 09:41:45
permalink: /java/tumvkkmv/
---

老是记不住栈通用的方法有哪些，记录一下，加强一下记忆。

- `E push()`  添加元素
- `E peek()` 获取到栈首元素，不删除元素
- `E pop()` 获取到栈首元素，并删除栈首元素

我们我们都知道栈的特点，就是先进后出，每次出栈的都是栈首元素。

## Stack源码

Stack是继承自Vector的

```java
public class Stack<E> extends Vector<E> {
    public Stack() {}
}
```

### push E push(E item)

栈的push方法，就是在栈首添加元素，stack的push方法是调用vector的add Element(item)方法，然后在返回item

```java
public E push(E item) {
    addElement(item);
    return item;
}
```

### public synchronized E pop() 

栈的pop方法，通过内部调用peek方法，获取到元素之后，然后通过vector的removeElement方法实现元素的删除。

```java
public synchronized E pop() {
    E obj;
    int len = size();
    obj = peek();
    removeElementAt(len - 1);
    return obj;
}
```

### public synchronized E peek()

栈的peek方法，获取到栈首的元素

```java
public synchronized E peek() {
    int len = size();
    if (len == 0)
        throw new EmptyStackException();
    return elementAt(len - 1);
}
```

## Stack简单操作

```java
Stack < Integer > s = new Stack < > ();
int[] nums = {1, 2, 3};
for (int x: nums) {
    s.push(x);
}
while (!s.isEmpty()) {
    // out 1,2,3
    System.out.println(s.pop());
}
s.push(1);
Integer peek = s.peek();

// out 1
System.out.println(peek);
```

## 栈的额外实现

在官方的文档里面，写了这样一段话：

> A more complete and consistent set of LIFO stack operations is provided by the Deque interface and its implementations, which should be used in preference to this class. For example:
>
> ```java
> Deque<Integer> stack = new ArrayDeque<Integer>();
> ```

大概的意思就是：Deque接口及其实现提供了一组更完整、更一致的LIFO堆栈操作，应优先使用此类。

想表达的含义就是优先使用Deque及其实现类。

### Deque的简单操作

```java
Deque <Integer> s = new ArrayDeque <> ();

int[] nums = {1, 2, 3};

for (int x: nums) {
    s.push(x);
}
while (!s.isEmpty()) {
    // out 1,2,3
    System.out.println(s.pop());
}
s.push(1);
Integer peek = s.peek();

// out 1
System.out.println(peek);
```

对于栈的操作，主要就是那三个方法push、pop、peek。
