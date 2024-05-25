---
title: 如何在VS code中运行微信小程序？
author: 邓聪的小破站
createTime: 2024/05/24 23:29:11
permalink: /article/iczctjeg/
tags: 
  - vue
  - uniapp
  - wechat
---

配置在VS code里面运行微信小程序。



<!-- more -- >

参考文章：[VS code如何开发微信小程序？（保姆级教程）](https://blog.csdn.net/laowang357/article/details/135044289)

1 下载相应的插件

- 微信小程序开发工具
- vscode weapp api
- vscode wxml
- vscode-wechat

2 执行命令创建项目，

```shell
vue create -p dcloudio/uni-preset-vue uniapp-test
```

然后选择默认模版

```
Preset options:
? 请选择 uni-app 模板 默认模板
📦  Installing additional dependencies...
```

如果出现这样子就表示我们成功了

```shell
added 1064 packages, changed 1 package, and audited 1999 packages in 3m

116 packages are looking for funding
  run `npm fund` for details

58 vulnerabilities (4 low, 39 moderate, 10 high, 5 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project uniapp-test.
👉  Get started with the following commands:

 $ cd uniapp-test
 $ npm run serve
```

然后我们就可以 切换到uniapp-test目录，然后使用npm run server来启动项目。
