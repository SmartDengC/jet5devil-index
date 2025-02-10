---
title: Vue：快速创建Vue项目
createTime: 2025/02/10 23:45:18
permalink: /article/6y33m8mj/
tags:
   - vue
---

这里简单说一下如何创建vue项目。

## 1 安装Vue CLI

```
npm install -g @vue/cli
```

## 2 使用Vue CLI创建项目

```
vue create todo-app // 这里创建一个叫做todo-app的项目
```

下面是具体的配置：

```
Vue CLI v5.0.8
Failed to check for updates
? Please pick a preset: (Use arrow keys)
  Default ([Vue 3] babel, eslint)   // 默认vue3版本 + babel + eslit， 如果选这个会直接创建完
  Default ([Vue 2] babel, eslint)  // 默认vue2 + babel + eslint，如果选这个会直接创建完
❯ Manually select features  // 手动配置， 
```

我们选者最后一项的手动配置：

```
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
❯◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

使用上下左右选择，空格选中，我们这里选择Router和Vuex，因为后面会基于这两个库来操作。

```
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
❯ 3.x
  2.x  // 选者vue的版本，
```

我选择vue2， 主要是资料完善，遇到问题能够更快的找到解决方法。

```
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) y
```

router使用history，默认是Hash模式。

```
? Pick a linter / formatter config:
❯ ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
```

选择 eslint 校验规则。此处建议选择默认配置，即直接回车即可。

```
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ Lint on save  // 保存的时候检查
 ◯ Lint and fix on commit  // 提交的时候检查
```

选者什么时候进行代码校验， 这里选择第一个。

```
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files  // 存放到独立文件中
  In package.json  // 存放到package.json里面
```

选择如何存放配置，我选择单独存

```
? Save this as a preset for future projects? (y/N) n
```

选择是否保存本次预设，建议选者n，即不保存，否则以后创建项目修改配置不方便。

```
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
