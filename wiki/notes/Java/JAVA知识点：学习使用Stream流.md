---
title: Stream API的链式美学与性能密码
createTime: 2024/12/26 13:52:41
permalink: /java/o9gb2a3l/
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

## count

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));     
ints.stream().filter(x -> x > 2).count();
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

### groupingBy获取到对象的某个属性

```java
List<User> users = new ArrayList<>();
Map<String, List<Integer>> collect = users.stream()
  .collect(Collectors.groupingBy(User::getName, Collectors.mapping(User::getAge, Collectors.toList())));
```

### groupingBy对数据进行排序

输出的结果会根据TreeMap的key进行排序， 这里也就是User.name。

```java
TreeMap<String, List<User>> nameToObjs = users.stream().collect(Collectors.groupingBy(User::getName, TreeMap::new, Collectors.toList()));
```



## 去重、合并 distinct、skip、limit

流也可以进行合并、去重、限制、跳过

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8));
System.out.println(ints.stream().distinct().map(String::valueOf).collect(Collectors.joining(",")));
System.out.println(ints.stream().limit(4).map(String::valueOf).collect(Collectors.joining(",")));
```

快速简单学习使用Java8提供的新特性：Stream。

[Java 8 stream的详细用法](https://blog.csdn.net/y_k_y/article/details/84633001)

## 一、了解Stream内部的基本流程

### 1.1、流的中间操作

#### 1.1.1、筛选与切片

- filter：过滤流中某些元素

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<Integer> collect = ints.stream().filter(x -> x > 2).collect(Collectors.toList());
```

- limit(n)：获取n个元素
- skip(n)：跳过n元素
- distinct：通过流中元素的hashCode和equals去除重复的元素

#### 1.1.2、映射map

- map：接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
List<String> words = Arrays.asList("In", "the", "Day", "I", "am", "very", "happy");
words.stream().map(String::toUpperCase).forEach(System.out::println);
ints.stream().map(x -> x + 2).forEach(System.out::println);
```

#### 1.1.3、排序sorted

- sorted：自然排序，流中元素需实现Comparable接口
- sorted(Comparator com)：定制排序，自定义Comparator排序器

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



### 1.2、流的终止操作

#### 1.2.1、匹配、聚合操作

- a l lMatch:
- noneMatch：
- anyMatch：
- findFirst：返回流中第一个元素

```java
int[] arr = new int[]{1,2,3};
// findFirst返回的是一个Optional对象
Optional<Integer> first = Arrays.stream(arr).boxed().findFirst();
```

- findAny：返回流中的任意元素

```java
int[] arr = new int[]{1,2,3};
// findAny返回的是一个Optional对象
Optional<Integer> any = Arrays.stream(arr).boxed().findAny();
```

- count：返回流中元素的总个数
- max：返回流中最大的元素
  - max和min两个方法都需要传入一个Comparator的比较器，返回的也是Optional的对象


```java
int[] y = new int[26];
Arrays.stream(y).forEach(System.out::println);
Optional<Integer> max = Arrays.stream(y).boxed().max(Integer::compare);
Optional<Integer> max1 = Arrays.stream(y).boxed().max(Integer::compareTo);
Optional<Integer> max1 = Arrays.stream(y).boxed().max(Comparator.comparing(Integer::intValue));
```

- min：返回流中最小的元素

```java
List<String> names = Arrays.asList("张三", "李四", "王五", "放牛娃小姚", "养鸡娃小邓");
Optional<String> min1 = names.stream().min(String::compareTo);
Optional<String> min = names.stream().min(Comparator.comparing(String::length));
```

## 二、Stream实例说明

### 2.1、问：java列表对象， 需要对某一个字段进行排序，但是这个字段里面有一些会存在空值的情况。处理代码如下：

```java
batches.sort(
  Comparator.comparing(TCutBatch::getDaySeq,Comparator.nullsFirst(Integer::compareTo))
  .thenComparing(TCutBatch::getCreateTime)
  .reversed());
```

`Compartor.comparing(TCutBatch::getDaySeq)`对dayseq字段进行排序，`Compartor.nullsFirst(Integer::compareTo)`表示如果有空值的话就放到列表的首位； `.themComparing(TCutBatch::getCreateTime)`先根据dayseq排序，在根据createTime排序，最后在反转数据。

### 2.2、问：java列表转字典的时候，如果存在相同的key的话，就会出现多个value值的报错。

处理这个问题一般有三种方式，一个是用那个值，第二个就是将所有值进行合并， 第三个就是value用列表来存。

```java
reportSegmentCells.stream().collect(Collectors.toMap(
		TReportSegmentCell::getCellId, Function.identity(), (v1,v2)->{return v1;}
));
```

`(v1,v2)->{retur v1;}`表示用前值；`(v1,v2)->{return v2;}`就表示用后值覆盖前值。

### 2.3、问：从对象列表中获取到某个属性集合，并去重

```java
List<Long> equModelIdList = equList.stream()
                .map(TEqu::getEquModelId).distinct().collect(Collectors.toList());
// .map() 获取到所有的属性值
// .distinct() 去重
// .collect() 转成对应结构
```

### 2.4、问：获取数组的最小值，获取数组不同值的个数

```java
int min = Arrays.stream(nums).min().getAsInt();
int distinceCount = (int) Arrays.stream(nums).distinct().count();
```

### 2.5、问、数组基本类型和封装类型转化

```java
// 原始类型转化成封装类型
int[] ar = new int[]{1,2,3};
List<Integer> collect = Arrays.stream(ar).boxed().collect(Collectors.toList());
Integer[] integers = Arrays.stream(ar).boxed().toArray(Integer[]::new);

// 封装类型转化成原始类型
Integer[] ar1 = new Integer[]{1,2,3};
int[] ints = Arrays.stream(ar1).mapToInt(Integer::intValue).toArray();
```

