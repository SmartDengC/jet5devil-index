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

程序员分为两种，一种是读过Effective Java的，一种是没有读过Effective Java的。[Effective-Java-3rd-edition-Chinese-English-bilingual](https://github.com/clxering/Effective-Java-3rd-edition-Chinese-English-bilingual)

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

### Item18、Favor composition over inheritance优先选择复合而不是继承

超类变了，可能导致子类崩溃。

在子类里面添加了一个新的方法，但是同时在超类里面也添加一个方法，就有可能导致这两个方法名相同，返回类型不同，或者返回类型相同。

与其扩展现有类，不如为新类提供一个引用现有类实例的私有字段，这种设计称为复合，因为现有的类是新类的一个组件。新类中每个实例方法调用现有类实例的对应方法，并返回结果，这称谓转发。

Stack不应该继承Vector

只有子类确实是超类的子类的时候，继承才是合适的。换句话说，两个类A、B之间只要B满足isa关系是才应该扩展A。如果你想让B扩展A，那就问问：每个B都是A嘛？如果不能给出肯定的回答，B不应该扩展A。如果答案是否定的，通常情况下，B应该包含A的私有实例病暴露不同API，A不是B的基本组成部分，而仅仅是七实现的一个细节。

TODO：就是这一章的正确的代码没有复显。

### Item19、Design and document for inheritance or else prohibit it 继承要设计良好并有文档，否则禁止使用

先去做，在做的完美。

构造函数不能直接或间接调用可重写的方法。超类或者子类运行构造方法之前调用覆盖方法，如果重写的方法依赖于子类构造函数执行的任何初始化，那么就会出问题，不会像预期那样。

```java
public clas Super{
	public Super(){
    overrideMe();
  }
  public void overrideMe(){
    
  }
}
public class Sub extens Super{
  Instance instance;
  public Sub(){
    instance = Instance.now();
  }
 	@Override
  public void orerrideMe(){
    System.out.println(instance);  // 这里的instance就是null， 因为子构造函数初始化instance之前，超类调用了overrideMe
  }
}
```

可克隆Cloneable

可序列化Serializable

clone和readObject都不能直接或者间接的调用可覆盖的方法。

抽象类