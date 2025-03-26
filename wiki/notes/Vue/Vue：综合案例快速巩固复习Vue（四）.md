---
title: 综合案例快速巩固复习Vue（四）
createTime: 2025/02/16 22:07:47
permalink: /vue/98udxq8p/
tags:
  - vue
---

经典前端学习项目TodoMVC学习中！！

<!-- more -->

视频学习地址：[20分钟学会Vue综合案例 快速巩固复习Vue](https://www.bilibili.com/video/BV1714y167Sn?spm_id_from=333.788.videopod.sections&vd_source=35e7dde81183ac464990a0a0ab794bce)

项目代码地址：[TodoMVC](https://todomvc.com/)

## 一、创建项目

```shell
(base) ➜ vue npm create vue@2

> npx
> create-vue

Vue.js - The Progressive JavaScript Framework

✔ Project name: … dengcong-todos
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes

Scaffolding project in /Users/dengc4r/c4r_code/learning/vue/dengcong-todos...

Done. Now run:

  cd dengcong-todos
  npm install
  npm run dev
```

## 二、开始实现TodoMVC

### 2.0 项目简单修改

因为我们主要学习的是vue的内容，样式的话，我们就从项目的github上面拷，然后粘贴到项目里面来。我们在Github仓库：[todomvc-app-template](https://github.com/tastejs/todomvc-app-template)  里面找到`index.html`文件，然后把`body`里面的内容拷贝出来， 替换掉`App.vue`中body的内容。

然后修改`App.vue`中`script`里面的内容：

```vue
// App.vue
export default {}
```

然后修改`style`里面的内容，使用在线的TodoMVC的样式文件，也可以从仓库里面下载样式文件：

```
// App.vue
<style>
/* 引入在线的todomvc的样式 */
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>
```

注释掉`main.js`中导入的样式

```js
import Vue from 'vue'
import App from './App.vue'

// import './assets/main.css'

new Vue({
  render: (h) => h(App)
}).$mount('#app')
```

然后就是具体功能的实现

### 2.1 展示数据

### 2.2 添加数据

### 2.3 删除数据和清除数据

### 2.4 切换All/Active/Completed按钮

### 2.5 展示条数

### 2.6 全部切换状态

### 2.7 勾选完成







## 完整代码如下

```vue
<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <!-- @keyup.enter的含义是什么？ -->
      <input
        @keyup.enter="addTodo"
        class="new-todo"
        placeholder="What needs to be done?"
        autofocus
      />
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        @click="toggleAll"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!--  遍历数据，将todos里面的数据便利展示 -->
        <!-- :class 绑定属性值，使用todo.completed的值来确定 -->
        <li
          v-for="todo in filterTodos"
          :key="todo.id"
          :class="{ completed: todo.completed }"
        >
          <div class="view">
            <!-- input 输入框，使用v-model来进行双向绑定 -->
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <!-- 展示内容 -->
            <label v-text="todo.title"></label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" value="Create a TodoMVC template" />
        </li>
      </ul>
    </section>
    <!-- This footer should be hidden by default and shown when there are todos -->
    <footer class="footer">
      <!-- This should be `0 items left` by default -->
      <span class="todo-count"
        ><strong>
          {{ remaining }}
        </strong>
        item left</span
      >
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <a :class="{ selected: visibility === 'all' }" href="#/all">All</a>
        </li>
        <li>
          <a :class="{ selected: visibility === 'active' }" href="#/active"
            >Active</a
          >
        </li>
        <li>
          <a
            :class="{ selected: visibility === 'completed' }"
            href="#/completed"
            >Completed</a
          >
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button class="clear-completed" @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
export default {
  data() {
    return {
      todos: [
        {
          id: 1,
          title: "测试交日报",
          // false 表示未完成，true表示已完成
          completed: false,
        },
        {
          id: 2,
          title: "测试吃饭",
          completed: true,
        },
      ],
      visibility: "all",
    };
  },
  methods: {
    toggleAll(e) {
      // 全部切换
      this.todos.forEach((todo) => (todo.completed = e.target.checked));
    },
    onHashChange() {
      // hash就是端口后面的路由
      const hash = window.location.hash.replace(/#\/?/, "");
      // 判断是否在这三个路由里面
      if (["all", "active", "completed"].includes(hash)) {
        this.visibility = hash;
      } else {
        window.location.hash = "";
        this.visibility = "all";
      }
    },
    addTodo(e) {
      // 向todos里面添加内容
      const title = e.target.value.trim();
      if (!title) {
        return;
      }
      this.todos.push({
        id: Date.now,
        title,
        completed: false,
      });
      e.target.value = "";
    },
    removeTodo(todo) {
      // 删除todo
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
    clearCompleted() {
      // 清除已完成的内容，因为需要留下未完成的，所以需要清除完成
      // this.todos.filter((todo) => !todo.completed);
      // 表示未完成的数据
      this.todos = this.todos.filter((todo) => !todo.completed);
    },
  },
  computed: {
    filterTodos() {
      // 计算属性来实现需要展示哪些todos里面的数据
      switch (this.visibility) {
        case "all":
          return this.todos;
        case "active":
          return this.todos.filter((todo) => !todo.completed);
        case "completed":
          return this.todos.filter((todo) => todo.completed);
      }
    },
    remaining() {
      // 计算todos里面没有完成的数量
      return this.todos.filter((todo) => !todo.completed).length;
    },
  },
  mounted() {
    // 添加一个事件
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  },
};
</script>

<style>
/* 引入在线的todomvc的样式 */
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>
```

