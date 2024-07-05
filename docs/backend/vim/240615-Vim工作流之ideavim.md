---
title: Vim工作流之ideavim
author: 邓聪的小破站
createTime: 2024/06/15 22:56:17
permalink: /article/eo031xkx/
tags: 
  - vim
  - ideavim
---

对自己ideavim里面的配置进行学习说明。附上我现在用的ideavim的配置文件连接地址：[.ideavim](https://github.com/LintaoAmons/CoolStuffes/blob/main/ideavim/.ideavimrc)

<!-- more -->



## 基础配置篇

```
nmap L <action>(NextTab)  // 下一个tab
nmap H <action>(PreviousTab)  // 上一个tab

nmap ma <action>(ToggleBookmark)  创建一个书签

// #  向下找光标所在的单词， * 向下找光标做在的单词
// % 在括号两端移动

```







## 插件篇



### 1、Which-key

WhichKey是一个按键绑定的vim的插件，展示常见的绑定的按键，whichkey是一个用lua写的插件；which-key的话需要的idea或者pycharm里面安装which-key的插件。

![](https://user-images.githubusercontent.com/292349/116439438-669f8d00-a804-11eb-9b5b-c7122bd9acac.png)

Leader + w

在打开的窗口都可以用cmd+ w关闭

```bash
nmap <leader>wo <action>(UnsplitAll) \| <action>(HideAllWindows)  // 最大化窗口
nmap <leader>wl <action>(SplitVertically)  // 竖向分屏 可用:vs替换
nmap <leader>wc <c-w>c  // 关闭窗口
```

Leader + f

```bash
nmap <leader>fa <action>(GotoAction)  // go to action
nmap <leader>ff <action>(GotoFile)  // go to file
nmap <leader>ft <action>(FindInPath)  // 搜索 in project
nmap <leader>fp <action>(OpenProjectWindows)  // 切换打开的项目
nmap <leader>fm <action>(ReformatCode) \| <action>(OptimizeImports)  // 格式化当前代码
nmap <leader>fs <action>(FileStructurePopup)   // 打开项目结构目录 就是列出相关的方法
```

Learder + g

```bash
nmap <leader>dd <action>(Vcs.ShowTabbedFileHistory)  // 当前文件的历史git commit信息
```

Insert

```bash
nmap <leader>i f(a  // 跳转到( 左括号，然后进入插入模式
```

Leader + l

```bash
nmap <leader>lr <action>(RenameElement)  // 重命名方法
```

Leader + n

```bash
nmap <leader>nl :nohlsearch<CR>  // 不高亮
```

Leader + s

```bash
nmap <leader>sb <action>(ShowBookmarks)  // 打开书签
nmap <leader>ss <action>(FileStructurePopup)  // 文件结构
```

leader+z

```bash
nmap <leader>zo <action>(ExpandAllRegions)
nmap <leader>zc <action>(CollapseAllRegions)
```



```bash
nmap <leader>c :q!<CR>  // 保存退出
```



```bash
nmap ge <action>(GotoNextError)
nmap gt <action>(GotoTest)
nmap gm <action>(MethodUp)
nmap gi <action>(GotoImplementation)
" last changed in current buffer(file)
nmap ga '.
```

### 2、IdeaVim-EasyMotion

```bash
" 启动easymotion s2 当输入两个字符的时候触发
nmap ss <Plug>(easymotion-s2)
```

### 3、vim-surround

```bash
// ds 表示删除两边相同的字符
"hello world" -> hello world   // ds "  // 删除 "

// cs 表示修改两边相同的字符
"hello world" -> 'hello world'  // cs"'  // 把两侧的" 修改成‘

// ys 表示在两边添加相同的字符
hello w*orld -> hello (world)  // ysiw)  光标在world上面，ysiw) 表示在world两边添加()
```

### 4、nerdtree

```bash
<leader> e // open 目录文件树
```

在idea里面切换到目录树之后，在按除hjkl之外的按键是搜索，如何去掉这个，增加对文件或者是文件夹的操作的功能？



## 拓展vim 操作



删除文件所有内容，光标移动到文件头，然后dG

```bash
dG 删除当前光标文件到最后一行的文件, 不仅可以删除，也可以复制
yG 复制当前行到最后

yaw 复制光标所在的单词

d4j 删除下4行
y4j 复制下4行

caw 删除当前单词 进入插入模式
cc 删除当前行进入插入模式
c4j 删除下4行进入到插入模式
```



## VIM小游戏

[vimgolf](https://www.vimgolf.com/)
