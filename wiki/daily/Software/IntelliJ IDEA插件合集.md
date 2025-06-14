---
title: IntelliJ IDEA插件合集
createTime: 2025/06/14 00:20:45
permalink: /article/rzinxgty/
tags:
  - idea
---

-  IntelliJ IDEA作为一款强大的集成开发环境（IDE），其丰富的插件生态为开发者提供了许多实用工具。

- 这些插件不仅能提高编码效率，还能优化开发体验。例如，代码补全、调试助手、版本控制插件等，都能极大地简化开发流程，提升项目质量。

<!-- more -->

## 一、按键跳转相关

### 1.1、IdeaVim

[IdeaVim Plugin Homepage](https://plugins.jetbrains.com/plugin/164-ideavim)

IdeaVim是Vim用户的福音，许多的编辑器都支持Vim相关的插件。

IdeaVim支持许多模式，包括normal/insert/visual/modes等，配置的话通过`~/.ideavimrc`来配置，也可以配置Vim插件。

当我们安装完IdeaVim之后， 在下方会有一个`V`的图标，这个就是IdeaVim设置的地方。

- Enabled表示是否启用IdeaVim。
- Open ~/.ideavimrc 打开IdeaVim的配置文件。
- Settings 就是设置Idea使用默认的按键还是Vim的按键。

![image-20250614231754418](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202506142317667.png)

下面是我`~/.ideavimrc`文件内容，欢迎参考。

[IntelliJ IDEA vim 配置文件：.ideavimrc](https://github.com/SmartDengC/CoolStuffes/blob/main/ideavim/ideavimrc)

### 1.2、IdeaVimExtension

为IdeaVim插件增加自动切换为英文输入法的功能 
输入法自动切换功能不会默认启用
编辑器中normal模式下输入输入下面的指令以启用自动切换输入法功能：

- :set keep-english-in-normal 开启输入法自动切换功能
- :set keep-english-in-normal-and-restore-in-insert 回到insert模式时恢复输入法
- :set nokeep-english-in-normal-and-restore-in-insert 保留输入法自动切换功能，但是回到insert模式不恢复输入法
- :set nokeep-english-in-normal 关闭输入法自动切换功能

也可以通过将`set keep-english-in-normal[-and-restore-in-insert]`加入到`~/.ideavimrc`文件中并重启IDE来启用插件功能。

### 1.3、Which-Key

[Whih-Key Plugin Homepage](https://plugins.jetbrains.com/plugin/15976-which-key)

![](https://plugins.jetbrains.com/files/15976/screenshot_fda92f2d-42de-42bc-b510-c1534db8efbf)

Which-Key就是将Idea的一些操作配置到快捷键上面，在使用的时候可以进行提示。



这里有一个比较重要的问题，就是我们怎样找到这样的操作呢？

我们可以在Action里面搜索`IdeaVim: Track Action Ids`，这样的话，我们在操作的时候， 右下角就会展示操作的ID，就可以使用这个ID在`.ideavimrc`里面配置了

vim paste之后不会把yank的内容替换掉 csdn

[How do I replace-paste yanked text in vim without yanking the deleted lines?](https://superuser.com/questions/321547/how-do-i-replace-paste-yanked-text-in-vim-without-yanking-the-deleted-lines)

### 1.4、IdeaVim-Easymotion

#### 1.4.1、基础配置

IdeaVim-Easymotion需要配合下面的AceJump使用。

```visual basic
" easymotion
let g:EasyMotion_override_acejump = 0
let g:EasyMotion_do_mapping = 0
set easymotion
" 简单来说easymotion-s使用一个字符作为标签，easymotion-s2 使用两个字符作为标签
nmap ss <Plug>(easymotion-s)
" nmap ss <Plug>(easymotion-s2)
```

#### 1.4.2、AceJump

[AceJump Plugin Homepage](https://plugins.jetbrains.com/plugin/7086-acejump)

![](https://plugins.jetbrains.com/files/7086/screenshot_16299.png)

AceJump允许您快速将插入符号导航到编辑器中可见的任何位置。只需按“ctrl+；”，键入一个字符，然后在Ace Jump中键入匹配的字符。

- 跳转模式：通过快捷键给需要跳转的位置打上标签， 然后在输入对应的符号进行跳转。
  -  `Ctrl + （单次）;`
- 声明模式：就是跳转到变量定义的位置，或者是跳转到方法调用的地方。
  - `Ctrl + （两次）;`
- 目标模式：通过快捷键快速选中内容。
  -  `Ctrl + （三次）; `或者是`Ctrl + Alt + ;`

**小技巧：**

跳转到行首行尾：`Ctrl + Shift + ;`

## 二、代码补全相关

### 2.1、CodeGeex

[CodeGeex Plugin Homepage](https://plugins.jetbrains.com/plugin/20587-codegeex-ai-coding-assistant)

CodeGeeX是一款基于大模型的智能编程助手，它可以实现代码的生成与补全、自动为代码添加注释、自动解释代码、自动编写单元测试、实现代码审查Code Review、自动修复代码fixbug、自动生成commit message完成git提交，以及在不同编程语言的代码间实现互译、针对技术和代码问题的智能问答等丰富的功能。帮助开发者显著提高工作效率，CodeGeeX支持300+种编程语言，适配多种主流IDE平台，包括Visual Studio Code，JetBrains IDEs，Visual Studio，HBuilderX，DeepIn-IDE等。

### 2.2、Lingma - Alibaba Cloud AI Coding Assistant

[Lingma Plugin Homepage](https://plugins.jetbrains.com/plugin/17809-lingma--alibaba-cloud-ai-coding-assistant)

通义灵码是由阿里云提供的智能编码辅助工具，提供代码智能生成、智能问答、多文件修改、编程智能体等能力，为开发者带来高效、流畅的编码体验
