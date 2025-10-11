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

直接参考官网的安装步骤：[Installaton](https://www.lazyvim.org/installation)

- Make a backup of your current Neovim files:

  ```sh
  # required
  mv ~/.config/nvim{,.bak}
  
  # optional but recommended
  mv ~/.local/share/nvim{,.bak}
  mv ~/.local/state/nvim{,.bak}
  mv ~/.cache/nvim{,.bak}
  ```

- Clone the starter

  ```sh
  git clone https://github.com/LazyVim/starter ~/.config/nvim
  ```

- Remove the `.git` folder, so you can add it to your own repo later

  ```sh
  rm -rf ~/.config/nvim/.git
  ```

- Start Neovim!

  ```sh
  nvim
  ```

  Refer to the comments in the files on how to customize **LazyVim**.

## 二、Using

### 2.1、基本使用

LazyVim的配置文件目录：`~/.config/nvim`

:Lazy 进入到LazyVim的设置里面，有下面一下选项操作：

- Install (I)   ：安装插件
- Update (U)   ：更新配置中的插件
- Sync (S)  ：
-  Clean (X)   ：
- Check (C)   ：
- Log (L)  ：
-  Restore (R)：   
- Profile (P)   ：输出一下加载的内容
- Debug (D)   
- Help (?) 

### 2.2、LazyVim目录结构

```
├── LICENSE
├── README.md
├── init.lua
├── lazy-lock.json
├── lazyvim.json
├── lua
│   ├── config
│   │   ├── autocmds.lua
│   │   ├── keymaps.lua
│   │   ├── lazy.lua
│   │   └── options.lua
│   └── plugins
│       ├── example.lua
│       └── plugins.lua
└── stylua.toml
```

主要目录 lua/config， lua/plugins

#### 2.2.1、keymaps.lua

维护自己个性的自定义按键。

#### 2.2.2、options.lua

如果需要修改leader key，可以在lua/config/options.lua 里面修改，内容如下：

:::code-tabs
@tab options.lua

```lua
vim.g.mapleader = "," -- 使用逗号当做leader key

local opt = vim.opt
opt.relativenumber = false -- 关闭相对行数
```
:::

## 三、Install Plugins

### 3.1、[nvim-neo-tree/neo-tree.nvim](https://github.com/nvim-neo-tree/neo-tree.nvim)

一个目录树

```lua
  {
    "nvim-neo-tree/neo-tree.nvim",
    branch = "v3.x",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "MunifTanjim/nui.nvim",
      "nvim-tree/nvim-web-devicons", -- optional, but recommended
    },
    lazy = false, -- neo-tree will lazily load itself
    opts = {
      filesystem = {
        filtered_items = {
          hide_dotfiles = false,
        },
      },
      window = {
        position = "left",
      },
    },
  },

```

### 3.1、[LintaoAmons/easy-commands.nvim](https://github.com/LintaoAmons/easy-commands.nvim)

统领快捷键

```lua
	{
    "LintaoAmons/easy-commands.nvim",
    event = "VeryLazy",
    opts = {},
    -- use tag option to stay stable. This plugin is continues updating and adding more commands into it, pin to a tag should keep you stay where you are comfortable with.
    -- tag = "v0.8.0"
  }
```

:FormatCode ， 格式化

### 3.2、folke/noice.nvim

LazyVim自带的消息通知。

```lua
  {
    "folke/noice.nvim",
    enabled = true,
  }
```

关闭插件 enabled = false

## 四、Question for LazyVim

### 4.1、Show hidden files in neo-tree

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

### 4.2、LazyVim requires Neovim >= 0.11.2

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

