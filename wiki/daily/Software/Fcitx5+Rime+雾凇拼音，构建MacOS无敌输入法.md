---
title: Fcitx5+Rime+雾凇拼音，构建MacOS无敌输入法
createTime: 2025/08/12 22:24:16
permalink: /article/40v9kfue/
tags:
  - 输入法
  - fcitx5
  - 雾凇拼音
---


终于是找到了替换MacOS默认输入法的方式了，就是使用fcitx5+Rime+雾凇拼音，来实现自己满意的输入法。

<!-- more -->

对于MacOS原生的中文输入法，因为选词每次都需要翻好几页才能找到正确的字，确实是影响效率了。对于常见的输入法，像是搜狗输入法等等，有害怕数据的保密性问题，最后则中的方案就是通过开源软件来解决。



先列出上面说的这些软件的地址，基本上都是在GitHub上面，所以需要一定的基本功，能够使用GitHub这个网站。





## 一、聊聊如何快速的使用？

### 1.1、RIME 聪明的输入法懂我心意

[RIME 官网 | 中州韵输入法引擎](https://rime.im/) 

RIME不同操作系统的源代码是放在不同的GitHub仓库的，比如MacOS的代码仓库地址就是：[rime/squirrel](https://github.com/rime/squirrel)

我们进入到RIME的官网，可以看到**鼠须管**（一个RIME的版本）的下载按钮，我们先安装RIME。

安装之后，然后在系统中启用，我是用的是MacOS，配置在"**设置**->**键盘**->**文字输入**->**输入法**"中添加刚才我们安装的输入法启用RIME，这个时候我们就能够简单的使用了，但是这不是我们最终的形态，我们还需要配置**雾凇拼音**。

### 1.2、雾凇拼音-长期维护的简体词库

[雾凇拼音GitHub地址](https://github.com/iDvel/rime-ice)

[Rime 配置：雾凇拼音](https://dvel.me/posts/rime-ice/)

我们为什么要用雾凇拼音，因为使用拼音输入法，中文里面会有许多的相同声母、韵母的字，我们不好选中，用雾凇拼音可以加快我们输入的效率（这一点用过Mac自带的拼音输入法的我特别有感受）。

我们从GitHub上面把雾凇拼音下载下来，我们点击RIME的用户设定，然后把下载下来的雾凇拼音的文件都复制到用户设定这个目录下面。

这样的话，我们就可以正常使用了。

![image-20250812224330610](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202508122243603.png)



#### 1.2.1、修改文件里面的default.ymal文件。

文件里面都有详细的注释说明，这里我只修改了“候选词的个数”， 然后把用不到的双拼输入法给注释掉了，如下所示：

```yaml
# 方案列表
schema_list:
  # 可以直接删除或注释不需要的方案，对应的 *.schema.yaml 方案文件也可以直接删除
  # 除了 t9，它依赖于 rime_ice，用九宫格别删 rime_ice.schema.yaml
  - schema: rime_ice # 雾凇拼音（全拼）
  - schema: t9 # 九宫格（仓输入法）
  # - schema: double_pinyin # 自然码双拼
  # - schema: double_pinyin_abc # 智能 ABC 双拼
  # - schema: double_pinyin_mspy # 微软双拼
  # - schema: double_pinyin_sogou # 搜狗双拼
  # - schema: double_pinyin_flypy # 小鹤双拼
  # - schema: double_pinyin_ziguang # 紫光双拼
  # - schema: double_pinyin_jiajia # 拼音加加双拼

# 菜单
menu:
  page_size: 8 # 候选词个数
  # alternative_select_labels: [ ①, ②, ③, ④, ⑤, ⑥, ⑦, ⑧, ⑨, ⑩ ]  # 修改候选项标签
  # alternative_select_keys: ASDFGHJKL  # 如编码字符占用数字键，则需另设选字键（注意在雾凇中，大写字母也作为编码了）
```

然后就是修改输入法的皮肤，找到一位博主的主题分享，这里贴一下链接： [squirrel.custom.yaml](https://www.alipan.com/s/ZAHWMMSToCh)  提取密码：o1Wz

### 1.3、Fcitx5小企鹅输入法登陆macOS

- 官方文档：[Fcitx5 macOS小企鹅输入法](https://fcitx-contrib.github.io/)

- 代码仓库：[fcitx5-macos-installer](https://github.com/fcitx-contrib/fcitx5-macos-installer)
- 主题文件：[fcitx5-theme-collection](https://github.com/fcitx-contrib/fcitx5-theme-collection)

**先说一个， Fcitx5支持macOS >= 13，意思就是macOS版本小于13的，就只能体验上面的RIME。**

因为RIME没有卷轴模式，这个时候，我们就需要配合Fcitx5来使用了，从GitHub下载“**中州韵**”版本的Fcitx5，这个是包含RIME插件的，下载之后，我们找到小企鹅的高级设置，然后从鼠须管导入。

**高级**->**数据管理**->**本地鼠须管导入**->**勾选Rime配置**

然后在点击重新部署就可以了。

![image-20250812224757489](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202508122247552.png)

如果没有安装RIME，也是可以的，直接把雾凇拼音的文件拷到小企鹅的数据文件加，也就是：`~/.local/share/fcitx5/rime`目录。

还有其他的内容，像是主题的自定义配置，这个就留到后面在研究了，先体验一下这种方式的打字效率。

## 二、过程问题补充

### 2.1、20250827更新

今天在我的15款的mbp上面安装rime，macos 12.7.6，但是一直都安装不上，直到我看到这个issue： [osx 12.7 安装 0.16.2版本失败](https://github.com/rime/squirrel/issues/949)

是因为之前安装1.x的版本，安装失败了，需要先删除`/Library/Input Methods/Squirrel.app `这个文件。

### 2.2、20250911更新

小企鹅输入法还是给了我很多惊喜，比如像这次。我在chrome里面经常要输入url地址，都是英文的，但是好多次都是中文输入法，这个时候给每个应用设置不同的输入方式就流畅很多了。

问：如何为不同应用指定输入法

`高级` -> `macOS Frontend` -> `应用默认输入法`。

参考文档：[如何为不同应用指定输入法](https://fcitx-contrib.github.io/docs/faq.html#%E5%A6%82%E4%BD%95%E4%B8%BA%E4%B8%8D%E5%90%8C%E5%BA%94%E7%94%A8%E6%8C%87%E5%AE%9A%E8%BE%93%E5%85%A5%E6%B3%95)

问：如何从英文切换到中文？

设置默认输入法，如果设置的是英文，是使用的小企鹅的英文输入法，不是macOS自带的英文，所以使用 Ctrl + Space切换只能在两者之前切换（默认和小企鹅），不能在小企鹅内部切换（小企鹅英文和小企鹅中文），需要配置以下设置：

**全局配置**->**快捷键**->**向后切换输入法**

我配置的是Shift，非常的方便，效果就是Ctrl +Space切换输入法类型，Shift切换中英文。

### 2.3、20250912更新

小企鹅里面的Vim模式是什么？

就是配置程序，在启动的时候启用Vim Model，比如我现在配置的Visual Code 和Obsidian两个软件，都主要使用Vim来输入。

参考Github Issue： [请问fcitx5-macos有类似Squirrel上的vim mode吗 ?](https://github.com/fcitx-contrib/fcitx5-macos/issues/278)

