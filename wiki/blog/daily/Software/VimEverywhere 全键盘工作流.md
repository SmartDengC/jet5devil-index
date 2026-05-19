---
title: VimEverywhere 全键盘工作流
author: 阿聪小破站
createTime: 2024/01/19 21:24:49
permalink: /article/2knsr9ns/
tags:
  - Hammerspoon
  - karabiner
---

今天给大家介绍两个我在 MacBook 上面用的最多的、超级好用的软件，做按键映射。

  - Hammerspoon
  - Karabiner

<!-- more -->

## 一、Karabiner

### 1.1、Karabiner 简介

Karabiner 是 Mac 上面好用的按键映射的工具，它可以实现单个按键的映射，像是 Mac 键盘和 Win 键盘配置不同的 Config，然后在 Win 的 Config 里面将 Cmd 映射成 Alt， Alt 映射成 command，这样就方便很多；还有一种就是复杂按键的映射，比如将 Command + Ctrl + Shift +Alt 映射到 Caps 上面，因为 Caps 我们用的很少。

下面是我 Karabiner 的配置文件，欢迎大家点赞收藏： [Karabiner Config](https://github.com/SmartDengC/CoolStuffes/tree/main/karabiner)

### 1.2、Karabiner 使用方法

接下来我们说一下如何使用 Karabiner ，它是以 Json 的格式来写配置文件的。

如果我们想实现：空格键在按下的时候映射成 Hyper 键, 如果是单独按下的话还是空格键。

~~但是按键快了的话，会出现误触的情况， 第二个问题就是在这样子映射过后，明显能够感觉到输入的速度变慢了。现在再看输入的速度了，还有什么好的方式来解决现在输入速度比较慢的情况。~~

最后使用的是Keychron Q8 的一个额外按键映射成 Caps，用 Caps 来做 Hyper 键， 还是有点不是特别的满意，如果 spacebar 能解决上面的两个问题的话，那就很 nice 了，

但是这里的 to_if_alone 还是很重要的一个知识点。

因为大多数情况下是一个左手用键盘，右手用鼠标来操作。

```json
{
  "title": "HYPERKEY: Shift+Ctrl+Command+Optional, author: Dengc",
  "rules": [
    {
      "description": "SPACEBAR: Change spacebar to HYPERKEY if pressed with other keys (Post spacebar when pressed alone)",
      "manipulators": [
        {
          "from": {
            "key_code": "spacebar",
            "modifiers": {
              "optional": ["any"]
            }
          },
          "to": [
            {
              "key_code": "left_shift",
              "modifiers": ["left_command", "left_control", "left_option"]
            }
          ],
          "to_if_alone": [
            // 在from to的基础上添加to_if_alone的属性， 单独按下还是空格键
            {
              "key_code": "spacebar"
            }
          ],
          "type": "basic"
        }
      ]
    }
  ]
}
```

## 二、HammerSpoon 

### 2.1、什么是HammerSpoon？

:::info

**What is Hammerspoon?**

This is a tool for powerful automation of OS X. At its core, Hammerspoon is just a bridge between the operating system and a Lua scripting engine.

What gives Hammerspoon its power is a set of extensions that expose specific pieces of system functionality, to the user. With these, you can write Lua scripts to control many aspects of your OS X environment.

:::

我从 Hammerspoon 的 Github 仓库摘抄了一小部分，从中不难看出我们为什么要用 Hammerspoon， Hammerspoon 是 Lua 和 Mac 系统操作之间的一个桥梁，可以用 Lua 脚本来操作 Mac。

这一点最能体检的就是 Mac 电脑按键的控制，很方便的实现了按键与程序之间的映射、实现一些自动化流程。比如使用 Hyper + c 可以打开 Chrome 浏览器，使用 Hyper+e 可以打开 Iterm2；

不仅实现了按键的快速映射，Hammerspoon 还可以快速迁移，Hammerspoon 的配置文件在~/.hammerspoon 目录下面，对于一台新的电脑，只需要下载 Hammerspoon，然后在把.hammerspoon 文件夹替换掉，就可以实现无缝迁移。

下面是我的 Hammerspoon 的 github 地址，欢迎大家点赞转发： [Hammerspoon Config](https://github.com/SmartDengC/CoolStuffes/tree/main/.hammerspoon)

Hammerspoon 是以 Lua 写的，所以要想在此基础上修改的话，需要掌握 Lua 的语法，这个也是我下一步需要尝试的。

### 2.2、HammerSpoon问题总结

#### 2.2.1、在升级VS Code之后HammerSpoon报错

```shell
Some applications have alternate names which can also be checked if you enable Spotlight support with `hs.application.enableSpotlightForNameSearches(true)`.
2025-03-27 20:48:57: -- Loading extension: window
2025-03-27 20:48:57: 20:48:57 ERROR:   LuaSkin: hs.hotkey callback: /Users/dengc4r/.hammerspoon/switch-app.lua:109: attempt to call a nil value (method 'mainWindow')
stack traceback:
	/Users/dengc4r/.hammerspoon/switch-app.lua:109: in function 'toggle_application'
	/Users/dengc4r/.hammerspoon/switch-app.lua:94: in function </Users/dengc4r/.hammerspoon/switch-app.lua:92>
```

