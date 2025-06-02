---
title: PakePlus：一个将网站打包成软件的工具
createTime: 2025/06/01 22:10:35
permalink: /article/1n9nud39/
---

终于实现了自己的心里的需求了，将自己的博客网站打包成了IOS的软件，在我的Iphone上面正常运行了。

这样就不会整天没事就打开抖音了。

<!-- more -->

情况是这样的，我使用Vuepress前端框架，将自己学习过程中遇到的问题以及知识点写了下来，但是现在只有网页端，但是在自己空闲的时候，大多数都是使用的是手机，这个时候不知道自己应该做什么，老是会不自觉的打开抖音，为了抽空出来学习，想着将网站软件化。PakePlus就很好的实现了我这个需求。

## 一、Pake

开始的时候，关注的是Pake这个工具，Github地址为：[tw93/Pake](https://github.com/tw93/Pake)，但是感觉这个仅支持电脑的，好像不支持移动端，如果电脑端使用的多的话， 还是推荐用的。

Pake依赖Rust，如果没有安装的话，需要安装一下：

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装、使用Pake

```shell
# Install with npm
npm install -g pake-cli

# Command usage
pake url [OPTIONS]...

# Feel free to play with Pake! It might take a while to prepare the environment the first time you launch Pake.
pake https://weekly.tw93.fun --name Weekly --hide-title-bar
```

Pake还支持结合Github Action在线上进行打包，参考：[Online Compilation (used by ordinary users)](https://github.com/tw93/Pake/wiki/Online-Compilation-(used-by-ordinary-users))

## 二、PakePlus

我主要是解决移动端的问题，所以选择了PakePlus，Github地址为：[Sjj1024/PakePlus](https://github.com/Sjj1024/PakePlus)，PackPlus还有相对应的网站进行说明，主页地址为：[PakePlus](https://www.pakeplus.com/)

按照上面网站操作就能成功，下面仅记录过程中遇到的问题。

1、打包出来的ipa文件需要签名，使用的爱思助手，有效期是7天，看后面优化

[爱思助手 ipa签名问题](https://www.i4.cn/news_detail_40956.html
)

2、安装之后，打开软件弹出不受信任的开发者

[不受信任的开发者](https://blog.csdn.net/qq_59398646/article/details/141330396)

3、下一步就是了解tb上面的轻松签该怎么使用?



