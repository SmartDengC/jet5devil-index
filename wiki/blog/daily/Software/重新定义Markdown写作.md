---
title: 重新定义Markdown写作
createTime: 2025/04/27 10:54:00
permalink: /article/rgmwrvjo/
tags:
  - obsidian
  - typora
  - markdown
---

重新定义Markdown写作，让写作更方便。

<!-- more -->

## 一、Typora

用了挺过多的文档编辑器，最后还是保留下了Typora，因为Typora可以关联Picgo将图片上传到图床上，（自己构建的基于Gitee的图床）； 在Typora的加持，文字编辑工作有明显的提高，这里简单记录一下使用过程中的一些知识点和小技巧。

如果你也想要配置的话，如果出现问题，可以参考下面文章：

- [Picgo：picgo+gitee 出错 404 Project Not Found](https://blog.csdn.net/weixin_41288824/article/details/108260798)

- [解决Mac中Picgo无法安装gitee插件问题](https://blog.csdn.net/weixin_41288824/article/details/119397192)

- MD 数学公式：[使用 MD 语法编写数学公式](https://blog.csdn.net/wzk4869/article/details/126863936)

### 1.1、Typora主题管理

我们知道Typora的[官方网站](https://typoraio.cn/)， 在网站上方的导航栏里面点击**主题**，就可以跳转到Typora官方收录的众多主题界面。

找到自己喜欢的主题之后，点击download之后会跳出下载界面，我们下载之后，然后在设置里面找到外观，打开主题的配置文件所在的文件夹。

![image-20250409114540045](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202504091145109.png)

然后将下载下来的主题文件拷贝到**主题文件夹**即可，我的Typora主题文件夹地址为：`/Users/dengc4r/Library/Application Support/abnerworks.Typora/themes`，然后重启就可以选择刚才配置的主题了。

主题的主页一般都有相应的安装说明，例如[Lapis](https://theme.typoraio.cn/theme/Lapis/)，可以看看如何操作。

![image-20250409114833013](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202504091148054.png)

### 1.2、Typora插件管理

Typora非开源项目，没有相应的插件管理功能，但是强大的网友自己写了一套插件管理的程序。

[obgnail/typora_plugin](https://github.com/obgnail/typora_plugin)  只支持Windows、Linux版本，不支持Mac版本电脑

[typora-community-plugin/typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin)  支持Windows、Linux、Mac但是我还没有安装成功，哈哈。

- [如何编译属于你的第一个插件？](https://github.com/typora-community-plugin/typora-community-plugin/blob/main/docs/zh-cn/dev-guide/1-getting-started.md)
- [如何安装？](https://github.com/typora-community-plugin/typora-community-plugin/blob/main/docs/zh-cn/user-guide/1a-installation.md)

### 1.3、Typora基础快捷键

- Command + B 粗体
- Command + Shift + L 开启/关闭左侧导航栏
- Command + Ctrl + 1/2/3 开启/关闭大纲、文件列表、文件树
- Command + Shift + \ 显示所有标签页
- F8 专注模式（就是编辑的地方才会高亮）
- F9 打字机模式 （就是光标在屏幕正中央）
- Command + t 新建一个tag页、

### 1.4、多Repository管理图床

现在情况是将平时学习的图片上传到仓库 typora_picture 里面，然后将每天复盘的财经图片放到 daily_review_picture 仓库里面。

typora_picture config

- repo: jet5devil/typora-picture
- branch: master
- token: xxxx
- path: mac_img/

daily_review_picture config:

- repo: jet5devil/daily_review_picture
- branch: master
- token: xxxx
- path: trading_img/

## 二、Obsidian

Obsidian自带Vim，只要在设置里面开启Vim编辑即可使用Vim相关键位。

如何实现在Visual模型下自动切换到英文输入法。

**我发现，要想编辑器好看，还是得自己调样式。**

发现一个下字体的好方式，就是通过Typora的主题来下载，像是这种主题，在Github上面都是有下好的ttf字体文件，直接找到安装就可以了。

只要不涉及到图片部分，Obsidian还是很方便的

### 2.1、主题管理

可以直接在设置里面搜索。

#### 2.1.1、SlRvb/Obsidian--ITS-Theme

主题项目地址：[SlRvb/Obsidian--ITS-Theme](https://github.com/SlRvb/Obsidian--ITS-Theme)

### 2.2、插件管理

许多的插件都是通过fork Obsidian这个仓库复制出来修改的。[obsidianmd/obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)

#### 2.2.1、Style Settings

一个可以修改主题样式的插件，[Style Settings](https://github.com/mgmeyers/obsidian-style-settings)

#### 2.2.2、Vim Supports

[obsidian-vimrc-support](https://github.com/esm7/obsidian-vimrc-support)

在Obsidian中自动切换输入法，可以研究一下这个库代码，暂时还没有使用，后面使用：

[ALONELUR/vim-im-select-obsidian](https://github.com/ALONELUR/vim-im-select-obsidian)

### 2.3、kbwo/obsidian-click-hint

[kbwo/obsidian-click-hint](https://github.com/kbwo/obsidian-click-hint)

### 2.4、编辑模版Template

Obsidian中如何设置模版？

1. 按下`Ctrl+P`（在 macOS 上为`Cmd+P`）以打开命令面板。

就是在笔记里面提前编辑好模版，然后输入快捷键插入。

### 2.5、Obsidian 演讲PPT

canvas

### 2.6、按键管理

自定义快捷键

Command + Ctrl + C 折叠/展开当前行

Command + Ctrl + L 折叠/展开右侧侧边栏

Command + Ctrl + R 折叠/展开左侧侧边栏

Quick switcher: Open quick switcher（Ctrl + P）

Follow link under cursor（Ctrl + Enter）

参考：

[Obsidian 搭配 Vim Mode，提升写作体验](https://forum-zh.obsidian.md/t/topic/14890)

[.jiyee/.obsidian.vimrc](https://gist.github.com/jiyee/cfa8dc2f37359004b34820543f691db3)

[配置Obsidian-像Vim一样跳转.md](https://gist.github.com/LintaoAmons/80b5749164c2273107ae5fc18d163831)
