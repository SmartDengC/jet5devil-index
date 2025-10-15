---
title: JS：JavaScript写算法
author: 阿聪小破站
createTime: 2024/02/13 19:50:50
permalink: /vue/1lxehg5i/
tags: 
  - js
---

在写算法过程中，看到 b 站上一个博主用 js 来处理，突然灵光一现，我也可以将 java 的题解用 js 来实现，慢慢的学习 js 的使用。

下面记录 js 的一些语法、api 和思路。

## 语法

**while 语法**

```js
var hIndex = function(citation){
  let i = citation.length, h=1;
  while(i>=0 && citation[i]>=h){
    ...
  }
}
```

## 思路

**排序**

```js
var hIndex = function (citation) {
  citation.sort((a, b) => a - b); // 升序排序
};
```

sort 函数可以不传参数，但是这个时候排序是一个字符一个字符排，数字也是一样，比如 11 会排到 2 的前面。

reverse 函数与 sort 类似，是反转的意思。

```js
s = [40, 100, 1, 5, 25, 10];
undefined;
points.sort(); // [1, 10, 100, 25, 40, 5]
points.reverse(); // [5, 40, 25, 100, 10, 1]
points.sort((a, b) => a - b); // [1, 5, 10, 25, 40, 100]
points.sort((a, b) => b - a); // [100, 40, 25, 10, 5, 1]
```
