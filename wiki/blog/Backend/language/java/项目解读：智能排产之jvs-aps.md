---
title: 项目解读：智能排产之jvs-aps
createTime: 2025/05/10 19:42:46
permalink: /article/1ukxjgg9/
---

项目是关于智能排产的。

<!-- more -->

项目通过多module编写， 主要是jvs-aps-common和jvs-aps-mgr两个module，项目使用maven管理包

```
.
├── README.md
├── jvs-aps-common
├── jvs-aps-mgr
├── pom.xml
└── sql
```

## 一、jvs-aps-common

common 项目目录代码

```
.
├── aps  									APS功能包
│   ├── annotation  						自定义注解
│   ├── component  							统一处理
│   ├── config  							配置
│   ├── dto  								数据传输对象
│   ├── entity  							po实体类
│   ├── enums  								业务枚举
│   ├── graph  								图
│   ├── mapper
│   ├── service
│   ├── solve  								排产求解核心
│   ├── tree  								树
│   ├── util  								工具
│   └── vo  								展示层数据传输对象
├── common
│   ├── constant
│   ├── exception
│   └── utils
├── database  								数据库配置
│   ├── config
│   ├── entity
│   ├── handler
│   └── interceptor
└── redis  									 redis配置
    ├── config
    └── utils
```

从主要功能出发了解整个项目，比如直接看排产的核心内容，然后在过程中有什么问题在扩展了解。

### 1.1、solve

#### 1.1.1、calculate

#### 1.1.2、component

#### 1.1.3、dto

#### 1.1.4、enums

#### 1.1.5、impl

#### 1.1.6、model

#### 1.1.7、score

约束？

应该是把规则单独提出来了，通过这个类`ApsHardSoftScoreConstraintProvider`来管理

#### 1.1.8、util

util主要包含了一些排产过程中用到的工具类，比如时间转换的、调整库存的工具类、处理物料需求的工具类、任务匹配、生成任务、排产使用的日历、任务持续时长、任务校验相关的工具类。

## 二、jvs-aps-mgr

项目入口，controller

```
.
└── aps
    ├── JvsApsApplication.java
    ├── config
    │   ├── ContextHolderFilter.java
    │   └── UnifyExceptionHandler.java
    └── controller
        ├── IncomingMaterialOrderController.java
        ├── ManufactureBomController.java
        ├── MaterialController.java
        ├── PlanReportFieldSettingController.java
        ├── PlanningProductionOrderController.java
        ├── PlanningStrategyController.java
        ├── ProcessController.java
        ├── ProcessRouteController.java
        ├── ProductionOrderController.java
        ├── ProductionResourceController.java
        ├── ResourceCalendarController.java
        ├── ScheduleResultController.java
        ├── SmartSchedulingController.java
        ├── TaskAdjustController.java
        ├── TaskAssignmentController.java
        ├── TaskReportController.java
        ├── WorkCalendarController.java
        └── WorkModeController.java
```

