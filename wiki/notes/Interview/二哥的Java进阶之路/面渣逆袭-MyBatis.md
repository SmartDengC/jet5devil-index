---
title: 面渣逆袭-MyBatis
createTime: 2025/08/12 23:10:41
permalink: /interview/gac6ry8e/
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



## 一、MyBatis



一、手写持久层框架（ipresistent）的思路分析

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







Java学的半吊子， 慢慢回顾学习。今天要学习的是数据库ORM框架-MybatisPlus。



Java领域的ORM（Object Relation Mapping）框架有很多，像是Spring JDBC、Spring Data JPA、Mybatis、Mybatis-plus等等，反正我都没有用过。

随便在网上都能找到一个篇5，6w+阅读的文章，我们就跟着下面这个文章学习：

[MyBatis-Plus快速入门-(干货满满+超详细)](https://blog.csdn.net/weixin_45537947/article/details/111399311)



为什么加一个@SpringBootApplication， 修改main函数调用SpringApplication.run()就能够启动一个SpringBoot项目。

```java
@SpringBootApplication
public class le_MybatisPlusStartUp {
    public static void main(String[] args) {
        // System.out.println("Hello world!");
        SpringApplication.run(le_MybatisPlusStartUp.class ,args);
    }
}
```

## 二、Mybatis-Plus

Mybatis-Plus作为Mybatis的增强，自己封装了很多简单好用的方法，来解脱自己写sql。

### 方法一、根据主键ID去查询单个结果selectById

```java
/**
* 根据 ID 查询
*
* @param id 主键ID
* T selectById(Serializable id);
*/
User user = userMapper.selectByID(1);
```

### 方法二、查询多条数据库中的记录selectList

```java
/**
* 根据 entity 条件，查询全部记录
*
* @param queryWrapper 实体对象封装操作类（可以为 null）
* List<T> selectList(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
*/
List<User> users = userMaper.selectList(null);
```

### 方法三、查询多条数据库中的记录-条件查询selectList(wrapper)

```java
/**
* 根据 entity 条件，查询全部记录
*
* @param queryWrapper 实体对象封装操作类（可以为 null）
* List<T> selectList(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
*/
QueryWrapper wrapper = new QueryWrapper();
wrapper.eq("id",1);//相当于where id=1
List<User> list = userMapper.selectList(wrapper);
```

```java
/**
* 附加条件构造器QueryWrapper常用方法 ---这几个肯定够用了
*/
wrapper.eq("version", "202504"); // 相当于where条件 version='202504'
wrapper.between("字段", "区间一", "区间二");// 相当于范围内使用的between
wrapper.like("version", "202504"); // 相当于 like '%202504%'
wrapper.likeleft("version", "GC"); // 相当于 like '%GC'
wrapper.likeright("version", "V");  // 相当于 like 'V%'
wrapper.groupBy("version");  // 相当于group by version
wrapper.in("字段", "包括的值,分割"); // 相当于in
wrapper.orderByAsc("version");  // 升序 order by version asc 
wrapper.orderByDesc("version");  // 降序 order by version desc
wrapper.ge("value", "211");  //大于等于 value >= 211
wrapper.le("value", "985");  //小于等于 value <= 985
wrapper.last("limit 1"); // 相当于 limit 1
```

### 方法四、根据主键的id集合进行多条数据的查询selectBatchIds

```java
/**
* 查询（根据ID 批量查询）
*
* @param idList 主键ID列表(不能为 null 以及 empty)
* List<T> selectBatchIds(@Param(Constants.COLLECTION) Collection<? extends Serializable> idList);
*/
List list1 = Arrays.asList(1,2);
List<User> list2 = userMapper.selectBatchIds(list1);
```

### 方法五、分页查询selectPage

```java
/**
* 根据 entity 条件，查询全部记录（并翻页）
*
* @param page         分页查询条件（可以为 RowBounds.DEFAULT）
* @param queryWrapper 实体对象封装操作类（可以为 null）
* <P extends IPage<T>> P selectPage(P page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
*/
IPage<User> page = new Page<>(1,2);//参数一：当前页，参数二：每页记录数
//这里想加分页条件的可以如方法三自己构造条件构造器
IPage<User> userIPage = userMapper.selectPage(page, null);
```

二、配置Mybatis-Plus项目

[SpringBoot+Mybatis-Plus的入门搭建与配置测试](https://blog.csdn.net/qq_52423918/article/details/119329561)
