---
title: 策略模式（StrategyPattern）
createTime: 2025/07/02 23:17:40
permalink: /java/ohw212zy/
---

在真实的开发中，策略模式帮助了我很多。在工单的状态转化过程中使用到了策略模式，将生生的代码在认真撸一遍。

参考的代码仓库地址：[implement-study/strategy-pattern](https://github.com/implement-study/strategy-pattern)

## 策略模式基础

我们要知道我们为什么需要策略模式？

策略模式属于 **行为模式**，行为模式的含义就是：用于描述类和对象之间怎样相互协作共同完成单个对象无法单独完成的任务成，以及怎么划分职责。

通过策略模式这个名字，就知道会有多个策略，我们需要根据不同的条件，自动获取到对应的策略以执行。

## 策略模式的类图

（先暂时使用下面的类图）

![img](https://i-blog.csdnimg.cn/blog_migrate/8f9c7940be48e6da74290667a4ae5d52.png)

我们能够清除的看出有三大块，一个就是接口Strategy，定义了两个方法接口，operation1和operation2，然后就是两个实现接口Strategy的实现类ConcreteStrategyA和ConcreteStrategyB，最后就是将这些策略注册的Context。

## 读代码



### CustomService.java

```java
```

