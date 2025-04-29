---
title: JAVA源码解析：String类
permalink: /article/3bo9iw2u/
createTime: 2025/01/15 10:18:29
tags:
  - java源码
---

[深入学习String源码与底层（一）.md](https://github.com/coderbruis/JavaSourceCodeLearning/blob/master/note/JDK/%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0String%E6%BA%90%E7%A0%81%E4%B8%8E%E5%BA%95%E5%B1%82%EF%BC%88%E4%B8%80%EF%BC%89.md)

[深入学习String源码与底层（二）.md](https://github.com/coderbruis/JavaSourceCodeLearning/blob/master/note/JDK/%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0String%E6%BA%90%E7%A0%81%E4%B8%8E%E5%BA%95%E5%B1%82%EF%BC%88%E4%BA%8C%EF%BC%89.md)

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {}
```

String类由final修饰，并实现了Serializable、Comparable、CharSequence.

- 由final修饰表示String类不能被继承，成员变量也是由final修饰，String类一旦创建就不能修改。

```java
    private final char value[];
```

String是由char数组保存实现。

创建String对象的几种方式：

- String s = "hello";
- String s = new String("hello");
- String s = "hell" + "0";



String 被设置成不可变性的原因？

- 主要是为了效率和安全性的缘故。如果String允许被继承，由于他高度被使用率，可能会降低程序的性能，所以String被定义成final
- 由于字符串常量池的存在，为了更加有效的管理和优化字符串常量池里面的对象， 将Strng设计成不可变性。
- 安全性考虑。因为使用字符串的场景非常多，设计成不可变可以有效的防止字符串被有意或者无意的修改。
- 作为HashMap、HashTable等hash数据key的必要，因为不可变的设计，jvm底层很容易在缓存String对象的时候缓存其hashcode，这样在执行效率上会大大提升。

---

这里补充一下字符串常量池的知识点：[深入理解Java字符串常量池](https://javabetter.cn/string/constant-pool.html)

我们就用String s = new String("小邓"); 这个例子来说，问这个语句会创建几个对象？

当字符串常量池里面没有 小邓的时候，先会在常量池里面创建一个小邓，然后在堆里面创建一个小邓；如果常量池里面有小邓，那么就只会在堆里面创建一个小邓。

在java中，栈上存储的是基本数据类型的变量和对象的引用，而对象本身则存储在堆上，同时引用变量s存储在栈上，他指向堆内存中的字符串小邓。

通常情况下，我们是使用String s = “小邓”；来创建变量的时候，先在常量池里面找是否存在，如果存在的话，直接返回；如果不存在的话，就在常量池里面创建一个小邓的对象，然后将地址返回。

这里有一个需要注意的地方，在java中使用+连接符号是，一定要注意+的连接小徐是非常低的，因为+连接符的原理就是通过StringBuilder的append()来实现的，所以如: String name = "a" + "b"; 在底层是先new出一个StringBuilder对象，然后在调用该对象的append()方法来实现的:

```java
// String s = "a" + "b";
String s = new StringBuilder().append("a").append("b").toString();

```

---

常量可以被认为运行是不可改变，所以编译时被以常量折叠方式优化。

变量和动态生成的常量必须在运行时确定值，所以不能在编译期折叠优化。



### String的equals方法

equals比较的是字符串内容是否相等

### String的hashcode方法

在String类中，有一个字段hash存储着String的哈希值，如果字符串为空，则hash值为0，String类中的hashcode计算方法就是以31为权，每一位为字符的ASCLL值进行运算，用自然溢出来等效取模，经过第一次的hashcode计算之后，属性hash就会赋哈希值

### String的hashcode()和equals()

String的equals是比较的两个字符串的内容；hashcode是比较的字符串的hash值，那么问题来来，单纯的equals相等，或者hash值相等，能判断两个字符串相同吗？答案是不能的。

```java
String a = "gdejicbegh";
String b = "hgebcijedg";
System.out.println("a.hashcode() == b.hashcode() " + (a.hashCode() == b.hashCode()));  // true
System.out.println("a.equals(b) " + (a.equals(b)));  // false
```

回文串是典型的hash值相等，但是字符串内容不相等，对于算法领域这块，回文字符串和字符串匹配都是比较重要的一块，比如马拉车算法、KMP算法。

- 如果两个对象的equals相等，则他们的hashcode一定相等
- 如果两个对象的equals不相等，他们的hashcode可能相等； // 回文字符串
- 如果两个对象的hashcode相等，则他们equals不一定相等
- 如果两个对象的hashcode不相等，则他们的equals一定不相等。



### String的compareTo方法

```java
    public int compareTo(String anotherString) {
        int len1 = value.length;
        int len2 = anotherString.value.length;
        int lim = Math.min(len1, len2);
        char v1[] = value;
        char v2[] = anotherString.value;

        int k = 0;
        while (k < lim) {
            char c1 = v1[k];
            char c2 = v2[k];
            if (c1 != c2) {
                return c1 - c2;
            }
            k++;
        }
        return len1 - len2;
    }

```

String的compareTo方法是比较的最低位不同字符的ascll码的差值，如果最低位都相等的话，就返回字符串长度的差值。

### String的startWith方法

s.startWith(anotherStr)

### String的endWith方法

### String的indexOf

indexOf(int ch) 传入字符的ascll码来匹配位置。

