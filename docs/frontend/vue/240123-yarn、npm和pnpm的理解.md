---
title: yarn、npm和pnpm的理解
author: 阿聪小破站
createTime: 2024/01/23 11:09:59
permalink: /article/r3jj4tlv/
tags: 
  - yarn
  - npm
  - pnpm
---

修改本地 yarn 的版本

我们使用 yarn 来管理

```
yarn set version <版本号>
yarn set version 2.4.3
```

```
npm install -g yarn
npm uninstall -g yarn
npm view yarn versions  // 查看yarn提供的版本
```

[升级 Yarn 2，摆脱 node_modules](https://juejin.cn/post/6996958355914752036)

xxx.lock 文件的作用？

## package.json 中^和~的区别

^2.0.0-rc.0 不改变主要版本和次要版本，就是说 2.0.x 的版本都是可以的
~2.0.0-rc.0 不改变主要版本，就是说 2.x 的版本都是可以的

[package.json 中^,~的区别](https://blog.csdn.net/peaceoncemore/article/details/79195206)

## pnpm

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
