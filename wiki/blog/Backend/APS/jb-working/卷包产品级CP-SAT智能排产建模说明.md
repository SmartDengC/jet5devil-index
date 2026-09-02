---
title: 卷包产品级CP-SAT智能排产建模说明
createTime: 2026/06/08 17:49:39
permalink: /article/xn3pear3/
tags:
  - aps
---
# 卷包产品级 CP-SAT 智能排产建模说明

---

> 参考文档体例：`建模论文_生产线智能调度与瓶颈优化模型`  
> 对应代码入口：`TSchedulePlanVersionController.cpSatSchedule`  
> 实际求解主链路：`TSchedulePlanVersionAppService.cpSatSchedule` + `schedule/cpsat` 包

---

## 摘要

本文针对卷包生产场景中的产品级智能排产问题，基于项目中 `cpSatSchedule` 相关代码逻辑，建立了一套“产品-机组-时间桶”三维离散优化模型。该模型以剩余需求、交期、机组日历、开台上限、换牌控制与负载均衡为核心约束和优化对象，将业务侧排产数据标准化后交由 OR-Tools 的 CP-SAT 求解器进行计算，并输出日级排产方案。

与传统工序级作业车间调度模型不同，当前模型并不追求单件工序的开始时刻与结束时刻排序，而是将问题抽象为“某物料是否在某机组某工作日生产、生产多少”的组合优化问题，因此更适用于卷包业务按日排产、按机组开台、按产品切换控制的实际场景。

在建模过程中，系统首先提取各物料的剩余需求量与交期，收集有效工作日并离散化为日级时间桶，然后依据机组实际工时和产品产能换算形成能力矩阵；随后定义是否生产、是否开机、生产数量、欠产量、延期量、换牌量和机组总负载等变量，并建立单线单日单产品、能力上界、需求守恒、交期达成、日历可用、最大开台数及换牌触发等约束；最后以欠产、延期、换牌、开机数和负载跨度的加权和作为单目标函数进行求解。

该模型本质上是一个带软约束惩罚的整数规划模型。当前版本已具备较好的工程可落地性，可直接服务于卷包产品级 APS 智能排产，同时也为后续扩展换牌时间折损、跨月连续生产偏好、分批交付、多时段滚动重排等高级能力提供了清晰的模型骨架。

**关键词：** CP-SAT；整数规划；卷包排产；产品级调度；交期约束；换牌控制；负载均衡

---

## 一、问题重述

### 1.1 业务背景

卷包生产排产并非简单地将订单顺序依次下发，而是在有限机组资源、有限工作日历和多物料并存的条件下，决定不同物料在不同机组、不同日期上的生产分配方案。该过程需要同时考虑：

- 物料计划量与已排产量之间的剩余缺口；
- 各物料的交期要求；
- 各机组在不同日期的开台状态和有效工时；
- 不同机组对不同物料的实际产能差异；
- 每天允许同时开机的机组数量上限；
- 连续生产偏好与切换换牌成本；
- 多机组之间的负载均衡性。

### 1.2 问题目标

结合代码实现，`cpSatSchedule` 的目标可以概括为：

1. 在有效排产期内，为有剩余需求的物料分配合适的机组与工作日。
2. 在满足日历与能力约束的前提下，尽量完成全部需求并降低延期。
3. 尽量减少机组换牌次数与开机数量。
4. 尽量缩小不同机组之间的总负载差异。
5. 输出可直接落库的日级排产明细。

---

## 二、问题分析

### 2.1 模型类型分析

从代码逻辑可见，该模型不是经典的工序级 Job Shop 或 Flow Shop 排序模型，而是一个更贴近业务执行层的：

**多产品、多机组、多日期桶的离散产量分配优化模型**

其关键特征如下：

- 时间维度采用“日级时间桶”，而非分钟级连续时间。
- 决策核心是“生产与否”和“生产数量”，而不是工序先后次序。
- 交期、换牌、开机数、负载均衡以软约束惩罚形式进入目标函数。
- 求解结果直接对应业务排产明细，具备较强工程落地性。

### 2.2 总体求解思路

模型求解流程可抽象为：

```text
排产版本/策略/订单/机组日历/产能数据
            ↓
     提取剩余需求、交期、有效工作日
            ↓
  构建标准化输入 PackScheduleProblem
            ↓
  建立变量、约束与加权单目标函数
            ↓
      调用 OR-Tools CP-SAT 求解
            ↓
      映射为日级排产明细并落库
```

---

## 三、模型假设与符号说明

### 3.1 基本假设

1. 排产时间离散为“日级时间桶”，同一天内不再细分小时级工序顺序。
2. 同一机组在同一工作日最多只生产一种物料。
3. 某物料在某机组某日的排产量不超过该机组该日对该物料的最大可产量。
4. 停机日、无工时日或不可用日历对应的机组-日期组合不可排产。
5. 所有排产量在进入求解器前均做整数缩放处理，避免浮点建模误差。
6. 交期风险以“交期前累计未满足量”衡量，并通过延期变量惩罚。
7. 当前版本换牌只建模为切换惩罚，不直接扣减当日工时。
8. 上月连续生产信息、优选机台偏好和换牌时长矩阵已纳入输入，但本版本未全部转化为显式强约束。

### 3.2 符号说明

| 符号 | 含义 |
|------|------|
| $\(p \in P\)$ | 物料/产品集合 |
| \(l \in L\) | 机组集合 |
| \(t \in T\) | 日级时间桶集合 |
| \(D_p\) | 物料 \(p\) 的剩余需求量 |
| \(Cap_{p,l,t}\) | 物料 \(p\) 在机组 \(l\)、日期 \(t\) 的最大可产量 |
| \(A_{l,t}\) | 机组 \(l\) 在日期 \(t\) 是否可用 |
| \(M_t\) | 日期 \(t\) 的最大允许开台数 |
| \(d_p\) | 物料 \(p\) 的交期对应桶索引 |
| \(x_{p,l,t}\) | 物料 \(p\) 是否在机组 \(l\)、日期 \(t\) 生产 |
| \(u_{l,t}\) | 机组 \(l\) 在日期 \(t\) 是否开机 |
| \(q_{p,l,t}\) | 物料 \(p\) 在机组 \(l\)、日期 \(t\) 的排产量 |
| \(c_{l,t}\) | 机组 \(l\) 在日期 \(t\) 是否发生换牌 |
| \(short_p\) | 物料 \(p\) 周期结束时的欠产量 |
| \(late_p\) | 物料 \(p\) 截止交期的延期量 |
| \(load_l\) | 机组 \(l\) 的总排产量 |
| \(maxLoad\) | 所有机组总排产量的最大值 |
| \(minLoad\) | 所有机组总排产量的最小值 |

---

## 四、数据预处理与标准化建模输入

### 4.1 剩余需求提取

代码中首先依据计划量与已排产量，提取每个物料的剩余需求：

\[
\begin{aligned}
D_p = \max \left( 0,\; PlanQty_p - ScheduledQty_p \right)
\end{aligned}
\]

仅当 \(D_p > 0\) 时，该物料才进入本轮优化模型。若全部物料需求均已满足，则直接返回空方案。

### 4.2 工作日离散化

系统从机组开台计划中收集满足以下条件的日期：

- 非停机；
- 日历工时大于 0；
- 不早于排产开始日。

随后按日期升序排序，构成日级时间桶集合 \(T\)。

### 4.3 产能矩阵构建

对于每个机组-物料组合，系统先得到“单位工时产量”，再结合该日有效工时，换算成日级最大产能：

\[
\begin{aligned}
Cap_{p,l,t}
= \left\lfloor
UnitCap_{p,l} \cdot WorkHours_{l,t} \cdot Scale
\right\rfloor
\end{aligned}
\]

其中 `Scale = 1000`，用于将业务中的小数量统一缩放为整数。

### 4.4 可行性预校验

若某物料存在剩余需求，但在有效排产期内不存在任何“有能力且可开机”的候选机组，则模型直接报错，提示该物料在有效排产期内没有可用机台。

---

## 五、决策变量设计

### 5.1 二元变量

是否在机组 \(l\)、日期 \(t\) 生产物料 \(p\)：

\[
\begin{aligned}
x_{p,l,t} \in \{0,1\}, \qquad \forall p \in P,\; l \in L,\; t \in T
\end{aligned}
\]

机组 \(l\) 在日期 \(t\) 是否开机：

\[
\begin{aligned}
u_{l,t} \in \{0,1\}, \qquad \forall l \in L,\; t \in T
\end{aligned}
\]

机组 \(l\) 在日期 \(t\) 是否发生换牌：

\[
\begin{aligned}
c_{l,t} \in \{0,1\}, \qquad \forall l \in L,\; t \in T
\end{aligned}
\]

### 5.2 整数变量

日级排产量：

\[
\begin{aligned}
0 \le q_{p,l,t} \le Cap_{p,l,t},
\qquad \forall p \in P,\; l \in L,\; t \in T
\end{aligned}
\]

欠产量：

\[
\begin{aligned}
0 \le short_p \le D_p, \qquad \forall p \in P
\end{aligned}
\]

延期量：

\[
\begin{aligned}
0 \le late_p \le D_p, \qquad \forall p \in P
\end{aligned}
\]

机组总负载：

\[
\begin{aligned}
load_l = \sum_{p \in P} \sum_{t \in T} q_{p,l,t},
\qquad \forall l \in L
\end{aligned}
\]

并进一步定义最大负载与最小负载：

\[
\begin{aligned}
maxLoad &= \max_{l \in L} load_l, \\
minLoad &= \min_{l \in L} load_l
\end{aligned}
\]

---

## 六、约束条件构建

### 6.1 单机组单日单产品约束

同一机组在同一时间桶最多安排一个物料：

\[
\begin{aligned}
\sum_{p \in P} x_{p,l,t} \le 1,
\qquad \forall l \in L,\; t \in T
\end{aligned}
\]

该约束对应代码中的 `AssignmentConstraintBuilder`。

### 6.2 指派与开机关联约束

若机组未开机，则不允许生产任何物料：

\[
\begin{aligned}
\sum_{p \in P} x_{p,l,t} \le u_{l,t},
\qquad \forall l \in L,\; t \in T
\end{aligned}
\]

这保证了“有生产必有开机”。

### 6.3 产量与能力绑定约束

当某机组某日未选择生产某物料时，该物料排产量必须为 0；若被选择，则排产量不超过该日能力上界：

\[
\begin{aligned}
q_{p,l,t} \le Cap_{p,l,t} \cdot x_{p,l,t},
\qquad \forall p \in P,\; l \in L,\; t \in T
\end{aligned}
\]

该约束对应 `CapacityConstraintBuilder`。

### 6.4 需求守恒约束

对每个物料，总排产量与欠产量之和必须等于总需求：

\[
\begin{aligned}
\sum_{l \in L} \sum_{t \in T} q_{p,l,t} + short_p = D_p,
\qquad \forall p \in P
\end{aligned}
\]

即模型允许“未完成”，但必须把未完成量显式记录为欠产变量。该约束对应 `DemandConstraintBuilder`。

### 6.5 日历可用性约束

若机组 \(l\) 在日期 \(t\) 不可用，则强制不开机：

\[
\begin{aligned}
u_{l,t} = 0,
\qquad \forall (l,t) \in L \times T \text{ with } A_{l,t} = 0
\end{aligned}
\]

该约束体现了停机、无工时日不可排产。对应 `CalendarConstraintBuilder`。

### 6.6 每日最大开台数约束

对于任意日期 \(t\)，同时开机机组数不超过策略中给定的开台上限：

\[
\begin{aligned}
\sum_{l \in L} u_{l,t} \le M_t,
\qquad \forall t \in T
\end{aligned}
\]

这是一类典型的日资源总量约束。

### 6.7 交期约束

设物料 \(p\) 的交期对应桶索引为 \(d_p\)，则截止交期的累计产量与延期量之和至少覆盖交期需求：

\[
\begin{aligned}
\sum_{l \in L} \sum_{t \le d_p} q_{p,l,t} + late_p \ge D_p,
\qquad \forall p \in P
\end{aligned}
\]

由于目标函数会最小化 \(late_p\)，因此该变量可以解释为“交期前无法完成的缺口量”。该约束对应 `DueDateConstraintBuilder`。

### 6.8 换牌触发约束

若同一机组在相邻两个时间桶中生产了不同物料，则必须触发换牌变量：

\[
\begin{aligned}
x_{p,l,t-1} = 1,\; x_{p',l,t} = 1,\; p \ne p'
\;\Rightarrow\; c_{l,t} = 1
\end{aligned}
\]

代码中通过布尔析取逻辑实现：

\[
\begin{aligned}
\neg x_{p,l,t-1} \;\lor\; \neg x_{p',l,t} \;\lor\; c_{l,t}
\end{aligned}
\]

并对首个时间桶设置：

\[
\begin{aligned}
c_{l,0} = 0, \qquad \forall l \in L
\end{aligned}
\]

该约束对应 `ChangeoverConstraintBuilder`。

### 6.9 机组负载均衡辅助约束

定义每条机组的总排产量：

\[
\begin{aligned}
load_l = \sum_{p \in P} \sum_{t \in T} q_{p,l,t},
\qquad \forall l \in L
\end{aligned}
\]

再定义：

\[
\begin{aligned}
maxLoad &= \max_{l \in L} load_l, \\
minLoad &= \min_{l \in L} load_l
\end{aligned}
\]

其目的是在目标函数中最小化 \(maxLoad - minLoad\)，以压缩机组负载差异。该约束对应 `WorkloadConstraintBuilder`。

---

## 七、目标函数设计

当前系统采用**单目标加权求和**方式，将多个业务目标统一折算为一个优化目标：

\[
\begin{aligned}
\min \; Z
=\;&
w_1 \sum_{p \in P} short_p
+ w_2 \sum_{p \in P} late_p \\
&+ w_3 \sum_{l \in L} \sum_{t \in T} c_{l,t}
+ w_4 \sum_{l \in L} \sum_{t \in T} u_{l,t} \\
&+ w_5 \left( maxLoad - minLoad \right)
\end{aligned}
\]

其中：

- \(w_1\)：欠产惩罚权重；
- \(w_2\)：交期延期惩罚权重；
- \(w_3\)：换牌惩罚权重；
- \(w_4\)：开机数量惩罚权重；
- \(w_5\)：负载均衡惩罚权重。

### 7.1 权重业务含义

从代码默认值可看出，当前模型的优化优先级大体为：

1. 优先满足需求；
2. 优先降低交期违约；
3. 尽量减少换牌；
4. 尽量减少开机数；
5. 尽量均衡机组负载。

对应默认权重口径大致为：

- 欠产：`1000`，若策略要求必须满足需求，则提升到 `10000`
- 交期：`1000`
- 换牌：`500 + 300`
- 开机数：`50`
- 负载均衡：`30`

因此该模型本质上是一种“以需求达成为最高优先级”的加权惩罚型优化模型。

---

## 八、求解方法与代码实现链路

### 8.1 求解器选择

模型采用 Google OR-Tools 的 `CP-SAT` 求解器。该求解器适合处理：

- 0-1 决策变量；
- 整数产量变量；
- 线性约束；
- 带逻辑关系的布尔约束；
- 多个软约束加权组合而成的目标函数。

### 8.2 代码求解主链路

系统中的 CP-SAT 排产主链路可概括为：

1. `TSchedulePlanVersionController.cpSatSchedule` 接收排产请求；
2. `TSchedulePlanVersionAppService.cpSatSchedule` 初始化版本数据并汇总基础输入；
3. `PackScheduleProblemBuilder` 将业务数据标准化为 `PackScheduleProblem`；
4. `PackScheduleVariableBuilder` 建立变量；
5. 各 `ConstraintBuilder` 逐类叠加约束；
6. `PackScheduleObjectiveBuilder` 构造加权目标函数；
7. `PackScheduleCpSatService` 配置并调用求解器；
8. `PackScheduleSolutionMapper` 将求解结果映射为业务可读结果；
9. `persistCpSatSchedule` 将排产明细落库并回写已排产量。

### 8.3 求解参数

当前默认求解配置为：

- 最大求解时间：`60` 秒
- 并行搜索线程数：`4`
- 是否输出搜索日志：`false`

当求解状态既不是 `OPTIMAL` 也不是 `FEASIBLE` 时，系统视为求解失败并抛出异常。

---

## 九、结果输出解释

### 9.1 排产明细输出

模型求解后，仅保留排产量大于 0 的组合，输出为日级排产记录，主要字段包括：

- `workDay`
- `machineId`
- `matId`
- `planQty`
- `workHours`

随后系统将其转换为 `TSchedulePlanDetail` 业务对象，并补齐计划开始时间、结束时间、班次起止时间等信息。

### 9.2 评价指标输出

系统同时统计以下指标，用于衡量方案质量：

- `objectiveValue`：目标函数值
- `unfulfilledQty`：总欠产量
- `lateQty`：总延期量
- `changeoverCount`：换牌次数
- `openLineCount`：开机数量
- `loadSpreadQty`：最大负载与最小负载之差

这些指标既可用于前端展示，也可用于策略调优和模型对比分析。

---

## 十、模型特点与局限性分析

### 10.1 模型特点

当前模型具有以下优点：

- 建模对象清晰，直接面向卷包产品级日排产；
- 数据标准化与求解建模分层明确，工程结构清晰；
- 兼顾需求、交期、换牌、开机与均衡等多个业务目标；
- 求解结果天然可回写数据库，具备较强系统落地能力；
- 后续便于继续扩展更多策略与约束。

### 10.2 当前局限性

尽管模型已具备实用性，但从代码看仍存在一些尚未完全深化的部分：

1. `changeoverTimes` 已进入问题输入，但尚未按真实换牌时长扣减可用工时。
2. `preferredLinesByProduct` 已构建，但尚未形成优选机台偏好约束或奖励项。
3. `lastMonthProduction` 已进入模型输入，但尚未正式转化为跨周期连续性约束。
4. 当前粒度为日级，尚不支持同机组同日多次切换生产。
5. 交期建模目前以总需求口径处理，尚未细化到分批次交付需求。

因此，当前版本更准确地说是：

**卷包产品级、日粒度、带交期与换牌惩罚的 CP-SAT 智能排产模型。**

---

## 十一、结论与后续扩展方向

综合代码逻辑分析，`cpSatSchedule` 对应的并不是传统的工序级精细排序模型，而是一套适用于卷包场景的产品级智能排产整数优化模型。该模型通过“产品-机组-时间桶”的离散表达，把业务中最关键的需求满足、交期达成、开台控制、换牌抑制和负载均衡问题统一纳入 CP-SAT 求解框架，能够生成可直接执行和落库的日级排产方案。

从建模角度看，该方案已经具备较完整的工业化基础。后续可沿以下方向继续扩展：

1. 将换牌时间显式计入产能损失模型；
2. 将连续生产偏好改造成硬约束或更强的软约束；
3. 将交期从“总需求截止”拓展到“分批需求截止”；
4. 将时间粒度从“日”细化到“班次”或“时段”；
5. 引入插单、停机、故障等动态扰动，演进为滚动重排模型；
6. 结合瓶颈识别指标，进一步形成“排产 + 瓶颈优化”一体化模型。

该文档可作为当前 `cpSatSchedule` 方法的建模抽象说明，也可作为后续卷包 APS 智能排产模型持续演进的基础文档。
