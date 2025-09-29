---
title: 你问我用什么Vim，我只能说LazyVim
createTime: 2025/09/17 22:28:23
permalink: /article/e24zyzkj/
tags: 
  - vim
  - lazyvim
---

从上大学那会就断断续续使用Vim，到现在也在使用，但是只是使用Vim的一些基本功能，也没有做积累，全靠平时工作使用，不用就会忘记。

<!-- more -->

说到LazyVim，我就要向大家推荐一下，我现在的LazyVim的配置文件，欢迎点赞：[LazyVim Config](https://github.com/SmartDengC/CoolStuffes/tree/main/lazyvim)

现在使用LazyVim，就是一个默认安装了许多插件的Vim工具，你也可以自己选择安装的插件并配置，但是使用默认的插件，简单的工作就能够适用了。

## 一、Install LazyVim

官方网站：[**LazyVim**](https://www.lazyvim.org/)



## 二、Using

LazyVim的配置文件目录：`~/.config/nvim`



## 三、Question for LazyVim

### 3.1、Show hidden files in neo-tree

就是neo-tree目录树中显示隐藏文件，修改文件：`.config/nvim/lua/plugins/default_plugin_config.lua`

```lua
return {
  {
    "nvim-neo-tree/neo-tree.nvim",
    opts = {
      filesystem = {
        filtered_items = {
          hide_dotfiles = false,
        },
      },
    },
  },
}
```



### 3.2、LazyVim requires Neovim >= 0.11.2

因为更新了LazyVim导致现在的neovim版本不匹配，出现如下问题：

```sh
LazyVim requires Neovim >= 0.11.2
For more info, see: https://github.com/LazyVim/LazyVim/issues/6421
```

我的neovim现在是0.10.3，没有满足要求

```sh
(base) ➜ nvim nvim --version
NVIM v0.10.3
Build type: Release
LuaJIT 2.1.1736781742
Run "nvim -V1 -v" for more info
```

对neovim进行更新：

```sh
brew update
brew upgrade neovim
```

