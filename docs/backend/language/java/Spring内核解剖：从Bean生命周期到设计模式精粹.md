---
title: Spring内核解剖：从Bean生命周期到设计模式精粹
createTime: 2025/01/15 15:09:40
permalink: /article/umyyg2k7/
---

《Spring Framework内核解剖：从Bean生命周期到设计模式精粹》一文深入剖析了Spring框架的核心机制，重点探讨了Bean的生命周期、依赖注入（DI）和控制反转（IoC）等关键特性。文章结合实际代码案例，详细阐述了Spring如何通过简洁而强大的设计模式实现高效的容器管理，并揭示了其
在企业级应用开发中的广泛应用。通过对Spring内核的设计理念和实现细节的解读，本文为开发者提供了深入理解框架原理的视角，同时总结了Spring框架在依赖管理、面向切面编程（AOP）以及事务处理等方面的优势。

**关键词**

- Bean生命周期
- 依赖注入
- 控制反转
- 设计模式
- 面向切面编程（AOP）

<!-- more -->

**《Spring IoC容器源码的量子纠缠：三级缓存与循环依赖终极破译》**

**《跟着Spring源码学架构：手写迷你版IoC容器实践指南》**

**《从Spring事务源码到分布式系统设计：ACID的工业化实现》**

## 一、获取Spring源码

使用spring5的源码来阅读

```
git clone https://github.com/spring-projects/spring-framework
```

使用idea导入gradle项目: [IntelliJ IDEA导入Gradle项目，并启动项目](https://blog.csdn.net/caicai1171523597/article/details/120057915) 

## 二、

IOC反转控制，通俗来讲就是将创建并且绑定数据bean的权利赋予给spring容器（或spring ioc容器），在bean生成或者初始化的时候，Spring容起就会将数据注入到bean中，又或者通过将对象的引用注入到对象数据域中的方式来注入对方法调用的依赖。

BeanFactory

ApplicationContext应用上下文

ApplicationContext包含BeanFactory的所有功能。

读取xml配置文件的方法：

```java
BeanFactory bf = new XmlBeanFactory(new ClassPathResource("application.xml"));
ApplicationContext bf = new ClassPathXmlApplicationContext("appliation.xml");
```

### DefaultListableBeanFactory

DefaultListableBeanFactory是整个bean加载的核心部分，是spring注册及加载bean的默认实现

- AliasRegistry 接口：  alias指的是bean的别名，aliasRegistry定义了对alias的增删改查等操作
- SimpleAliasRegistry 类：主要是用map作为alias的缓存，并对接口AliasRegistry进行实现
- SingletonBeanRegistry 接口：定义对单例的注册和获取
- BeanFactory 接口：定义获取bean和bean的各种属性
- DefaultSingletonBeanRegistry 接口：实现了SingletonBeanRegistry的方法，同时继承了SimpleAliasRegistry

### XmlBeanDefinitionReader

xml配置文件的读取是spring中最重要的功能，因为spring的大部分功能都是以配置作为切入点，XmlBeanDefinitionReader实现了对资源文件的读取、解析以及注册。

- Spring容器的生命周期分为几个阶段？Spring容器的初始化发生在什么时候，发生了什么？Spring容器的销毁过程又发生了什么？
- Sprring容器什么时候读取xml配置文件？并且把配置信息读取？Spring容器用什么数据结构存储用于常见bean的k/v信息/
- Spring容器获取了用户创建bean的kv信息后，在什么是糊去创建并初始化bean？
