---
title: iTerm2+oh-my-zsh教程
author: 邓聪的小破站
createTime: 2024/03/10 15:10:21
permalink: /article/0vsvogfd/
tags: 
  - iterm2
  - oh-my-zsh
---

经过上次搭建的mysql的服务被勒索之后，我就专门创建了一个mac用户，用于除工作之外其他情况使用；新建的用户里面缺少许多的配置，就比如像是iterm2里面，现在没有了分支的提示，需要使用命令查看才知道我再那个分支；还有就是history命令的提示，总之就是不是很方便。

![cc99f4c4297be26553ef5e90c88459f6_720](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202403111243010.png)

这里就记录一下用oh-my-zsh来配置iterm2的过程。这里参考文章：[iTerm2 + oh-my-zsh 教程（7000字长文）](https://zhuanlan.zhihu.com/p/290737828)

## 1、安装Oh-My-Zsh

直接到官网，[oh my zsh](https://ohmyz.sh/)，然后点击Install oh-my-zsh	

## 2、下载不下来（没有遇到可以跳过）

面对的第一个问题就是没办法下载，访问被拒绝。

```shell
zero@MacBook-Pro ~ % sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
curl: (7) Failed to connect to raw.githubusercontent.com port 443 after 15 ms: Connection refused
```

这里参考 [Failed to connect to raw.githubusercontent.com:443](https://zhuanlan.zhihu.com/p/115450863)中第二个评论的解决方式，通过在[ipaddress.com/](https://www.ipaddress.com/)网站中找到搜索到https://raw.githubusercontent.com的ip地址，然后在hosts里面添加对应的内容。

下面是我添加的内容：

```shell
# GitHub Start
185.199.108.133  raw.githubusercontent.com
185.199.109.133  raw.githubusercontent.com
185.199.110.133  raw.githubusercontent.com
185.199.111.133  raw.githubusercontent.com
```

然后我们就能够正常的安装了

## 3、更换主题

我这里还是用的原来的Dracula的主题

```shell
# 下载dracula的主题文件
git clone https://github.com/dracula/zsh.git  

# 里面有一个以theme结尾的文件和一个lib目录，将这两个移动到~/.oh-my-zsh/themes
cp zsh/dracula.zsh-theme ~/.oh-my-zsh/themes
cp -r zsh/lib/ ~/.oh-my-zsh/themes

# 修改zsh主题配置
vim ~/.zshrc
ZSH_THEME="dracula"
source ~/.zshrc
```

参考：[change-zsh-themes](https://github.com/Dunmysad/change-zsh-themes)， 里面还有自动补全和高亮的配置，也建议设置一下，很方便。

## 4、问题

### 0、command not found

```shell
dracula_git_async:1: command not found: async_start_worker                                                                                  
dracula_git_async:2: command not found: async_register_callback
dracula_git_async:3: command not found: async_job
```

需要将我们下下来的主题里面的lib文件夹拷贝到`~/.oh-my-zsh/thems/lib`里面。

参考：[配置 mac 开发环境 zsh+oh-my-zsh+dracula](https://juejin.cn/post/6844904071359545352)

### 1、Insecure completion-dependent directories detected

```
[oh-my-zsh] For safety, we will not load completions from these directories until
[oh-my-zsh] you fix their permissions and ownership and restart zsh.
[oh-my-zsh] See the above list for directories with group or other writability.

[oh-my-zsh] To fix your permissions you can do so by disabling
[oh-my-zsh] the write permission of "group" and "others" and making sure that the
[oh-my-zsh] owner of these directories is either root or your current user.
[oh-my-zsh] The following command may help:
[oh-my-zsh]     compaudit | xargs chmod g-w,o-w

[oh-my-zsh] If the above didn't help or you want to skip the verification of
[oh-my-zsh] insecure directories you can set the variable ZSH_DISABLE_COMPFIX to
[oh-my-zsh] "true" before oh-my-zsh is sourced in your zshrc file.
```

> It says set
> `ZSH_DISABLE_COMPFIX=true` in **.zshrc** before you source **.oh-my-zsh** in your **.zshrc** file.
>
> So, put
> `ZSH_DISABLE_COMPFIX=true` at the first line of your **.zshrc** file and then
> run `source .zshrc`..

编辑`vim .zshrc`， 把`ZSH_DISABLE_COMPFIX=true`放到第一行，放到最后会不生效，最后`source .zshrc`

参考： [Folder permission "Insecure completion-dependent directories detected"](https://github.com/ohmyzsh/ohmyzsh/issues/6835)
