---
title: Mac按键映射之Hammerspoon
author: 阿聪小破站
createTime: 2024/01/19 21:24:49
permalink: /article/2knsr9ns/
tags:
  - Hammerspoon
---

今天给大家介绍两个我在 MacBook 上面用的最多的、超级好用的软件，做按键映射。

<!-- more -->

## 一、HammerSpoon 简介

> **What is Hammerspoon?**
>
> This is a tool for powerful automation of OS X. At its core, Hammerspoon is just a bridge between the operating system and a Lua scripting engine.
>
> What gives Hammerspoon its power is a set of extensions that expose specific pieces of system functionality, to the user. With these, you can write Lua scripts to control many aspects of your OS X environment.

我从 hammerspoon 的 github 仓库摘抄了一小部分，从中不难看出我们为什么要用 hammerspoon， hammerspoon 是 lua 和 mac 系统操作之间的一个桥梁，可以用 lua 脚本来操作 mac。

这一点最能体检的就是 mac 电脑按键的控制，很方便的实现了按键与程序之间的映射、实现一些自动化流程。比如使用 hyper + c 可以打开 chrome 浏览器，使用 hyper+e 可以打开 iterm2；

不仅实现了按键的快速映射，hammerspoon 还可以快速迁移，hammerspoon 的配置文件在~/.hammerspoon 目录下面，对于一台新的电脑，只需要下载 hammerspoon，然后在把.hammerspoon 文件夹替换掉，就可以实现无缝迁移。

下面是我的 hammerspoon 的 github 地址，欢迎大家学习查看。 [.hammerspoon](https://github.com/SmartDengC/CoolStuffes/tree/main/.hammerspoon)

hammerspoon 是以 lua 写的，所以要想在此基础上修改的话，需要掌握 lua 的语法，这个也是我下一步需要尝试的。



### 二、HammerSpoon问题总结

### 2.1、在升级VS Code之后HammerSpoon报错

```shell
Some applications have alternate names which can also be checked if you enable Spotlight support with `hs.application.enableSpotlightForNameSearches(true)`.
2025-03-27 20:48:57: -- Loading extension: window
2025-03-27 20:48:57: 20:48:57 ERROR:   LuaSkin: hs.hotkey callback: /Users/dengc4r/.hammerspoon/switch-app.lua:109: attempt to call a nil value (method 'mainWindow')
stack traceback:
	/Users/dengc4r/.hammerspoon/switch-app.lua:109: in function 'toggle_application'
	/Users/dengc4r/.hammerspoon/switch-app.lua:94: in function </Users/dengc4r/.hammerspoon/switch-app.lua:92>
```

