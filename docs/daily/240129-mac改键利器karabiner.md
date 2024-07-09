---
title: Mac改键利器karabiner
author: 阿聪小破站
createTime: 2024/01/29 19:47:02
permalink: /article/lap9glun/
---

今天来简单说说 mac 上面一个非常好用的改键的软件, 叫做 karabiner

## 举几个简单的例子

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



补充mac的快捷键

ctrl + command + spacebar 打开表情输入法



mac输入法技巧：

西安  -> xi'an

使用tab键来选择声调

Shift + 字母， option +数字

燚。shift + 空格



