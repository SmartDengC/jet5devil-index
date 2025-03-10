---
title: Vue：Vue问题集
author: 阿聪小破站
createTime: 2024/01/30 11:22:33
permalink: /vue/93k08fsh/
tags:
  - vue
---

## error @achrinza/node-ipc@9.2.2: The engine "node" is incompatible with this module. Expected version "8 || 10 || 12 || 14 || 16 || 17". Got "20.5.0" error Found incompatible module.

大概意思就是node-ipc@9.2.2 和 node 的版本不兼容

```shell
(base) ➜ aas_ui (master) ✔ yarn config set ignore-engines true
yarn config v1.22.21
success Set "ignore-engines" to "true".
✨  Done in 0.04s.
```

## singleModelBuilder.ts:136 [Vue warn]: Error in created hook (Promise/async): "TypeError: Assignment to constant variable."

这个又是啥？
