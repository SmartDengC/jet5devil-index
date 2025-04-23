---
title: Spring注解：不要在傻傻分不清楚
createTime: 2025/01/16 09:32:01
permalink: /article/wjazlwza/
tags:
  - spring
---

## @Autowired注解

spring的注解

默认按类型装配，默认情况下必须要求依赖对象必须存在（不存在会报错），可以通过required=false属性设置非必须，如果我们想使用名称装配可以结合@Qualifier注解进行使用。

```java
@Autowired(required = false)
private Date date;

@Autowired
@Qualifier("birth")
private Date birthday;
```

当系统中存在多个相同类型的Bean时，如果不使用@Qualified程序启动会报错。

```java
@Bean
public Date d1(){
  return new Date;
}
public Date d2(){
  return new Date();
}
@Autowired
private Date date; // 会报错 required a single bean, but 2 found
```



## @Resource javaEE注解

默认按名称进行装配，可以通过name属性指定名称，如果没有指定name属性，当注解写在字段上时，默认取字段名进行查找注入，如果写在setter方法上默认取属性名进行装配。当找不到与名称匹配的bean时才按照类型进行装配。但是需要注意的是，如果name属性一旦指定，就会值按照名称装配：

```java
@Resource
private Date date;  // 会报错 No qualifying bean of type 'java.util.Date'
```

因为我们没有以date为名称的bean，所以会按照类型注入，但是类型又有两个Date的bean，将date改成d1或者d2指明name属性

```java
@Resource("d1")
private Date date;
```

## @Qualifier 

[Spring注解@Qualifier的详细用法你知道几种](https://blog.csdn.net/zhijingzhi/article/details/125128784)

筛选注入对象

```java
@Resource
@Qualifier
private List<Date> dates = Collections.emptyList();
```

直接使用@Qualifier， 起到一个筛选的作用，只有Bean上有@Qualifier注解的bean才会被收集注入

## @Transactional

Spring事务管理。[事务注解 @Transactional 失效的3种场景及解决办法](https://blog.csdn.net/hollis_chuang/article/details/115713374)

保证数据的原子性，对于多个操作，要么都成功，要么都不成功。比如两个表的新增，第二个表需要获取到第一个表新增后的id，当在保存第二个表时报错，需要回滚第一个表的新增操作。

需要确认所使用的数据库是否支持事务管理。

在使用过程中，可能@Transactional不生效：

- 方法不是public的
- 在类内部调用类内部标有@Transactional的方法，比如：

```java
@Component
public class Plan {
    @Transactionlal
    public void method() {
        // save模拟保存操作
        save();
    }

    public void invoke() {
        //类内部调用@Transactional标注的方法。
        method();
    }
}
```

- 事务方法内部捕获了异常，没有抛出新的异常，导致事务操作不回滚。

```java
@Component
public class plan {
    @Transactional
    public void invoke() {
        try {
            int i = 0;
            if (i == 0) {
                throw new Exception("i 等于 0 了");
            }
        } catch (Exception e) {
            System.out.println("i catch exception");
        }
    }
}
```

