---
title: CSS选择器
createTime: 2024/10/13 00:04:32
permalink: /vue/xayo3yaj/
---



```css
// 定义全局变量
:root{
  --line-border-fill: #fff;
  --line-border-empty: #f1f1;
}

// 使用
.container{
  background-color: var(--line-border-fill)l;
}

```



[CSS所有选择器的用法及示例（完整版）](https://blog.csdn.net/qq_45914609/article/details/142342792)



## 一、基础选择器

### 元素选择器

就是所有元素都会应用相对应的设置。

```css
p{
  color: red
}
```

### 类选择器

以.开头， 会选择所有具有指定类的元素

```css
.container{
  background-color: #fff;
}
```

### ID选择器

以#开头，选择具有指定id的元素

```css
#container{
  background-color: #fff;
}
```

总结：

上面的三种选择器都比较简单， 一个元素选择器，就是html的元素；一个类选择器，就是class="container"; 一个是id选择器，就是id="container"。

## 二、组合选择器

### 2.1 后代选择器

通过空格分隔两个选择器，以选择第一个选择器的后代中符合第二个选择器的元素。	

```css
div p{
  color: blue;
}
```

实例：div p 会选择所有div元素内的p元素。

### 2.2、子元素选择器

使用 > 符号分割选择器，通过>符号选择直接子元素。

```css
div > p{
  color: red;
}
```

实例：div>p会选择直接位于div元素内p元素。

### 2.3、相邻兄弟选择器

使用+符号分割选择器，选择紧接在另一元素后的元素，且二者有相同的父元素。

```css
h2+p{
  color: red;
}
```

实例：h2+p会选择紧跟在h2元素之后的p元素。

### 2.4、通用兄弟选择器

使用~符号分割选择器，选择某个元素之后所有兄弟元素（共享相同父元素），而不仅仅是紧接在后面的元素。

```css
h2~p{
  color: red;
}
```

h2~p会选择所有与h2元素在同一层级的p元素

### 2.5、群组选择器

使用,分割，允许同时选择多个选择器，并对它们应用相同的样式规则。

```css
h1, h2, p{
  color: red;
}
```

实例：会将h1, h2, p元素的文字颜色都设置为蓝色。

## 三、属性选择器

### 3.1、等于属性选择器

[attribute="value"] 选择具有指定属性且属性值完全等于指定值的元素，根据元素的属性及属性值来选择元素。

```css
a[target="_blank"]{
  color: red;
}
```

实例：这个选择器会选择所有a标签，其target属性值完全等于_blank, 这就意味者这些链接会在新标签或者新窗口打开。

### 3.2 包含属性选择器

```css
a[title~="example"]{
  color: red;
}
```

实例：这个选择器会选择所有的a标签，其中title属性值中包含单词example（注意，example必须是一个完整的单词，前后有空格分隔）

### 3.3、起始属性选择器

```css
a[title^="example"]{
  color: red;
}
```

### 3.4、结尾属性选择器

```css
a[href$=".pdf"]{
  color: red;
}
```

### 3.5、子串属性选择器

```css
a[href*="example"]{
  color: red;
}
```

## 四、伪类选择器

### 4.1、动态伪类选择器

用于选择处于特点状态的元素

- :hover 当鼠标指针悬停在元素上方触发
- :active 当元素被用户激活是触发，选择活动链接
- :focus 选择获得焦点的元素
- :visited 选择已访问过的链接
- :link 选择未访问过的链接

```css
a:hover{
  color: blue;
}
```

