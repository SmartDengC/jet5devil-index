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

### 9、什么事自动拆箱，装箱？

就是基本类型与包装类型之间的转化问题。

```java
Integer i = 10; // 装箱
int n = i; // 拆箱
```

i 是Integer类型，n是int类型；变量i是包装类型，变量n是基本数据类型。

### 10、&与&&有什么区别？

&和&&都是运算符。

&是位运算符，按位与，只有两端都是1的时候结果才为1.

&&是逻辑运算符，当两个操作都为true，结果为true，如果前面的结果为false，&&就会出现短路现象，不走后面的逻辑。

### 11、switch语句能否用在byte、long、String类型上？

Java5以前，switch(expr)中，expr只能是byte，short，char，int

从java5开始，java中引入了枚举类型，expr也可以是枚举类型

从java7开始，expr可以是字符串，但是长整形目前还不可以。

### 12、break、continue、return的区别及作用？

break跳出整个循环，但是只会跳出一层循环。

continue跳出本次循环

return 程序返回，不再执行下面的代码。

### 13、用效率最高的方法计算2乘以8？

 8等于2的三次方，所以2*8 可以写成2 << 3，表示将最高位不为0的1左移3位。

### 14、说说自增自减运算？

以++为例来说明，++在前，就先加，然后在赋值，如果++在后，就先赋值，然后在加。

“符号在前就先加减，符号在后就后加减”。

```java
int i = 1;
i = i++;
// 1
sout(i);
```

答案是1，结果是不是有点离谱？

对于JVM来说，它对自增运算的处理，是会先定义一个临时变量来接受i的值，然后进行自增运算，最后又将临时变量赋值给值为2的i，所以结果为1.

### 18、面向对象编程有哪些特性？

[深入理解Java三大特性：封装、继承和多态](https://javabetter.cn/oo/encapsulation-inheritance-polymorphism.html)

封装、继承、多态



封装：是将数据和操作数据的方法捆绑在一起，形成一个独立的对象（类的实例）。

继承：允许一个子类继承现有类的属性和方法，以提高代码的复用性，建立类之间的层次关系；同时支持子类重写和扩展父类的属性和方法，从而实现多态。

多态：允许不同类的对象对同一消息作出相应，但表现出不同的行为（即方法的多样性）



为什么Java里面要多组合少继承？

继承适合描述“is-a”的关系，但是继承容易导致类之间的强耦合性，一旦父类发生变化，子类也要随之变化，违背了开闭原则。

组合适合描述“has-a”或者“can-do”的关系，通过在类中组合其他类，能够更加灵活的扩展功能，组合避免了复杂的类的继承体系，同时准守了开闭原则和松耦合的设计原则。

```java
// 形状接口
interface Shape {
    void draw();
}
// 颜色接口
interface Color {
    void applyColor();
}
```

形状干形状的事情：

```java
// 圆形的实现
class Circle implements Shape {
    private Color color;  // 通过组合的方式持有颜色对象

    public Circle(Color color) {
        this.color = color;
    }

    @Override
    public void draw() {
        System.out.print("Drawing a circle with ");
        color.applyColor();  // 调用颜色的逻辑
    }
}

// 矩形的实现
class Rectangle implements Shape {
    private Color color;

    public Rectangle(Color color) {
        this.color = color;
    }

    @Override
    public void draw() {
        System.out.print("Drawing a rectangle with ");
        color.applyColor();
    }
}
```

颜色干颜色的事情：

```java
// 红色的实现
class RedColor implements Color {
    @Override
    public void applyColor() {
        System.out.println("red color");
    }
}

// 绿色的实现
class GreenColor implements Color {
    @Override
    public void applyColor() {
        System.out.println("green color");
    }
}
```

### 20、重载和重写的区别？

重载是在同一个类中，相同的方法名，不同的参数个数和返回值的方法（overload）。

重写是在继承中，重写父类的方法，此时的方法名、参数个数、返回值都相同（override）。

LSP 里氏替换原则，子类能够替换他的基类，

### 21、访问修饰符public、protected、private以及默认时的区别？

- default：默认时，同一包可见，可以修饰类、接口、方法、属性
- public：全局可见，可以修饰类、接口、方法、属性
- protected：包可见，可以修饰方法、属性
- private：同一类可见，可以修饰方法、属性

### 23、抽象类和接口有什么区别？

抽象类属于类，在java中，类只能单继承；接口可以实现多继承。

抽象类具有构造函数，接口不具有构造函数 。

抽象类可以有抽象方法，也可以有普通方法，普通方式需要实现；接口主要是定义一组方法规范，没有具体的实现细节。

### 24、成员变量和局部变量的区别？

- 语法上：成员变量是定义在类中，局部变量是定义在方法中。
- 在内存中存储方式上：如果成员变量使用static修饰，那么变量属于类，没有的话，就属于变量实例。对象存储在堆上，如果局部变量类型为基本类型，那么存储在栈内存，如果为引用数据类型，那么存放的是指向堆内存对象的引用或者是指向常量池中的地址。
- 生存时间上：成员变量随对象而创建，局部变量随方法的调用而自动消失
- 赋值上：没有final修饰的成员变量，会自动设置默认值，成员变量必须手动设置默认值（final必须显示的赋值）

### 25、static关键字了解吗？

static关键字可以用来修饰变量、方法、代码块、内部类，以及导入包。

修饰对象：作用

- 变量：静态变量、类级别变量，所有实例共享同一份数据
- 方法：静态方法，类级别方法，与实例无关。
- 代码块：在类加载时初始化一些数据，只执行一次。
- 内部类：与外部绑定但独立于外部类实例。
- 导入：可以直接访问静态成员，无需通过类名引用，简化代码书写，降低代码可读性。

静态变量：是被static修饰符修饰的变量，也称为类变量，他属于类，不属于类的任何一个对象，一个类不管有多少实例，静态变量在内存中有且仅有一个副本。

实例变量：必须依附于某一实例，需要先创建对象之后才能访问。静态变量可以实现让多个对象共享内存。

### 26、final关键词有什么作用？

final可以修饰类、方法、变量。

修饰类的时候，表明该类不能被继承；修改方法的时候，表明该方法不能被重写；修饰变量的时候，表明变量一旦赋值就不能在修改。

### 28、==和equals的区别？

- ==：用于比较两个对象的引用，即它们是否指向同一对象实例。简单来说就是比较引用是否相同，对于基本类型（比如int，double，char等）比较的是值是否相等
- equals：比较两个对象的值是否相等。

### 32、Java创建对象有哪几种方式？

- 通过new关键字创建对象

> 需要注意下：当new子类的时候，子类和父类静态代码块、构造方法的执行顺序。
>
> 首先执行父类的静态代码块
>
> 接着是子类的静态代码块
>
> 在执行父类的构造方法
>
> 最后是子类的构造方法。

- 反射：反射允许运行是创建对象，并且可以访问类的私有成员，在框架中比较常见。

  ```java
  Class clazz = Class.forName("Person");
  Person person = (Person) clazz.newInstance();
  ```

- 采用clone机制： 需要实现Cloneable接口并重写clone方法

  ```java
  Person person = new Person();
  Person person2 = (Person) person.clone();
  ```

- 通过序列化： 通过序列化将对象转化成字节流，在通过反序列化从字节流中恢复对象。需要实现Serializable接口

```java
Person person = new Person();
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.txt"));
oos.writeObject(person);
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.txt"));
Person person2 = (Person) ois.readObject();
```

### 36、字符串拼接是如何实现的？

```java
String a = "hello ";
String b = "world!";
String ab = a + b;
```

比如上面的代码，第一行和第二行逻辑是一样的，就是判断方法区常量池里面是否有对应的字符串，如果有的话，直接返回引用，如果没有就在常量池里面创建一个，这个时候是不会在堆上面创建对象的。

第三行代码，就相当于调用StringBuilder或者StringBuffer来生成一个对象，然后通过append构建出来a+b的结果，`new StringBuilder().append(a).append(b).toString();`所以会在堆上创建对象。

### 37、Integer a=127,Integer b = 127; Integer c= 128,Integer d = 128;

a == b返回true，c ==d返回false。

这是因为Java在自动装箱过程中，会使用Integer.valueOf()方法来创建Integer对象，针对[-128, 127]的值会使用缓存来处理。

### 38、String怎么转化成Integer的？原理？

两个方法，一个是Integer.parseInt，转成int， 一个是Integer.valueOf转成Integer，使用缓存。

但是最后都会调到Integer类中的parseInt方法，不过计算有点反常规，使用负的值累减。

（就是将每个字符转成数字，然后乘以进制，在变成负数，最后在判断是否为负返回结果）

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/javase-20.png)

## 二、补充：

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
