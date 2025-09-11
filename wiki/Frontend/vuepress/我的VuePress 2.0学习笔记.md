---
title: 我的Vueress 2.0学习笔记
author: 阿聪小破站
createTime: 2024/01/20 22:12:30
permalink: /article/oo17euso/
tags: 
  - vuepress
  - cloudflare
---

## 一、我对Vuepress的看法

### 1.1、思考 

时间：20240116 

今天简单的说一下，如何快速的构建出来 Vuepress 的项目。我们在浏览器里面搜索 Vuepress 进入到官网，里面是默认 Vuepress1.x 的版本，我们要在右上角切换到 2.x 的版本文档。
我们按照官网来就能够很快速的构建出来， [快速上手](https://v2.vuepress.vuejs.org/zh/guide/getting-started.html)

这里提几个思考：

- 对于新手来说，官网里面很多的目录，想要找到自己需要的资料是比较困难的，如果进一步学习的话，建议找一个 b 站的快速入门的视频来看，因为我主要是后端开发，前端知识懂一些，但是不多，从视频里面我们能够大致有一个整体架构。
- 初学者我还是建议从构建项目开始，一步一步的尝试，这样你会发现掌握的很牢固，这个和开箱即用有很大区别， 因为你是在别人的基础上，对于使用的代码是很陌生的，自己走过来的代码就不会那样，这也能促使自己有写作的东西
- 学习和写博客都是一个长期的事情，不在一朝一夕。（重要）

### 1.2、为什么用Vuepress

时间：20240117

使用过了许多的静态网站来写博客，像是[hexo](https://hexo.io/)、[docusaurus](https://docusaurus.io/)， 但总是感觉要么很复杂，自己没办法改；要么就是样式问题，自己看不习惯，不想自己去修改。

为什么我会选择 Vuepress2， Vuepress 是基于 Vue 开发的，加上公司里面是用的 vue，自己会的话，工作方面也好办一些，Docusaurus 是基于 React 来写的，就感觉不是很方便。

### 1.3、http-server 

时间：20250310

通过Nginx部署前端静态文件之前，可以使用http-server在本地启动看看有没有问题。

```shell
# 全局安装http-server
npm install http-server -g
# 查看是否安装成功
http-server -v
# 切换到dist目录
cd dist
# 开启服务器
http-server
# 防止80端口被占用，可以指定端口, -p指定端口 -o打开浏览器
http-server -p 8091 -o
```

参考：[http-server使用，启动本地服务器 & 使用serve包本地启动](https://blog.csdn.net/weixin_44867717/article/details/127383329)

## 二、过程问题总结

### 2.1、Vuepress 如何加载网路图片？

时间：20240119

我使用的是 Picgo+Gitee 的方式实现图床，就是把图片通过 Picgo 的方式上传到 Gitee，然后 Gitee 加载出来一个图片的链接地址，今天在用的时候发现 md 文件中运行出来图片不展示了，最后发现可以用如下方式解决：

在 config.js 中添加 head 节点内容如下：

```vue
head: [ ["meta", {name:"referrer", content:"no-referrer"}], ],
```

即可解决问题。

参考文章： [vuepress 如何加载网络图片](https://segmentfault.com/q/1010000041746842)

### 2.2、解决侧边栏显示文件路径的问题

平常写的时候喜欢写 title 属性，但是展示出来是这样子的

```
/vuepress2.0/README.md  // 这里vuepress2.0是我的目录，按理说是不应该有的
```

这里需要冒号后面添加一个空格, 像这样`title: page_title`

### 2.3、踩坑 vuepress-theme-plume，线上 navbar 点击不跳转

上面我不是说不用主题吗，后面不是又用了嘛，但是这个里面有点点坑，作为初学者的我也是研究了需求才弄明白。
问题就是在本地运行没有问题，但是一打包都到服务器上面就有问题。

**这个问题最后是把包管理工具切换到 pnpm 才解决的**
最开始我用的是 yarn 1.22 版本的包管理工具，但是主题默认安装了一个 comment2 的插件，最小支持的版本是 yarn2.x, 就去升级到 yarn 4.0.2, 后面都很正常就是在打包丢到服务器上面，发现切换 navbar 点击无效，找了很久才在源码库里面看到下面这个图片，才想着换包管理工具，折腾了两天还是蛮开心的。

![image-20240123223914954](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202401232239092.png)

这个过程自己也对前端有了一个初步的了解，主要还是 yarn、npm、pnpm 这个管理工具的认识。

## 三、Cloudflare 部署问题

现在这个项目的静态文件主要是通过Cloudflare来打包部署的，将代码提交到Github， Cloudflare会自动拉取代码打包发布，记录一下在这个过程里面遇到的问题

### 3.1、This project is configured to use yarn？

刚才在推送到 Cloudfare 上面自动部署的时候出现了一个这个问题，这个我是很清楚的；项目是我用 yarn init 创建出来的，但是现在使用的是 pnpm 来管理，所以这里我们要切换一下。

修改 package.json 中的 packageManager 为自己使用的版本。

`"packageManager": "yarn@1.22.21"`---> `"packageManager": "pnpm@8.14.3"`

### 3.2、Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json

这个问题主要就是因为 package.json 与 pnpm lock 文件里面定义的不匹配，现在的解决办法就是不上传 pnpm-lock.json 这个文件。

### 3.3、TypeError: Cannot read properties of undefined (reading 'split')

```shell
10:11:05.287	TypeError: Cannot read properties of undefined (reading 'split')
10:11:05.287	    at file:///opt/buildhome/repo/docs/.vuepress/.temp/.server/app.13DZFPsY.mjs:3837:42
10:11:05.288	    at Array.forEach (<anonymous>)
10:11:05.288	    at file:///opt/buildhome/repo/docs/.vuepress/.temp/.server/app.13DZFPsY.mjs:3836:16
10:11:05.288	    at ReactiveEffect.fn (/opt/buildhome/repo/node_modules/@vue/reactivity/dist/reactivity.cjs.js:996:13)
```

上面就是 Cloudflare 在部署的时候输出的错误信息，我们可以清楚的看到他在使用 vuepress 下面.temp 目录里面的问题，但是很疑惑这个，我们都没有操作这个目录，为什么会用到这里的文件呢？

在.vuepress 目录下面，除了 temp 目录，还有一个 cache 的目录，这两个目录是用来实现热更新的，就是我们改了一些文件，保存之后就会自动刷新上去，就是因为这两个文件。

对于解决方案来说，我们还是选择不上传到 Github，让 Cloudflare 自己去构建。

### 3.4、TypeError: Cannot read properties of undefined (reading 'path')

感觉上像是那个文件配置的不对，但是又没有提示那个文件出现错误了。

**我现在也说不清楚这个问题到底在哪里，后面我就更新了vuepress-theme-plume的版本，但是出现了下面的问题**

### 3.5、升级主题后出现：useClientData() is called without provider

在升级相应的版本之后，出现了这个问题，这个的话我再 Github上面也遇到两个一样的问题。

**参考 :**

[usePageHead() is called without provider #103](https://github.com/vuepress/core/discussions/103) 

[[Bug]useClientData() is called without provider](https://github.com/vuepress-theme-hope/vuepress-theme-hope/issues/3945)

执行一下`npx vp-update`。对于这个npx是什么后面再补充，搞了两天终于是解决了。

### 3.6、The language 'mysql' is not loaded, falling back to 'txt' for syntax highlighting.

这是一个警告，大概的意思就是因为在插入代码的时候，将代码的类型设置成了mysql，但是mysql的话，markdown文件有识别不了导致的提示。例如下面所示：

````markdown
```mysql
```
````

### 3.7、TypeError: Cannot read properties of undefined (reading '0')

现在来看，这个问题就是因为将`vuepress-theme-plume`定义到了tags信息头里面， 这个为什么不能通过build， 现在还不清楚。

错误代码如下：

```markdown
title: vuepress-theme-plume源码
author: 邓聪的小破站
createTime: 2024/06/28 00:36:57
permalink: /article/xfyjihyq/
tags: 
  - vuepress
  - vurpress-theme-plume  ❌ 不要这样写
```

### 3.8、SyntaxError: The requested module 'node:events' does not provide an export named 'addAbortListener'

```
00:29:14.016	Executing user command: pnpm build
00:29:14.681	> vuepress-starter@1.0.0 build /opt/buildhome/repo
00:29:14.681	> vuepress build docs
file:///opt/buildhome/repo/node_modules/.pnpm/execa@9.3.1/node_modules/execa/lib/utils/max-listeners.js:1
00:29:15.786	import {addAbortListener} from 'node:events';
00:29:15.786	        ^^^^^^^^^^^^^^^^
00:29:15.786	SyntaxError: The requested module 'node:events' does not provide an export named 'addAbortListener'
```

在升级了vuepress的版本到`2.0.0-rc.14`的时候，使用`CloudFlare` build的时候提示了这个错误，在github上面看到，应该是因为node 的版本的问题，`CloudFlare`配置的`build system 2` 里面的node版本是`v18.17.1`的版本， 需要将版本升级，我这里升级到`v20.17.0`，通过在`CloudFlare`的`Environment variabvles`里面添加`NODE_VERSION`等于`v20.17.0`，如下图：

![image-20240914090626015](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202409140906188.png)

后面就是把生产用的运行环境也调一下。

### 3.9、启动Vuepress2的项目，上方导航栏消失了

现在就只有Home、Blog、Tags、Archives这些导航栏。

### 3.10、FetchError: request to https://r2.cnpmjs.org/is-glob/-/is-glob-4.0.3.tgz failed, reason: certificate has expired

**时间：20250910**

问题含义大概就是，使用cnpm的源证书过期了，但是为什么呢？

因为我本地使用的是cnpm的源安装的依赖，这个时候它把源地址、包信息写到了pnpm-lock.yml里面，正好我又上传到Github了，导致Cloudflare使用我这个lock文件来打包，导致的问题。

解决就是，不上传这个pnpm-lock.yml文件。
