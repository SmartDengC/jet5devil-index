---
title: 项目解读：jvs-aps
createTime: 2025/05/10 19:42:46
permalink: /java/1ukxjgg9/
---

项目是关于智能排产的。

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

