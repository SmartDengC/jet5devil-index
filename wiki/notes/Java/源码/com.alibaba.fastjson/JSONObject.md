---
title: JSONObject
createTime: 2025/05/14 17:13:00
permalink: /java/ar6h16u8/
---

学习一下阿里的FastJson。

Pom.xml依赖：

```xml
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>fastjson</artifactId>
	<version>2.0.33</version>
</dependency>
```

使用的fastjson 2.x的版本。

## 一、JSON

在FastJson中，JSON类和JSONObject类是两个核心组件，其中，JSON是一个工具类，提供了全局性的静态方法来处理JSON数据的解析和生成。而JSONObject则是一个具体的实现类，用于表示一个可变的JSON对象，并支持键值对操作：

- JSON：适合简单的JSON解析和生成任务
- JSONObject：适合需要动态修改或复杂的操作场景

### 1.1、JSON接口的定义

JSON是一个接口类，里面有许多的静态实现类。

```java
public interface JSON {
    static JSONObject parseObject(String text) {...}
    static < T > T parseObject(String text, Class < T > clazz) {...}
    static JSONArray parseArray(String text) {...}
    static String toJSONString(Object object) {...}
}
```

### 1.2、内置方法

提供了许多解析方法，例如：`toJSONString()`，`parse()`，`parseArray()`，`parseObject()`等

#### JSON.toJSONString()

```java
List<Integer> lit = new ArrayList<>(Arrays.asList(1,2,3,4,455));

// [1,2,3,4,455]
String s = JSON.toJSONString(lit);
```

#### JSON.parseObject()

事例一：

```java
// 使用JSON类
String jsonString = "{\"name\":\"Alice\", \"age\":25}";
Map<String, Object> map = JSON.parseObject(jsonString, Map.class);
```

事例二：

```java
String jsonStr = "{\"id\":1,\"name\":\"张三\",\"age\":18}";
JSONObject jsonObject = JSON.parseObject(jsonStr);
// 1
int id = jsonObject.getIntValue("id");
// 张三
String name = jsonObject.getString("name");
```

#### JSON.parseArray()

```java
// JSONArray继承ArrayList，lit是一个列表
JSONArray lit = JSON.parseArray("[1,2,3,4,455]");
// 转化成数组
Integer[] integers = lit.toArray(Integer.class);
```

## 二、JSONObject

上面简单说了JSONObject和JSON的区别。JSONObject类定义，继承自LinkedHashMap。

```java
public class JSONObject extends LinkedHashMap<String, Object> implements InvocationHandler {}
```

JSONObject操作：

```java
// 使用JSONObject类
JSONObject jsonObject = new JSONObject();
jsonObject.put("name", "Alice");
jsonObject.put("age", 25);
jsonObject.remove("age");
```

## 三、JSONArray

JSONArray类定义，JSONArray继承自ArrayList，List具有的方法它都具有。

```java
public class JSONArray extends ArrayList<Object> {}
```

JSONArray的简单操作：

```java
List < Integer > lit = new ArrayList < > (Arrays.asList(1, 2, 3, 4));
// 将列表对象转成字符串
String jsonString = JSONObject.toJSONString(lit);
// 通过parseArray，将字符串转化成JSONArray对象
JSONArray objects1 = JSONArray.parseArray(jsonString);
// 通过传入对应的class来转换
List < Integer > integers = JSONArray.parseArray(jsonString, Integer.class);
```

#### public static JSONArray parseArray(String text)

```java
public static JSONArray parseArray(String text) {
    return parseArray(text, ParserConfig.global);
}
```

## 四、功能补充

### 4.1、使用注解控制序列化和反序列化

在下面的代码中，@JSONField注解指定了JSON字段的名称、是否序列化、日期格式等属性。可以使用以下代码进行序列化和反序列化：

```java
public class User {
    @JSONField(name = "userId")
    private int id;
  
    @JSONField(serialize = false)
    private String name;

    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date birthday;
}
```

