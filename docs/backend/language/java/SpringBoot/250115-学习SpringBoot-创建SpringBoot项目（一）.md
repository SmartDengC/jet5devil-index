---
title: 学习SpringBoot-创建SpringBoot项目（一）.md
createTime: 2025/01/15 09:58:25
permalink: /article/joacqcb8/
---

idea中编辑yml文件没有提示问题 -> [Idea Spring Boot配置文件.yaml或.properties不能自动提示的有效解决办法](https://blog.csdn.net/xfwdxt/article/details/107163389)



如何创建一个SpringBoot项目？

我们使用Maven来管理包，这里我在父项目里面创建一个module，将这个module改造成SpringBoot项目。

现在pom.xml文件里面添加web的依赖。

```
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
```

然后在src/main/java里面创建一个对应项目的启动类：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class le_SpringStartUp {
    public static void main(String[] args) {
        SpringApplication.run(le_SpringStartUp.class, args);
    }
}
```

这样的话，项目就可以启动了，启动默认端口是8080，如果想修改端口的话，可以在resources里面创建一个application.yml的文件，里面修改端口。

```yaml
server:
  port: 8081
```

