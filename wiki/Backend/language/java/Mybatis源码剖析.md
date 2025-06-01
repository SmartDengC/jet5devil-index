---
title: Mybatis源码剖析
createTime: 2025/05/30 10:06:55
permalink: /article/ff2x7tjw/
---


需要解决的疑问：

- 手写持久层框架-仿写mybatis
- mybatis架构设计、主要组件
- mybatis如何完成sql解析及执行？
- mybatis如何设置的参数？
- mybatis如何进行的类型转换？
- mybatis如何封装的返回结果集
- mybatis插件原理是什么？
- mybatis缓存底层数据结构是什么？





## 一、手写持久层框架（ipresistent）的思路分析

分为框架使用端和自定义框架本身

### 1.1、框架使用端

- 创建SqlMapConfig.xml配置文件：数据库配置信息
- 创建Mapper.xml配置文件，存放sql信息、参数类型、返回值类型

### 1.2、自定义框架本身

- 1、加载配置文件
  
  创建Resource类，负责加载配置文件，加载成字节数入流，存到内存中
  
  方法：InputStream getResource(String path); 
  
- 2、创建两个JavaBean（容器对象）用来存放配置信息
  
  Configuration：全局配置类，存放sqlMapConfig.xml配置文件解析出来的信息
  
  MapperStatement：映射配置类，存放mapper.xml配置文件解析出来的信息 

- 3、解析配置文件，填充容器对象

  创建SqlSessionFactoryBuilder类

  方法：SqlSessionFactory build(InputStream) 

  解析配置文件（dom4j+xpath），封装Configuration； 创建SqlSessionFactory

- 4、创建SqlSessionFactory接口及DefaultSqlSessionFactory

  方法：SqlSession openSession() 工厂模式

- 5、创建SqlSessionFactory接口和DefaultSqlSessionFactory接口的实现类

  方法：selectList(), selelctOne(), update(), delete()

- 6、创建Exector接口和实现类SimpleExecutor

  方法：query(Configuration, MappedStatement, Object param);



