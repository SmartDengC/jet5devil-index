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

## 一、Npm

```
request to https://r2.cnpmjs.org/buffer-builder/-/buffer-builder-0.2.0.tgz failed, reason: certificate has expired
```

参考 这个评论：[request to https://registry.npmjs.org/co failed](https://stackoverflow.com/questions/54611707/request-to-https-registry-npmjs-org-co-failed)，主要是关闭ssl请求校验。

```
request to https://registry.npmjs.org/co failed
```

参考： [【 npm详解：从入门到精通】](https://blog.csdn.net/m0_74187147/article/details/138590144)

在我们安装完nodejs的时候，就会默认安装npm，我们可以用npm -v来查看安装的版本。

### 1.1 npm init

在nodejs项目中，package.json文件是项目的元数据文件，其中包含了项目的各种信息，如名称、版本、依赖等，使用npm init命令可以初始化并生成一个package.json文件。

如果希望使用默认配置快速生成package.json，可以使用-y或者-yes。

```
npm init -y
```

### 1.2 npm install

简写为npm i， 下载项目依赖。

默认是将下载的包存放到node_modules里面，并在package.json文件的dependencies字段中添加相应条目，如果只想用于开发环境，可以使用--save-test，例如下面实例：

```
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

```
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

```js
npm config list --l 或 npm config ls -l #查看全部配置项
npm config list #查看简略配置信息
npm config get <key>  #查看某一项的配置信息
npm config set <key> <value> #设置某一项的配置信息
```

例如：

```js
// 设置npm的仓库源
npm config set registry http://registry.npmjs.org/ 
// 关闭strict-ssl
npm config set strict-ssl false
```

## 二、Yarn

我们使用 yarn 来管理

```
// 修改本地 yarn 的版本
yarn set version <版本号>
yarn set version 2.4.3
```

通过npm来安装yarn

```
npm install -g yarn
npm uninstall -g yarn
npm view yarn versions  // 查看yarn提供的版本
```

[升级 Yarn 2，摆脱 node_modules](https://juejin.cn/post/6996958355914752036)

xxx.lock 文件的作用？



## 三、pnpm

### ppm outdated

今天学到一个 pnpm 的新命令，就是`pnpm outdated`，意思就是展示出来可更新的包的内容，比如像这样子：

```
(base) ➜ jet5devil-index (dev0) ✗ pnpm outdated
┌────────────────────────────────┬─────────────┬─────────────┐
│ Package                        │ Current     │ Latest      │
├────────────────────────────────┼─────────────┼─────────────┤
│ @types/lz-string               │ 1.5.0       │ Deprecated  │
├────────────────────────────────┼─────────────┼─────────────┤
│ vue                            │ 3.4.31      │ 3.5.4       │
├────────────────────────────────┼─────────────┼─────────────┤
│ pnpm                           │ 8.15.8      │ 9.10.0      │
├────────────────────────────────┼─────────────┼─────────────┤
│ uuid                           │ 3.4.0       │ 10.0.0      │
├────────────────────────────────┼─────────────┼─────────────┤
│ vuepress-plugin-comment2 (dev) │ 2.0.0-rc.26 │ 2.0.0-rc.30 │
├────────────────────────────────┼─────────────┼─────────────┤
│ vuepress-theme-plume (dev)     │ 1.0.0-rc.97 │ 1.0.0-rc.98 │
```

`pnpm update vuepress@latest` 和 `pnpm update vuepress@next`的区别？

### pnpm list --depth=1

可以查看项目直接依赖的包及其版本，以及间接依赖包的最新版本。

## 四、package.json

### 4.1 package.json 中^和~的区别

^2.0.0-rc.0 不改变主要版本和次要版本，就是说 2.0.x 的版本都是可以的
~2.0.0-rc.0 不改变主要版本，就是说 2.x 的版本都是可以的

[package.json 中^,~的区别](https://blog.csdn.net/peaceoncemore/article/details/79195206)
