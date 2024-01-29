



这里就是简单的记录moment的简单使用，

moment就相当于python中的datetime的库



前言

在日常开发中，我们常常遇到一下几种场景

- 需要对日期进行非标准格式展示，如： 2021年5月11日星期二下午6点42
- 需要对日期进行处理，如果要取钱24小时的时间等。

在这里使用js原生的new Date()处理就有麻烦了，因此我们找到了moment这个类库



## 20240129更新

现在脑子里面都是迷糊的，手也是冻的不行。

我们这里就说怎样弄momentjs就行了，对于一个没有一点前端基础的人来说。

新建一个html的文件，然后导入momentjs的cdn文件，然后就可以在script标签里面使用moment的以下方法了

下面是代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>  // 使用script标签导入momentjs文件
  </head>
  <body>
    <script>
      var currentTime = moment().format("YYYY-MM-DD");  // 定一个变量来接受当前时间
      console.log(currentTime);  // console log打印出来
    </script>
  </body>
</html>

```

api 参考

[moment.js 的常用方法](https://blog.csdn.net/halo1416/article/details/83620022)
