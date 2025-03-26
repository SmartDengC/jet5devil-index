---
title: JAVA知识点：学习使用Stream流
createTime: 2024/12/26 13:52:41
permalink: /article/o9gb2a3l/
---

你问我会用Java8的Stream流吗？我只能说你往下看。

<!-- more -->

[【java基础】吐血总结Stream流操作](https://blog.csdn.net/qq_43410878/article/details/123716629)

![](https://i-blog.csdnimg.cn/blog_migrate/39fb94d0579a1ebdc900de287c3cbc4b.png#pic_center)

中间操作：stream特性、stream创建、filter、map、sorted、提取和组合

终端操作：foreach、find、match、reduce、max、min、count、collect

## foreach

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
ints.forEach(System.out::println);
ints.forEach(x -> System.out.println(x + 1));
```

## filter

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<Integer> collect = ints.stream().filter(x -> x > 2).collect(Collectors.toList());
```



## max、min

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<String> names = Arrays.asList("张三", "李四", "王五", "放牛娃小姚", "养鸡娃小邓");

ints.stream().max(Comparator.comparing(Integer::intValue)).ifPresent(System.out::println);
ints.stream().max(new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
}).ifPresent(System.out::println);
names.stream().max(Comparator.comparing(String::length)).ifPresent(System.out::println);
```

## count

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));     
ints.stream().filter(x -> x > 2).count();
```



## 映射map

map：接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<String> words = Arrays.asList("In", "the", "Day", "I", "am", "very", "happy");
words.stream().map(String::toUpperCase).forEach(System.out::println);
ints.stream().map(x -> x + 2).forEach(System.out::println);
```

## 规约 reduce

规约也称缩减，是把一个流缩减成一个值，能实现对集合求和、求乘积和球最值操作。

## 收集 collect

collect可以说是内容最繁多、功能最丰富的部分。就是把流收集起来，最终可以是收集成一个值，也可以收集成一个新的集合。

collect主要依赖于java.util.stream.Collectors类内置的静态方法。

## 归集 toList、toSet、toMap

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<Integer> newInts = ints.stream().filter(x -> x % 2 == 1).collect(Collectors.toList());
Set<Integer> newInts2 = ints.stream().filter(x -> x % 2 == 1).collect(Collectors.toSet());

```

## 统计 count、averaging

Collectors提供了一些用于数据统计的静态方法：

- 计数： count
- 平均值：averagingInt averagingLong averagingDouble
- 最值：maxBY、minBy
- 求和：summingInt、summingLong、summingDouble
- 统计以上所有值：summarizingInt ...

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
Long collect = ints.stream().collect(Collectors.counting());
long count = ints.stream().count();
int size = ints.size();
```



## 分组 groupingBy、partitioningBy

- 分区： 将stream按条件分成两个Map
- 分组：将集合分为多个Map

## 排序 sorted

sorted，中间操作，有两种排序：

- sorted()：自然排序，流中元素需实现Comparable接口
- sorted(Comparator com): Comparator排序器自定义排序 

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
// 正序输出
ints.stream().sorted().map(String::valueOf).collect(Collectors.joining(","));
// 逆序输出
ints.stream().sorted(new Comparator<Integer>() {
     @Override
     public int compare(Integer o1, Integer o2) {
          return o2 - o1;
     }
}).map(String::valueOf).collect(Collectors.joining(","));
// 逆序输出
ints.stream().sorted(Comparator.reverseOrder()).map(String::valueOf).collect(Collectors.joining(","));
```

## 去重、合并 distinct、skip、limit

流也可以进行合并、去重、限制、跳过

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8));
System.out.println(ints.stream().distinct().map(String::valueOf).collect(Collectors.joining(",")));
System.out.println(ints.stream().limit(4).map(String::valueOf).collect(Collectors.joining(",")));
```

