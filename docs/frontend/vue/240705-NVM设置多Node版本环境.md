---
title: 240705-NVM设置多Node版本环境
author: 邓聪的小破站
createTime: 2024/07/05 14:55:44
permalink: /article/fjhacl2x/
tags: 
  - vue
  - nvm
---

我们为什么会用到多版本的node， 因为在老项目中，太高版本的node会出现许多问题， 这个时候方便的切换node版本就显得尤为重要；其次就是在排查问题中可能会切换版本来定位问题。



<!-- more -->

## 安装nvm

这里使用的是mac来演示， 直接使用`brew install nvm`来安装就可以了。

安装之后终端会有如下提示：

```shell
You should create NVM's working directory if it doesn't exist:
  mkdir ~/.nvm
```

我们需要创建出来这个.nvm的目录，然后还会提示添加环境变量：

```shell
Add the following to your shell profile e.g. ~/.profile or ~/.zshrc:
  export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

我们把上面的export及其下面的内容添加到 ~/.profile 或者~/.zshrc里面，然后source一下就可以用了

## 使用nvm

1 nvm list 查看

```shell
(base) ➜ jet5devil-index (dev0) ✗ nvm list
->     v18.20.3
         system
default -> 18 (-> v18.20.3)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v18.20.3) (default)
stable -> 18.20 (-> v18.20.3) (default)
lts/* -> lts/iron (-> N/A)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.24.1 (-> N/A)
lts/erbium -> v12.22.12 (-> N/A)
lts/fermium -> v14.21.3 (-> N/A)
lts/gallium -> v16.20.2 (-> N/A)
lts/hydrogen -> v18.20.3
lts/iron -> v20.15.0 (-> N/A)
```

nvm install 18  // 下载node==18的版本。

