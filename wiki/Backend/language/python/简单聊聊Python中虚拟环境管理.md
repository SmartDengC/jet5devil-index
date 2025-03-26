---
title: 简单聊聊Python中虚拟环境管理
author: 邓聪的小破站
createTime: 2024/05/16 11:24:51
permalink: /article/lupe9x4r/
tags:
  - python
  - vent
  - conda
---

虚拟环境是一种用于隔离不同Python项目所需要依赖的机制。他允许我们在同一台机器上同时安装和管理多个Python版本，以及每个版本所需要的包。通过虚拟环境，我们可以避免不同项目之间的依赖冲突，并且可以针对特定项目选择特定的Python版本。

<!-- more -->

我的Mac电脑升级了OS的小版本，导致我的虚拟环境用不了了，我也不知道为什么，很难受，因此需要重新创建虚拟环境，里面的依赖库不对应，导致运行不起来，也很难受。

这里简单说一下我使用的Python虚拟环境，对于虚拟环境还是蛮有作用的，每一个项目使用不同的环境，能够避免依赖库之前的版本问题。

常见的有python的venv的环境和conda两种方式创建虚拟环境。

## 一、venv

### 1.1 创建虚拟环境

使用`python -m venv VENR_DIR`来创建， VENV_DIR指定存放环境的目录，VERV_DIR一般使用venv，这是一个不成文的规定。

```shell
(base) ➜ test1 python -m venv venv
(base) ➜ test1 ls
venv
(base) ➜ test1 source venv/bin/activate
(venv) (base) ➜ test1 python --version
Python 3.8.8
```

如果我们想指定python的版本也是可以的，使用`python3.9 -m venv VENV_DIR`，前提是你电脑本地有对应版本的python解释器，如下：

```shell
(venv) (base) ➜ test2 python3.9 -m venv venv
(venv) (base) ➜ test2 ls
venv
(venv) (base) ➜ test2 source venv/bin/activate
(venv) (base) ➜ test2 python --version
Python 3.9.21
```

### 1.2 激活使用虚拟环境

激活虚拟环境`source VENV_DIR/bin/activate`（前面的venv就是环境的名称）

```shell
// source VENV_DIR/bin/activate
(base) ➜ test source venv/bin/activate
(venv) (base) ➜ test ls
venv
(venv) (base) ➜ test python3 --version
Python 3.9.6
(venv) (base) ➜ test
```

### 1.3 退出虚拟环境

deactivate 退出当前的虚拟环境

```shell
deactivate
```

## 二、conda

conda创建虚拟环境

conda查看虚拟环境

conda切换虚拟环境

conda activate envName 切换到envName环境， 

conda deactivate 退出虚拟环境

conda虚拟环境包管理
