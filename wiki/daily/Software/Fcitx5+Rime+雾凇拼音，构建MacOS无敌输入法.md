---
title: Fcitx5+Rime+雾凇拼音，构建MacOS无敌输入法
createTime: 2025/08/12 22:24:16
permalink: /article/40v9kfue/
---


终于是找到了替换MacOS默认输入法的方式了，就是使用fcitx5+Rime+雾凇拼音，来实现自己满意的输入法。

<!-- more -->

对于MacOS原生的中文输入法，因为选词每次都需要翻好几页才能找到正确的字，确实是影响效率了。对于常见的输入法，像是搜狗输入法等等，有害怕数据的保密性问题，最后则中的方案就是通过开源软件来解决。



先列出上面说的这些软件的地址，基本上都是在GitHub上面，所以需要一定的基本功，能够使用GitHub这个网站。

[fcitx5-macos-installer](https://github.com/fcitx-contrib/fcitx5-macos-installer)

[Fcitx5 macOS小企鹅输入法](https://fcitx-contrib.github.io/)



[RIME 官网 | 中州韵输入法引擎](https://rime.im/) 

RIME不同操作系统的源代码是放在不同的GitHub仓库的，比如MacOS的地址就是：[rime/squirrel](https://github.com/rime/squirrel)

[雾凇拼音GitHub地址](https://github.com/iDvel/rime-ice)

[Rime 配置：雾凇拼音](https://dvel.me/posts/rime-ice/)

## 聊聊如何快速的使用？

我们先安装RIME，安装之后，然后在macOS系统设置里面，启用RIME，这个时候我们就能够简单的使用了，但是这不是我们最终的形态，我们还需要配置雾凇拼音。

我们从GitHub上面把雾凇拼音下载下来，我们点击RIME的用户设定，然后把雾凇拼音下载下来的文件都复制到用户设定这个目录下面。这样的话，我们就可以正常使用了。

![image-20250812224330610](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202508122243603.png)

修改文件里面的default.ymal文件。

找到一个别人的主题分享，这里铁一下链接： [squirrel.custom.yaml](https://www.alipan.com/s/ZAHWMMSToCh)  提取密码：o1Wz

但是RIME没有卷轴模式，这个时候，我们就需要配合Fcitx5来使用了，从GitHub下载“中州韵”版本的Fcitx5，这个是包含RIME插件的，下载之后，我们找到小企鹅的高级设置，然后从鼠须管导入。

![image-20250812224757489](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202508122247552.png)

如果没有安装RIME，也是可以的，直接把雾凇拼音的文件拷到小企鹅的数据文件加，也就是：`~/.local/share/fcitx5/rime`目录。

还有其他的内容，像是主题的自定义配置，这个就留到后面在研究了，先体验一下这种方式的打字效率。



**20250827补充**

今天在我的15款的mbp上面安装rime，macos 12.7.6，但是一直都安装不上，直到我看到这个issue： [osx 12.7 安装 0.16.2版本失败](https://github.com/rime/squirrel/issues/949)

是因为之前安装1.x的版本，安装失败了，需要先删除`/Library/Input Methods/Squirrel.app `这个文件。





