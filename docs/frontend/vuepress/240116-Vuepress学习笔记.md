---
title: Vuepress学习笔记
author: 阿聪小破站
createTime: 2024/01/20 22:12:30
permalink: /article/oo17euso/
tags: 
  - vuepress
  - cloudflare
---

## 零、站点推荐

这里引用几个我现在看这比较有学习作用的 vuepress 的网站

### 1、[Forever Study](https://www.yydnas.cn/)

这个网站是我在使用 vuepress 以后的看到的第一个 vuepress 的网站，里面有许多东西值得借鉴，像是标展、文章的时间轴， 集成了平路等等这些，这个应该都是博主自己写的，是相当有价值的

特点：标签、时间轴、文章评论等等

这个博主还在友链里面添加了一位，不知道是不是本人，感觉可以去看看他的文章， 打开自己的一个思路，接触优秀的人，优秀的作品。

### 2、[飞跃高山与大洋的鱼](https://docs.shanyuhai.top/)

这个博客就是我在 b 站上面视频的作者，是从 20 年开始使用的，到现在已经 24 年了，里面可以学习东西还是有很多的，这里简单记录一下，方便后期查看。

### 3、[artiely](https://artiely.github.io/)

今天在找主题的过程中，发现一个大佬，他的网站真的是超级好看，我都想 fock 一下，现在这个阶段还是慢慢的自己来构建把，要是一下子上手别人的都得不尝试了.

不过在自己优化的时候可以借鉴一下。

### 4、[pengzhanbo](https://pengzhanbo.cn/)

今天有迎来以为大佬的博客，这个大佬是 plume 这个主题的作者，我也是跟着他的博客在操作，里面有许多的东西都是他自己写的，他还有许多的开源的项目，真的是不折不扣的大佬，而且他的很多项目现在都还在维护，不至于遇到无法解决的问题也没有人交流了。

今天遇到一个 plume 的问题，还在努力学习解决中，就是本地没问题，部署到像是 github page 或者是使用 cloudfare 代理部署，上方的 navbar 点击就是没有反应

在搞几天，希望自己能够解决。

## 一、简介

**20240116 更新**

今天更新简单的说一下快速的构建出来 vuepress 的项目。我们在浏览器里面搜索 vuepress 进入到官网，里面是默认 vuepress1.x 的版本，我们要在右上角切换到 2.x 的版本文档。
我们按照官网来就能够很快速的构建出来， [快速上手](https://v2.vuepress.vuejs.org/zh/guide/getting-started.html)

这里提几个思考：

- 对于新手来说，官网里面很多的目录，想要找到自己需要的资料是比较困难的，如果进一步学习的话，建议找一个 b 站的快速入门的视频来看，因为我主要是后端开发，前端知识懂一些，但是不多，从视频里面我们能够大致有一个整体架构。
- 初学者我还是建议从构建项目开始，一步一步的尝试，这样你会发现掌握的很牢固，这个和开箱即用有很大区别， 因为你是在别人的基础上，对于使用的代码是很陌生的，自己走过来的代码就不会那样，这也能促使自己有写作的东西
- 学习和写博客都是一个长期的事情，不在一朝一夕。（重要）

**20240117 更新**

使用过了许多的静态网站来写博客，像是[hexo](https://hexo.io/)、[docusaurus](https://docusaurus.io/)， 但总是感觉要么很复杂，自己没办法改；要么就是样式问题，自己看不习惯，不想自己去修改。

为什么我会选择 vuepress2， vuepress 是基于 vue 开发的，加上公司里面是用的 vue，自己会的话，工作方面也好办一些,docusaurus 是基于 react 来写的，就感觉不是很方便。

## 二、学习中使用的部分插件

使用了一个新的主题，主题项目里面集成了一些插件。



## 三、过程问题

### 1、vuepress 如何加载网路图片？**20240119 更新**

我使用的是 picgo+gitee 的方式在实现图床，就是把图片通过 picgo 的方式上传到 gitee，然后 gitee 加载出来一个图片的链接地址，今天在用的时候发现 md 文件中运行出来图片不展示了，最后发现可以用如下方式解决：

在 config.js 中添加 head 节点内容如下：

```vue
head: [ ["meta", {name:"referrer", content:"no-referrer"}], ],
```

即可解决问题。

参考文章： [vuepress 如何加载网络图片](https://segmentfault.com/q/1010000041746842)

### 2、如何在一个 md 文件里面展示出来当前目录导航？

### 3、解决侧边栏显示文件路径的问题

平常写的时候喜欢写 title 属性，但是展示出来是这样子的

```
/vuepress2.0/README.md  // 这里vuepress2.0是我的目录，按理说是不应该有的
```

这里需要冒号后面添加一个空格, 像这样`title: page_title`

### 4、踩坑 vuepress-theme-plume，线上 navbar 点击不跳转

上面我不是说不用主题吗，后面不是又用了嘛，但是这个里面有点点坑，作为初学者的我也是研究了需求才弄明白。
问题就是在本地运行没有问题，但是一打包都到服务器上面就有问题。

**这个问题最后是把包管理工具切换到 pnpm 才解决的**
最开始我用的是 yarn 1.22 版本的包管理工具，但是主题默认安装了一个 comment2 的插件，最小支持的版本是 yarn2.x, 就去升级到 yarn 4.0.2, 后面都很正常就是在打包丢到服务器上面，发现切换 navbar 点击无效，找了很久才在源码库里面看到下面这个图片，才想着换包管理工具，折腾了两天还是蛮开心的。

![image-20240123223914954](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202401232239092.png)

这个过程自己也对前端有了一个初步的了解，主要还是 yarn、npm、pnpm 这个管理工具的认识。

## 四、Cloudflare 部署问题

### 1.This project is configured to use yarn？

刚才在推送到 cloudfare 上面自动部署的时候出现了一个这个问题，这个我是很清楚的；项目是我用 yarn init 创建出来的，但是现在使用的是 pnpm 来管理，所以这里我们要切换一下。

修改 package.json 中的 packageManager 为自己使用的版本。

`"packageManager": "yarn@1.22.21"`---> `"packageManager": "pnpm@8.14.3"`

### 2.Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json

这个问题主要就是因为 package.json 与 pnpm lock 文件里面定义的不匹配，现在的解决办法就是不上传 pnpm-lock.json 这个文件。

### 3.TypeError: Cannot read properties of undefined (reading 'split')

```shell
10:11:05.287	TypeError: Cannot read properties of undefined (reading 'split')
10:11:05.287	    at file:///opt/buildhome/repo/docs/.vuepress/.temp/.server/app.13DZFPsY.mjs:3837:42
10:11:05.288	    at Array.forEach (<anonymous>)
10:11:05.288	    at file:///opt/buildhome/repo/docs/.vuepress/.temp/.server/app.13DZFPsY.mjs:3836:16
10:11:05.288	    at ReactiveEffect.fn (/opt/buildhome/repo/node_modules/@vue/reactivity/dist/reactivity.cjs.js:996:13)
```

上面就是 cloudflare 在部署的时候输出的错误信息，我们可以清楚的看到他在使用 vuepress 下面.temp 目录里面的问题，但是很疑惑这个，我们都没有操作这个目录，为什么会用到这里的文件呢？

在.vuepress 目录下面，除了 temp 目录，还有一个 cache 的目录，这两个目录是用来实现热更新的，就是我们改了一些文件，保存之后就会自动刷新上去，就是因为这两个文件。

对于解决方案来说，我们还是选择不上传到 github，让 cloudflare 自己去构建。

### 4、Cloudflare部署上后访问：TypeError: Cannot read properties of undefined (reading 'path')

感觉上像是那个文件配置的不对，但是又没有提示那个文件出现错误了。

**我现在也说不清楚这个问题到底在哪里，后面我就更新了vuepress-theme-plume的版本，但是出现了下面的问题**

### 5、升级主题后出现：useClientData() is called without provider

在升级相应的版本之后，出现了这个问题，这个的话我再 github上面也遇到两个一样的问题。

**参考 :**

[usePageHead() is called without provider #103](https://github.com/vuepress/core/discussions/103) 

[[Bug]useClientData() is called without provider](https://github.com/vuepress-theme-hope/vuepress-theme-hope/issues/3945)

执行一下`npx vp-update`。

对于这个npx是什么后面再补充，搞了两天终于是解决了。
