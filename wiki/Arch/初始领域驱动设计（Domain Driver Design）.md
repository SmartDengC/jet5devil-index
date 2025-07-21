---
title: 初始领域驱动设计（Domain Driver Design）
createTime: 2025/07/18 15:24:47
permalink: /article/vmyhudry/
---

[构建自己的软件大厦](https://docs.mryqr.com/build-your-own-software-skyscraper/)

```java
 @Transactional//事务边界
    public void updateMyMobile(String mobileNumber, String memberId) {
        
        //采用事务脚本的方式，直接通过SQL语句实现业务逻辑
        String sql = "update member set mobile_number = ? , mobile_identified = 1 where id = ?;";
        jdbcTemplate.update(sql, mobileNumber,memberId);
    }
```

存在问题，业务代码和技术代码揉杂在一起。

面向对象编程OOP。

```java
    @Transactional
    public void updateMyMobile(String mobileNumber) {
        String memberId = CurrentUserContext.getCurrentMemberId();
        Member member = memberRepository.findMemberById(memberId);

        //先后调用Member对象中的2个setter方法实现业务逻辑
        member.setMobileNumber(mobileNumber);
        member.setMobileIdentified(true);

        memberRepository.updateMember(member);
    }
```

电话号码用户能改，管理员也能改的话，这样就需要多处进行修改，定义多个方法。（贫学模型）



领域对象。

```java
    @Transactional
    public void updateMyMobile(String mobileNumber) {
        String memberId = CurrentUserContext.getCurrentMemberId();
        Member member = memberRepository.findMemberById(memberId);

        //只需调用Member种的updateMobile()方法即可
        member.updateMobile(mobileNumber);

        memberRepository.updateMember(member);
    }
```

更新的具体操作交给领域对象来做，比如这里的updateMobile。

```java
    //由Member对象自身处理同时更新mobileNumber和mobileIdentified字段
    public void updateMobile(String mobileNumber) {
        this.mobileNumber = mobileNumber;
        this.mobileIdentified = true;
    }
```

在DDD中Member对象被称为 **聚合根**，而更新mobileNumber的同时需要一并更新mobileIdentified则被称为聚合根的**不变条件**。





（坚持代码即是设计的原则，让代码本身直接体现业务意图）。

MerberDomainService为领域服务，用于处理领域对象自身无法处理的业务逻辑。



![](https://docs.mryqr.com/images/118-it/ddd/ddd-books.jpeg)

- **《领域驱动设计：软件核心复杂性应对之道》**（蓝皮书，从左往右第一本，首版时间2003年）：DDD的开山之作，对于初学者来说阅读起来有些晦涩，不建议初学者直接阅读该书
- **《实现领域驱动设计》**（红皮书，从左往右第二本，首版时间2013年）：这本是讲DDD落地的经典书籍，其中包含大量代码示例，很多人都是通过这本书才真正进入DDD的世界
- **《领域驱动设计模式、原理与实践》**（从左往右第三本，首版时间2015年）：这也是一本能够帮你系统的完成DDD落地的书籍
- **《解构领域驱动设计》**（首版时间2021年）：国内第一本关于DDD的专著，作者张逸在DDD社区具有比较大的影响力



## 概念

![](https://docs.mryqr.com/images/118-it/ddd/1-strategic.png)

聚合根：

- 聚合根属于实体，但是实体不一定是聚合根

领域服务：

- 领域服务是领域模型的一部分

实体：用于表示那些具有生命周期的“存在”，实体通过唯一标识进行标定，实体有ID

值对象：用于表示那些仅仅起描述性作用的东西，值对象则通过其包含的所有属性进行标定，值对象没有ID

领域事件：

- 一个业务操作通常会导致一个结果，这个结果被称为领域事件，即领域模型中已经发生的事情。
- 领域事件通常用于组建之间的因果关系处理，比如：当成员手机号已更新事件产生后，我们可能会在另一个业务组件中做相应的同步操作，这里的组件粒度可以是聚合根，可以是其他业务模块，还可以是一个独立的第三方系统。



资源库（Repository）：

- 用于保存/获取聚合根。DAO对象用于存储对象，但是与DAO不同的是，**资源库操作的基本单位是聚合根**，也即只有聚合根对象才配得上拥有资源库，其他实体对象则没有

应用服务：

- 领域模型是用来完成业务功能的，也即需要效应用户发起的各种请求，但是在软件系统中在这些请求达到领域模型之前，事实上还有很多事情需要处理，比如需要从数据库中加载数据（聚合根）、处理事务、权限管控等，在DDD中，这些操作由应用服务（Application Service）完成。应用服务可以看作领域模型的门面，它将接收到的请求派发给合适的领域模型去处理，在整个过程中，应用服务充当的是协调者和编排者的角色，就像酒店的前台一样。

如果成功没有如期而至，那只是因为我们没有付出足够的努力。

当你遇到任何问题，记住，解决问题的办法永远在问题之外。

成功只会眷顾那些持之以恒、竭尽全力，并能够战胜挑战的人。



## 三、战略设计

DDD的战略设计只在解决一个问题，就是软件的模块划分的问题。

战略设计中包含领域、子域、通用语言和限界上下文等概念。

领域（Domain）表示一个行业中所发生的一切业务；

子域（Subdomain）表示领域中细分之后的子业务，是比领域更小的概念，子域可以细分为核心子域、支撑子域、和通用子域；

通用语言（Ubiquitous Language）：表示领域中所有人员都是用一套相同的语言进行沟通交流	；

限界上下文（Bounded Context）：表示由通用语言形成的上下文边界。



核心域 - 电商系统中的订单系统；支撑域-积分模块；通用域-登录模块。限界上下文：交易模块中的订单和物流模块中的订单，不同的语境表示不同的含义。

![](https://docs.mryqr.com/images/118-it/ddd/bcs.png)



软件设计中模块的概念。

难点不在于如何定义模块，而是在于如何划分模块。

“我通过自己对业务的深入了解，外加自己的从业 经验和抽象能力，搞定了DDD的战略设计”。

“知识归根到底由经验而来 -- 约翰 洛克”

“知识的唯一来源是经验 -- 爱因斯坦”

什么是架构？一种解释是：软件架构是项目中的资深程序员们对某个问题所达成的统一认识而已。



码如云模块划分：

![](https://docs.mryqr.com/images/118-it/ddd/mry-bcs.png)

三个顶层模块，一个是核心上下文（模块），其中包含各种核心的业务实体，比如应用和实力等，每个月业务实体均被建模为一个聚合根；第二个是后台管理上下文（模块），用于码如云的后台运营，包含客户关系、投诉管理和订单管理；第三个是集成上下文（模块），用于处理与第三方的API集成。

在前文提到，登录功能可以看作是通用子域而模块为一个独立的模块，但是码如云中并未这样划分，而是将登录功能消化在核心上下文中，因为其粒度尚未达到需要独立为一个模块的程度。



总结：

这一章的话，介绍了一些概念，像是领域、子域、限界上下文，然后对这些概念进行了举例说明，然后聊到模块化的重要性。

总的来说就是，DDD就是来划分模块的，不是贬低，而是让我们了解到战略设计的本质。

**那战略设计的本质是什么？**

开头说了，战略设计的本质只解决一个问题，就是软件的模块划分问题（就是如何划分模块）。



## 四、代码工程结构



![](https://docs.mryqr.com/images/118-it/ddd/4-2.png)

将技术分包作为顶层分包是一种反模式。



![](https://docs.mryqr.com/images/118-it/ddd/4-3.png)

DDD建议分包时：“先业务，后技术。”

好处：

- 业务直观
- 便于导航。当找一个功能的时候，首先想到的是该功能属于哪个业务模块，而不是属于哪个Controller。
- 便于迁移。每个业务包都包含了从业务到技术的所有代码，因此在迁移时只需要整体挪动业务包即可。

domain包代码量远超其他所有分包，强调在DDD中领域模型应该是代码的主体。



总结：

本章的话，主要讲述了码如云项目的代码架构，以先业务后技术的方式来组织代码。



## 五、请求处理流程

DDD中所有的组件都是围绕着聚合根展开的，其中有些本身就是聚合根的一部分，比如实体和值对象；有些是聚合根客户，比如应用服务；有些则是对聚合根的辅助或补充，比如领域服务和工厂。
