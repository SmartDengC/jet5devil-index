---
title: Mac按键映射之Karabiner
author: 阿聪小破站
createTime: 2024/01/19 21:24:49
permalink: /article/8x2tdq44/
tags:
  - karabiner
---

今天给大家介绍两个我在 MacBook 上面用的最多的、超级好用的软件，做按键映射。

<!-- more -->

# 一、Karabiner

## 1.1、karabiner 简介

karabiner 是 mac 上面好用的按键映射的工具，它可以实现单个按键的映射，像是 mac 键盘和 win 键盘配置不同的 config，然后在 win 的 config 里面将 cmd 映射成 alt， alt 映射成 command，这样就方便很多；还有一种就是复杂按键的映射，比如将 Command + Ctrl + Shift +Alt 映射到 Caps 上面，因为 Caps 我们用的很少。

下面是我 karabiner 的配置文件，欢迎大家查看。

 [CoolStuffes Karabiner](https://github.com/SmartDengC/CoolStuffes/tree/main/karabiner)

接下来就是写 karabiner 怎么使用，它是以 json 的格式来写配置文件的。

空格键在按下的时候映射成 hyper 键, 如果是单独按下的话还是空格键.

但是按键快了的话，会出现误触的情况， 第二个问题就是在这样子映射过后，明显能够感觉到输入的速度变慢了。

现在再看输入的速度了

还是么有好的方式来解决现在输入速度比较慢的情况，还有就是解释

Woxia

最后还是用 q8 的一个额外按键映射成 caps，用 caps 来做 hyper 键， 还是有点不是特别的满意，如果 spacebar 能解决上面的两个问题的话，那就很 nice 了，

还是用 caps 来做 hyper。

但是这里的 to_if_alone 还是很重要的一个知识点。

因为大多数情况下是一个左手用键盘，右手用鼠标来操作。

暂时放弃了，就先用 caps 来用着

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

