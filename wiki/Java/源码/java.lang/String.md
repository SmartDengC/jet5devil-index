---
title: String
permalink: /java/3bo9iw2u/
createTime: 2025/01/15 10:18:29
outline: [2, 4]
tags:
  - java源码
---

## 一、String

String常用的方法：

1. `length()` - 返回字符串的长度。
2. `charAt(int index)` - 返回指定位置的字符。
3. `substring(int beginIndex, int endIndex)` - 返回字符串的一个子串，从 `beginIndex` 到 `endIndex-1`。
4. `contains(CharSequence s)` - 检查字符串是否包含指定的字符序列。
5. `equals(Object anotherObject)` - 比较两个字符串的内容是否相等。
6. `indexOf(int ch)` 和 `indexOf(String str)` - 返回指定字符或字符串首次出现的位置。
7. `replace(char oldChar, char newChar)` 和 `replace(CharSequence target, CharSequence replacement)` - 替换字符串中的字符或字符序列。
8. `trim()` - 去除字符串两端的空白字符。
9. `split(String regex)` - 根据给定正则表达式的匹配拆分此字符串。

### 1.1、String类的基础理解

[深入学习String源码与底层（一）.md](https://github.com/coderbruis/JavaSourceCodeLearning/blob/master/note/JDK/%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0String%E6%BA%90%E7%A0%81%E4%B8%8E%E5%BA%95%E5%B1%82%EF%BC%88%E4%B8%80%EF%BC%89.md)

[深入学习String源码与底层（二）.md](https://github.com/coderbruis/JavaSourceCodeLearning/blob/master/note/JDK/%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0String%E6%BA%90%E7%A0%81%E4%B8%8E%E5%BA%95%E5%B1%82%EF%BC%88%E4%BA%8C%EF%BC%89.md)

```java
public final class String
implements java.io.Serializable, Comparable<String>, CharSequence {
  	// 用来存储字符串的内容
    private final char value[];
    private int hash;
}
```

String类由final修饰，并实现了Serializable、Comparable、CharSequence.

- 由final修饰表示String类不能被继承，成员变量也是由final修饰，String类一旦创建就不能修改。

```java
    private final char value[];
```

String是由char数组保存实现。

创建String对象的几种方式：

- String s = new String("hello");

- String s = "hello";

```java
String str = "abc";
// 等价于先创建一个char[]数组，然后创建出String
char data[] = {'a', 'b', 'c'};
String str = new String(data);
```

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

这里有一个需要注意的地方，在java中使用+连接符号是，一定要注意+的连接效率是非常低的，因为+连接符的原理就是通过StringBuilder的append()来实现的，所以如: String name = "a" + "b"; 在底层是先new出一个StringBuilder对象，然后在调用该对象的append()方法来实现的:

```java
// String s = "a" + "b";
String s = new StringBuilder().append("a").append("b").toString();
```

---

常量可以被认为运行是不可改变，所以编译时被以常量折叠方式优化。

变量和动态生成的常量必须在运行时确定值，所以不能在编译期折叠优化。

#### String的equals方法

equals比较的是字符串内容是否相等

#### String的hashcode方法

在String类中，有一个字段hash存储着String的哈希值，如果字符串为空，则hash值为0，String类中的hashcode计算方法就是以31为权，每一位为字符的ASCLL值进行运算，用自然溢出来等效取模，经过第一次的hashcode计算之后，属性hash就会赋哈希值

#### String的hashcode()和equals()

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

### 1.2、String类相关的方法

#### public boolean equals(Object another)

这里的this表示什么含义？ 表示当前对象

先判断传入对象是否等于当前对象，如果是直接返回true；判断another是否是String类型，如果是将another转成String，先判断长度是否一致，在循环判断每一位是否相同。

```java
    public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        if (anObject instanceof String) {
            String anotherString = (String)anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
              	// n-- != 0表示循环次数，真正的位置是i
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                        return false;
                    i++;
                }
              	/**
              	for(int i = 0;i < n; i++){
                  if(v1[i] != v2[i])
                    return false;
                }
                */
                return true;
            }
        }
        return false;
    }
```

#### public int hashcode()

```java
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        char val[] = value;

        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
```

#### public int compareTo(String anotherString)

String类实现Comparable接口，实现了compareTo接口。

```java
    public int compareTo(String anotherString) {
        int len1 = value.length;
        int len2 = anotherString.value.length;
      	// 以小驱动
        int lim = Math.min(len1, len2);
        char v1[] = value;
        char v2[] = anotherString.value;

        int k = 0;
        while (k < lim) {
            char c1 = v1[k];
            char c2 = v2[k];
          	// 从头往后比较，遇到不想等的直接返回c1-c2
            if (c1 != c2) {
                return c1 - c2;
            }
          	// 相同指针后移
            k++;
        }
      	// 如果前lim个字符都相同的话，就返回len1-len2
        return len1 - len2;
    }
```

String的compareTo方法是比较的最低位不同字符的ascll码的差值，如果最低位都相等的话，就返回字符串长度的差值。

#### public String(char value[])

String的构造函数好多，都给我看花眼了。

```java
    public String(char value[]) {
        this.value = Arrays.copyOf(value, value.length);
    }
```

#### ⭐️ public int length()

求字符串长度的方法，返回char[]数组的长度。

```java
    public int length() {
        return value.length;
    }
```

#### ⭐️ public boolean isEmpty()

判断字符串是否为空，判断字符串的char[]数组的长度是否为0.

```java
    public boolean isEmpty() {
        return value.length == 0;
    }
```

#### ⭐️ public char charAt(int index)

返回字符串对应下标index的字符，获取char[]数组对应下标的字符。

```java
    public char charAt(int index) {
      	// 校验下标index的合法性
        if ((index < 0) || (index >= value.length)) {
            throw new StringIndexOutOfBoundsException(index);
        }
        return value[index];
    }
```

#### void getChars(char dst[], int dstBegin)

```java
void getChars(char dst[], int dstBegin) {
    System.arraycopy(value, 0, dst, dstBegin, value.length);
}
```

**System.arraycopy()**

System.arraycopy()方法是Java中的本地方法，其实际实现是由Java虚拟机的底层实现提供的。native修饰。

System.arraycopy()方法的性能非常高，因为它是由底层实现的，并且能够利用硬件的特性来进行快速的数据复制。通常比使用循环逐个复制数组元素要快得多

```java
public static native void arraycopy(Object src, int srcPos,Object dest, int destPos,int length);
```

- src：源数组
- srcPos：源数组中的起始位置
- dest：目标数组
- destPos：目标数组中的起始位置
- length：要复制的元素个数

**Arrays.copyOf()**

```java
    @SuppressWarnings("unchecked")
    public static <T> T[] copyOf(T[] original, int newLength) {
        return (T[]) copyOf(original, newLength, original.getClass());
    }
    public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
      	// 创建对应类型的数组。
        @SuppressWarnings("unchecked")
        T[] copy = ((Object)newType == (Object)Object[].class)
            ? (T[]) new Object[newLength]
            : (T[]) Array.newInstance(newType.getComponentType(), newLength);
      	// 底层还是使用的System.arraycopy来复制的
        System.arraycopy(original, 0, copy, 0, Math.min(original.length, newLength));
        return copy;
    }
```

- original：要复制的原始数组
- newLength：新数组的长度，它可以比原数组的长度长或者短。
- newType：新数组的类型，是一个Class对象，通常是一个数组类。它用于确定新数组的类型。

#### public boolean startsWith(String prefix, int toffset)

判断字符串是否以prefix开头。

```java
    public boolean startsWith(String prefix, int toffset) {
        char ta[] = value;
        int to = toffset;
        char pa[] = prefix.value;
        int po = 0;
        int pc = prefix.value.length;
        // Note: toffset might be near -1>>>1.
      	// 控制下标toffset的范围，toffset + pc > value.length -> toffset > value.length - pc
        if ((toffset < 0) || (toffset > value.length - pc)) {
            return false;
        }
      	// 这里--pc和pc--应该是相同的作用，就是用来控制循环次数的
      	// for循环需要维护额外的循环变量，直接用前面定义好的pc这个变量来维护循环次数
        while (--pc >= 0) {
            if (ta[to++] != pa[po++]) {
                return false;
            }
        }
        return true;
    }
    public boolean startsWith(String prefix) {
        return startsWith(prefix, 0);
    }
    public boolean endsWith(String suffix) {
      	// endsWith 调用startsWith，下标为value.length - suffix.value.length
        return startsWith(suffix, value.length - suffix.value.length);
    }
```

#### ⭐️ public String subString(int beginIndex, int endIndex)

求字符串指定beginIndex到endIndex的子串。

使用String的构造函数创建新的字符串，new String(value, beginIndex, subLen) ；

```java
public String substring(int beginIndex, int endIndex) {
    if (beginIndex < 0) {
        throw new StringIndexOutOfBoundsException(beginIndex);
    }
    if (endIndex > value.length) {
        throw new StringIndexOutOfBoundsException(endIndex);
    }
    int subLen = endIndex - beginIndex;
    if (subLen < 0) {
        throw new StringIndexOutOfBoundsException(subLen);
    }
    return ((beginIndex == 0) && (endIndex == value.length)) ? this
            : new String(value, beginIndex, subLen);
}
```

#### public String concat(String str)

判断str是否为空，如果为空直接返回当前字符串；

不为空的话，新建一个 value.length + str.length()的新char[]数组，然后拷贝进去创建新的字符串。

```java
public String concat(String str) {
    if (str.isEmpty()) {
        return this;
    }
    int len = value.length;
    int otherLen = str.length();
  	// Arrays.copyOf(源数组，新数组长度)
    char buf[] = Arrays.copyOf(value, len + otherLen);
    str.getChars(buf, len);
    return new String(buf, true);
}
```

#### public char[] toCharArray

将字符串转化成char[]数组，就是将value数组的值复制一份，然后返回。

```java
public char[] toCharArray() {
    // Cannot use Arrays.copyOf because of class initialization order issues
    char result[] = new char[value.length];
    System.arraycopy(value, 0, result, 0, value.length);
    return result;
}
```

### 1.3、字符串常量池

刚才突然想到了字符串常量池，简单了解一下。

```java
String x = new String("邓哈哈");
```

上面代码经历了哪些过程？

使用new关键词创建字符串对象，java虚拟机会先在字符串常量池里面查找有没有想等的对象，如果有的话，就在堆上创建一个“邓哈哈”的对象，然后将地址赋值到x；如果字符串常量池里面没有的话，就会先在常量池里面创建对象，然后在堆上再创建一个对象。

但是我们进场使用双引号来创建字符串对象。

```java
String y = "邓哈哈";
```

先还是会在字符串常量池里面查找有没有对象，如果有的话，直接将常量池里面对应的对象地址赋值给y；如果没有的话，就会先创建，然后在赋值给y。

[字符串常量池 - 设计思路 1/3](https://xie.infoq.cn/article/ef9d6392929a4eb137fa6c20f)

[字符串常量池 -StringTable 源码实现 2/3](https://xie.infoq.cn/article/be2da49fce15ad02f936c28e9)

[字符串常量池 -String.intern 源码实现 3/3](https://xie.infoq.cn/article/631545e5ec45a3b0beebe481e)

## 二、StringBuilder

[聊聊 Java StringBuilder和StringBuffer 两兄弟](https://javabetter.cn/string/builder-buffer.html)

操作可变的字符串，线程不安全。

#### ⭐️ public StringBuiler()

构造函数，默认大小为16，可以传入大小

```java
    public StringBuilder() {
        super(16);
    }
    public StringBuilder(int capacity) {
        super(capacity);
    }
```

#### ⭐️ public StringBuilder append(String str)

对于StringBuilder的append方法，可以传入的参数有许多，比如像是字符串String， StringBuilder对象，char数组，int， long，float，double

```java
@Override
public StringBuilder append(String str) {
    super.append(str);
    return this;
}
```

append方法是调用的父类的append方法，代码如下：

```java
    public AbstractStringBuilder append(String str) {
        if (str == null)
            return appendNull();
        int len = str.length();
        ensureCapacityInternal(count + len);
        str.getChars(0, len, value, count);
        count += len;
        return this;
    }
```

我们可以看到如果传入的字符串不为空的话，是会将str拼接到value后面的，但是每次前面都会对容量进行校验，如果容量不够就进行扩容。

扩容的话，容量是原来容量的2倍在加2，加2是为了，原来是空串或者容量只有1的情况。

```java
    private void ensureCapacityInternal(int minimumCapacity) {
        // overflow-conscious code
        if (minimumCapacity - value.length > 0) {
            value = Arrays.copyOf(value, newCapacity(minimumCapacity));
        }
    }
    private int newCapacity(int minCapacity) {
        // overflow-conscious code
        int newCapacity = (value.length << 1) + 2;
        if (newCapacity - minCapacity < 0) {
            newCapacity = minCapacity;
        }
        return (newCapacity <= 0 || MAX_ARRAY_SIZE - newCapacity < 0)
            ? hugeCapacity(minCapacity)
            : newCapacity;
    }
```

还有一些删除delete，插入insert的方法，这里暂时省略。

#### public StringBuilder reverse()

反转字符串顺序。

```java
@Override
public StringBuilder reverse() {
    super.reverse();
    return this;
}
```

#### ⭐️ public String toString()

StringBuilder的toString方法，返回字符串内容。

```java
@Override
public String toString() {
    // Create a copy, don't share the array
    return new String(value, 0, count);
}
```

## 三、StringBuffer

操作可变字符串，通过synchronized修饰，线程安全。

StringBuffer和StringBuilder的方法差不多，只是在方法之前加入了synchronized关键字的修饰。

StringBuffer还有一些特有的方法，暂时后面在记录。

## 四、应用

### 4.1、格式化字符串

给出字符串s，如果长度不到8,就用#填充。

```java
String s = "hello";
StringBuilder matSb = new StringBuilder(s);
while (matSb.length() < 8) {
    matSb.append("#");
}
```

