---
title: 面渣逆袭-Java SE
createTime: 2025/07/16 23:10:28
permalink: /interview/xkyfo3ia/
---

[Java面试题之Java基础篇，56道Java基础八股文（2.3万字68张手绘图），面渣逆袭必看👍](https://javabetter.cn/sidebar/sanfene/javase.html)

## 一、Java SE

1、什么是Java？⭐️

2、Java语言有哪些特点？

3、JVM、JDK和JRE有什么区别？

4、说说什么是跨平台？原理是什么？

5、什么是字节码？采用字节码的好处是什么？

6、为什么有人说Java是“编译与解释并存”的语言？

### 7、Java有哪些数据类型？⭐️

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/core-grammar/nine-01.png)

基本数据类型：

byte，short， int， long， float， double，boolean，char

引用类型：

数组，类，接口

**问：boolean类型实际占用几个字节？**

这个依据具体的JVM实现细节。java虚拟机规范中，并没有明确规定boolean类型的大虾哦，只规定了boolean类型的取值true或者false。

**问：给Integer最大值+1，会发生什么？**

当给Integer.MAX_VALUE加一时，会发生溢出，变成Integer.MIN_VALUE。

因为java整数是采用补码的形式存储的，Integer.MAX_VAULE是01111111 11111111 11111111 11111111（32位），加一后结果变成了：10000000 00000000 00000000 00000000，即-2147483648（Integer.MIN_VALUE）



## 补充：

#### 1、Java中值传递与引用传递。

```java
class Person {
    int money;
}

class Client {
    public static void main(String[] args) {
        Person person = new Person();
        person.money = 0;
        check(person);
        if (person == null) {
            System.out.println(" has no money.");
        } else {
            System.out.println(" is rich.");
        }
    }
    private static void check(Person person) {
        if (person.money <= 0) {
            person = null;
        }
    }
}
```

上面代码最后返回的是“is rich”，为什么呢？

**在函数调用的时候，Java会把参数的内存地址拷贝一份在传递**，所以实参和形参地址相同，都能同时操作同一块内存地址。

在check方法中，只是去掉了形参与内存地址的关系，不影响实参对内存的操作。

（实参：check(person) person就是实参；形参：void check(Person person)中的person就是形参。）

总结：

当参数类型是基本数据类型时，传递的是实参的值，因此无法对实参进行修改。

当参数类型是非基本数据类型时，传递的是实参内存地址的拷贝，此时形参和实参都可以对此对象进行修改，但是互相无法影响对方本身。

[1.1 无法消失的对象 - 值传递和引用传递](https://leetcode.cn/leetbook/read/deep-learning-java-from-bug/7lyoo7/)

#### 2、Java中字符串常量池。

JVM中，线程之间共享的内存区域有：堆和方法区。

当我们在`String s = new String("")`的时候，首先会在堆上创建一个对象，然后将对应的引用返回，如果方法区的字符串常量池里面没有对应内容，就会在常量池里面创建一份（常量池是通过char数组存储的），堆上的对象持有常量池中这个字符串的引用，也就是持有char数组的内存地址。

如果常量池里面有了，就只会创建对象。==是比较的两个对象的地址是否相同，.equals是比较的两个对象的值是否相同。

总结：

JVM中，线程间共享的内存空间有堆和方法区。

String常量以字符串数组的形式存储于常量池中，但是new出来的String对象存储在堆中。

通过调用String的intern()方法，可以将堆上的引用转换成常量池中的引用。

[1.2 真假字符串 - 特殊的 String 类型](https://leetcode.cn/leetbook/read/deep-learning-java-from-bug/7lc5e5/)

#### 3、int的取值范围

0既不是整数也不是负数。

正数的补码和原码相同，负数的补码是将原码除标志位外，其他位按位取反，再加一。

-1的原码：1000 0000 0000 0000 0000 0000 0000 0001

除符号位按位取反：1111 1111 1111 1111 1111 1111 1111 1110

再加一：1111 1111 1111 1111 1111 1111 1111 1111



补码把减法变成了加法。



小结：

计算机以二进制的形式存储数据，整数在计算机中以补码的形式存储。

正数的补码和原码相同，负数的补码是将原码除符号位按位取反后再加一。

使用补码的好处是可以将减法转化为加法。

Java中，int占4个字节，每个字节8位，共32位，取值范围是[-2^31, 2 ^ 31 - 1]

由原理可以推导出，由于short占16位，所以取值范围是[-2^15, 2^15-1]
