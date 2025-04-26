---
title: JAVA问题集：找寻问题的答案
author: 邓聪的小破站
createTime: 2024/08/01 10:09:40
permalink: /article/u1ugmp0a/
tags: 
  - java
  - 问题集
---

记录自己在使用Java过程中遇到的问题，看下去，说不定一也有相同问题，能够找到解决办法。

<!-- more -->

## 一、字符串（String）

### 1.1、数字转化成指定位数的字符串，不足的进行补零

[java将数字转换为指定位数的字符串](https://blog.51cto.com/u_16213466/7876568)

#### 1.1.1、String.format()方法转换

```java
String.format("%04d", 22);  // "0022"
String.format("%05d", 22);  // "00022"
```

0代表前面要补的字符， 4表示字符串的长度， d表示参数为整数类型。

#### 1.1.2、DecimalFormat类转换

```java
DecimalFormat df = new DecimalFormat("0000");  // 0的位数表示最后输出位数
String result = df.format(22); // "0022"
```

"0000"表示将数据格式化为4位长度的字符串，不足4位时使用0填充，超过4位不做处理。

#### 1.1.3、StringBuilder类拼接字符串

```java
int len = 4, num = 22;
StringBuilder sb = new StringBuilder();
sb.append(num);
while(sb.length()<len){
  sb.insert(0, "0");
}
String result = sb.toString();
```

## 二、日期（Date，Calendar）

### 2.1、获取到日期的年月日

```java
// Date 
Date date = new Date();
int year = Integer.parseInt(String.format("%tY", date));
int month = Integer.parseInt(String.format("%tm", date));
int day = Integer.parseInt(String.format("%td", date));
int hour = Integer.parseInt(String.format("%tH", date));
int minute = Integer.parseInt(String.format("%tM", date));
int second = Integer.parseInt(String.format("%tS", date));

// Calendar
Calendar calendar = Calendar.getInstance();
int year = calendar.get(Calendar.YEAR);
// 月份是从0开始算的
int month = calendar.get(Calendar.MONTH) + 1;
int day = calendar.get(Calendar.DAY_OF_MONTH);
int dayMin = calendar.getActualMinimum(Calendar.DAY_OF_MONTH);
int dayMax = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
```



## 三、进制

### 3.1、十进制转二进制

```java
String string = Integer.toString(10, 2);  // 1010
String binaryString = Integer.toBinaryString(10);  // 1010
```



```java
int i = 1 << 2; // 4 左移操作
```



## 四、随便问

[Java 数据长度获取方式对比：length属性、length()和size()方法](https://blog.csdn.net/DaPiCaoMin/article/details/136851235)

字符串使用cha r[]实现的，字符串提供了一个length()的方法，用来获取char[]数组的长度

```java
private final char value[];
public int length() {
    return value.length;
}
```

数组的话，默认有一个length的属性，可以直接调用。

集合的话，维护了一个size的属性，但是返回长度是用size()方法。

```java
private int size;
public int size() {
    return size;
}
```

