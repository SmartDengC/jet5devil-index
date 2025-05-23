---
title: SpringBoot：集成Mybatis-Plus
createTime: 2025/05/20 18:50:34
permalink: /article/nxvgxavi/
tags:
  - springboot
---

[Spring Boot 整合 MyBatis-Plus 教程](https://developer.aliyun.com/article/1583296)

[SpringBoot集成MyBatisPlus+MySQL（超详细）](https://blog.csdn.net/weixin_47316183/article/details/132044019)

终于是搞出来了，这里简单记录一下过程中遇到问题，方便后面查看。

现在项目上使用的Mybatis-Plus版本3.4.3.1

## 一、配置pom.xml文件内容

很多功能配置pom的时候，我们都会多添加依赖，但是我们又不知道加入的依赖的作用。

下面就导入这两个。

引入mybatis-plus的依赖，也需要引入mysql的依赖，因为我们需要连接mysql数据库，这样的话就需要mysql connector。

```xml
    <dependencies>
      	<!--mybatis-plus-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.3.1</version>
        </dependency>
				<!--mysql-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
```

这里我发现有两个依赖，一个是mysql-connector-j，就是上面这个，但是groupId是com.mysql。

还有一个就是mysql-connector-java，groupId是mysql，这两个有啥区别吗？

```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
```

## 二、配置application.yml文件

这里我创建了一个application-local.yml的文件，用来区分开发环境和测试环境的配置文件内容。

- application.yml

```yaml
spring:
  profiles:
    active: local # 连不上数据库是因为我没有指定配置文件
    
  datasource:
    url: jdbc:mysql://${dhh.db.host}:3306/${dhh.db.tableName}?useUnicode=true&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: ${dhh.db.username}
    password: ${dhh.db.password}

# Use logs
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

- Application-local.yml

```yaml
dhh:
  db:
    host: 8.137.xxx.xxx
    username: dengxx
    password: dengxx
    tableName: share_photo_project
```

## 三、创建相应的文件

### 3.1、实体文件

```java
package dhh.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * @author 邓聪
 * @since 2025/5/22 12:43
 */
@Data  // Data是lombok
@TableName("hr1")
public class Hr {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField(value = "name")
    private String name;

    @TableField(value = "phone")
    private String phone;

    @TableField(value = "telephone")
    private String telephone;
}
```

### 3.2、创建mapper接口

mapper接口集成自BaseMapper，传入实体作为范性

```java
package dhh.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import dhh.project.entity.Hr;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author 邓聪
 * @since 2025/5/22 12:45
 */
@Mapper
public interface HrMapper extends BaseMapper<Hr> {
}
```

### 3.3、创建服务接口和服务实现类

- 服务接口
  - 接口集成Iservice，传入 实体作为范性

```java
package dhh.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import dhh.project.entity.Hr;

public interface HrService extends IService<Hr> {
}
```

- 接口服务实现类

```java
package dhh.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dhh.project.entity.Hr;
import dhh.project.mapper.HrMapper;
import dhh.project.service.HrService;
import org.springframework.stereotype.Service;

@Service
public class HrServiceImpl extends ServiceImpl<HrMapper, Hr> implements HrService {
}
```

### 3.4、创建contorller文件

```java
package dhh.project.controller;

import dhh.project.entity.Hr;
import dhh.project.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/SpringHrController")
public class SpringHrController {

    @Autowired
    private HrService hrService;

    @GetMapping("getAllHr")
    public List<Hr> getAllHr() {
        return hrService.list();
    }
}
```

这样的话，我们就可以使用 **http://127.0.0.1:8081/SpringHrController/getAllHr**来访问接口获取数据了。

## 四、问题

### 4.1、Cannot load driver class: com.mysql.cj.jdbc.Driver

修改了mysql-connector-java的版本为8.0.29，我使用的是mysql5.7的数据库

### 4.2、一直连不上数据库？

> Cause: org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection; nested exception is java.sql.SQLNonTransientConnectionException: Could not create connection to database server. Attempted reconnect 3 times. Giving up.] with root cause

一直连不上数据库，我以为是密码啥的输入错误，结果是因为我新建的application-local.yml没有配置在application.yml文件中。

```yaml
spring:
  profiles:
  # 连不上数据库是因为我没有指定配置文件
      active: local

```

## 五、考虑多数据源问题

### 5.1、配置pom.xml

```xml
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
            <version>3.5.0</version>
        </dependency>
```

### 5.2、配置application.yml文件

```yaml
spring:
  profiles:
    active: local # 连不上数据库是因为我没有指定配置文件
  datasource: #  考虑多数据源
    dynamic: # 动态数据源
      primary: master  # 指定主数据源
      datasource:
        master:
          url: jdbc:mysql://${dhh.db.host}:3306/${dhh.db.tableName}?useUnicode=true&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: ${dhh.db.username}
          password: ${dhh.db.password}
        slave_1:
          url: jdbc:mysql://${dhh.slave_1.host}:3306/${dhh.slave_1.tableName}?useUnicode=true&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: ${dhh.slave_1.username}
          password: ${dhh.slave_1.password}
```

### 5.3、使用@DS指定数据源

```java
package dhh.project.service;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dhh.project.entity.db2.FsState;
import dhh.project.mapper.FsStateMapper;
import org.springframework.stereotype.Service;

/**
 * 状态(FsState)表服务实现类
 *
 * @author 邓聪
 * @since 2025-05-23 10:27:56
 */
@Service
@DS("slave_1") // 指定数据源
public class FsStateService extends ServiceImpl<FsStateMapper, FsState> {

}
```

