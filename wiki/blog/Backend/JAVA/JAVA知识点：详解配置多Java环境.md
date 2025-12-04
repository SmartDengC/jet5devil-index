---
title: JAVA知识点：详解配置多Java环境
createTime: 2024/12/11 14:57:29
permalink: /article/jbq16ay3/
tags: 	
  - java
---

开发过程中难免会遇到使用不同JDK来编码的情况，记录配置多Java环境的过程。

<!-- more -->

配置：Macbook Pro m2

开发多个项目，使用的不同的jdk，前面是jdk8， 新项目是jdk17，就需要在本地配置多jdk环境。

文件参考：[MAC M1安装多个JDK版本及动态切换 ](https://www.cnblogs.com/ryosetsu/p/base_java.html)

主要的逻辑就是下载对应的jdk版本软件，进行安装，在后面配置一下环境变量。

## 一、实现多Java环境

### 1、 安装 省略

[Download Java JDK](https://www.azul.com/downloads/?package=jdk)

去上面地址电脑对应的jdk，然后进行安装，安装默认的路径为：`/Library/Java/JavaVirtualMachines`

需要记住这个地址，下面配置环境变量的时候需要用到。

### 2、配置环境变量

安装完之后进行环境变量的配置，打开配置文件

```shell
vim ~/.bash_profile
```

根据下面的配置，结合自己的情况稍微做修改。

```shell
# 配置JDK路径
export JAVA_8_HOME=/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
export JAVA_11_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
# 设置默认JDK版本
export JAVA_HOME=$JAVA_11_HOME
CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
# 配置alias命令动态切换JDK版本  
alias jdk8="export JAVA_HOME=$JAVA_8_HOME"
alias jdk11="export JAVA_HOME=$JAVA_11_HOME"
export JAVA_HOME
export PATH
export CLASSPATH
```

生效配置文件

```shell
source ~/.bash_profile
```

验证是否成功

```shell
(base) ➜ ~ java -version
java version "1.8.0_291"
Java(TM) SE Runtime Environment (build 1.8.0_291-b10)
Java HotSpot(TM) 64-Bit Server VM (build 25.291-b10, mixed mode)
(base) ➜ ~ jdk17
(base) ➜ ~ java -version
openjdk version "17.0.13" 2024-10-15 LTS
OpenJDK Runtime Environment Zulu17.54+21-CA (build 17.0.13+11-LTS)
OpenJDK 64-Bit Server VM Zulu17.54+21-CA (build 17.0.13+11-LTS, mixed mode, sharing)
(base) ➜ ~ jdk8
(base) ➜ ~ java -version
java version "1.8.0_291"
Java(TM) SE Runtime Environment (build 1.8.0_291-b10)
Java HotSpot(TM) 64-Bit Server VM (build 25.291-b10, mixed mode)
```

## 二、遇到的问题

java异常：idea 报错：无效的目标发行版：17 的解决办法

java: 警告: 源发行版 17 需要目标发行版 17

这些问题都是指向着项目需要的jdk版本和本地配置的jdk版本不一致。

1 右键项目后点击 **Open Module Settings**， 然后修改Module JDK这一项。

2 打开idea的设置，搜索**Maven**， 找到Maven下的Importing， 然后修改 **JDK for importer**为相应的JDK版本。

