---
title: 2024-01-30-terminal中使用typora打开md文件
author: 
createTime: 2024/01/30 11:08:49
permalink: /article/cyy3y0nr/
---


因为平时用typora来写md文件的时间比较多，特别是在命令行中，需要跳转到typora中，简单配置一下



我们都知道`open . `使用finder打开当前目录，我们也可以用`open /Application/Typora.app` 来打开typora软件。

但是我们要用typora打开md文件该怎么办？

我们使用-a参数， `open -a /Applications/Typora.app README.md`

但是每次都要输入折磨多字符肯定不方便，我们给上面的命令其一个别名t，如下设置

`alias t="open -a  /Applications/Typora.app"`

这样的话，我们就可以直接使用`t README.md` 使用typora来打开README.md文件了



**alias的简单使用**

- `alias` 查看系统中所有的命令别名
- `alias 别名='原命令'`
- `unalias 别名` 删除别名
- `vi ~/.bashrc` 写入这个文件及永久生效，编辑后记得是环境变量剩下 `source .bashrc`