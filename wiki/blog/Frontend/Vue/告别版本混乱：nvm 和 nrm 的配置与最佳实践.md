---
title: 告别版本混乱：nvm、fnm 和 nrm 的配置与最佳实践
author: 邓聪的小破站
createTime: 2024/07/05 14:55:44
permalink: /article/fjhacl2x/
tags: 
  - vue
  - nvm
  - fnm
  - node
---

我们为什么会用到多版本的Node， 因为在老项目中，太高版本的node会出现许多问题， 这个时候方便的切换node版本就显得尤为重要；其次就是在排查问题中可能会切换版本来定位问题。

<!-- more -->

## 一、nvm（Nodejs Version Manager）

NVM(Nodejs Version Manager)多node版本管理

### 1.1、安装nvm

~~这里使用的是mac来演示， 直接使用`brew install nvm`来安装就可以了。安装之后终端会有如下提示：`You should create NVM's working directory if it doesn't exist`，使用下面命令创建一下：`mkdir ~/.nvm`~~

~~我们需要创建出来这个.nvm的目录，然后还会提示添加环境变量：`Add the following to your shell profile e.g. ~/.profile or ~/.zshrc`，使用下面命令配置一下：~~

```sh
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

~~我们把上面的export及其下面的内容添加到 ~/.profile 或者~/.zshrc里面，然后source一下就可以用了：`source ~/.zshrc`~~

---

不使用上面brew的安装方式，使用源码仓库中安装方式。

[Installing-and Updating](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

安装或者更新nvm，可以通过下面的脚本来实现

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 国内访问不了github的可以使用gitee
curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
# 加载 nvm
source ~/.bashrc
```

这个脚本通过克隆nvm代码仓库代码到`~/.nvm`，然后尝试在环境变量文件（~/.bashrc, ~/.zshrc等等）后面添加下面的环境变量，如果没有添加环境变量成功的话， 也可以手动执行下面语句。

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

这样子的话， 我们只需要重新启动终端，就能够使用nvm了。

20260209更新

今天在安装opencode的时候，需要用到node v20+的版本，但是电脑上有v18和v20两个版本，每次打开终端都是v18，使用下面命令设置终端打开默认的node版本：

```shell
nvm alias default v20.19.5
```

20260220更新

在安装openclaw的时候，需要满足node>=v22+，继续使用nvm来做node版本管理

```shell
# Download and install Node.js:
nvm install 22
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

### 1.3、nvm问题总结

#### 1.3.1、Visual Code中的终端启动项目问题

出现一个问题，使用自带的终端启动没有问题，node -v 版本v20.19.5， 但是在vs里面node -v版本v20.11.0， 启动就会出现`[plugin:vite:vue] crypto.hash is not a function`的问题。

使用不同的node：

```
// iterm
(base) ➜ jet5devil-index (dev1) ✗ which node
/Users/dengc4r/.nvm/versions/node/v20.19.5/bin/node

// vs
(base) ➜ jet5devil-index (dev1) ✗ which node  
/usr/local/bin/node
```

但是在vs里面使用nvm会错误：`zsh：command not found：nvm`

## 二、fnm（Fast Node Manager）

```sh
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.22.0".

# Verify npm version:
npm -v # Should print "10.9.4".
```

### 2.1、nvm和fnm的对比

| 操作            | nvm命令                                       | fnm命令                |
| --------------- | --------------------------------------------- | ---------------------- |
| 查看已安装版本  | nvm ls                                        | fnm list               |
| 查看远程版本    | nvm ls-remote                                 | fnm list-remote        |
| 安装指定版本    | nvm install <版本号>                          | fnm install <版本号>   |
| 切换版本        | nvm use <版本号>                              | fnm use <版本号>       |
| 设置默认版本    | nvm alias default <版本号>                    | fnm default <版本号>   |
| 卸载版本        | nvm uninstall <版本号>                        | fnm uninstall <版本号> |
| 自动切换 .nvmrc | 需手动执行 nvm use （也可以配置相关文件内容） | 自动检测并切换         |

## 三、nrm（Npm Registry Manager）

NRM（Npm Registry Manager）多镜像源管理

对于后端开发来说，能够多掌握一点前端知识总算是好的，之前是一直在使用nrm，只是使用他的nrm use 的工功能，这里强势学习一波。

nrm（npm registry manager）是npm的镜像管理工具。

### 3.1、安装nrm

```sh
npm install -g nrm
```

不仅是npm的源可以用nrm来切换，pnpm的源是跟着npm的，所以切换npm的源，pnpm的源地址也随着npm源的变化而变化。

### 3.2、nrm使用技巧

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

### 3.3、nrm问题总结

#### 3.3.1、使用nrm use无法切换源

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
