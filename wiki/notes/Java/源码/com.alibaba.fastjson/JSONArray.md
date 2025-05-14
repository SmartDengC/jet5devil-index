---
title: JSONArray
createTime: 2025/05/14 17:31:16
permalink: /java/imhjl4yu/
---
```java
        List<Integer> lit = new ArrayList<>(Arrays.asList(1, 2, 3, 4));

        String jsonString = JSONObject.toJSONString(lit);
        JSONArray objects1 = JSONArray.parseArray(jsonString);
        List<Integer> integers = JSONArray.parseArray(jsonString, Integer.class);
```





### public static JSONArray parseArray(String text)

```java
public static JSONArray parseArray(String text) {
    return parseArray(text, ParserConfig.global);
}
```

### parseArray

```java
public static <T> List<T> parseArray(String text, Class<T> clazz) {
    return parseArray(text, clazz, ParserConfig.global);
}
```
