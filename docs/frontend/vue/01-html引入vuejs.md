---
title: 01-html引入vuejs
author: 
createTime: 2024/01/29 21:05:59
permalink: /article/t2lt4360/
---

简单写一个 vue 的使用系列

## 20240129 更新

这里写从 html 中如何使用 vuejs

使用 script 标签导入 vuejs， 使用 script 标签 创建一个 vue 对象，并绑定到具体标签上面。

data 是 vue 双向绑定的数据

methods 是写方法的地方。

mounted vue 的生命周期，在挂载的时候，会加载这个里面的东西

created vue 的生命周期，在加载文件的时候会调用里面的方法

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- 引入vue的js文件 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>
    <!-- 创建一个根元素 -->
    <div class="home" id="home">Hello {{world}}</div>
    <script>
      // 将vue挂在到id为home的根元素上
      var vm = new Vue({
        el: "#home",
        data() {
          return {
            world: "vue",
          };
        },
        methods: {},
        mounted() {},
        created() {},
      });
    </script>
  </body>
</html>
```
