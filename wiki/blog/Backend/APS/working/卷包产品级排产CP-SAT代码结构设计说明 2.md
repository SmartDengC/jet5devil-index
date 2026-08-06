---
title: 卷包产品级排产CP-SAT代码结构设计说明 2
createTime: 2026/06/05 09:53:39
permalink: /article/gwy7mq7z/
tags:
  - aps
  - cpsat
---
# 卷包产品级排产 CP-SAT 代码结构设计说明

## 1. 文档目的

本文用于说明卷包产品级排产在 `Java + OR-Tools CP-SAT` 中，约束代码通常应该如何组织。

重点不是某一条公式怎么写，而是如何避免把数据准备、变量定义、约束构建、目标函数、求解和结果回填全部堆进一个大类中，导致后期难以演进。

推荐的整体结构是：

`数据准备 -> 模型上下文 -> 变量构建 -> 约束构建 -> 目标构建 -> 求解 -> 结果回填`

## 2. 总体设计原则

在 `Java + OR-Tools CP-SAT` 中，官方建模入口本身较为简单，核心类主要包括：

- `Loader.loadNativeLibraries()`
- `CpModel`
- `CpSolver`
- `BoolVar`
- `IntVar`

真正影响工程质量的关键，不在于是否会调用这些类，而在于代码如何分层。

推荐遵循以下原则：

- 业务数据与求解模型分离
- 变量创建与约束创建分离
- 硬约束与目标函数分离
- 求解过程与结果映射分离
- 模型主流程与具体约束实现分离

## 3. 推荐的七层结构

### 3.1 Solver Facade：总入口层

这一层负责组织一次完整排产求解流程，但不应直接编写具体约束公式。

推荐类名示例：

- `PackPlanCpSatService`
- `ProductScheduleSolverFacade`

这一层通常只负责：

1. 接收业务入参
2. 调用数据整理器生成标准模型输入
3. 创建 `CpModel`
4. 调用变量构建器
5. 调用约束构建器
6. 调用目标构建器
7. 配置 `CpSolver`
8. 执行求解并返回结果

### 3.2 Problem Input：标准化输入层

该层负责将数据库实体、业务对象、日期和浮点量，整理成适合建模的标准输入对象。

推荐类名示例：

- `PackScheduleProblem`

建议该对象中包含：

- 产品集合 `products`
- 产线集合 `lines`
- 时间桶集合 `buckets`
- 需求量 `demand[p]`
- 能力矩阵 `cap[p][l][t]`
- 兼容矩阵 `compatible[p][l]`
- 可用矩阵 `available[l][t]`
- 开台上限 `maxOpen[t]`
- 交期映射 `dueBucket[p]`
- 原计划映射 `baseline[p][l][t]`

这一层的目标是让 `CpModel` 不直接面对数据库实体，而是只处理整数化、索引化后的标准输入。

### 3.3 Model Context：模型上下文层

该层用于统一保存模型对象、问题输入对象以及所有已创建变量，是整个建模过程的共享上下文。

推荐类名示例：

- `PackScheduleModelContext`

该对象通常包含：

- `CpModel model`
- `PackScheduleProblem problem`
- `Map<Key, BoolVar> xVars`
- `Map<Key, BoolVar> uVars`
- `Map<Key, IntVar> qVars`
- `Map<Key, BoolVar> cVars`
- `Map<Product, IntVar> shortVars`
- `Map<Product, IntVar> lateVars`

同时建议提供以下访问方法，降低后续约束构建的重复代码：

- `x(p,l,t)`
- `u(l,t)`
- `q(p,l,t)`
- `c(l,t)`

### 3.4 Variable Builder：变量构建层

这一层专门负责创建变量，不负责创建约束。

推荐类名示例：

- `PackScheduleVariableBuilder`

职责包括：

- 创建 `x[p,l,t]`
- 创建 `u[l,t]`
- 创建 `q[p,l,t]`
- 创建 `c[l,t]`
- 创建 `short[p]`
- 创建 `late[p]`

这一层只做两件事：

- 决定变量是否存在
- 决定变量上下界

例如：

- 不兼容的 `x[p,l,t]` 可直接不创建，或创建为固定 `0`
- 不可用时间桶的 `u[l,t]` 可直接固定为 `0`
- `q[p,l,t]` 的上界可直接设置为 `cap[p,l,t]`

### 3.5 Constraint Builders：约束构建层

这是建模的核心层，但不建议将所有约束写在一个类中，而应按业务模块拆分。

推荐拆分类如下：

- `AssignmentConstraintBuilder`
- `CapacityConstraintBuilder`
- `DemandConstraintBuilder`
- `CalendarConstraintBuilder`
- `ChangeoverConstraintBuilder`
- `DueDateConstraintBuilder`
- `StabilityConstraintBuilder`

各类职责建议如下：

#### AssignmentConstraintBuilder

负责资源占用与开机关联类约束，例如：

- 单线单桶单产品
- 开机才允许生产

#### CapacityConstraintBuilder

负责工艺能力与生产能力类约束，例如：

- 产量受能力限制
- 产品与机台兼容性限制

#### DemandConstraintBuilder

负责计划完成类约束，例如：

- 产品总需求守恒
- 周期末欠量计算

#### CalendarConstraintBuilder

负责时间窗口和产线可用性相关约束，例如：

- 设备不可用时禁止开机
- 同一时间桶最大开台数限制

#### ChangeoverConstraintBuilder

负责换牌触发和换牌关联约束，例如：

- 相邻时间桶产品不同则触发换牌变量

#### DueDateConstraintBuilder

负责交期相关约束，例如：

- 截止某个交期桶累计产量不足则形成延期量

#### StabilityConstraintBuilder

负责重排稳定性相关约束，例如：

- 与原计划偏离时触发扰动变量

### 3.6 Objective Builder：目标构建层

目标函数也应独立，不建议散落在各个约束类中。

推荐类名示例：

- `PackScheduleObjectiveBuilder`

这一层负责组合各种惩罚项，例如：

- `unfulfilledPenalty * sum(short[p])`
- `latePenalty * sum(late[p])`
- `changeoverPenalty * sum(c[l,t])`
- `openLinePenalty * sum(u[l,t])`
- `balancePenalty * imbalanceExpr`
- `stabilityPenalty * sum(delta[p,l,t])`

职责边界建议如下：

- 约束构建层负责“能不能这样排”
- 目标构建层负责“这样排好不好”

### 3.7 Solver Config 与 Solution Mapper：求解配置与结果映射层

最后建议单独拆出两部分。

#### Solver Config

建议统一管理：

- 最大求解时间
- 并行线程数
- 是否输出求解日志
- 是否仅求可行解
- 正常排产与重排场景的时间限制差异

#### Solution Mapper

推荐类名示例：

- `PackScheduleSolutionMapper`

负责将求解器输出的变量值转回业务结果，例如：

- 哪条线哪个时间桶生产哪个产品
- 该桶产量多少
- 交期欠量多少
- 换牌次数多少
- 目标值和求解状态是什么

## 4. 推荐的目录结构

如果后续在 `factory-production` 中落地一个独立的 CP-SAT 求解模块，推荐结构如下：

```text
schedule/cpsat/
  PackScheduleCpSatService.java
  PackScheduleProblem.java
  PackScheduleModelContext.java
  PackScheduleVariableBuilder.java
  PackScheduleObjectiveBuilder.java
  PackScheduleSolutionMapper.java
  constraint/
    AssignmentConstraintBuilder.java
    CapacityConstraintBuilder.java
    DemandConstraintBuilder.java
    CalendarConstraintBuilder.java
    ChangeoverConstraintBuilder.java
    DueDateConstraintBuilder.java
    StabilityConstraintBuilder.java
  model/
    ProductKey.java
    LineBucketKey.java
    ProductLineBucketKey.java
  result/
    PackScheduleSolution.java
    PackScheduleLineTask.java
```

该结构的优点是：

- 新增约束时不需要修改总入口
- 调整目标权重时不需要影响变量层
- 后续扩展插单、重排或更多业务约束时更容易复用
- 若未来从 `OR-Tools` 切换到其他求解器，也能保留大部分输入、上下文和结果层

## 5. 主流程伪代码

整体主流程建议如下：

```java
Loader.loadNativeLibraries();

PackScheduleProblem problem = problemBuilder.build(input);
PackScheduleModelContext ctx = new PackScheduleModelContext(new CpModel(), problem);

variableBuilder.build(ctx);

assignmentConstraintBuilder.build(ctx);
capacityConstraintBuilder.build(ctx);
demandConstraintBuilder.build(ctx);
calendarConstraintBuilder.build(ctx);
changeoverConstraintBuilder.build(ctx);
dueDateConstraintBuilder.build(ctx);
stabilityConstraintBuilder.build(ctx);

objectiveBuilder.build(ctx);

CpSolver solver = solverFactory.create(config);
CpSolverStatus status = solver.solve(ctx.getModel());

PackScheduleSolution solution = solutionMapper.map(ctx, solver, status);
return solution;
```

该流程的意义在于：

- 先准备标准问题输入
- 再统一创建变量
- 再按模块叠加约束
- 最后统一构建目标、求解并映射结果

## 6. 结合卷包产品级排产的设计建议

对于卷包产品级排产，最不推荐的做法是将以下内容全部放入同一个大类中：

- 数据查询
- 变量创建
- 约束公式
- 目标函数
- 求解参数
- 结果落库

这种方式在前期虽然开发速度快，但后续会面临以下问题：

- 约束之间耦合严重
- 调整局部逻辑容易影响全局
- 新增目标函数或重排逻辑风险高
- 难以进行单元测试和模块复用

更稳妥的做法是将 CP-SAT 看作一个独立求解引擎模块，与应用层、领域层尽量解耦。

## 7. 总结

在 `Java + OR-Tools CP-SAT` 中，约束代码的最佳组织方式，不是围绕“某个大 service”堆积，而是围绕建模职责分层：

- 输入标准化
- 模型上下文
- 变量构建
- 约束构建
- 目标构建
- 求解配置
- 结果映射

这样的结构更适合卷包产品级排产这种约束复杂、后续还会持续演进的场景，也更有利于后续扩展：

- 多策略切换
- 局部重排
- 插单处理
- 求解器替换
- 单元测试与性能调优
