---
title: 入手VueRouter、Vuex（三）
createTime: 2025/02/10 15:05:56
permalink: /vue/b990m52q/
tags:
  - vue
  - vuerouter
  - vuex
---

[30分钟学习Vue之VueRouter&Vuex趁着暑假掌握一门技巧，大学生前端实习毕业设计必备技能](https://www.bilibili.com/video/BV1zF411R7cR/?spm_id_from=333.337.search-card.all.click&vd_source=35e7dde81183ac464990a0a0ab794bce)

项目结构：

```shell
├── README.md
├── jsconfig.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.vue
    ├── assets
    ├── components
    ├── main.js
    ├── router
    ├── store
    └── views
```

## 一、Vue Router

VueRouter主要做的就是路由跳转。	

如果我们使用Vue CLI创建项目的时候勾选了Vue Router的话，我们就会得到一个默认的Router的配置文件。

```js
// src/router/index.js
// 导入所需的 Vue 和 Vue-Router 库
import Vue from "vue";
import VueRouter from "vue-router";
// 导入首页视图组件
import HomeView from "../views/HomeView.vue";

// 安装 VueRouter 插件
Vue.use(VueRouter);

// 定义路由配置数组
const routes = [
  {
    path: "/", // 根路径
    name: "home", // 路由名称
    component: HomeView, // 对应的组件
  },
  {
    path: "/about", // about 页面的路径
    name: "about", // 路由名称
    // 路由级代码分割
    // 这会生成一个独立的 chunk 文件 (about.[hash].js)
    // 当路由被访问时才会加载（懒加载）
    component: function () {
      return import(/* webpackChunkName: "about" */ "../views/AboutView.vue");
    },
  },
];

// 创建路由实例
const router = new VueRouter({
  mode: "history", // 使用 HTML5 History 模式，去掉 URL 中的 #
  base: process.env.BASE_URL, // 应用的基路径
  routes, // 路由配置
});

// 导出路由实例
export default router;
```

### 1.1 Router的基本的路由功能

创建一个VideoView.vue文件，文件内容如下：

```vue
<!-- src/views/VideoView.vue -->
<template>
  <div class="videoClass">
    <!-- 页面标题 -->
    <h3>一级组件：视频</h3>
  </div>
</template>

<script>
// 定义视频组件
export default {
  // 组件名称
  name: "VideoView",
};
</script>
```

在src/router/index.js文件里面配置简单路由：（只列出了部分代码）

```js
// src/router/index.js

// 定义路由配置数组
const routes = [
  // ...
  {
    path: "/video", // video 页面的路径
    name: "video", // 路由名称
    component: function () {
      return import(/* webpackChunkName: "video" */ "../views/VideoView.vue");
    },
  },
];
```

这样的话，我们就可以通过访问 http://localhost:8082/video查看页面了

### 1.2 Router的嵌套路由的功能

如果想使用嵌套路由的话，在想要加入子路由的地方添加children数组，里面的内容和外层路由一样，path、name和component

```js
// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import VideoView from "../views/VideoView.vue";
import VideoInfo1 from "@/views/video/VideoInfo1.vue";
import VideoInfo2 from "@/views/video/VideoInfo2.vue";

Vue.use(VueRouter);

const routes = [
...
  {
    // 定义一个路由路径为 "/video/:id"，其中 ":id" 是参数占位符。
    path: "/video/:id",
    // 路由名称，用于在链接和导航中引用该路由。
    name: "video",
    // 对应的组件是 VideoView，默认情况下会渲染此组件。
    component: VideoView,
    // 定义子路由，处理视频相关的其他信息页面。
    children: [
      {
        // 子路由路径为 "/info1"，名称为 "info1"，对应的组件是 VideoInfo1。
        path: "/info1",
        name: "info1",
        component: VideoInfo1,
      },
      {
        // 子路由路径为 "/info2"，名称为 "info2"，对应的组件是 VideoInfo2。
        path: "/info2",
        name: "info2",
        component: VideoInfo2,
      },
    ],
  },
];
...
```

### 1.3 Router的动态路由

```js
// src/router/index.js
const routes = [
...
  {
     // 定义一个路由路径为 "/video/:id"，其中 ":id" 是参数占位符。
    path: "/video/:id",
		...
    // 是否将参数传递给组件作为 props 属性，默认值是 true。
    props: true,
  },
];
..
```

如果想要在组件里面接受，可以添加props，如下：

```vue
<template>
  <div class="videoClass">
    <h3>一级组件：视频</h3>
    <p>id 是 {{ id }}</p>  // id就是我们传过来的数据
  </div>
</template>

<script>
export default {
  name: 'VideoView',
  props: ['id']
}
</script>
```

### 1.3 Router的编程式导航功能

Router的导航守卫。vue-router提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

[Vue-router导航守卫，看这一篇就够了](https://juejin.cn/post/7331928379556757543)

#### 1.3.1 全局前置守卫beforeEach

beforeEach是Vue Router中的一个全局前置守卫。它允许我们在每次路由切换之前执行一些操作或者进行一些验证。

```js
// src/router/index.js
// 导航守卫
router.beforeEach((to, from, next) => {
  console.log('导航触发了')
  next()  // 添加之后才会往后路由
})
```

#### 1.3.2 全局的解析守卫beforeResolve

全局的解析守卫在Vue Router中是一种导航守卫，用于在路由切换之前解析异步数据，这个守卫会在所有路由跳转之前被调用，确保在路由切换时已经准备好需要的数据

#### 1.3.3 全局后置钩子afterEach

用于在路由切换之后执行一些操作。这些守卫会在所有路由跳转完成之后被调用，无论是成功还是失败。

## 二、vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式 + 库**。它采用集中式[存储管理](https://so.csdn.net/so/search?q=存储管理&spm=1001.2101.3001.7020)应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

```js
// src/store/index.js
import Vue from "vue";
import Vuex from "vuex";

// 安装 Vuex
Vue.use(Vuex);

export default new Vuex.Store({
  // 定义状态：用于存储全局数据
  state() {
    return {
      loginStatus: "用户已经登陆了", // 用户登录状态
      count: 0, // 计数器
    };
  },
  // getters：类似于计算属性，用于对 state 中的数据进行处理
  getters: {
    len() {
      console.log("getters执行了");
      return state.loginStatus.len; // 获取登录状态字符串长度
    },
  },
  // mutations：用于修改 state 中的数据的方法（同步操作）
  mutations: {
    changeCount(state, num) {
      state.count += num; // 修改计数器的值
      console.log("new count" + state.count);
    },
  },
  // actions：用于处理异步操作，然后通过提交 mutation 来修改数据
  actions: {
    delayChangeCount(state, num) {
      setTimeout(() => {
        state.commit("changeCount", num); // 3秒后修改计数器的值
      }, 3000);
    },
  },
  // modules：用于将 store 分割成模块
  modules: {},
});
```

使用的话如下：

```vue
<template>
    <div class="video-info1">
      <h2>二级组件：收藏</h2>
    </div>
</template>

<script>
export default {
  name: 'VideoInfo2',
  created() {
    // 调用下方的方法
    this.handler()
  },
  methods: {
    handler() {
      // 调用store的数据
      this.$store.commit('changeCount', 2)
      this.$store.commit('changeCount', 1)
      this.$store.dispatch('delayChangeCount', 3)
      this.$store.getters.len
    }
  }
}
</script>
```

