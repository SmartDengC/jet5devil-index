---
title: 编辑器：Idea
createTime: 2025/05/13 11:20:53
permalink: /article/nfoxbm0u/
---
IDEA（IntelliJ IDEA）是一个功能强大的集成开发环境（IDE），主要用于 Java 开发，也支持多种编程语言。凭借智能代码补全、调试工具、版本控制和插件生态，IDEA 提供高效的开发体验，广受开发者喜爱。

在使用Idea过程中，有一些内容、调整的设置需要掌握，这里做下记录。

<!-- more -->

## 一、基础设置

### 1.1、对新打开的项目配置默认信息





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