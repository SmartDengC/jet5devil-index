---
title: Vim Plugin NerdTree
date: 2023/01/30 01:00:58
tags: 
  - vim-plugin
  - nerdtree
author: 
createTime: 2024/02/03 19:14:57
permalink: /article/0bof1ye1/
---



NerdTree 是对文件的整体管理


这里简单描述一下NerdTree的操作


# 一、Install 

使用vim-plugin来安装，直接在配置文件里面写入github的地址就可以了。

这里突然想起，可以直接在vimrc里面编写


下面是我的nerdtree的配置
```json
" 4.nerdtree
nnoremap <leader>v :NERDTreeFind<cr>
nnoremap <leader>g :NERDTreeToggle<cr>
let NERDTreeShowHidden=1
let NERDTreeIgnore = ['\.pyc$']  " 过滤所有.pyc文件不显示
let g:NERDTreeDirArrowExpandable = '+'
let g:NERDTreeDirArrowCollapsible = '-'
let NERDTreeShowBookmarks=1  " 开启Nerdtree时自动显示Bookmarks
```
# 二、Using
授人以渔，就是我们可以键入 ? 来打开帮助手册。

![Snipaste_2023-02-15_09-48-36](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302150952809.png)



## 1、唤醒

## 2、NerdTree 帮助手册
### File node mappings
- t 在新的tab里面打开
- T 打开一个新的空的tab？ 
- i 横向分屏打开
- gi
- s 纵向分屏打开
- gs 
- \<CR\> 当前标签页打开

### Directory node mappings
- o  打开和关闭文件夹，与回车的作用类似
- O 重新刷新打开
- t
- x 关闭父类文件
- X 关闭所有的打开的子类文件夹

### Bookmark table mapping

问：如何加入书签？
我们将光标移动到你需要加标签的地方，这个时候键入  `:Bookmark`，这样就将光标所在的文件或者是目录加入到标签里面

---
- o 打开书签
- go 前一个文件
- D 删除书签
- B 打开和关闭书签显示

### Tree navigation mappings
- P  跳转根目录
- p 跳转到父目录
- K 跳转到第一个子目录
- J 跳转到最后一个子目录

### Filesystem mappings
- C 将光标所在的目录设置蹭root目录
- u 返回到根目录的上一层，折叠
- U 返回到根目录的上一层，不折叠
- r 重新载入当前目录
- R 重新载入根目录
- m 打开菜单，就是操作增删改文件的菜单

### Tree filtering mappings
- I 隐藏 . 开头的文件或者文件夹
- F 隐藏文件
- B 打开或者关闭书签
