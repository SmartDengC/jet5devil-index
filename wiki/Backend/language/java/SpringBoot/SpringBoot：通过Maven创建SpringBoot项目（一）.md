---
title: SpringBoot：通过Maven创建SpringBoot项目（一）
createTime: 2025/01/15 09:58:25
permalink: /article/joacqcb8/
tags:
  - springboot
---

写了这么多年SpringBoot代码，今天从创建项目开始记录。《如何使用Maven创建一个SpringBoot项目》

 [Idea Spring Boot配置文件.yaml或.properties不能自动提示的有效解决办法](https://blog.csdn.net/xfwdxt/article/details/107163389)

[【IntelliJ IDEA】使用Maven方式构建Spring Boot Web 项目（超详细）2](https://developer.aliyun.com/article/1478595)	

## 一、创建一个普通的Java项目

我们使用Maven来管理包，这里我在父项目里面创建一个module，将这个module改造成SpringBoot项目。

现在pom.xml文件里面添加web的依赖。

### 1.1、修改pom.xml文件

因为maven是我们的包管理工具，我们需要在里面配置springboot相关的信息，我们才能用springboot

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.18</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>        
    </dependencies>
```

完整pom.xml文件内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--项目的基本信息-->
    <groupId>dhh.project</groupId>
    <artifactId>hello-spring-boot</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 项目维护的一些变量   -->
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <springboot.version>2.7.18</springboot.version>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <!--        <version>2.7.18</version>-->
        <version>${springboot.version}</version>
    </parent>

    <!--  依赖相关  -->
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

    </dependencies>

</project>

```

### 1.2、创建启动类

然后在src/main/java里面创建一个对应项目的启动类：

- 为什么一个SpringApplication.run(类名.class, args) 就能够启动项目呢？

```java
package dhh.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainStartUp {
    public static void main(String[] args) {
        // System.out.println("Hello world!");
        SpringApplication.run(MainStartUp.class, args);
    }
}
```

### 1.3、编辑配置文件

这样的话，项目就可以启动了，启动默认端口是8080，如果想修改端口的话，可以在resources里面创建一个application.yml的文件，里面修改端口。

```yaml
server:
  port: 8081
```

### 1.4、项目目录结构

- src, main, java,
- src, main, resource

```
.
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── dhh
│   │   │       └── project
│   │   │           ├── MainStartUp.java
│   │   │           └── controller
│   │   │               └── SpringHelloController.java
│   │   └── resources
│   │       └── application.yml

```





## 问题

```
SpringBootServletInitializer 的作用?
```

```java
package dhh.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MainStartUp extends SpringBootServletInitializer {
    public static void main(String[] args) {
        System.setProperty("file.encoding", "UTF-8");
        SpringApplication.run(MainStartUp.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(MainStartUp.class);
    }

}
```
