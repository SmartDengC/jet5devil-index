---
title: M2 MacBookPro踩坑Xcode
createTime: 2024/10/18 02:18:26
permalink: /article/buzgdlbt/
tags:
  - mbp
  - xcode
---
一个版本不匹配引发的问题， 我累了。

<!-- more -->

```
芯片    Apple M2 Max
macOS  Ventura 13.7
```

今天被安排去支援其他项目，项目代码的版本管理工具使用的是svn，之前在15款的mbp上面安装过svn，后面换电脑迁移到当前的电脑上面，想这能够使用。

但是在拉代码的时候，就出现问题，svn co 报错了。

```shell
svn: E200029: Couldn't perform atomic initialization
svn: E200030: SQLite 编译为 3.39.5，但是运行于 3.39.4
```

大概的意思就是编译是一个版本，运行是另外一个版本，版本不匹配。

看网上有很多教程说是更新homebrew，然后重新安装sqlite和svn。

```shell
brew update
brew reinstall sqlite svn --build-from-source
```

悲伤的是，我安装了，但是还是上面一样的报错，途中还出现需要安装`xcode command line`，但是在线有安装不了。

```
==> Reinstalling sqlite
Error: Xcode alone is not sufficient on Ventura.
Install the Command Line Tools:
  xcode-select --install
```

比悲伤更悲伤的事情是，xcode command line下载都是执行apple developer，但是使用现有的apple账号登陆不了，死活登陆不上苹果的developer网站，最后还是用邮箱重新注册了一个账号才登陆上，下载了适配的xcode command line版本。

[登陆apple developer出现 您的apple ID 暂时不符合使用此应用程序的条件](https://blog.csdn.net/qq_34081968/article/details/109518918)

[苹果开发者官网的下载专区](https://developer.apple.com/download/all/)

[develop.apple.com](https://developer.apple.com/)

但是问题还是没有解决，我的svn依然出现版本不匹配的情况，看网上有说升级os版本的，最后决定从13.1升级到13.7，竟然就好了，Sqlite3 的版本也变成了3.39.5了。

```shell
(base) ➜ Downloads sqlite3 --version
3.39.5 2022-10-14 20:58:05 554764a6e721fab307c63a4f98cd958c8428a5d9d8edfde951858d6fd02daapl
```

升级过后回出现一些软件打不开的情况，这些都能接受，重新安装一下就行了。
