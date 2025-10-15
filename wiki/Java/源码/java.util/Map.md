---
title: Map
createTime: 2025/07/16 18:10:51
permalink: /java/v5qyuogp/
---



简单看看Map接口的代码。



## 一、Map接口定义

Map是一个接口类。

```java
pulbic interface Map<K, V>{
  
  boolean isEmpty();
  boolean containsKey(Object var1);
  bollean containsValue(Object var1);
 
  V get(Object var1);
  V put(K var1, V var1);
  void putAll(Map<? extends K, ? extends V> var1);
  void clear();
  Set<K> keySet();
  Collection<V> values();
  Set<Entry<K, V>> entrySet();
}
```

## 二、存在的默认方法

###  2.1、default V getOrDefault(Object key, V defaultValue) 

如果存在key，返回默认值defaultValue。

```java
default V getOrDefault(Object key, V defaultValue) {
    Object v;
    return (v = this.get(key)) == null && !this.containsKey(key) ? defaultValue : v;
}
```

### 2.2、default V computeIfAbsent(K key, Function<? super k, ? extends V> mappingFunction)

如果存在key，则不执行后面的lambda表达式，如果key不存在就执行后面的lambda表达式。

```java
default V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction) {
    Objects.requireNonNull(mappingFunction);
    Object v;
    Object newValue;
    if ((v = this.get(key)) == null && (newValue = mappingFunction.apply(key)) != null) {
        this.put(key, newValue);
        return newValue;
    } else {
        return v;
    }
}
```

computeIfAbsent方法自动检测cnt是否已经存在于映射中，如果不存在，他就会使用Lambda表达式`k->0`来计算默认值0， 然后将这个值于cnt关联起来，如果cnt已经存在了，它什么也不会做，然后，无论键是否存在，我们都会增加其计数。

```java
public static void main(String[] args) {
    Map<String, Integer> cnt = new HashMap<>();
    String key = "Joe";

    cnt.computeIfAbsent(key, k -> 0);
    cnt.put(key, cnt.get(key) + 1);
}
```
