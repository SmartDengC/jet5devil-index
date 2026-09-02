---
title: 卷包产品级排产CP-SAT约束构建器设计说明 3
createTime: 2026/06/05 10:13:45
permalink: /article/x8o7i0kg/
tags:
  - aps
  - cpsat
---
# 卷包产品级排产 CP-SAT 约束构建器设计说明

## 1. 文档目的

本文用于说明卷包产品级排产在 `Java + OR-Tools CP-SAT` 中，如何围绕核心变量：

- `x[p,l,t]`
- `u[l,t]`
- `q[p,l,t]`
- `c[l,t]`
- `short[p]`
- `late[p]`

设计各类 `ConstraintBuilder`，并说明每类构建器在代码中通常负责哪些约束。

本文重点不是给出可直接运行的完整代码，而是提供一套稳定、可扩展的代码骨架设计思路，便于后续落地实现。

## 2. 核心变量回顾

在本文中，默认采用如下变量定义：

- `x[p,l,t]`
  表示产品 `p` 是否在产线 `l` 的时间桶 `t` 生产，类型为 `BoolVar`。
- `u[l,t]`
  表示产线 `l` 在时间桶 `t` 是否开机，类型为 `BoolVar`。
- `q[p,l,t]`
  表示产品 `p` 在产线 `l`、时间桶 `t` 的排产量，类型为 `IntVar`。
- `c[l,t]`
  表示产线 `l` 在 `t-1 -> t` 是否发生换牌，类型为 `BoolVar`。
- `short[p]`
  表示产品 `p` 在计划周期结束后的未完成量，类型为 `IntVar`。
- `late[p]`
  表示产品 `p` 在交期点的延期量或未完成量，类型为 `IntVar`。

## 3. ConstraintBuilder 统一接口

建议所有约束构建器实现统一接口，以保持整体结构一致：

```java
public interface ConstraintBuilder {
    void build(PackScheduleModelContext ctx);
}
```

统一接口的好处有：

- 总入口层调用方式一致
- 各类约束构建器边界清晰
- 便于按业务模块扩展
- 更容易做单元测试

## 4. AssignmentConstraintBuilder

### 4.1 职责

该构建器负责 `x` 与 `u` 的基础占用关系，主要表达“某条线某个时间桶到底能不能安排产品”。

### 4.2 典型约束

- 单线单桶最多一个产品
- 开机才允许生产

### 4.3 代码骨架示意

```java
public class AssignmentConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int l : problem.getLines()) {
            for (int t : problem.getBuckets()) {
                List<Literal> productAssignments = new ArrayList<>();

                for (int p : problem.getProducts()) {
                    BoolVar x = ctx.x(p, l, t);
                    if (x != null) {
                        productAssignments.add(x);
                    }
                }

                if (!productAssignments.isEmpty()) {
                    model.addLessOrEqual(LinearExpr.sum(productAssignments), 1);
                    model.addLessOrEqual(LinearExpr.sum(productAssignments), ctx.u(l, t));
                }
            }
        }
    }
}
```

### 4.4 业务含义

- `x` 决定“生产哪个产品”
- `u` 决定“该时间桶这条线是否开机”

二者配合后，模型才能表达“线开了，但这一桶最多只安排一个产品”。

## 5. CapacityConstraintBuilder

### 5.1 职责

该构建器负责 `q` 与 `x` 的联动关系，确保产量不会脱离产品选择和能力边界。

### 5.2 典型约束

- 产量受产品选择约束
- 产量受产线能力约束

### 5.3 代码骨架示意

```java
public class CapacityConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int p : problem.getProducts()) {
            for (int l : problem.getLines()) {
                for (int t : problem.getBuckets()) {
                    IntVar q = ctx.q(p, l, t);
                    BoolVar x = ctx.x(p, l, t);

                    if (q == null || x == null) {
                        continue;
                    }

                    int cap = problem.getCapacity(p, l, t);
                    model.addLessOrEqual(q, LinearExpr.term(x, cap));
                }
            }
        }
    }
}
```

### 5.4 业务含义

该构建器表达的是：

- 没选中产品时不能有产量
- 选中后产量也不能超过该线该桶的最大能力

若存在产品与机台不兼容的问题，通常可以在变量层直接固定 `x=0`，也可以在该构建器中补充对应限制。

## 6. DemandConstraintBuilder

### 6.1 职责

该构建器负责总需求与未完成量 `short[p]` 的守恒关系。

### 6.2 典型约束

- 产品总需求守恒
- 周期末欠产量定义

### 6.3 代码骨架示意

```java
public class DemandConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int p : problem.getProducts()) {
            List<IntVar> qtyVars = new ArrayList<>();

            for (int l : problem.getLines()) {
                for (int t : problem.getBuckets()) {
                    IntVar q = ctx.q(p, l, t);
                    if (q != null) {
                        qtyVars.add(q);
                    }
                }
            }

            IntVar shortVar = ctx.shortVar(p);
            LinearExpr produced = LinearExpr.sum(qtyVars.toArray(new IntVar[0]));
            model.addEquality(
                    LinearExpr.newBuilder()
                            .add(produced)
                            .add(shortVar)
                            .build(),
                    problem.getDemand(p)
            );
        }
    }
}
```

### 6.4 业务含义

该构建器表达的是：

- 产品需求总量要么被生产完成
- 要么在周期结束后落入 `short[p]`

这使得模型对计划完成率有明确责任边界。

## 7. CalendarConstraintBuilder

### 7.1 职责

该构建器负责时间窗口、设备可用性以及最大开台数相关约束。

### 7.2 典型约束

- 设备不可用时间桶禁止开机
- 同一时间桶开机数不能超过上限

### 7.3 代码骨架示意

```java
public class CalendarConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int l : problem.getLines()) {
            for (int t : problem.getBuckets()) {
                if (!problem.isAvailable(l, t)) {
                    model.addEquality(ctx.u(l, t), 0);
                }
            }
        }

        for (int t : problem.getBuckets()) {
            List<BoolVar> openVars = new ArrayList<>();
            for (int l : problem.getLines()) {
                openVars.add(ctx.u(l, t));
            }
            model.addLessOrEqual(
                    LinearExpr.sum(openVars.toArray(new BoolVar[0])),
                    problem.getMaxOpen(t)
            );
        }
    }
}
```

### 7.4 业务含义

该构建器表达的是：

- 维护、停机、保养、不上班的时间桶不得开机
- 同一时间桶的开台数不能突破车间组织和策略上限

这与现有“最大同时开台数”口径是直接一致的。

## 8. ChangeoverConstraintBuilder

### 8.1 职责

该构建器负责换牌变量 `c[l,t]` 的触发逻辑。

### 8.2 典型约束

- 相邻两个时间桶产品不同，则触发换牌

### 8.3 代码骨架示意

```java
public class ChangeoverConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int l : problem.getLines()) {
            for (int t : problem.getBuckets()) {
                if (t == problem.getFirstBucket()) {
                    continue;
                }

                BoolVar c = ctx.c(l, t);

                for (int p1 : problem.getProducts()) {
                    for (int p2 : problem.getProducts()) {
                        if (p1 == p2) {
                            continue;
                        }

                        BoolVar prev = ctx.x(p1, l, t - 1);
                        BoolVar curr = ctx.x(p2, l, t);

                        if (prev == null || curr == null) {
                            continue;
                        }

                        model.addGreaterOrEqual(
                                c,
                                LinearExpr.newBuilder()
                                        .add(prev)
                                        .add(curr)
                                        .addConstant(-1)
                                        .build()
                        );
                    }
                }
            }
        }
    }
}
```

### 8.4 业务含义

该构建器表达的是：

- 上一桶生产某产品
- 当前桶生产另一个产品
- 则本次切换视为一次换牌

首版建议先只建“是否换牌”，而不急于精细区分“从哪个产品切到哪个产品”的不同代价。  
后续若需要更精细的换牌时间矩阵，可扩展为 `y[p1,p2,l,t]` 变量体系。

## 9. DueDateConstraintBuilder

### 9.1 职责

该构建器负责交期欠量 `late[p]` 的定义。

### 9.2 典型约束

- 截止交期桶累计产量不足时，形成延期量

### 9.3 代码骨架示意

```java
public class DueDateConstraintBuilder implements ConstraintBuilder {

    @Override
    public void build(PackScheduleModelContext ctx) {
        CpModel model = ctx.getModel();
        PackScheduleProblem problem = ctx.getProblem();

        for (int p : problem.getProducts()) {
            int dueBucket = problem.getDueBucket(p);
            List<IntVar> dueQtyVars = new ArrayList<>();

            for (int l : problem.getLines()) {
                for (int t : problem.getBuckets()) {
                    if (t <= dueBucket) {
                        IntVar q = ctx.q(p, l, t);
                        if (q != null) {
                            dueQtyVars.add(q);
                        }
                    }
                }
            }

            IntVar lateVar = ctx.lateVar(p);
            int dueDemand = problem.getDueDemand(p);

            model.addGreaterOrEqual(
                    lateVar,
                    LinearExpr.newBuilder()
                            .addConstant(dueDemand)
                            .addTerm(LinearExpr.sum(dueQtyVars.toArray(new IntVar[0])), -1)
                            .build()
            );
        }
    }
}
```

### 9.4 业务含义

该构建器表达的是：

- 到交期桶为止
- 产品累计产量若低于交期要求
- 差额部分记入 `late[p]`

首版建议采用“允许延期但高惩罚”的思路，而不是一开始写成绝对零延期死约束。

## 10. StabilityConstraintBuilder

### 10.1 职责

该构建器主要用于重排场景，负责偏离原计划的扰动变量。

### 10.2 典型约束

- 若新方案与原计划不一致，则触发 `delta[p,l,t]`

### 10.3 说明

该构建器在首版主排产中可以先不落地，但建议在整体框架上预留位置。  
后续做以下场景时会非常重要：

- 紧急插单
- 设备故障重排
- 物料短缺局部调整

## 11. 对 ConstraintBuilder 的工程建议

### 11.1 每个构建器只依赖 `ctx`

`ConstraintBuilder` 内部不建议直接：

- 查数据库
- 解析日期
- 转换 DTO
- 编排业务对象

推荐原则是：

- Builder 只读取 `ctx` 和 `problem`
- Builder 只负责向 `model` 中添加约束

### 11.2 一个 Builder 只负责一类业务规则

判断一个构建器是否拆分合理，可以看以下标准：

- 是否围绕同一组变量展开
- 是否表达的是同一类业务规则
- 是否能够独立测试

例如：

- `AssignmentConstraintBuilder` 主要围绕 `x/u`
- `CapacityConstraintBuilder` 主要围绕 `q/x`
- `DemandConstraintBuilder` 主要围绕 `q/short`
- `CalendarConstraintBuilder` 主要围绕 `u`
- `ChangeoverConstraintBuilder` 主要围绕 `x/c`
- `DueDateConstraintBuilder` 主要围绕 `q/late`

若一个构建器同时处理：

- 交期
- 换牌
- 可用窗口
- 需求守恒

通常说明拆分还不够清晰。

## 12. ModelContext 的推荐访问方式

为了让每个构建器写起来统一且简洁，建议在 `PackScheduleModelContext` 中提供统一访问方法。

```java
public class PackScheduleModelContext {
    private final CpModel model;
    private final PackScheduleProblem problem;
    private final Map<ProductLineBucketKey, BoolVar> xVars;
    private final Map<LineBucketKey, BoolVar> uVars;
    private final Map<ProductLineBucketKey, IntVar> qVars;
    private final Map<LineBucketKey, BoolVar> cVars;
    private final Map<Integer, IntVar> shortVars;
    private final Map<Integer, IntVar> lateVars;

    public BoolVar x(int p, int l, int t) { ... }
    public BoolVar u(int l, int t) { ... }
    public IntVar q(int p, int l, int t) { ... }
    public BoolVar c(int l, int t) { ... }
    public IntVar shortVar(int p) { ... }
    public IntVar lateVar(int p) { ... }
}
```

这样所有构建器都能共享统一写法，降低重复代码和键值拼装错误的风险。

## 13. 约束构建串联方式

主流程中，通常按以下顺序串联各类构建器：

```java
variableBuilder.build(ctx);

assignmentConstraintBuilder.build(ctx);
capacityConstraintBuilder.build(ctx);
demandConstraintBuilder.build(ctx);
calendarConstraintBuilder.build(ctx);
changeoverConstraintBuilder.build(ctx);
dueDateConstraintBuilder.build(ctx);

objectiveBuilder.build(ctx);
```

这套顺序的含义是：

- 先创建全部变量
- 再依次补资源、能力、需求、时间窗口、换牌和交期约束
- 最后统一构建目标函数

## 14. 总结

围绕 `x/u/q/c/short/late` 这套变量设计 `ConstraintBuilder` 时，最重要的原则不是代码有多短，而是职责是否清晰。

推荐映射关系如下：

- `AssignmentConstraintBuilder` 管 `x/u`
- `CapacityConstraintBuilder` 管 `q/x`
- `DemandConstraintBuilder` 管 `q/short`
- `CalendarConstraintBuilder` 管 `u`
- `ChangeoverConstraintBuilder` 管 `x/c`
- `DueDateConstraintBuilder` 管 `q/late`

这样的拆分方式，最适合卷包产品级排产这种业务规则复杂、后续还会持续扩展的场景，也最利于后续继续增加：

- 多策略目标
- 局部重排
- 插单处理
- 更多工艺约束
