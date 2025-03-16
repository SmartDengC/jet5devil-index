---
title: 前端包管理工具(npm,yarn,pnpm)
description: 前端包管理工具(npm,yarn,pnpm)
author: 阿聪小破站
createTime: 2024/01/23 11:09:59
permalink: /article/r3jj4tlv/
tags: 
  - yarn
  - npm
  - pnpm
---

简单了解前端的包管理工具，包括但不限于Npm、Pnpm、Yarn

<!-- more -->

## 一、npm(Node Package Management)

参考： [【 npm详解：从入门到精通】](https://blog.csdn.net/m0_74187147/article/details/138590144)

在我们安装完nodejs的时候，就会默认安装npm，我们可以用npm -v来查看安装的版本。

参考 这个评论：[request to https://registry.npmjs.org/co failed](https://stackoverflow.com/questions/54611707/request-to-https-registry-npmjs-org-co-failed)，主要是关闭ssl请求校验。

```
request to https://registry.npmjs.org/co failed
```

参考： [【 npm详解：从入门到精通】](https://blog.csdn.net/m0_74187147/article/details/138590144)

在我们安装完nodejs的时候，就会默认安装npm，我们可以用npm -v来查看安装的版本。

### 1.1 npm init

在nodejs项目中，package.json文件是项目的元数据文件，其中包含了项目的各种信息，如名称、版本、依赖等，使用npm init命令可以初始化并生成一个package.json文件。

如果希望使用默认配置快速生成package.json，可以使用-y或者-yes。

```shell
npm init -y
```

### 1.2 npm install

简写为npm i， 下载项目依赖。

默认是将下载的包存放到node_modules里面，并在package.json文件的dependencies字段中添加相应条目，如果只想用于开发环境，可以使用--save-test，例如下面实例：

```shell
npm i vuepress@next --save-dev

{
  "devDependencies": {
    "vuepress": "^2.0.0-rc.19"
  }
}
```

有安装命令，也存在卸载命令：npm uninstall xxx。更新命令：npm update xxx

删除本地模块的时候需要思考的问题：是否将package.json上的相应依赖信息也消除？

- npm uninstall [name]：删除模块，不删除package.json中对应信息
- npm uninstall [name] --save：删除模块，同时删除package.json中dependencies下的对应信息
- npm uninstall [name] --save-dev： 删除模块，同时删除package.json中devDependencies下的信息。 

可以在package.json文件的scripts字段中，自定义npm脚本，这些脚本可以使用npm run命令来执行，例如：

```shell
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

使用npm run test，就会输出：echo "Error: no test specified" && exit 1

### 1.3 npm config

参考：[npm、node修改配置npm config与.npmrc文件的作用](https://blog.csdn.net/aaqingying/article/details/118890747)

设置npm配置的命令。

```shell
npm config list --l 或 npm config ls -l #查看全部配置项
npm config list #查看简略配置信息
npm config get <key>  #查看某一项的配置信息
npm config set <key> <value> #设置某一项的配置信息
```

例如：

```shell
// 设置npm的仓库源
npm config set registry http://registry.npmjs.org/ 
// 关闭strict-ssl
npm config set strict-ssl false
```

## 二、yarn(Yet Another Resource Negotiator)

我们使用 yarn 来管理

```shell
// 修改本地 yarn 的版本
yarn set version <版本号>
yarn set version 2.4.3
```

通过npm来安装yarn

```shell
npm install -g yarn
npm uninstall -g yarn
npm view yarn versions  // 查看yarn提供的版本
```

[升级 Yarn 2，摆脱 node_modules](https://juejin.cn/post/6996958355914752036)

xxx.lock 文件的作用？

## 三、pnpm(Performant NPM)

### 3.1、pnpm install

根据package.json下来包，也可以使用缩写版：`pnpm i`

### 3.2、pnpm outdated

今天学到一个 pnpm 的新命令，就是`pnpm outdated`，意思就是展示出来可更新的包的内容，比如像这样子：

```shell
(base) ➜ jet5devil-index (dev0) ✗ pnpm outdated
│Package           │ Current │ Latest │
│mongodb           │ 5.5.0   │ 6.14.2 │
│sass-loader (dev) │ 12.6.0  │ 16.0.5 │
│vue               │ 2.7.16  │ 3.5.13 │
│vue-router        │ 3.6.5   │ 4.5.0  │
│vuex              │ 3.6.2   │ 4.1.0  │
```

`pnpm update vuepress@latest` 和 `pnpm update vuepress@next`的区别？

### 3.3、pnpm list --depth=1

可以查看项目直接依赖的包及其版本，以及间接依赖包的最新版本。

## 四、其他问题和知识点

### 4.1、package.json 中^和~的区别

^2.0.0-rc.0 不改变主要版本和次要版本，就是说 2.0.x 的版本都是可以的
~2.0.0-rc.0 不改变主要版本，就是说 2.x 的版本都是可以的

[package.json 中^,~的区别](https://blog.csdn.net/peaceoncemore/article/details/79195206)

### 4.2、修改下载源

查看源地址：`npm config get registry`

使用原始的下载源下载的很慢，开发中避免不了修改下载源。修改分为永久修改和临时修改

#### 4.2.1、永久修改下载源

```shell
# 永久切换官方的源 
npm config set registry https://registry.npmjs.org/
# 永久切换成淘宝源 
npm config set registry https://registry.npm.taobao.org
```

#### 4.2.2、临时修改下载源

临时修改就是在下载包的传入临时的源地址，例如：

```shell
# 临时切换官方的源 
npm install express --registry https://registry.npmjs.org/ 
# 临时切换成淘宝源 
npm install express --registry https://registry.npm.taobao.org 
```

### 4.3、Certificate has Expired（证书过期）

```shell
request to https://r2.cnpmjs.org/buffer-builder/-/buffer-builder-0.2.0.tgz failed, reason: certificate has expired
```

上面的问题是因为证书过期，最直接的解决方法就是关闭ssl验证。

```shell
npm config set strict-ssl false
```

参考 这个评论：[request to https://registry.npmjs.org/co failed](https://stackoverflow.com/questions/54611707/request-to-https-registry-npmjs-org-co-failed)，主要是关闭ssl请求校验。

