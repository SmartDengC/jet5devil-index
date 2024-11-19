---
title: 阅读｜Effective Java
author: 邓聪的小破站
createTime: 2024/07/16 22:09:57
permalink: /article/os5a2vnf/
tags: 
  - books
  - java
  - EffectiveJava
---

程序员分为两种，一种是读过Effective Java的，一种是没有读过Effective Java的。

<!-- more -->


《设计模式：可复用面向对象软件的基础》

反模式 Antipattern 不要这样做



## Chapter 4. Classes and Interfaces（类和接口）

### [Item 15: Minimize the accessibility of classes and members（尽量减少类和成员的可访问性）](https://github.com/clxering/Effective-Java-3rd-edition-Chinese-English-bilingual/blob/dev/Chapter-4/Chapter-4-Item-15-Minimize-the-accessibility-of-classes-and-members.md)

主要是强调对成员变量、接口的访问程度；有四种访问级别：

private、package-private、pretect、public，尽量模块化，少使用public

如果一个类具有这样的字段或者访问器，客户端将能够修改数组的内容，存在常见的安全漏洞：

```java
// Potential security hole!
public static final Thing[] VALUES = {...};
```

将公共数组设置成私有的，并添加一个公共的不可变的List:

```java
private static final Thing[] PRIVATE_VALUE = {...};
public static final List<Ting> VALUES = Collections.unmodifiableList(ArrayList.asList(PRIVATE_VALUE));
```

或者，将数组设置成私有的，返回一个私有数组副本的公共方法：

```java
private static final Thing[] PRIVATE_VALUE = {...};
public static final Thing[] values(){
  return PRIVATE_VALUE.clone();
}
```



### [Item 16: In public classes, use accessor methods, not public fields](https://github.com/clxering/Effective-Java-3rd-edition-Chinese-English-bilingual/blob/dev/Chapter-4/Chapter-4-Item-16-In-public-classes-use-accessor-methods-not-public-fields.md)

**（在公共类中，使用访问器方法，而不是公共字段）**

使用私有字段和公共访问方法

```java
class Point{
  private double x;
  public Point(double x){
    this.x = x;
  }
  public double getX(){return x;}
  public double setX(double x){
    this.x = x;
  }
}
```

### Item 17: Minimize mutability（减少可变性）

不变类方法名是介词（如plus）而不是动词（如add）。

不变类每次返回的都是一个新类。

```java
public final class Complex {
  private final double re;
  private final double im;
  public Complex(double re, double im){
    this.re = re;
    this.im = im;
  }
  public Complex plus(Complex c){
    return new Complex(re - c.re, im - c.im);
  }
}
```

更优的一种方式

```java
public class Complex {
  private final double re;
  private final double im;
  private Complex(double re, double im){
    this.re = re;
    this.im = im;
  }	
  public static Complext valueOf(double re, double im){
    return new Complex(re, im);
  }
}
```



​	