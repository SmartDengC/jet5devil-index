---
title: Vue核心语法（一）
createTime: 2025/02/15 22:27:19
permalink: /vue/0w8mci4f/
tags:
  - vue
---

本书旨在帮助开发者快速掌握Vue框架的核心语法，涵盖从组件定义到事件处理、数据绑定、方法与属性的使用，以及组件的**生命周期管理**。重点内容包括Vue的创建与基本语法、组件生命周期、事件处理机制、数据绑定技术、方法与属性的应用，以及组件布局与样式设计。



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <p>Name: {{name}}</p>
        <p>Age: {{age}}</p>
        <!-- 方法调用 output() -->
        <p>{{output()}}</p>
        <!-- 计算属性调用： outputComputed 不加括号 -->
        <p>{{outputComputed}}</p>

        <!-- 4、指令 -->
         <!-- 4.1 内容指令 -->
        <p v-text="htmlContent">123</p>
        <p v-html="htmlContent">123</p>
        <!-- 4.2 渲染指令 -->
        <!-- v表示值，k表示键， index表示索引 -->
        <p v-for="(v, k, index) in obj">这是内容：{{v}}-{{k}}-{{index}}</p>
        <p v-if="false">true表示展示, false表示隐藏,  元素被销毁</p>
        <p v-show="false">true展示, false表示隐藏, 元素不销毁</p>

        <!-- 4.3 属性指令 -->
        <p v-bind:title="name">这是内容，响应式数据的绑定</p>
        <p :title="name">这是内容</p>

        <!-- 4.4 事件指令 -->
        <button v-on:click="output()">Click On</button>
        <button @click="output">Click On</button>

        <!-- 4.5 表单指令 
         v-model实现双向绑定，就是表单中的数据会实际修改响应数据
        -->
        <br>
        <input type="text" v-model="inputValue">
        <p v-text="inputValue"></p>
        <!-- 4.6 修饰符 
         .trim在绑定的时候是先去掉两端的空格，然后在赋值给inputValue
        -->
        <input type="text" v-model.trim="inputValue">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#app',
            // 1、响应数据和插值表达式
            data(){
                return {
                    name: 'Amy',
                    age: 30,
                    htmlContent: "v-html: <span>span</span>标签",
                    arr: ['a', 'b', 'c', 'd'],
                    obj: {a: 10, b:20, c:30},
                    inputValue: '这是默认内容'
                }
            },
            // 方法属性：
            methods: {
                output(){
                    console.log('methods执行了')
                    return 'hello world' + this.name + 'age: ' + this.age
                }
            },
            // 计算属性：具有缓存性
            computed: {
                outputComputed(){
                    console.log('computed执行了')
                    return 'hello world' + this.name + 'age: ' + this.age
                }
            },
            // 3 监听器：监听某个相应式数据的变化，在变化的时候除了在页面上变化， 还有其他的执行逻辑
            watch: {
                name(newValue, oldValue){
                    console.log(newValue, oldValue)
                }
            }
        })
    </script>

</body>
</html>
```

