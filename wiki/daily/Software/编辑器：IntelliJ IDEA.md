---
title: 编辑器：IntelliJ IDEA
createTime: 2025/05/13 11:20:53
permalink: /article/nfoxbm0u/
tags:
  - idea
---
IDEA（IntelliJ IDEA）是一个功能强大的集成开发环境（IDE），主要用于 Java 开发，也支持多种编程语言。凭借智能代码补全、调试工具、版本控制和插件生态，IDEA 提供高效的开发体验，广受开发者喜爱。

在使用Idea过程中，有一些内容、调整的设置需要掌握，这里做下记录。

<!-- more -->

[真香！用 IDEA 神器看源码，效率真高！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247505133&idx=1&sn=5f722cb29c655203b27cb38684503390&chksm=cea19b26f9d61230d87df97c8efd892ff6e3f7be77e6ec104c8f823a9a0c7dc7232f03b8351b&scene=178&cur_album_id=1319419426898329600#rd)

[IDEA 高效使用教程](https://idea.javaguide.cn/tips/efficient-use-guide.html)

[IDEA 高效使用指南](https://idea.javaguide.cn/)

## 一、基础设置

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

## 二、信息了解

### 2.1、设置idea使用内容，并了解配置项信息

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



