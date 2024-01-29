

简单写一个vue的使用系列



## 20240129更新

这里写从html中如何使用vuejs

使用script标签导入vuejs， 使用script标签 创建一个vue对象，并绑定到具体标签上面。

data是vue双向绑定的数据

methods是写方法的地方。

mounted vue的生命周期，在挂载的时候，会加载这个里面的东西

created vue的生命周期，在加载文件的时候会调用里面的方法



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

