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

### Item 20: Prefer interface to abstract classes接口优于抽象类

1、抽象类的局限：一个类要实现抽象类定义的类型，该类必须是抽象类的子类。因为java只允许单一继承，这种限制对抽象类而严重制约了他们作为类型定义的使用

2、接口的有点：任何定义了所有必须的方法并遵守通用约定的类都允许实现接口，而不管该类驻留在类层次结构中何处。

接口是定义mixin（混合类型）的理想工具。（混合设计模式/）

> 抽象类知识点扩展 [Java抽象类，看这一篇就够了，豁然开朗](https://javabetter.cn/oo/abstract.html)
>
> 抽象类不能被实例化，但是可以使用extends创建子类；如果一个类定义了一个或者多个抽象方法，那么这个类必须是抽象类。
>
> 抽象类中可以定义抽象方法，也可以定义普通方法。抽象类派生的子类必须实现父类中的抽象方法。

总之，接口通常是定义允许多种实现类型的最佳方法。如果到处一个重要的接口，则应该强烈考虑提供一个骨架实现。尽可能的，你应该痛殴接口上的默认的方法提供骨架实现，一边接口的所有实现者都可以使用它。也就是说，对接口的限制通常要求框架实现采用抽象类的形式。

### Item 21: Design interface for posterity为后代设计接口

默认的方法没有被覆盖，导致执行结果不是预期结果。

### Item 22: Use interface only to define types 接口只用于定义类型

定义常量接口类是一种糟糕的方式。**那如何定义常量类？**

一种是与类和接口紧密绑定的话，就定义在类或者接口里面；二种是看做枚举类型的成员，使用enum；三种是使用不可实例化的工具类导出常量。如下：

```java
public class PhysicalConstants{
  private PhysicalContants(){}  // 将构造私有，阻止实例化
  public static final double AVOGADROS_NUMBER = 6.022_140_857e23; 
  // System.out.println(1_000_00);
}
```

```java
import static com.effectivejava.science.PhysicalContants.*;
public class Test{
  double atoms(double mols){
    return AVOGADROS_NUMBER * mols;
  }
}
```

总之，接口应该只用于定义类型。它们不应该用于导出常量。



### Item23: Prefer class hierarchies to tagged classes 类层次结构优于带标签的类

Radius 半径

rectangle 矩形

### Item24: Favor static member classer over nonstatics 静态成员类优于非静态成员类

静态成员类、非静态成员类、匿名类和内部类

calculate

如果嵌套类的实例可以独立于外部勒的实例存在，那么嵌套类必须是静态成员类：如果没有外部实例，就不可能创建非静态成员类的实例。（简单理解就是静态类可以独立于外部类实例存在，非静态类就不行，必须通过外部类实例来创建非静态类）。

简单回顾一下，有四种不同类型的嵌套类，每一种都有自己的用途。如果嵌套的类需要在单个方法之外可见，或者太长不适合放入方法中，则使用成员类。除非成员类的每一个实例都需要引用外部类实例，让他保持静态。假设嵌套类属于方法内部，如果你只需要从一个位置创建实例，并存在一个能够描述类的现有类型，那么娇气设置为匿名类；否则将其设置成为局部类。



### Item25: Limit source files to a single top-level class 源文件仅限有单个顶层类

风险：在源文件中定义多个顶层类使得为一个类提供多个定义成为可能，所使用的定义受源文件传给编译器的顺序的影响。

下面这个例子就是错误的：

一个Utensil.java

```java
class Utensil{
  static final String NAME = "pot";
}
class Dessert{
  static final String NAME = "pie";
}
```

一个Dessert.java

```java
class Utensil {
    static final String NAME = "pan";
}
class Dessert {
    static final String NAME = "cake";
}
```

通过Java Utensil.java Dessert.java命令编译时，编译错误，编辑器会告诉你多重定义了Utensil和Dessert.

## Chapter 5. Generices 范型

没有范型，从集合中取出来的数据需要进行强制转换，如果存入错误类型的数据，转换就会出现问题；

加入范型，在插入的时候就进行转换。但是也有缺点，扬长避短？ **有什么缺点？**

### Items26: Don't use raw types 不要使用原始类型

Raw 生

声明中具有一个或者多个类型参数的类或接口就是范型类或范型接口，例如，List接口有一个类型参数E，用于表示元素类型。该接口的全名是`List<E>`，范型类和范型接口统称为范型。

如果使用原始类型，就失去了范型的表现力和安全性（在这里想到了python、js和ts的区别）

如果你想使用范型，但不知道实际的类型参数是什么，那么可以使用问好代替，例如，范型集`Set<E>`的无界通配符是`Set<?>`，它是最通用的参数话集合类型，能够容纳任何集合.

```java
    public void printHello(Set<?> a, Set<?> b){
        
    }
```

下面的例子是使用通用类型instanceof运算的首选方法。

```java
if(o instanceof Set){
  Set<?> s = (Set<?>) o;
}
```

`Set<Object>`是一个参数话类型，表示可以包含任何类型的对象的集合

`Set<?>`是一个通配符类型，表示只包含某种未知类型的对象的集合

`Set`是一个原始类型，它选择范型系统

前两个是安全的，后一个是不安全的。

![image-20241213001023857](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202412130010952.png)
