---
title: 面向对象编程OOP
createTime: 2025/07/18 18:09:38
permalink: /design-pattern/qgrlsni4/
---

::: tip

1、什么是OOP？

2、三大特性：封装、继承、多态如何实现？

:::

## 什么是面线对象编程？

面向对象编程（Object-Oriented Programming， OOP）是一种将**数据**和**操作数据的方法**封装成**对象**的编程方式。他的核心思想就是：“将复杂世界抽象成一个个对象，通过对象之间的交互解决问题。”

## OOP的三大特性：封装、继承和多态

### 1、封装：将数据和方法隐藏在类中

特点：

- 隐藏在内部实现，保护数据安全
- 提供统一接口访问数据，提高代码的可维护性。

代码实例：

```java
public class Person {

    private final String name;

    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getPersonInfo() {
        return this.name + ", " + this.age;
    }
}
```

说明：

name和age属于私有属性，一旦赋值就不能修改，外部无法直接访问

提供getPersonInfo方法，安全访问数据。



### 2、继承：子类复用父类的属性和方法

- 子类复用父类的代码，减少冗余
- 支持功能扩展，保持结构清晰。



实例：

定义一个Human的类，其中包含了name和age，定义了一个获取信息的方法getInfo。

```java
public class Human {
    private final String name;

    private final int age;

    public Human(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getInfo() {
        return this.name + ", " + this.age;
    }
}
```

定义一个Person的类，继承Human，可以直接调用父类的getInfo方法返回对应的信息。

```java
public class Person extends Human {

    public Person(String name, int age) {
        super(name, age);
    }

    public static void main(String[] args) {
        Human human = new Person("Dhh", 18);
        System.out.println(human.getInfo());
    }
}
```

### 3、多态：同一接口，不同表现形式

多态：在类继承/接口实现情况下的一种行为，表现为：对象多态，行为多态。

- 多态的前提：有继承/实现关系；存在父类引用子类对象；存在方法重写。
- 注意事项：多态是对象、行为的多态，java中属性（成员变量）不谈多态。

特点：

- 同一接口，执行不同对象的行为。
- 提高代码的灵活性和可扩展性。

实例：

父类Person

```java
public class Person {
    private final String name;
    private final int age;
    public int getAge() {
        return age;
    }
    public String getName() {
        return name;
    }
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getInfo() {
        return this.name + ", " + this.age;
    }
}
```

子类Teacher

```java
public class Teacher extends Person {
    public Teacher(String name, int age) {
        super(name, age);
    }
    @Override
    public String getInfo() {
        return "重写父类的getInfo方法返回：" + getName() + "," + getAge();
    }
}
```

调用

```java
public static void main(String[] args) {
    // 对象对态
    Person person = new Teacher("Dhh", 18);
    // 行为多态
    person.getInfo();

    Person teacher = new Teacher("Dhh", 18);
    teacher.getInfo();
}
```

