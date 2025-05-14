---
title: JSON
createTime: 2025/05/14 17:12:55
permalink: /java/qwm62hxg/
---
学习一下 ali 的json工具。



json

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

