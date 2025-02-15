---
title: Vue：快速创建Vue项目（二）
createTime: 2025/02/10 23:45:18
permalink: /article/6y33m8mj/
tags:
   - vue
---

## 1 安装Vue CLI

我们使用[VueCLI](https://cli.vuejs.org/zh/guide/)脚手架来创建，Vue CLI 致力于将 Vue 生态中的工具基础标准化。它确保了各种构建工具能够基于智能的默认配置即可平稳衔接，这样你可以专注在撰写应用上，而不必花好几天去纠结配置的问题。与此同时，它也为每个工具提供了调整配置的灵活性，无需 eject。

```
npm install -g @vue/cli
```

## 2 使用Vue CLI创建项目

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
