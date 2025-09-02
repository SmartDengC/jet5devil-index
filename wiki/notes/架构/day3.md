---
title: day3
createTime: 2025/08/29 11:22:55
permalink: /article/s2ey9pdi/
---


时间：20250829

## 019、阿里巴巴Seata分布式事务解决方案

seata是一款开源的分布式事务的解决方案，致力于在微服务架构下提供高性能和简单以哟瓶的分布式事务服务。



订单服务、会员服务、库存服务。

创建订单，增加积分，减少库存

事务协调者。

- 通知开始处理本地事务 
-  服务处理相应逻辑，比如新增订单记录、增加会员积分（事务都没有提交）
- 本地事务处理完毕）最后，事务协调者发送事务提交的指令

二阶段提交。



三个重要角色。

TM 事务管理器：巨欸多功能什么时候全局提交/回滚（司令官）@GlobalTransactional

TC 事务协调者：负责通知命令的中间件seata-server，@Transactional

-  注册分支事务
- 开启本地事务
- 提交本地事务（直接提交事务了？）
- 上报TC分支事务成功/失败

RM 资源管理器：做具体事情的人。

seata at模式下如何实现数据自动提交、自动回滚

undo_log回滚日志表（执行sql语句的时候，生成一条相反的sql存放到undo_log里面）

收到TC下达的分支替吉奥，删掉undo_log即可，收到Tc下达分支回滚，执行undo_log逆向sql，还原数据



**seata如何避免并发情况下脏读脏写？**

通过分布式锁。

怎么使用seata框架，来保证事务的隔离型？

因为sata一阶段本地事务已提交，为防止其他事务脏读脏写需要加强隔离。

1、脏读 select语句加for update ，代理方法增加@GlobalLock + @Transactional或者@GlobalTransaction

2、脏写 必须使用@GlobalTransaction



##	020、京东金融是如何保障接口幂等性？

幂等性是啥？发一次接口调用与发多次相同的接口消息都能得到与预期相符的结果

构建幂等表是通用解决方案。

应用系统：

- 请求偷强制要求附加： RequestId ： 18a720... 一定时间内唯一

应用网关 nginx + lua

- 检查requestId setnx 保证并发性 ，是存在redis中
- 键： 值：存活时间
- SYS1-123456789: OK：3分钟
- SYS1-18a720...: PROC：5分钟

数据服务：

- 处理完成，将更改redis的状态 SYS1-18a720...: OK：5分钟
- 返回数据到应用系统：{"code": "0", message: "success"}

```java
@GetMapping("/ab")
// 利用AOP after 通知，更新redis状态
@Idempotent
public object 方法(){
  // 处理方法
}
```

优点：后台服务无代码侵入，无序修改业务逻辑

缺点：

- 前台应用要针对幂等进行改造（前端生成requestId， nginx返回201状态错误）

- 架构复杂度增加，需要额外部署nginx、redis