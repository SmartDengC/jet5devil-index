---
title: Typora：重新定义 Markdown 写作
author: 邓聪的小破站
createTime: 2024/05/28 11:04:03
permalink: /article/ivolgtdr/
tags: 
  - typora
  - markdown
---

用了挺过多的文档编辑器，最后还是保留下了Typora，因为Typora可以关联Picgo将图片上传到图床上，（自己构建的基于Gitee的图床）； 在Typora的加持，文字编辑工作有明显的提高，这里简单记录一下使用过程中的一些知识点和小技巧。

<!-- more -->

如果你也想要配置的话，如果出现问题，可以参考下面文章：

- [Picgo：picgo+gitee 出错 404 Project Not Found](https://blog.csdn.net/weixin_41288824/article/details/108260798)

- [解决Mac中Picgo无法安装gitee插件问题](https://blog.csdn.net/weixin_41288824/article/details/119397192)

- MD 数学公式：[使用 MD 语法编写数学公式](https://blog.csdn.net/wzk4869/article/details/126863936)

## 一、Typora主题管理

我们知道Typora的[官方网站](https://typoraio.cn/)， 在网站上方的导航栏里面点击**主题**，就可以跳转到Typora官方收录的众多主题界面。

找到自己喜欢的主题之后，点击download之后会跳出下载界面，我们下载之后，然后在设置里面找到外观，打开主题的配置文件所在的文件夹。

![image-20250409114540045](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202504091145109.png)

然后将下载下来的主题文件拷贝到**主题文件夹**即可，我的Typora主题文件夹地址为：`/Users/dengc4r/Library/Application Support/abnerworks.Typora/themes`，然后重启就可以选择刚才配置的主题了。

主题的主页一般都有相应的安装说明，例如[Lapis](https://theme.typoraio.cn/theme/Lapis/)，可以看看如何操作。

![image-20250409114833013](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202504091148054.png)

## 二、Typora插件管理

Typora非开源项目，没有相应的插件管理功能，但是强大的网友自己写了一套插件管理的程序。

[obgnail/typora_plugin](https://github.com/obgnail/typora_plugin)  只支持Windows、Linux版本，不支持Mac版本电脑

[typora-community-plugin/typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin)  支持Windows、Linux、Mac但是我还没有安装成功，哈哈。

- [如何编译属于你的第一个插件？](https://github.com/typora-community-plugin/typora-community-plugin/blob/main/docs/zh-cn/dev-guide/1-getting-started.md)
- [如何安装？](https://github.com/typora-community-plugin/typora-community-plugin/blob/main/docs/zh-cn/user-guide/1a-installation.md)



## 三、Typora基础快捷键

- Command + B 粗体
- Command + Shift + L 开启/关闭左侧导航栏
- Command + Ctrl + 1/2/3 开启/关闭大纲、文件列表、文件树
- Command + Shift + \ 显示所有标签页
- F8 专注模式（就是编辑的地方才会高亮）
- F9 打字机模式 （就是光标在屏幕正中央）
- Command + t 新建一个tag页

