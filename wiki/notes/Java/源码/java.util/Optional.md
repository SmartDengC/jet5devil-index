---
title: Optional
createTime: 2025/05/09 22:51:05
permalink: /java/94mvo7hw/	
---

在开发中看到过Optional相关的代码，但是只知道一些简单的API，这里仔细阅读一下Optional类的代码。

为什么会引入Optional类，主要就是来解决NPE问题，就是空指针问题。

## 一、Optional基础方法代码

```java
// final 修饰，表示不能被继承
public final class Optional<T> {
  
}
```

先看我熟悉的几个方法吧。

```java
public Optional<String> getNumber(){
    boolean hasNum = true;
    if(hasNum){
        return Optional.of("我有值");
    }
    return Optional.empty();
}
```

### private Optional(T value)

两个构造方法都是私有的，没有办法直接通过new创建对象，只能通过Optional自带的方法创建，像是of创建有参的Optional对象，empty创建无参Optional对象。

```java
// 无参构造函数
private Optional() {
    this.value = null;
}
// 构造函数，传入一个value。
private Optional(T value) {
    this.value = Objects.requireNonNull(value);
}
```

`Object.requireNonNull(T obj)`防止对象为空。

```java
public static <T> T requireNonNull(T obj) {
    if (obj == null)
        throw new NullPointerException();
    return obj;
}
```

### public static \<T> Optional\<T> of(T value) 

创建一个值为value的Optional对象，value为空

```java
public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}
```

### public static final Optional\<?> empty()

创建一个空的Optional

```java
private static final Optional<?> EMPTY = new Optional<>();

public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
}
```

### public static \<T> Optional\<T> ofNullable(T value)

如果value为空，返回一个空的Optional对象，如果value不为空，返回一个值为value的Optional对象。

```java
public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
```

### public T get()

返回Optional对象的值。

```java
public T get() {
    if (value == null) {
        throw new NoSuchElementException("No value present");
    }
    return value;
}
```

### public boolean isPresent()

判断value是否为空，有值返回true， 没有值返回false

```java
public boolean isPresent() {
    return value != null;
}
// 例如
// number value 有值， 有值返回true，没有值返回false
Optional<String> number = getNumber();
boolean present = number.isPresent(); // true

```

### public void ifPresent(Consumer<? super T> consumer)

如果value不为空，就调用consumer的accept方法。

```java
public void ifPresent(Consumer<? super T> consumer) {
    if (value != null)
        consumer.accept(value);
}
```

### public T orElse(T other)

获取值；value不为空返回value，否则返回other

```java
public T orElse(T other) {
    return value != null ? value : other;
}
```

### public T orElseGet(Supplier<? extends T> other)

获取值；

orElse和orElseGet两个方法不同的点在于当Optional对象不为空的时候 orElseGet方法不被调用。

```java
public T orElseGet(Supplier<? extends T> other) {
    return value != null ? value : other.get();
}
```

例：

```java
public static String getDefaultString(){
    return "默认值";
}

@Test
public void test2(){
  	// hello = “hello"
    String hello = Optional.ofNullable("hello").orElseGet(SelfStream::getDefaultString);
}
```

### public Optional\<T> filter(Predicate< ? super T> predicate)

对Optional value进行过滤

如果表达式的结果为false，则返回EMPTY，否则返回过滤后的Optional对象。

```java
public Optional<T> filter(Predicate<? super T> predicate) {
    Objects.requireNonNull(predicate);
    if (!isPresent())
        return this;
    else
        return predicate.test(value) ? this : empty();
}	
```

### public\<U> Optional\<U> map(Function<? super T, ? extends U> mapper)

转换

```java
public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
        return empty();
    else {
        return Optional.ofNullable(mapper.apply(value));
    }
}
```

例如；

```java
@Test
public void test3(){
  	// filter
    Predicate<String> len6 = pwd -> pwd.length() >= 6;
    Predicate<String> len10 = pwd -> pwd.length() <= 10;
    Predicate<String> eq = pwd -> pwd.equals("password");

    Optional<String> passWord = Optional.ofNullable("passWord");	 
  	// sout -> password
    passWord
        .map(String::toLowerCase)
        .filter(len6.and(len10).and(eq))
        .ifPresent(System.out::println);
     // intOpt.value = 8
     Optional<Integer> intOpt = passWord.map(String::length);
}
```
