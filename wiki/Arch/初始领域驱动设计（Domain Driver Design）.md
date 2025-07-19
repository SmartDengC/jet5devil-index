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



