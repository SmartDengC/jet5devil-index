---
title: Vue：moment学习记录
author: 阿聪小破站
createTime: 2024/01/29 20:31:59
permalink: /article/xw7xufgn/
tags:
  - vue
  - moment
---

这里就是简单的记录 moment 的简单使用，

moment 就相当于 python 中的 datetime 的库

前言

在日常开发中，我们常常遇到一下几种场景

- 需要对日期进行非标准格式展示，如： 2021 年 5 月 11 日星期二下午 6 点 42
- 需要对日期进行处理，如果要取钱 24 小时的时间等。

在这里使用 js 原生的 new Date()处理就有麻烦了，因此我们找到了 moment 这个类库

## 20240129 更新

现在脑子里面都是迷糊的，手也是冻的不行。

我们这里就说怎样弄 momentjs 就行了，对于一个没有一点前端基础的人来说。

新建一个 html 的文件，然后导入 momentjs 的 cdn 文件，然后就可以在 script 标签里面使用 moment 的以下方法了

下面是代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    // 使用script标签导入momentjs文件
  </head>
  <body>
    <script>
      var currentTime = moment().format("YYYY-MM-DD"); // 定一个变量来接受当前时间
      console.log(currentTime); // console log打印出来
    </script>
  </body>
</html>
```

api 参考

[moment.js 的常用方法](https://blog.csdn.net/halo1416/article/details/83620022)
