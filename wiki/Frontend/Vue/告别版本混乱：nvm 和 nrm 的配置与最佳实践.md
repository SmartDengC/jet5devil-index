---
title: 告别版本混乱：nvm 和 nrm 的配置与最佳实践
author: 邓聪的小破站
createTime: 2024/07/05 14:55:44
permalink: /article/fjhacl2x/
tags: 
  - vue
  - nvm
  - node
---

我们为什么会用到多版本的Node， 因为在老项目中，太高版本的node会出现许多问题， 这个时候方便的切换node版本就显得尤为重要；其次就是在排查问题中可能会切换版本来定位问题。

<!-- more -->

## 一、nvm：多node版本管理

### 1.1、安装nvm

这里使用的是mac来演示， 直接使用`brew install nvm`来安装就可以了。

安装之后终端会有如下提示：`You should create NVM's working directory if it doesn't exist`

使用下面命令创建一下：

```sh
mkdir ~/.nvm
```

我们需要创建出来这个.nvm的目录，然后还会提示添加环境变量：`Add the following to your shell profile e.g. ~/.profile or ~/.zshrc`

使用下面命令配置一下：

```sh
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

我们把上面的export及其下面的内容添加到 ~/.profile 或者~/.zshrc里面，然后source一下就可以用了

```sh
source ~/.zshrc
```

### 1.2、nvm使用技巧

#### 1.2.1 nvm list 

```sh
(base) ➜ jet5devil-index (dev0) ✗ nvm list
->     v18.20.3
         system
default -> 18 (-> v18.20.3)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v18.20.3) (default)
stable -> 18.20 (-> v18.20.3) (default)
lts/* -> lts/iron (-> N/A)
lts/hydrogen -> v18.20.3
lts/iron -> v20.15.0 (-> N/A)
```

#### 1.2.2、nvm install \<node-version>

例如：`nvm install 18`下载node==18的版本。

## 二、nrm：多镜像源管理

对于后端开发来说，能够多掌握一点前端知识总算是好的，之前是一直在使用nrm，只是使用他的nrm use 的工功能，这里强势学习一波。

nrm（npm registry manager）是npm的镜像管理工具。

### 2.1、安装nrm

```sh
npm install -g nrm
```

不仅是npm的源可以用nrm来切换，pnpm的源是跟着npm的，所以切换npm的源，pnpm的源地址也随着npm源的变化而变化。

### 2.2、nrm使用技巧

```sh
// 查看当前源
nrm ls // 查看所有的
nrm current // 查看当前使用的源

// 切换源
nrm use taobao

// 增加源
nrm add <registry> <url> // registry为源名称， url为源的路径
nrm add yx http://xx.xxx.xxx.xx:52528/repository/ys-group/

// 删除源
nrm del <registry>  
nrm del yx
```

### 2.3、nrm问题总结

#### 2.3.1、使用nrm use无法切换源

```
(base) ➜ jet5devil-index (dev1) ✗ nrm use npm   
   Registry has been set to: https://registry.npmmirror.com/
   
(base) ➜ jet5devil-index (dev1) ✗ nrm use cnpm                        
   Registry has been set to: https://registry.npmmirror.com/
```

通过上面的输出就能很好的看出来问题，我先切换到npm源，输出的是npmmirror，我在切换到cnp也是npmmirror，所以我觉得多半是nrm问题了。

使用下面命令重新安装了一下nrm，就可以切换了。`npm install -g nrm --force`

或者是强行切换：`nrm use taobao --force`

或者是手动切换registry：`npm config set registry https://registry.npmmirror.com/`
