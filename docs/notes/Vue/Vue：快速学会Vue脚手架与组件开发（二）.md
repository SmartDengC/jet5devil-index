---
title: 快速学会Vue脚手架与组件开发
createTime: 2025/02/10 23:45:18
permalink: /vue/6y33m8mj/
tags:
   - vue
---

[30分钟学会Vue之脚手架与组件化开发 趁着暑假掌握一门技能 大学生前端实习毕业设计必备技能](https://www.bilibili.com/video/BV13m4y1Y7MD?spm_id_from=333.788.videopod.sections&vd_source=35e7dde81183ac464990a0a0ab794bce)

## 一、Vue脚手架使用

### 1.1 安装Vue CLI

我们使用[VueCLI](https://cli.vuejs.org/zh/guide/)脚手架来创建，Vue CLI 致力于将 Vue 生态中的工具基础标准化。它确保了各种构建工具能够基于智能的默认配置即可平稳衔接，这样你可以专注在撰写应用上，而不必花好几天去纠结配置的问题。与此同时，它也为每个工具提供了调整配置的灵活性，无需 eject。

```
npm install -g @vue/cli
```

### 1.2 使用Vue CLI创建项目

```
vue create todo-app // 这里创建一个叫做todo-app的项目
```

下面是具体的配置：

```shell
Vue CLI v5.0.8
Failed to check for updates
? Please pick a preset: (Use arrow keys)
  Default ([Vue 3] babel, eslint)   // 默认vue3版本 + babel + eslit
  Default ([Vue 2] babel, eslint)  // 默认vue2 + babel + eslint
❯ Manually select features  // 手动配置， 
```

我们选者最后一项的手动配置：

```shell
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◉ Babel  // vue项目中普遍使用的es6语法，但是有时我们需要兼容低版本浏览器，需要引入babel插件，将es6转化成es5
 ◯ TypeScript  //TypeScript通过添加类型来扩展JavaScript。
 ◯ Progressive Web App (PWA) Support  // 渐进式web应用程序之支持
 ◉ Router  // Vue Router路由
❯◉ Vuex  // Vuex是一个专为vuejs应用程序开发的状态管理模式，采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
 ◯ CSS Pre-processors  // css预处理器，比如要用sass就要按照规定的语法形式
 ◉ Linter / Formatter  // 格式化程序
 ◯ Unit Testing  // 单元测试
 ◯ E2E Testing  // 端到端
```

使用上下左右选择，空格选中，我们这里选择Babel、Linter/Formatter、Router和Vuex，因为后面会基于这些库来操作。

```shell
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
❯ 3.x
  2.x  // 选者vue的版本，
```

我选择vue2， 主要是资料完善，遇到问题能够更快的找到解决方法。

```shell
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) y
```

Vue Router使用history 模式，去掉url中的#，Vue Router默认是Hash模式。

```shell
? Pick a linter / formatter config:
❯ ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
```

选择 ESLint 校验规则。此处建议选择默认配置，即直接回车即可。

```shell
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ Lint on save  // 保存的时候检查
 ◯ Lint and fix on commit  // 提交的时候检查
```

选者什么时候进行代码校验， 这里选择第一个。

```shell
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files  // 存放到独立文件中
  In package.json  // 存放到package.json里面
```

选择如何存放配置，我选择单独存

```shell
? Save this as a preset for future projects? (y/N) n
```

选择是否保存本次预设，建议选者n，即不保存，否则以后创建项目修改配置不方便。

```shell
✨  Creating project in /Users/dengc4r/c4r_code/learning/vue/todo-app.
🗃  Initializing git repository...
⚙️  Installing CLI plugins. This might take a while...
added 653 packages in 17s

91 packages are looking for funding
  run `npm fund` for details
🚀  Invoking generators...
📦  Installing additional dependencies...
added 11 packages in 2s

91 packages are looking for funding
  run `npm fund` for details
⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project todotest.
👉  Get started with the following commands:

 $ cd todo-app
 $ npm run serve
```

然后等创建完成就可以运行了。

[Vue.js 学习笔记十二：Vue CLI 之创建一个项目](https://blog.csdn.net/qq_27875933/article/details/117434093)



## 二、Vue组件开发

组件允许我们将UI划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。在实际应用中，组件常常被组织成一个层层嵌套的树状结构。

这里使用Vue Cli默认创建的Vue2来介绍组件之间的通行。



目录结构：

```
.
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
└── main.js
```

这里App.vue是父组件，HelloWorld.vue是子组件

### 2.1 父传子

简单来说，就是将父组件里面的数据，传给子组件使用。

在子组件中通过props属性来定义需要传输的响应数据

```vue
<template>
  <div class="hello">
    <slot>这是默认slot内容</slot>
    <h1>{{ msg }}</h1>  
    <!-- 使用{{}}展示响应数据 -->
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  // 1. 父组件向子组件传递数据
  props: {
    msg: String,
    name: String,
    count: {
      type: [String, Number],
      // default: 0,  // 表示没有传值的时候的默认值
      required: true, // 表示属性必须要传值
    },
  },
};
</script>
```

在父组件中代码怎么写呢？

首先需要通过import导入组件，然后在components属性中添加需要导入的组件。

在使用上，直接使用标签，然后在里面通过子组件的属性来传值，例如HelloWord组件里面的msg和name，在实现上，还可以使用属性绑定，将父组件中的数据传过去，例如这里的:count

```vue
<template>
  <div id="app">
    <h1>父组件中的childCount{{ childCount }}</h1>
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- 通过属性绑定的方式来传值也是可以的 -->
    <HelloWorld
      msg="Hello World"
      name="John"
      :count="parentCount"
      @change-child-data="handlerChildData"
    />
  </div>
</template>
<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>
```

### 2.2 子传父

子组件的数据传给父组件的话， 相对来说要复杂点。

在子组件中，通过调用`$emit`方法来实现。

```vue
this.$emit("change-child-data", this.childCount);
```

上面的代码就是定义一个'change-child-data'的事件，然后将this.childCount数据传过去。

那么在父组件中该如何接受呢？

例如下面代码，通过事件绑定，绑定一个子组件事件change-child-data， 使用父组件handlerChildData方法来处理

```vue
<template>
  <div id="app">
    <h1>父组件中的childCount{{ childCount }}</h1>
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- 通过属性绑定的方式来传值也是可以的 -->
    <HelloWorld
      msg="Hello World"
      name="John"
      :count="parentCount"
      @change-child-data="handlerChildData"
    />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  data() {
    return {
      parentCount: 100,
      childCount: 0,
    };
  },
  methods: {
    handlerChildData(data) {
      this.childCount = data;
    },
  },
  components: {
    HelloWorld,
  },
};
</script>
```

### 2.3 组件插槽

在使用组件的时候，也可以在子组件标间里面写内容，例如：

```vue
<HelloWorld>这是父组件中的插槽使用</HelloWorld>
```

可以在子组件中加入插槽功能。

#### 2.3.1 默认插槽

子组件中定义默认插槽：

```vue
<template>
  <div class="hello">
    <!-- 这里就是默认插槽 -->
    <slot>这是默认slot内容</slot>
    <h1>{{ msg }}</h1>
    <button @click="handleClick">Click It</button>
    <slot name="footer" ></slot>
  </div>
</template>
```

父组件中使用方式：

```vue
<HelloWorld>这是父组件中的插槽使用</HelloWorld>
```

#### 2.3.2 具名插槽

如果子组件中定义的插槽不止一个的话，就可以使用具名插槽。

```vue
 <slot name="footer" ></slot>
```

父组件使用：

```vue
<!-- 具名插槽 -->
<HelloWorld>
  <template #footer>这是第一个footer</template>
</HelloWorld>
```

#### 2.3.3 作用域插槽

子组件定义作用域插槽

```vue
<!-- 作用域插槽 -->
<!-- childCount是一个响应数据。-->
<template>
	<slot name="footer2" :childCount="childCount"></slot> 
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      childCount: 0,
    };
  },
}
</script>
```

父组件中使用：

```vue
<!-- 作用域插槽 -->
<HelloWorld>
  <template #footer2="slotProps">
    这是第一个footer {{ slotProps.childCount }}
  </template>
</HelloWorld>
```

