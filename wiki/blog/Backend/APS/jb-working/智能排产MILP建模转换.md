---
title: 智能排产MILP建模转换
createTime: 2026/08/11 15:46:52
permalink: /article/b69krv3m/
tags:
  - aps
---
# 智能排产 MILP 建模转换

本文把《智能排产约束体系》中的数学建模语言转换为当前项目可直接使用的排产建模语言。目标是新增独立 `MILP` 引擎时，与现有 CP-SAT 的变量、输入、日志和结果口径保持一致。

## 1. 建模口径

当前项目只处理卷包车间内的产线排产，不再建模工厂维度。因此 PDF 中的工厂下标 `f` 全部删除。

| PDF 符号 | PDF 含义 | 项目统一符号 | 项目含义 |
| --- | --- | --- | :-: |
| `f` | 工厂 | 删除 | 当前版本、车间上下文已限定范围 |
| `m` | 机台 | `l` | 产线 / 机组，来自 `PackScheduleLine.lineId` |
| `p` | 牌号 | `p` | 产品 / 牌号 / 物料，来自 `PackScheduleProduct.productId` |
| `t` | 日期 | `t` | 时间桶，来自 `PackScheduleBucket.index` |
| `M_f` | 工厂机台集合 | `L` | 产线集合 |
| `P` | 牌号集合 | `P` | 产品集合 |
| `T` | 排产日期集合 | `B` | 时间桶集合 |

后续 MILP 包内应继续使用 `q/x/u` 这套项目命名，不再使用 PDF 的 `x/z/b`，避免和 CP-SAT 现有变量混淆。

## 2. 数据参数转换

| PDF 参数 | 去工厂后 | 项目数据来源 | 说明 |
| --- | --- | :-: | :-: |
| `Q_p` | `demand[p]` | `PackScheduleProduct.demandScaled` | 产品待排产总量 |
| `a_fmp` | `allowed[p,l]` | `capacity[p,l,t] > 0` | 允许生产不单独建表，正产能即允许 |
| `c_fmp` | `unitCapacity[l,p]` | `PackScheduleProblem.unitCapacityByLineProduct` | 单位时间产能 |
| `H_fmt` | `workHours[l,t]` | `PackScheduleProblem.workHoursByKey` | 时间桶有效可用工时 |
| `Nmax_ft` | `maxOpen[t]` | `PackScheduleProblem.maxOpenByBucket` | 同一时间桶最大开台数 |
| `Tchg_fmpq` | `changeoverTime[p,q]` | `PackScheduleProblem.changeoverTimes` | 换牌时间，当前不区分产线 |
| `Cchg_fmpq` | `changeoverCost[p,q]` | 暂用 `changeoverTime[p,q]` | 未维护成本时，用换牌时间代替 |
| `p0_fm` | `lastProduct[l]` | `PackScheduleProblem.lastMonthProduction` | 上月末产线结束产品 |
| `pi_fmp` | `priority[l,p]` | `ScheduleBasicDataBo.equGroupBrandPriorityMap` | 数值越小越优先 |
| `Gsync` | `syncLineGroups` | 现有 `syncMachineCount` 或后续分组输入 | 齐开齐停分组 |
| `G_w` | `feederLineGroups` | `TEquConnectionAppService.getResourceNodeGroupByShopId` | 喂丝机连接产线组 |
| `Ddue_pt` | `dueDemand[p,t]` | 订单交期换算 | 累计交付检查点 |

物料累计可用相关参数 `K`、`C_fpkr(t)`、`A_fpkr,t`、`S0_fpkr`、安全余量暂不进入第一版 MILP。

## 3. 决策变量转换

| PDF 变量 | 项目统一变量 | 类型 | 含义 |
| --- | --- | --- | --- |
| `x_fmpt` | `q[p,l,t]` | `IntVar >= 0` | 产品 `p` 在产线 `l`、时间桶 `t` 的排产量 |
| `z_fmpt` | `x[p,l,t]` | `BoolVar` | 产品 `p` 是否在产线 `l`、时间桶 `t` 生产 |
| `b_fmt` | `u[l,t]` | `BoolVar` | 产线 `l` 在时间桶 `t` 是否开机 |
| `y_fmpqt` | `change[p,q,l,t]` | `BoolVar` | 产线 `l` 从上一生产产品 `p` 切换到 `q` |
| `u_pt` | `gapQty[p,t]` | `IntVar >= 0` | 截至时间桶 `t` 的累计交付缺口量 |
| `rho_pt` | `gapRate[p,t]` | `IntVar >= 0` | 缺口率的整数缩放值 |
| `dsync_fmm't` | `syncDiff[l1,l2,t]` | `BoolVar` | 齐开齐停偏差 |
| `dfeed_fm1m2pt` | `feederDiff[l1,l2,p,t]` | `BoolVar` | 同一喂丝机连接产线的同步生产偏差 |
| `Delta+_fm` | `overWorkload[l]` | `NumVar >= 0` | 产线负荷高于平均值的偏差 |
| `Delta-_fm` | `underWorkload[l]` | `NumVar >= 0` | 产线负荷低于平均值的偏差 |

班组变量 `n_fmt` 和延时变量 `o_fmt` 第一版不单独建模。当前系统的开台计划已给出每个时间桶有效工时，MILP 直接使用 `workHours[l,t]`。

## 4. 硬约束转换

### H1 生产计划量匹配

PDF:

```text
sum_f sum_m sum_t x_fmpt = Q_p
```

项目:

```text
sum_l sum_t q[p,l,t] + unfulfilled[p] = demand[p]
```

当策略启用 `mustFulfillDemand` 时:

```text
unfulfilled[p] = 0
```

### H2 产线和产品可生产性

PDF:

```text
0 <= x_fmpt <= M * a_fmp
```

项目:

```text
0 <= q[p,l,t] <= capacity[p,l,t] * x[p,l,t]
```

若 `capacity[p,l,t] <= 0`，不创建 `q[p,l,t]` 和 `x[p,l,t]`，等价于 `allowed[p,l,t] = 0`。

### H3 单产线单时间桶唯一产品

PDF:

```text
sum_p z_fmpt <= 1
```

项目:

```text
sum_p x[p,l,t] <= 1
sum_p x[p,l,t] = u[l,t]
```

`u[l,t]` 是产线开机变量，和当前 CP-SAT 口径一致。

### H4 最大开台数

PDF 的班组总量约束在当前项目中转换为最大开台数约束:

```text
sum_l u[l,t] <= maxOpen[t]
```

单机台班组数、班组延时不在第一版 MILP 中建变量，由 `workHours[l,t]` 预先折算。

### H5 工时和换牌工时

PDF:

```text
productionHours + changeoverHours <= Heff
```

项目:

```text
sum_p q[p,l,t] / unitCapacity[l,p] + sum_pq changeoverTime[p,q] * change[p,q,l,t] <= workHours[l,t]
```

MILP 中如需避免除法，应在建模时转换为线性系数:

```text
sum_p q[p,l,t] * minutesPerBox[l,p] + sum_pq changeoverMinutes[p,q] * change[p,q,l,t] <= workMinutes[l,t]
```

换牌变量:

```text
change[p,q,l,t] >= x[p,l,t-1] + x[q,l,t] - 1
```

首桶若存在上月末产品:

```text
change[lastProduct[l],q,l,firstT] >= x[q,l,firstT]
```

## 5. 软目标转换

软目标全部由策略 `optimize_rules` 配置后生效，不配置则不进入 MILP 目标。

| PDF 目标 | 建议策略键 | 项目目标表达 |
| --- | --- | --- |
| S1 缺口量与缺口率 | `due_progress_gap` | 最小化 `gapQty[p,t]` 和 `gapRate[p,t]` |
| S2 换牌时间 / 成本 | `changeover_control` | 最小化 `changeoverTime[p,q] * change[p,q,l,t]` |
| S3 物料安全余量 | 暂不实现 | 第一版跳过 |
| S4 机台牌号适配优先级 | `brand_machine_priority` | 最小化 `priorityPenalty[l,p] * q[p,l,t]` |
| S5 齐开齐停 | `soft_sync_start_stop` | 最小化 `syncDiff[l1,l2,t]` |
| S5 生产均衡性 | `workload_balance` | 最小化 `overWorkload[l] + underWorkload[l]` |
| S6 喂丝机连接同步生产 | `feeder_sync_production` | 最小化 `feederDiff[l1,l2,p,t]` |

### S1 累计交付缺口

```text
sum_l sum_tau<=t q[p,l,tau] + gapQty[p,t] >= dueDemand[p,t]
```

缺口率用整数缩放表达，例如 `RATE_SCALE = 10000`:

```text
gapQty[p,t] * RATE_SCALE <= gapRate[p,t] * dueDemand[p,t]
```

### S4 产线牌号适配优先级

优先级惩罚:

```text
priorityPenalty[l,p] = priority[l,p] - minPriority[p]
```

目标项:

```text
min sum_p sum_l sum_t priorityPenalty[l,p] * q[p,l,t]
```

### S5 软齐开齐停

```text
syncDiff[l1,l2,t] >= u[l1,t] - u[l2,t]
syncDiff[l1,l2,t] >= u[l2,t] - u[l1,t]
```

目标项:

```text
min sum syncDiff[l1,l2,t]
```

### S5 生产均衡性

产线占用工时:

```text
workload[l] = sum_t productionMinutes[l,t] + changeoverMinutes[l,t]
```

平均负荷:

```text
avgWorkload = sum_l workload[l] / lineCount
```

偏差:

```text
workload[l] - avgWorkload <= overWorkload[l]
avgWorkload - workload[l] <= underWorkload[l]
```

目标项:

```text
min sum_l overWorkload[l] + underWorkload[l]
```

### S6 喂丝机连接同步生产

```text
feederDiff[l1,l2,p,t] >= x[p,l1,t] - x[p,l2,t]
feederDiff[l1,l2,p,t] >= x[p,l2,t] - x[p,l1,t]
```

目标项:

```text
min sum feederDiff[l1,l2,p,t]
```

## 6. MILP 新引擎落点

新增 `factory-production-application` 下的 `schedule/milp` 包，复用 CP-SAT 的输入对象:

```text
PackScheduleProblemBuilder -> PackScheduleProblem -> PackScheduleMilpService -> PackScheduleSolution
```

建议新增类:

| 类 | 职责 |
| --- | --- |
| `PackScheduleMilpService` | MILP 求解入口，负责创建 `MPSolver`、组装变量、约束、目标并求解 |
| `PackScheduleMilpVariableBuilder` | 创建 `q/x/u/change/gap/sync` 等变量 |
| `MilpConstraintBuilder` | MILP 约束接口 |
| `MilpAssignmentConstraintBuilder` | H2/H3 |
| `MilpDemandConstraintBuilder` | H1/S1 |
| `MilpOpenLineConstraintBuilder` | H4 |
| `MilpWorkTimeConstraintBuilder` | H5 |
| `PackScheduleMilpObjectiveBuilder` | 组装策略软目标 |
| `PackScheduleMilpSolutionMapper` | 映射 MILP 解为现有 `PackScheduleSolution` |

策略编码分流:

```text
CP    -> 当前 CP-SAT 链路
GA    -> 当前 GA 链路
MILP  -> 新增 MILP 链路
```

## 7. 第一版不做的内容

- 不建工厂维度 `f`。
- 不建独立 `allowed[p,l]` 表，正产能即允许生产。
- 不建班组变量 `n[l,t]` 和延时变量 `o[l,t]`。
- 不实现物料累计可用 H6。
- 不实现物料安全余量 S3。
- 不改 GA 逻辑。
