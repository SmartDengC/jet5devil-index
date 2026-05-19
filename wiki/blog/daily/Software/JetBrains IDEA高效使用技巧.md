---
title: JetBrains IDEA高效使用技巧
createTime: 2025/05/13 11:20:53
permalink: /article/nfoxbm0u/
outline: [2,4]
tags: 
  - vim
  - JetBrains
  - ideavim
---
IDEA（IntelliJ IDEA）是一个功能强大的集成开发环境（IDE），主要用于 Java 开发，也支持多种编程语言。凭借智能代码补全、调试工具、版本控制和插件生态，IDEA 提供高效的开发体验，广受开发者喜爱。

在使用Idea过程中，有一些内容、调整的设置需要掌握，这里做下记录。

<!-- more -->

[真香！用 IDEA 神器看源码，效率真高！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247505133&idx=1&sn=5f722cb29c655203b27cb38684503390&chksm=cea19b26f9d61230d87df97c8efd892ff6e3f7be77e6ec104c8f823a9a0c7dc7232f03b8351b&scene=178&cur_album_id=1319419426898329600#rd)

[IDEA 高效使用教程](https://idea.javaguide.cn/tips/efficient-use-guide.html)

[IDEA 高效使用指南](https://idea.javaguide.cn/)

## 一、基础信息

### 1.1、对新打开的项目配置默认信息

- Idea窗口最大化？
  - Leader +  W + O

- Idea分屏之前跳转，ctrl + l/r
  - 分屏 Leader + W + L
  - 分屏之后的跳转 


### 1.2、快捷键

- Generate  生成Get，Set方法的（Command + N）
- Find in File 在整个项目里面搜索（Ctrl + Shift  + F）
- Recent File 最近打开的文件（Command + E）
- Recent Location 显示最近修改的文件（Command + Shift + E）

[高效使用IDEA](http://blog.zhaojishun.cn/articles/2020/01/27/1580092173752.html)

- 自动提示补全（Alt + Enter）
- 显示文件结构（Leader + S + S）

- 快速抽取变量（Command + Option + V）
- 后缀补全，使用.var
- 重命名（Shift + F6）
- 查看类结构（Command +7 or Leader + S + S)
- 查看类实现、继承的类（Command+Option+B）方便查看源码

### 1.3、高效的设置

- 双斜杠紧跟代码头（Editor-Code Style-Java，取消Line comment at first column, 打开Add a space at line comment start）
- 取消大小写匹配（Editor-General-Code completion， 取消Match case，输入str会提示String）
- 通过Command + 鼠标滚轮调整编辑器字体的大小（Editor-General-Change font size with Command + Size Wheel）
- 设置编辑器字体样式，使用JetBrains Mono，开启连字。（Editor-Font-开启Enable ligatures）
- 设置Live Template
  - `List<$VAR$> $END$ = new ArrayList<>();`并配置应用的文件。

- 优化导包，Editor-General-Auto Import
  - Add unambiguous import on the fly，自动导入定义唯一的包。
  - O ptimize imports on the fly， 自动删除不用的import定义。


### 1.4、每次打开都是不正确的配置信息，修改成正确的

`File->New Project Setup -> Setting for New Projects` 

在上面配置路径里面，对新创建的或者新打开的项目设置对应的默认配置。

比如默认Maven的配置

## 二、内存信息了解

### 2.1、设置idea使用内容，并了解配置项信息

/Users/dengc4r/Library/Application Support/JetBrains

```shell
-Xms1024m
-Xmx2048m
-XX:ReservedCodeCacheSize=512m
-XX:+IgnoreUnrecognizedVMOptions
-XX:+UseG1GC
-XX:SoftRefLRUPolicyMSPerMB=50
-XX:CICompilerCount=2
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-ea
-Dsun.io.useCanonCaches=false
-Djdk.http.auth.tunneling.disabledSchemes=""
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true
-Dkotlinx.coroutines.debug=off
-XX:ErrorFile=$USER_HOME/java_error_in_idea_%p.log
-XX:HeapDumpPath=$USER_HOME/java_error_in_idea.hprof

--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED

-javaagent:/Applications/JetBrains-MacKed/ja-netfilter.jar=jetbrains
```

上面的信息就是我现在Idea对内存相关的配置，下面仔细了解一下各个配置的含义

#### 2.1.1、内存配置

```
-Xms1024m
-Xmx2048m
-XX:ReservedCodeCacheSize=512m
```

- Xms 设置JVM初时堆内存大小。
- Xmx 设置JVM最大堆内存大小。
- XX:ReservedCodeCacheSize 设置JIT编译器代码缓存的大小，用于存储JIT编辑的机器代码。

#### 2.1.2、垃圾回收器和堆内存设置

```
-XX:+UseG1GC
-XX:SoftRefLRUPolicyMSPerMB=50
-XX:CICompilerCount=2
```

- XX:+UserG1GC 启用G1垃圾回收器，适合大内存环境，尤其是需要低停顿时间的应用
- XX:SoftRefLRUPolicyMSPerMB 设置软引用的回收策略，这影响到内存回收的行为
- XX:CICompilerCount 设置JIT编译器使用的线程数。

#### 2.1.3、错误处理与堆转储

```
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
```

- XX:HeapDumpOnoutOfMemoryError 当发生OOM时，JVM会生成堆转储（heap dump），有利于后续的分析和调试
- -XX:-OmitStackTraceInFastThrow 禁用快速抛出异常时省略堆栈跟踪信息，确保在发生异常时可以查看完整的堆栈信息。

#### 2.1.4、调试和安全设置

```
-ea
-Dsun.io.useCanonCaches=false
-Djdk.http.auth.tunneling.disabledSchemes=""
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true
-Dkotlinx.coroutines.debug=off
```

- -ea 启用断言，有助于调试时发现潜在的问题
- -Dsun.io.useCanonCaches 禁用文件系统的缓存机制，可以有助于文件路径问题的调试

#### 2.1.5、错误日志与堆转储路径

```
-XX:ErrorFile=$USER_HOME/java_error_in_idea_%p.log
-XX:HeapDumpPath=$USER_HOME/java_error_in_idea.hprof
```

- -XX:ErrorFile 指定JVM错误日志的输出路径，%p是进程id（PID），用来唯一标识每个错误日志文件
- -XX:HeapDumpPath 指定JVM堆转存的存储 路径

## 三、插件推荐

-  IntelliJ IDEA作为一款强大的集成开发环境（IDE），其丰富的插件生态为开发者提供了许多实用工具。

-  这些插件不仅能提高编码效率，还能优化开发体验。例如，代码补全、调试助手、版本控制插件等，都能极大地简化开发流程，提升项目质量。

<!-- more -->

### 3.1、按键跳转相关

#### 3.1.1、IdeaVim

[IdeaVim Plugin Homepage](https://plugins.jetbrains.com/plugin/164-ideavim)

IdeaVim是Vim用户的福音，许多的编辑器都支持Vim相关的插件。

IdeaVim支持许多模式，包括normal/insert/visual/modes等，配置的话通过`~/.ideavimrc`来配置，也可以配置Vim插件。[.ideavim](https://github.com/LintaoAmons/CoolStuffes/blob/main/ideavim/.ideavimrc)

当我们安装完IdeaVim之后， 在下方会有一个`V`的图标，这个就是IdeaVim设置的地方。

- Enabled表示是否启用IdeaVim。
- Open ~/.ideavimrc 打开IdeaVim的配置文件。
- Settings 就是设置Idea使用默认的按键还是Vim的按键。

![image-20250614231754418](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202506142317667.png)

下面是我`~/.ideavimrc`文件内容，欢迎参考。

[IntelliJ IDEA vim 配置文件：.ideavimrc](https://github.com/SmartDengC/CoolStuffes/blob/main/ideavim/ideavimrc)

##### 3.1.1.1、Vim基础

```
nmap L <action>(NextTab)  // 下一个tab
nmap H <action>(PreviousTab)  // 上一个tab

nmap ma <action>(ToggleBookmark)  创建一个书签

// #  向下找光标所在的单词， * 向下找光标做在的单词
// % 在括号两端移动
```

##### 3.1.1.2、Vim扩展

删除文件所有内容，光标移动到文件头，然后dG

```shell
dG 删除当前光标文件到最后一行的文件, 不仅可以删除，也可以复制
yG 复制当前行到最后

yaw 复制光标所在的单词

d4j 删除下4行
y4j 复制下4行

caw 删除当前单词 进入插入模式
cc 删除当前行进入插入模式
c4j 删除下4行进入到插入模式
```

查找内容

```
* 查找当前光标所在的单词
```

Vim小游戏： [vimgolf](https://www.vimgolf.com/)

#### 3.1.2、IdeaVimExtension

为IdeaVim插件增加自动切换为英文输入法的功能 
输入法自动切换功能不会默认启用
编辑器中normal模式下输入输入下面的指令以启用自动切换输入法功能：

- :set keep-english-in-normal 开启输入法自动切换功能
- :set keep-english-in-normal-and-restore-in-insert 回到insert模式时恢复输入法
- :set nokeep-english-in-normal-and-restore-in-insert 保留输入法自动切换功能，但是回到insert模式不恢复输入法
- :set nokeep-english-in-normal 关闭输入法自动切换功能

也可以通过将`set keep-english-in-normal[-and-restore-in-insert]`加入到`~/.ideavimrc`文件中并重启IDE来启用插件功能。

#### 3.1.3、Which-Key

[Whih-Key Plugin Homepage](https://plugins.jetbrains.com/plugin/15976-which-key)

![](https://plugins.jetbrains.com/files/15976/screenshot_fda92f2d-42de-42bc-b510-c1534db8efbf)

Which-Key就是将Idea的一些操作配置到快捷键上面，在使用的时候可以进行提示。

这里有一个比较重要的问题，就是我们怎样找到这样的操作呢？

我们可以在Action里面搜索`IdeaVim: Track Action Ids`，这样的话，我们在操作的时候， 右下角就会展示操作的ID，就可以使用这个ID在`.ideavimrc`里面配置了

vim paste之后不会把yank的内容替换掉 csdn

[How do I replace-paste yanked text in vim without yanking the deleted lines?](https://superuser.com/questions/321547/how-do-i-replace-paste-yanked-text-in-vim-without-yanking-the-deleted-lines)

WhichKey是一个按键绑定的vim的插件，展示常见的绑定的按键，whichkey是一个用lua写的插件；which-key的话需要的idea或者pycharm里面安装which-key的插件。

##### 3.1.3.1、Leader + w

在打开的窗口都可以用cmd+ w关闭

```bash
nmap <leader>wo <action>(UnsplitAll) \| <action>(HideAllWindows)  // 最大化窗口
nmap <leader>wl <action>(SplitVertically)  // 竖向分屏 可用:vs替换
nmap <leader>wc <c-w>c  // 关闭窗口
```

##### 3.1.3.2、Leader + f

```bash
nmap <leader>fa <action>(GotoAction)  // go to action
nmap <leader>ff <action>(GotoFile)  // go to file
nmap <leader>ft <action>(FindInPath)  // 搜索 in project
nmap <leader>fp <action>(OpenProjectWindows)  // 切换打开的项目
nmap <leader>fm <action>(ReformatCode) \| <action>(OptimizeImports)  // 格式化当前代码
nmap <leader>fs <action>(FileStructurePopup)   // 打开项目结构目录 就是列出相关的方法
```

##### 3.1.3.3、Learder + g

```bash
nmap <leader>dd <action>(Vcs.ShowTabbedFileHistory)  // 当前文件的历史git commit信息
```

##### 3.1.3.4、Insert

```bash
nmap <leader>i f(a  // 跳转到( 左括号，然后进入插入模式
```

##### 3.1.3.5、Leader + l

```bash
nmap <leader>lr <action>(RenameElement)  // 重命名方法
```

##### 3.1.3.6、Leader + n

```bash
nmap <leader>nl :nohlsearch<CR>  // 不高亮
```

##### 3.1.3.7、Leader + s

```bash
nmap <leader>sb <action>(ShowBookmarks)  // 打开书签
nmap <leader>ss <action>(FileStructurePopup)  // 文件结构
```

##### 3.1.3.8、leader+z

```bash
nmap <leader>zo <action>(ExpandAllRegions)
nmap <leader>zc <action>(CollapseAllRegions)
```



```bash
nmap <leader>c :q!<CR>  // 保存退出
```



```bash
nmap ge <action>(GotoNextError)
nmap gt <action>(GotoTest)
nmap gm <action>(MethodUp)
nmap gi <action>(GotoImplementation)
" last changed in current buffer(file)
nmap ga '.
```

#### 3.1.4、IdeaVim-Easymotion

##### 3.1.4.1、基础配置

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

##### 3.1.4.2、AceJump

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

#### 3.1.5、vim-surround

```bash
// ds 表示删除两边相同的字符
"hello world" -> hello world   // ds "  // 删除 "

// cs 表示修改两边相同的字符
"hello world" -> 'hello world'  // cs"'  // 把两侧的" 修改成‘

// ys 表示在两边添加相同的字符
hello w*orld -> hello (world)  // ysiw)  光标在world上面，ysiw) 表示在world两边添加()
```

#### 3.1.6、nerdtree

```bash
<leader> e // open 目录文件树
```

在idea里面切换到目录树之后，在按除hjkl之外的按键是搜索，如何去掉这个，增加对文件或者是文件夹的操作的功能？

### 3.2、代码补全相关

#### 3.2.1、CodeGeex

[CodeGeex Plugin Homepage](https://plugins.jetbrains.com/plugin/20587-codegeex-ai-coding-assistant)

CodeGeeX是一款基于大模型的智能编程助手，它可以实现代码的生成与补全、自动为代码添加注释、自动解释代码、自动编写单元测试、实现代码审查Code Review、自动修复代码fixbug、自动生成commit message完成git提交，以及在不同编程语言的代码间实现互译、针对技术和代码问题的智能问答等丰富的功能。帮助开发者显著提高工作效率，CodeGeeX支持300+种编程语言，适配多种主流IDE平台，包括Visual Studio Code，JetBrains IDEs，Visual Studio，HBuilderX，DeepIn-IDE等。

#### 3.2.2、Lingma - Alibaba Cloud AI Coding Assistant

[Lingma Plugin Homepage](https://plugins.jetbrains.com/plugin/17809-lingma--alibaba-cloud-ai-coding-assistant)

通义灵码是由阿里云提供的智能编码辅助工具，提供代码智能生成、智能问答、多文件修改、编程智能体等能力，为开发者带来高效、流畅的编码体验

