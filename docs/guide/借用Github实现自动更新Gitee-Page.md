---
title: 借用Github实现自动更新Gitee Page
date: 2023/02/13 00:59:29
author: joe dengc
tags: 
  - github
createTime: 2024/02/03 19:14:57
permalink: /article/epk6cqmx/
---



最近在使用hexo来写博客，对于hexo的简单使用、在Gitee Page上面也实现了正确的部署，但是发现了一个问题，就是说我在使用`hexo d` 进行部署的时候，gitee page 没有办法实现自动更新，需要手动进入到项目的gitee page页面点击更新，为了解决这个问题，发现了一个github的仓库代码，是使用action来实现的，下面简单说一下使用这个仓库的过程。



gitee page action 项目给出了一个使用教程，按照上面的流程可以实现gitee page的自动发布，但是这个文档写的属实有点模糊，可以作为本文章的一个补充。

[Gitee Pages Action](https://github.com/marketplace/actions/gitee-pages-action)



# 0x00 总体说明

这里说一下整体的一个思路，有两种方式。

第一种，就是在github上面创建一个项目，我们将代码提交到github这个项目上去，然后在action里面配置实现，①将github提交的最新的代码同步到gitee 指定项目上 ②使用action实现对gitee page更新的操作。

第二种，就是不通过github同步代码到gitee上面，需要同时提交到github和gitee对应的仓库里面，然后使用github的action实现gitee page的自动更新

我们一上面第一种为例来说明



# 0x01 Github 里面操作



## 00 在Github中创建一个项目



需要再github里面创建一个项目。

我这里已经创建出来了，所以github才会提示说， 这个仓库已经存在了，你们创建的仓库和gitee上面的项目同名就可以。

这里注意哈，github创建出来的主分支叫做main，而gitee创建出来的主分支叫做master。

![image-20230213102115976](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131021251.png)



## 01 生成秘钥-配置到个人设置以及创建出的项目里



### 0、对秘钥的理解

如果有时间的童鞋可以看一下这里我的文章，大概意思就是说秘钥的一个工作流程，没有的话也不影响使用。

[SSH：ssh两种验证方式（一）](https://blog.csdn.net/weixin_41288824/article/details/100063009)

[SSH：ssh使用场景（二）](https://blog.csdn.net/weixin_41288824/article/details/88228024)

### 1、生成私钥和公钥

在命令行中 ` ssh-keygen -t rsa -C "你的邮箱地址"` ，然后一路回车就可以了，就是使用默认的配置。

秘钥会存放到家目录的.ssh文件夹下面。

![image-20230213104942668](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131049717.png)



### 2、配置公钥私钥

在个人的setting里面，找到`SSH and GPG keys`,  然后点击new SSH key， title的话，随意输入，只要直接能够区分就可以；

对于下面key，我们要把公钥（id_rsa.pub）里面的内容，拷到key里面，然后点击保存就可以。

![image-20230213123307292](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131233333.png)



下一步就是给项目设计变量，我们找到我们刚才在github上面创建的项目，找到项目的setting，然后点击action，在点击右侧的new repository secret。

![image-20230213123612577](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131236616.png)

点击之后会出现配置的界面，这里我们定义两个secret， 一个name叫做GITEE_RSA_PRIVATE_KEY， secret就是我们在上面生成的私钥，这里当时遇到一个问题，可以参考下面连接；另外一个叫做GITEE_PASSWORD， secret就是你的gitee的账号密码。

[# Key is invalid. You must supply a key in OpenSSH public key format](https://blog.csdn.net/qiuxuezhe_fei/article/details/126027207)



### 3、在github项目代码添加action文件

我们使用github的action流程，我们需要添加一个yml文件来作为action的执行文件。我们需要在项目的根目录下，创建一个`.github/workfolws`的文件夹，里面创建一个sync.yml 的文件，这个文件的名称可以随意。



这里在网页上面操作一下。

![image-20230213124743105](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131247147.png)



只要有这个文件就可以，可以在本地创建，然后上传到github，也是可以的。

到后面，会执行这个action，执行的过程也会在action 这个tag页里面展示，像是报错之类的信息。



## 02 yml文件问题（附加）



到这里github的配置就差不多，但是这里我遇到一个问题，就是我使用的hexo来部署的，hexo g会把之前的public文件下面的文件都删除，重新生成，这样的话，就会导致上面创建的yml文件丢失，这个问题我也是看了一晚上的issue才看到一个童鞋的解决问题。他的issue是中文的，十分轻松就能看懂的，这里就贴一下连接就可以。

两篇文章需要一起看，第一个就是说，hexo在部署的时候，如何将额外的文件添加到部署的文件夹里面（就是在source下面创建你想部署的文件）

第二篇文章说的就是设置一下，让文件正确的出现在根目录下面

[When Deploying, Resets My Custom Domain #87](https://github.com/hexojs/hexo-deployer-git/issues/87)

[使用Hexo设置Gitee自动部署时需要特别配置Hexo，建议写进这边的文档里面 #34](https://github.com/yanglbme/gitee-pages-action/issues/34)







# 0x03 Gitee 里面项目配置



## 00 首次使用gitee page

在gitee相关配置。

如果说你是第一次使用gitee page的话，就需要自己手动设置一下gitee page，这里就不过多的赘述了， 参考下面链接。

这里提醒一下，就是现在gitee page需要个人认证了。

[在Gitee搭建属于自己的博客](https://blog.csdn.net/qq_46036214/article/details/110137239)



## 01 配置公钥到个人设置里面

还是一样的，找到setting，然后左中方找到ssh公钥，标题的话，可以随意，下面的公钥，就填写我们上面生成的id_rsa里面的内容。

![image-20230213130326086](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202302131303137.png)





到这里我们的自动配置就配置完成了，然后即使测试了
