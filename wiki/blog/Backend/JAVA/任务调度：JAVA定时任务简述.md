---
title: 【任务调度】JAVA定时任务简述
createTime: 2025/01/02 16:12:50
permalink: /article/7mavwm41/
---
简单学习一下Java常用的几种定时任务的方式！

<!-- more -->

## 一、注解@Scheduled

只支持单机模式，不支持分布式。

使用注解@Scheduled很简单，因为spring自带了，只需要下面两步就能实现。

1 在启动类上面加上`@EnableScheduling`

```java
@SpringBootApplication
@EnableScheduling
@RestController
public class sh_UserManagerStartUp {
    public static void main(String[] args) {
        SpringApplication.run(sh_UserManagerStartUp.class, args);
    }
}
```

2 在运行类上面加上`@Scheduled`

```java
@Component  // 让spring管理
public class CronHandler {
    @Scheduled(cron ="*/6 * * * * ?")
    public void testCron(){
        System.out.println("Hello World!");
    }
}
```

## 二、分布式调度框架xxl-job

支持分布式调度。

### 2.1、下载代码

下载源码，[xxl-job](https://github.com/xuxueli/xxl-job.git)， 然后切换到2.4.2的版本。

Xxl-job由调度中心和执行器组成，可以到官网进行学习：[xxl-job 官方地址](https://www.xuxueli.com/xxl-job/)

### 2.2、部署xxljob调度中心

#### 2.2.1、配置打包调度中心jar包

从github下载下来xxljob的源码，找到里面的tables_xxl_job.sql这个sql文件，在自己部署的mysql里面执行一下。

```
├── db
│   └── tables_xxl_job.sql
```

#### 2.2.2、application.properties

然后找到xxl-job-admin 模块源码，修改配置文件里面的连接mysql的信息。

```
### xxl-job, datasource
spring.datasource.url=jdbc:mysql://xx.xxx.124.148:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=admin
spring.datasource.password=admin_pwd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

如果打包的时候报错找不到目录文件，可以修改一下logback.xml文件

```xml
<property name="log.path" value="./xxl-job/xxl-job-admin.log"/>
```

#### 2.2.3、Dockerfile

配置Dockerfile文件

```dockerfile
FROM openjdk:8-jre-slim
MAINTAINER xuxueli
WORKDIR /home/dengcong/project/xxljob/xxljob-admin
COPY xxl-job-admin-*.jar ./app.jar
ENV PARAMS=""
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 8080
ENTRYPOINT ["sh","-c","java -jar ${JAVA_OPTS} app.jar $PARAMS"]
```

#### 2.2.4、docker构建镜像

然后将jar包和Dockerfile文件上传到服务器。

```
.
├── Dockerfile
└── xxl-job-admin-2.4.2.jar
```

```
docker build -t xxljob-admin:1.0 .
docker run --name xxljob-admin -p 8082:8080 -itd xxljob-admin:1.0 /bin/bash
```

执行没有报错话，就可以在访问xxl-job的web界面了， [xxl-job web界面](http://127.0.0.1:8082/xxl-job-admin/toLogin)， 默认的密码是admin/123456。

### 2.3、部署xxljob执行器

同样的方式部署xxl-job执行器。

我们用源码里面适配springboot框架的xxl-job-executor-sample-springboot模块，

修改xxl-job调用中心地址：

```
xxl.job.admin.addresses=http://x.xxx.124.148:8082/xxl-job-admin
```

同样修改一下logback.xml文件

```xml
<property name="log.path" value="./xxl-job/xxl-job-executor-sample-springboot.log"/>
```

修改一下Dockerfile文件

```
FROM openjdk:8-jre-slim
MAINTAINER xuxueli
WORKDIR /home/dengcong/project/xxljob/xxljob-exector
COPY xxl-job*.jar app.jar
ENV PARAMS=""
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 8080
EXPOSE 9999
ENTRYPOINT ["sh","-c","java -jar $JAVA_OPTS app.jar $PARAMS"]
```

然后把Dockerfile 和jar包上传到服务器

```
.
├── Dockerfile
└── xxl-job-executor-sample-springboot-2.4.2.jar
```

构建镜像并运行

```
docker build -t xxljob-executor:1.0 .
docker run --name xxljob-executor -p 8083:8080 -p 9999:9999 -itd xxljob-executor:1.0 /bin/bash
```

注意：如果想要在本地启动执行器的话， 需要将本地ip映射到公网上去，这里我就不说明了。

### 2.4、集成到其他项目

添加pom依赖

```xml
<!--  xxl-job      -->
<dependency>
	<groupId>com.xuxueli</groupId>
	<artifactId>xxl-job-core</artifactId>
	<version>2.4.2</version>
</dependency>
```

配置xxl-job配置文件

```yaml
xxl:
    job:
        admin:
            addresses: http://x.xx.xxx.148:8080/xxl-job-admin
        accessToken: default_token
        executor:
            appname: xxl-job-executor-sample
            ip: 127.0.0.1
            port: 9999
            logPath: ./static/logs/xxl-job/jobhandler
            logretentiondays: 30
```

[xxl-job执行器启动报错读取不到配置文件Could not resolve placeholder ‘xxl.job.executor.address‘ in value “${xxl.job](https://blog.csdn.net/qq_41890624/article/details/119417319)

读取不到配置文件内容，大概率就是定义的字段错了。检查字段



Docker 部署xxljob和应用有问题。[xxl job 执行器注册不上](https://blog.51cto.com/u_16175464/8706306)

Xxl-job的密码是用md5加密的，想要修改密码，加密之后存在数据库里面就可以了。

一个XxlJobConfig.java

```java
package com.dengc.job.executor;

import com.xxl.job.core.executor.impl.XxlJobSpringExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * @author 邓聪
 */
@Configuration
public class XxlJobConfig {
    private Logger logger = LoggerFactory.getLogger(XxlJobConfig.class);
    // 获取到配置文件里面的值
    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;

    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Value("${xxl.job.executor.ip}")
    private String ip;

    @Value("${xxl.job.executor.port}")
    private int port;

    @Value("${xxl.job.accessToken}")
    private String accessToken;

    @Value("${xxl.job.executor.logPath}")
    private String logPath;

    @Value("${xxl.job.executor.logretentiondays}")
    private int logRetentionDays;

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        logger.info(">>>>>>>>>>> xxl-job config init.");
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setIp(ip);
        xxlJobSpringExecutor.setPort(port);
        xxlJobSpringExecutor.setAccessToken(accessToken);
        xxlJobSpringExecutor.setLogPath(logPath);
        xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);
        return xxlJobSpringExecutor;
    }
}
```

测试代码：

```java
package com.dengc.job.handle;

import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import groovy.util.logging.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * xxljob demo
 *
 * @author 邓聪
 */
@Slf4j
@Component
public class XxlHandler {
    private Logger logger = LoggerFactory.getLogger(XxlHandler.class);

    @XxlJob("demoJobHandler")
    public void demoJobHandler(String param) throws Exception{
        System.out.println("执行定时任务，执行时间" + new Date());
    }

    @XxlJob("demoJobHandler2")
    public ReturnT<String> demoJobHandler2(String param) throws Exception{
        System.out.println("hello world");
        return ReturnT.SUCCESS;
    }
    @XxlJob("testxxl")
    public ReturnT<String> testxxl(String param) throws Exception {
        System.out.println("测试 xxljob");
        logger.info("logger... 测试log...");
        return ReturnT.SUCCESS;
    }
}
```
