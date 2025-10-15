---
title: 面渣逆袭-Spring
createTime: 2025/08/25 10:37:06
permalink: /interview/ioae6yce/
---

[Sring面试题，41道Spring八股文](https://javabetter.cn/sidebar/sanfene/spring.html)

## 基础

### 1、Spring是什么？

Spring是一个Java后端开发框架，其最核心的 作用就是帮我们管理Java对象。

其最重要的特性就是IoC，也及时控制反转。以前我们要使用一个对象时，都要自己先new出来，但是有了Spring之后，我们只需要告诉Spring我们需要什么对象，他就会自动帮我们创建好并注入到Spring容器 当中。

另外，Spring还提供了AOP，也就是面向切面编程，在我们需要做一些通用功能的时候特别有用，比如说日志记录、权限校验、事物管理这些，我们不用在每个方法都写重复的代码，直接用AOP就能统一处理。

### 2、Spring有哪些模块呢？

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/spring-bb7c13ea-3174-4b32-84b8-821849ddc377.png)

- Spring Core模块：这是整个Spring框架的基础，包含了IoC容器和依赖注入等核心功能
- Spring Bean模块：负责Bean的管理和配置。
- Spring Context模块：上下文模块，他在Core的基础上提供了更多企业级的功能，比如国际化、事件传播、资源加载。ApplicationContext就在这个模块里面。

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        // Spring Boot会自动创建ApplicationContext
        ApplicationContext context = SpringApplication.run(Application.class, args);
    }
}
```

- Spring AOP模块： 提供了面向切面编程的支持，我们用的@Transactional、自定义切面这些都是基于这个模块。
- Spring Web模块：提供Web开发方面，Spring WebMVC就是我们常用的MVC框架，用来处理HTTP请求和相应，还有Spring WebFlux，支持响应式编程。
- Spring JDBC：简化了JDBC的使用
- Spring ORM：提供了对Mybatis-plus等ORM框架的集成支持。
- Spring Test模块：提供了测试支持，方便的进行单元测试和集成测试。常用的@SpringBootTest注解，加载上下文，进行集成测试。

```java
@Slf4j
@SpringBootTest(classes = QuickForumApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
public class BasicTest {
}
```

- Spring Security： 负责安全认证
- Spring Batch：批处理任务。

### 3、Spring有哪些常用的注解呢？

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/spring-8d0a1518-a425-4887-9735-45321095d927.png)

Bean相关的注解。@Component是最基础的，用来表示一个类是Spring组件，像@Service、@Repostor、@Controller这些都是@Component的特化版本，分别用到服务成、数据访问层和控制层。

依赖注入相关的注解。@Autowired是用的最多的，可以标注在字段、setter方法或者构造方法上。@Qualifier在有多个同类型Bean的时候用来注入具体那个，@Resource和@Autowired功能差不多，不过他是按名称注入的。

相关配置的常用组件。@Configuration标识配置类，@Bean用来定义Bean，@Value用来注入配置文件中的属性值。我们项目的数据库连接信息、Rediis配置这些都是用@Value来注入的，@PropertySource用来指定配置文件的位置。

Web开发相关的注解：@RestController相当于@Controller加@ResponseBody用来做RESTful接口。@RequestMapping及其变体@GetMapping、@PostMapping、@PutMapping、@DeleteMapping用来映射HTTP请求。@PathVariable获取路径参数，@RequestParam获取请求参数、@RequestBody接受JSON数据。

AOP相关的注解：@Aspect定义切面，@Pointcut定义切点，@Before、@After、@Around这些定义通知类型。



用的最多的还是@Transactional，基本上Service层需要保证事务原子性都会加这个注解。还有一些SpringBoot特有的注解，比如@SpringBootApplication启动类注解，@EnableAutoConfiguration开启自动配置等等。



###  ⭐ 4、Spring用到了那些设计模式？

