---
title: JSON
createTime: 2025/05/14 17:12:55
permalink: /java/qwm62hxg/
---
学习一下 阿里 的json工具。

```java
public interface JSON {
  
}
```

JSON是一个接口，里面有许多的静态实现类。

```java
static JSONArray parseArray(String text) {}

```



### parse()



### parseArray()



### parseObject()

```java
        List<Integer> lit = new ArrayList<>();
        String jsonString = JSONObject.toJSONString(lit);
        JSONArray objects = JSON.parseArray(jsonString);
```



```java
        /**
         * JSON.parseArray(JSONObject.toJSONString(studentList))
         * JSON.parseArray(JSON.toJSONString(studentList));
         * JSONObject.parseArray(JSONObject.toJSONString(studentList));
         * JSONArray.parseArray(JSONObject.toJSONString(studentList));
         * 源码了解。
         */
```

