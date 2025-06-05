---
title: JAVA知识点：详解Maven配置文件
createTime: 2024/12/10 15:52:22
permalink: /article/ayk9nsbn/
---

[全面详解Maven的配置文件settings.xml](https://blog.csdn.net/qq_20236937/article/details/135913803)

[阿里云云效Maven](https://developer.aliyun.com/mvn/view)

**尝试自己弄个maven私服？**

涉及到Java开发肯定是离不开Maven这个包管理工具的，这里就简单学习一下Maven的配置文件。

注意事项：

如果仓库的id设置成central，则该仓库会覆盖maven默认的中央仓库配置。

setting.xml中配置的激活的profile下的仓库优先级高于项目pom.xml文件配置的仓库 

仓库的搜索顺序为：本地仓库 > 全局配置的私服仓库 > 项目自身配置的私服仓库 > 镜像仓库 > 中央仓库

### localRepository

```xml
<localRepository></localRepository> 本地仓库的位置
```

### mirrors

```xml
<!-- 为仓库列表配置下载镜像列表，用于指定中央仓库的镜像，以提高依赖下载的速度 -->
<mirrors>
  <!-- mirror 匹配顺序，多个mirror优先级根据id字母顺序进行排序，即与编写的顺序无关-->
  <mirror>
    <id></id> 
    <name></name>
    <url></url>
    <!-- mirrorOf表示被镜像的服务器的id， 必须与repository节点设置的id一致-->
    <!--
			* 						= 匹配所有远程仓库，这样所有pom中定义的仓库都不生效
			external: *   = 匹配除localhost、使用file:// 协议外的所有远程仓库
			repo1,repo2   = 匹配仓库repo1 和repo2
			*, !repo1     = 匹配所有远程仓库，repo1除外
		-->
    <mirrorOf></mirrorOf>
  </mirror>
</mirrors>
```

id是唯一表示一个mirror，name节点名，url是官方的苦地址，mirrorOf表示一个镜像的替代位置，例如central比爱哦是替代官方中央库。

虽然可以配置多个mirror，但是只会使用一个节点，即默认情况下只有第一个生效，无法连接的时候，才会找后面一个。

配置多个mirros时，mirrofOf不能配置 * ， *的意思就是匹配所有的仓库。

### profile





idea中jdk的版本老是改变的话，可以在maven的配置文件中指定使用的jdk版本

```xml
<profiles>
	<profile>
		<id>jdk-1.8</id>
		<properties>
			<maven.compiler.source>1.8</maven.compiler.source>
			<maven.compiler.target>1.8</maven.compiler.target>
			<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
		</properties>
	</profile>
	<profile>
		<id>jdk-17</id>
		<properties>
			<maven.compiler.source>17</maven.compiler.source>
			<maven.compiler.target>17</maven.compiler.target>
			<maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
		</properties>
	</profile>
</profiles>

<activeProfiles>
	<activeProfile>jdk-8</activeProfile>
</activeProfiles>
```





