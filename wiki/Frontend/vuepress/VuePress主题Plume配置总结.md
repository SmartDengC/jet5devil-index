---
title: VuePress主题Plume配置总结
author: 阿聪小破站
createTime: 2024/01/21 08:58:08
permalink: /article/miluj0ki/
tags: 
  - vuepress-theme-plume
  - vuepress
---

[Theme Plume VuePress Next Theme](https://theme-plume.vuejs.press/)

一个简约易用的，功能丰富的 vuepress 文档&博客 主题

<!-- more -->



vs 创建文件，默认创建了 title、author、 createTime、permalnk

在命令行里面创建文件 也会默认创建基本信息

<!-- ![](10k_outline) -->

- home - <Iconify name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Iconify name="skill-icons:vscode-dark" size="2em" />
- twitter - <Iconify name="skill-icons:twitter" size="2em" />

::: caution 警告
危险内容
:::



[代码演示](https://theme-plume.vuejs.press/guide/repl/frontend/)

插入vue代码

::: vue-demo Finish Cal

```vue
<!-- ↑ 你也可以使用 html -->
<template>
  <!-- vue 模板 -->
  <h2>todo 使用vue嵌入vuex组件实现todo列表</h2>
  ...
</template>
<script>
export default {
  // vue 组件
};
</script>
<style>
/* css 代码 */
</style>
```

:::

可编辑go语言代码

:::go-repl#editable

```go
package main
import ("fmt")
func main(){
  fmt.Println("hello world")
}
```

:::



::: normal-demo Demo 演示

```html
<h1>Hello Word!</h1>
<p><span id="very">非常</span>强大!</p>
```

```js
document.querySelector('#very').addEventListener('click', () => {
  alert('非常强大')
})
```

```css
span {
  color: red;
}
```

:::
