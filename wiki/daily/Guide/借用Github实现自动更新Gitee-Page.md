---
title: 借用Github实现自动更新Gitee Page
author: 阿聪小破站
createTime: 2024/02/03 19:14:57
permalink: /article/epk6cqmx/
tags: 
  - github
---

最近在使用 hexo 来写博客，对于 hexo 的简单使用、在 Gitee Page 上面也实现了正确的部署，但是发现了一个问题，就是说我在使用`hexo d` 进行部署的时候，gitee page 没有办法实现自动更新，需要手动进入到项目的 gitee page 页面点击更新，为了解决这个问题，发现了一个 github 的仓库代码，是使用 action 来实现的，下面简单说一下使用这个仓库的过程。

gitee page action 项目给出了一个使用教程，按照上面的流程可以实现 gitee page 的自动发布，但是这个文档写的属实有点模糊，可以作为本文章的一个补充。

[Gitee Pages Action](https://github.com/marketplace/actions/gitee-pages-action)

# 0x00 总体说明

这里说一下整体的一个思路，有两种方式。

第一种，就是在 github 上面创建一个项目，我们将代码提交到 github 这个项目上去，然后在 action 里面配置实现，① 将 github 提交的最新的代码同步到 gitee 指定项目上 ② 使用 action 实现对 gitee page 更新的操作。

第二种，就是不通过 github 同步代码到 gitee 上面，需要同时提交到 github 和 gitee 对应的仓库里面，然后使用 github 的 action 实现 gitee page 的自动更新

我们一上面第一种为例来说明

# 0x01 Github 里面操作

## 00 在 Github 中创建一个项目

需要再 github 里面创建一个项目。

我这里已经创建出来了，所以 github 才会提示说， 这个仓库已经存在了，你们创建的仓库和 gitee 上面的项目同名就可以。

这里注意哈，github 创建出来的主分支叫做 main，而 gitee 创建出来的主分支叫做 master。

![image-20230213102115976](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131021251.png)

## 01 生成秘钥-配置到个人设置以及创建出的项目里

### 0、对秘钥的理解

如果有时间的童鞋可以看一下这里我的文章，大概意思就是说秘钥的一个工作流程，没有的话也不影响使用。

[SSH：ssh 两种验证方式（一）](https://blog.csdn.net/weixin_41288824/article/details/100063009)

[SSH：ssh 使用场景（二）](https://blog.csdn.net/weixin_41288824/article/details/88228024)

### 1、生成私钥和公钥

在命令行中 ` ssh-keygen -t rsa -C "你的邮箱地址"` ，然后一路回车就可以了，就是使用默认的配置。

秘钥会存放到家目录的.ssh 文件夹下面。

![image-20230213104942668](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131049717.png)

### 2、配置公钥私钥

在个人的 setting 里面，找到`SSH and GPG keys`, 然后点击 new SSH key， title 的话，随意输入，只要直接能够区分就可以；

对于下面 key，我们要把公钥（id_rsa.pub）里面的内容，拷到 key 里面，然后点击保存就可以。

![image-20230213123307292](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131233333.png)

下一步就是给项目设计变量，我们找到我们刚才在 github 上面创建的项目，找到项目的 setting，然后点击 action，在点击右侧的 new repository secret。

![image-20230213123612577](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131236616.png)

点击之后会出现配置的界面，这里我们定义两个 secret， 一个 name 叫做 GITEE_RSA_PRIVATE_KEY， secret 就是我们在上面生成的私钥，这里当时遇到一个问题，可以参考下面连接；另外一个叫做 GITEE_PASSWORD， secret 就是你的 gitee 的账号密码。

[# Key is invalid. You must supply a key in OpenSSH public key format](https://blog.csdn.net/qiuxuezhe_fei/article/details/126027207)

### 3、在 github 项目代码添加 action 文件

我们使用 github 的 action 流程，我们需要添加一个 yml 文件来作为 action 的执行文件。我们需要在项目的根目录下，创建一个`.github/workfolws`的文件夹，里面创建一个 sync.yml 的文件，这个文件的名称可以随意。

这里在网页上面操作一下。

![image-20230213124743105](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131247147.png)

只要有这个文件就可以，可以在本地创建，然后上传到 github，也是可以的。

到后面，会执行这个 action，执行的过程也会在 action 这个 tag 页里面展示，像是报错之类的信息。

## 02 yml 文件问题（附加）

到这里 github 的配置就差不多，但是这里我遇到一个问题，就是我使用的 hexo 来部署的，hexo g 会把之前的 public 文件下面的文件都删除，重新生成，这样的话，就会导致上面创建的 yml 文件丢失，这个问题我也是看了一晚上的 issue 才看到一个童鞋的解决问题。他的 issue 是中文的，十分轻松就能看懂的，这里就贴一下连接就可以。

两篇文章需要一起看，第一个就是说，hexo 在部署的时候，如何将额外的文件添加到部署的文件夹里面（就是在 source 下面创建你想部署的文件）

第二篇文章说的就是设置一下，让文件正确的出现在根目录下面

[When Deploying, Resets My Custom Domain #87](https://github.com/hexojs/hexo-deployer-git/issues/87)

[使用 Hexo 设置 Gitee 自动部署时需要特别配置 Hexo，建议写进这边的文档里面 #34](https://github.com/yanglbme/gitee-pages-action/issues/34)

# 0x03 Gitee 里面项目配置

## 00 首次使用 gitee page

在 gitee 相关配置。

如果说你是第一次使用 gitee page 的话，就需要自己手动设置一下 gitee page，这里就不过多的赘述了， 参考下面链接。

这里提醒一下，就是现在 gitee page 需要个人认证了。

[在 Gitee 搭建属于自己的博客](https://blog.csdn.net/qq_46036214/article/details/110137239)

## 01 配置公钥到个人设置里面

还是一样的，找到 setting，然后左中方找到 ssh 公钥，标题的话，可以随意，下面的公钥，就填写我们上面生成的 id_rsa 里面的内容。

![image-20230213130326086](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131303137.png)

到这里我们的自动配置就配置完成了，然后即使测试了
