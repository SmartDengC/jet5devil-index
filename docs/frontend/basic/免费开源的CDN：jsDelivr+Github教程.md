---
title: 免费开源的CDN：jsDelivr+Github教程
author: 邓聪的小破站
createTime: 2024/05/30 09:51:19
permalink: /article/htnzx9uq/
tags: 
  - CDN
  - jsDelivr
---

网站加载的图片耗时，将图片使用jsDelivr进行加速。

<!-- more -->

每次打开静态网站的时候，都会发现页面的内容已经加载出来了，但是图片还是一片白，就考虑如何让图片能够更快的加载出来。

后面发现可以用jsDelivr加速Githut上面的图片，拼接出来一个URL，到时候可以直接使用。

例如我这里有一个Github的仓库，仓库名称叫做`resoruce_cdn`， 存放图片路径相对于仓库目录的话是 `./CDN/iron_background.jpeg`。

![image-20240530103659696](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202405301037254.png)

这样我们根据下面的规则，就能得到一个调用图片的路径，就可以直接使用。如果你们打开这篇文章的话，能够清晰的对比出上面图片和下面图片的区别。（彪哥真的太帅了！！！）

>使用定义： https://cdn.jsdelivr.net/gh/Github用户名/仓库名@版本号/文件路径。
>参考用例：https://cdn.jsdelivr.net/gh/SmartDengC/resource_cdn@master/CDN/iron_background.jpeg



![](https://cdn.jsdelivr.net/gh/SmartDengC/resource_cdn@master/CDN/iron_background.jpeg)



我常用的图片是放到Gitee上面的，为什么没有GItee来做加速，第一个原因是因为我暂时没有找到相关的方法， 后面如果有的话，我会及时更新；第二个原因就是Github对国内访问有一点点局限，所有把不常修改的内容放到Github上面，常用的放到Gitee上面。
