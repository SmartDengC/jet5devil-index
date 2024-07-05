---
title: 简单说说lazyVim的使用
author: 邓聪的小破站
createTime: 2024/06/12 21:33:35
permalink: /article/apvbg392/
tags: 
  - vim
  - lazyvim
---



简单来说，我也是vim的老用户了，但是只是用到vim最简单的上下移动的功能，其他的更高级的功能也没有触及到。这里简单描述一下lazyvim的使用过程。

## 安装LazyVim

对于安装的话，这个就不说了，太久了，我也忘记了怎么安装的了，直接上官网的链接教程: [LazyVim Installation](https://www.lazyvim.org/installation)，需要注意的一点就是，lazyvim要求neovim的版本在0.9以上，如果不满足的话，要手动升级一下neovim的版本哟。

```
Neovim >= 0.9.0 (needs to be built with LuaJIT)
Git >= 2.19.0 (for partial clones support)
```

## LazyVim 目录树

下面是LazyVim文件的目录结构，config文件夹里面就是存放lazyvim的配置文件的，plugins就是存放lazyvim配置的插件的地方。

```shell
├── LICENSE
├── README.md
├── init.lua
├── lazy-lock.json
├── lua
│   ├── config
│   │   ├── autocmds.lua
│   │   ├── keymaps.lua
│   │   ├── lazy.lua
│   │   └── options.lua
│   └── plugins
│       ├── README.md
│       ├── ai.lua
│       ├── easy-commands_lt.lua
│       ├── example.lua
│       ├── scratch_lt.lua
│       ├── treesitter.lua
│       └── vim-translator.lua
├── scratch_config.json
└── stylua.toml
```

对于vim插件的安装：



### 1 config

#### 1.1 options.lua

options文件在我们启动lazyvim的时候是默认加载的，下面给出了一个网址，我们可以看到里面一些默认的配置，在这个文件里面，我只是去修改了一下mapleader这个配置，默认是空格键，我将它设置成逗号。

```lua
-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here
-- vim.g.mapleader = "\\"

vim.g.mapleader = "," -- 使用逗号当做leader key
```

​	

#### 1.2 keymaps.lua

```shell
-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

```



### 2 plugins

:Mason 来安装LSP



\<leader\> + cm mason 
s 开启跳转， ideavim里面是ss

ctrl + 上下左右来调整窗口的大小

\<leader\> + sh 打开帮助页

\<leader\> + ul 打开关闭行号

Ctrl + / 打开控制台

\<leader\> + fr 搜索最近打开的文件



### neotree.nvim

? -> show help

\# -> fuzzy_sorter

. -> set root

A -> add directory 添加目录

C -> close node

H -> toggle hidden 切换是否展示隐藏文件

P -> toggle preview 切换预览功能

S -> open split 横向打开文件

s -> open vsplit 纵向打开文件

a -> add

c -> copy

d -> delete

e -> toggle auto expand width ?

f -> filter on submit 搜索

m -> move 修改文件名称

q -> close window

r -> rename

y -> copy to clipboard

z -> close all nodes
