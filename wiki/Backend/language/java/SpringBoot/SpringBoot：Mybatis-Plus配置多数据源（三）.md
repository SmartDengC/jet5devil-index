---
title: SpringBoot：Mybatis-Plus配置多数据源（三）
createTime: 2025/05/26 09:48:34
permalink: /article/2e8r7k4o/
tags:
  - springboot
---

多数据源在SpringBoot中是比较常见的情况。比如连接到第三方数据库做业务。



## 一、注解的形式

### 1.1、配置pom.xml

```xml
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
            <version>3.5.0</version>
        </dependency>
```

### 1.2、配置application.yml文件

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

### 1.3、使用@DS指定数据源

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

## 二、使用config配置的形式

```properties
# ===============================================================================================
# MySQL DataSource Configuration
# ===============================================================================================
spring.datasource.name=mysql
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.url=jdbc:mysql://xx.xx.xxx.xxx:3306/mes?characterEncoding=utf8&autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true&nullCatalogMeansCurrent=true
spring.datasource.username=xxx
spring.datasource.password=xxx

# ---------------------------------------------
spring.datasource-other.name=mysql
spring.datasource-other.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource-other.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource-other.url=jdbc:mysql://xx.xx.xxx.xxx:3306/db2_test?characterEncoding=utf8&autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true&nullCatalogMeansCurrent=true
spring.datasource.username=xxx
spring.datasource.password=xxx
```

这里先简单记录，上面是通过properties的形式配置的，我们可以明显看出来，下面的数据源和上面的数据源不同的地方，上面是datasource，下面是datasource-other，这个datasource-other会在配置文件中使用到。比如下面的数据源的config文件。

```java
import com.alibaba.druid.pool.DruidDataSource;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import tk.mybatis.spring.annotation.MapperScan;

import javax.sql.DataSource;

// 默认扫描dhh.project.xxx.other下面的mapper【
@Configuration
@MapperScan(basePackages = "dhh.project.xxx.other", sqlSessionFactoryRef = "mybatisSqlSessionFactoryBean")
public class DataSourceConfigOther {

    @Bean("otherDataSource")
    @ConfigurationProperties(prefix = "spring.datasource-other") //读取yml文件中的配置的数据源参数
    public DataSource createotherDataSource() {
        return new DruidDataSource();
    }

    @Bean("mybatisSqlSessionFactoryBean")
    public MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean(
            @Qualifier("otherDataSource") DataSource dataSource,
            @Qualifier("mybatisPlusInterceptor") MybatisPlusInterceptor mybatisPlusInterceptor
    ) throws Exception {
        MybatisSqlSessionFactoryBean mybatisPlus = new MybatisSqlSessionFactoryBean();
        mybatisPlus.setDataSource(dataSource);
        // 配置分页插件拦截器
        mybatisPlus.setPlugins(mybatisPlusInterceptor);
        return mybatisPlus;
    }

    // 配置事务
    @Bean(name = "otherTransactionManager")
    public DataSourceTransactionManager otherTransactionManager(@Qualifier("otherDataSource") DataSource dataSource) {
        DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager(dataSource);
        dataSourceTransactionManager.setRollbackOnCommitFailure(true);
        dataSourceTransactionManager.setGlobalRollbackOnParticipationFailure(true);
        return dataSourceTransactionManager;
    }

    @Bean("otherSqlSessionTemplate")
    public SqlSessionTemplate otherSqlSessionTemplate(@Qualifier("mybatisSqlSessionFactoryBean") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
```

简单来理解就是通过扫描不同的mapper文件夹来实现不同数据源的切换。

## 三、出现的问题

[mybatis项目采用mybatis-plus开发，报：Invalid bound statement (not found) 异常，详细解决方案](https://www.cnblogs.com/ruanjianlaowang/p/14569411.html)

[mybatis-plus 有数据，但是total page为0](https://ask.csdn.net/questions/8094704)

