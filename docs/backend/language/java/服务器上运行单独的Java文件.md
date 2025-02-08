---
title: 服务器上运行单独的Java文件
createTime: 2024/10/28 08:47:01
permalink: /article/rmrsbqn9/
tags:
  - java
  - javac
---

遇到在服务器上运行单个文件的情况。

<!-- more -->

创建一个Hello.java的文件，文件内容如下：

（需要注意的是，文件里面的class后面的Hello和文件名称要一样。）

```java
public class Hello{
  public static void main(String[] args) {
    System.out.println("hello world");
  }
}
```

然后使用javac编译java文件：

```shell
(base) ➜ gitee javac Hello.java
(base) ➜ gitee ls
Hello.class     Hello.java    
```

运行class文件:

```shell
(base) ➜ gitee java Hello
hello world
```

这样的话就运行成功了，达到我们想要的目标了。
