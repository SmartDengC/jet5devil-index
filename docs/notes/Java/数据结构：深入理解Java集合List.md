---
title: 深入理解Java集合List
createTime: 2024/12/06 16:03:32
permalink: /java/mhzvrsmh/
---



## 创建List并初始化

简单记录一下java中创建List并赋值的操作

### new ArrayList<>()

```java
    public List<Integer> list1(){
        List<Integer> l1 = new ArrayList<>();
        l1.add(1);
        l1.add(2);
        l1.add(3);
        System.out.println("l1 = " + l1);
        return l1;
    }
```

### Arrays.asList()

```java
    public List<Integer> list2(){
        // 不可变化
        List<Integer> list = Arrays.asList(1, 2, 3);
        // 可变化
        List<Integer> list2 = new ArrayList<>(Arrays.asList(1, 2, 3));
        list2.add(5);
        System.out.println(list2);
        return list2;
    }
```

### List匿名内部类

```java
    public List<Integer> list3(){
        // 匿名内部类
        List<Integer> list3 = new ArrayList<Integer>(){{
            add(1);
            add(2);
            add(3);
        }};
        System.out.println(list3);
        return list3;
    }
```

### Stream.of()

```java
    public List<Integer> list4(){
        List<Integer> list4 = Stream.of(1, 2, 3, 4).collect(Collectors.toList());
        System.out.println(list4);
        return list4;
    }
```

### Lists.newArrayList()

```java
    public List<Integer> list5(){
        // pom里面需要加入com.google.guava的依赖
        List<Integer> list5 = Lists.newArrayList(1, 2, 3, 4);
        System.out.println(list5);
        return list5;
    }
```

