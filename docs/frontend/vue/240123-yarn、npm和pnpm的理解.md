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
