---
title: cp-sat-constraint-builder-analysis
createTime: 2026/09/17 10:29:05
permalink: /article/1g18w3wl/
---
# CP-SAT 约束构建器详解

本文档对卷包排产 CP-SAT 模型中的约束/目标构建器进行逐行拆解，涵盖业务背景、求解器变量、代码逻辑与数学表达。

---

## 一、AssignmentConstraintBuilder — 生产指派约束

### 1.1 一句话总结

**一个机组在一个时间桶里最多只能生产一种产品**，同时把"该机组该桶是否在生产"这个状态变量 `u` 与产品指派变量 `x` 关联起来。

### 1.2 业务背景

工厂排产的现实物理约束：一台机台在同一小时里不可能同时做两种不同的产品。比如机组#1 在 9:00-10:00 这个时间桶里，要么做品牌A，要么做品牌B，要么停机空闲，不能同时做两个。

### 1.3 求解器变量说明

OR-Tools CP-SAT 是一个约束规划求解器，它通过定义**变量**和**约束**来求解。这里用到的两个核心变量：

| 变量 | 类型 | 含义 |
|------|------|------|
| `x[p, l, t]` | `BoolVar`（0 或 1） | 产品 p 是否在机组 l、时间桶 t 上生产（1=是，0=否） |
| `u[l, t]` | `BoolVar`（0 或 1） | 机组 l 在时间桶 t 是否**有任何**产品在生产 |

- `x = 1`：该机组该桶确实在生产这个产品
- `x = 0`：该机组该桶没有生产这个产品
- `u = 1`：该机组该桶在生产（不管哪个产品）
- `u = 0`：该机组该桶空闲/停机

### 1.4 逐行拆解

#### 三层循环结构

```java
for (PackScheduleLine line : problem.getLinesSafe()) {        // 遍历每个机组
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) { // 遍历每个时间桶
        ...
    }
}
```

对**每一个 (机组, 时间桶) 组合**，建立一组约束。即对每个"槽位"独立处理。

#### 收集该槽位所有产品的指派变量

```java
LinearExprBuilder builder = LinearExpr.newBuilder();
int assignmentCount = 0;
for (PackScheduleProduct product : problem.getProductsSafe()) {
    BoolVar x = ctx.x(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucket.getIndex());
    if (x != null) {
        builder.add(x);
        assignmentCount++;
    }
}
```

- 遍历所有产品，取出 `x[p, l, t]` 变量
- `x != null` 表示该产品**允许**在这个机组、这个时间桶上生产（有些产品可能不能在某些机组生产，建模时就不会创建对应的变量）
- 把所有有效的 `x` 加到一个**求和表达式** `builder` 中，最终 `builder` = `x[p1,l,t] + x[p2,l,t] + x[p3,l,t] + ...`
- `assignmentCount` 记录有多少个有效的指派变量

#### 约束一：单线单桶最多一个产品

```java
if (assignmentCount > 0) {
    model.addLessOrEqual(builder, 1L);
```

数学表达：`Σ x[p, l, t] ≤ 1`

即：在机组 l、时间桶 t 上，**所有产品的指派变量之和不超过 1**。因为每个 `x` 只能取 0 或 1，所以这个约束的含义是：

- 和为 0：所有产品都没排，该槽位空闲
- 和为 1：恰好一个产品排在这个槽位
- 和为 2+：**被禁止**（不允许两个产品同时占一个槽位）

**大白话：一个机组一个小时最多只能做一个产品。**

#### 约束二：开机变量与指派严格挂钩

```java
    model.addEquality(builder, u);
```

数学表达：`Σ x[p, l, t] = u[l, t]`

`u` 是"该机组该桶是否在生产"的布尔变量。这个等式约束意味着：

- 如果有产品指派（Σx = 1），则 `u = 1`（该桶在开机生产）
- 如果没有产品指派（Σx = 0），则 `u = 0`（该桶空闲停机）

**`u` 不是独立决策的，它完全由 `x` 决定。** 这个约束把两个变量绑定在一起，后续其他约束要用"该桶是否在生产"时，只需引用 `u` 即可，不需要再管具体是哪个产品。

#### 兜底：无产品可排的槽位强制空闲

```java
} else if (u != null) {
    model.addEquality(u, 0L);
}
```

如果某个 (机组, 时间桶) 组合下，**没有任何产品有对应的 x 变量**（即 `assignmentCount == 0`），说明这个槽位从物理上就不可能排任何产品。此时必须强制 `u = 0`，防止求解器把 `u` 误设为 1（因为 `u` 默认域是 {0, 1}，不约束的话求解器可能随意赋值）。

### 1.5 数学总结

对每个机组 `l`、每个时间桶 `t`：

| 情况 | 约束 |
|------|------|
| 有产品可排（assignmentCount > 0） | `Σ x[p,l,t] ≤ 1`（最多一个产品）<br>`Σ x[p,l,t] = u[l,t]`（开机=有指派） |
| 无产品可排（assignmentCount = 0） | `u[l,t] = 0`（强制停机） |

### 1.6 图示

```
机组#1, 时间桶 9:00-10:00
┌─────────────────────────────────┐
│ 产品A: x[A,1,9] = ?  (0 或 1)  │
│ 产品B: x[B,1,9] = ?  (0 或 1)  │
│ 产品C: x[C,1,9] = ?  (0 或 1)  │
│                                 │
│ 约束1: x[A] + x[B] + x[C] ≤ 1  │  ← 最多选一个
│ 约束2: x[A] + x[B] + x[C] = u  │  ← u 和指派绑定
│                                 │
│ 合法解举例:                      │
│   x[A]=1, x[B]=0, x[C]=0, u=1  │  ✓ 做产品A
│   x[A]=0, x[B]=1, x[C]=0, u=1  │  ✓ 做产品B
│   x[A]=0, x[B]=0, x[C]=0, u=0  │  ✓ 空闲
│   x[A]=1, x[B]=1, x[C]=0, u=2  │  ✗ 违反 ≤1 和 =u
└─────────────────────────────────┘
```

### 1.7 为什么 u 变量需要存在？

既然 `u = Σx`，为什么不直接用 `Σx` 替代 `u`？

因为**后续很多约束只关心"该机组该桶是否在生产"，不关心具体是哪个产品**。比如：

- "A_A约束"：一旦开工就不能停，需要比较 `u[l,t]` 和 `u[l,t-1]`
- "齐开齐停"：多台机组要同时开停，用 `u` 判断
- "首桶开工"：某天第一个桶如果生产了必须开工，用 `u` 判断

有了 `u` 变量，这些约束写起来更简洁，求解器也能更高效地推理。

---

## 二、AppendStartContinuityConstraintBuilder — 机组续排约束

### 2.1 一句话总结

**有历史任务的机组如果本轮继续排产，必须紧贴着历史任务的结束位置开工，不允许跳过续排首桶从更晚的时间桶开始。**

### 2.2 业务背景

工厂排产时，有些机组上个月末已经在生产某个产品，本月继续排产时，该机组如果被使用，必须从历史任务的续排边界开始生产，不能中间空出一段时间再开工。

比如：机组#3 上月生产到 2 号 15:00，本月排产如果要用机组#3，必须从 2 号 15:00 之后的第一个可用时间桶开始，不能跳到 5 号才开始——否则中间几天机组空闲但后续又开工，这在工艺和计划上是不合理的。

关键设计：用的是**条件约束**（`onlyEnforceIf`）而非**无条件强制**，所以如果机组本轮没有任何生产需求，续排首桶不必开机——不会强制没有需求的机组参与排产。

### 2.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（BoolVar：0/1） |
| `T_avail(l)` | 机组 l 在本轮所有**可用**时间桶的集合（`isAvailable(l,t) = true` 且 `u[l,t] != null`） |
| `t₀(l)` | 机组 l 的续排首桶（`appendFirstSchedulableBucket`），即历史任务结束后的首个可排产桶 |
| `aₗ` | 辅助布尔变量 `appendLineUsed_l`：机组 l 本轮是否被使用 |

只有 `t₀(l)` 不为空的机组（有历史续排任务）才参与约束。

### 2.4 约束的数学表达

#### (1) 如果机组没有可用桶，aₗ = 0

```
|T_avail(l)| = 0  ⟹  aₗ = 0
```

当 `availableBucketCount <= 0` 时，`model.addEquality(appendLineUsed, 0L)`。

#### (2) aₗ = 1 时，机组至少有一个可用桶在生产

```
aₗ = 1  ⟹  Σ_{t ∈ T_avail(l)} u[l,t] ≥ 1
```

`model.addGreaterOrEqual(usedBuckets, 1L).onlyEnforceIf(appendLineUsed)` — **如果** `aₗ = 1`，则该机组至少有一个可用桶在生产。

#### (3) aₗ = 0 时，机组所有可用桶都不生产

```
aₗ = 0  ⟹  Σ_{t ∈ T_avail(l)} u[l,t] = 0
```

`model.addEquality(usedBuckets, 0L).onlyEnforceIf(appendLineUsed.not())` — **如果** `aₗ = 0`，则该机组所有可用桶都不生产。

> **约束 (2) 和 (3) 合在一起**，等价于 `aₗ` 恰好等于"是否存在 u[l,t]=1"的指示变量：
>
> ```
> aₗ = 1  ⇔  Σ_{t ∈ T_avail(l)} u[l,t] ≥ 1
> ```

#### (4) 续排首桶不可用，则机组本轮不使用

```
u[l, t₀(l)] 不存在  ⟹  aₗ = 0
```

如果续排首桶没有 `u` 变量（该桶建模时未创建），说明该桶无法生产，则 `aₗ = 0`，即该机组本轮不允许使用。

#### (5) 核心约束：如果机组本轮被使用，续排首桶必须开机

```
aₗ = 1  ⟹  u[l, t₀(l)] = 1
```

`model.addEquality(firstBucketProduction, 1L).onlyEnforceIf(appendLineUsed)`

**这是本类的核心业务约束**：有历史任务的机组如果本轮继续排产，必须紧贴着历史任务的结束位置开工，不允许跳过续排首桶从更晚的时间桶开始。

### 2.5 综合数学表达

对每个有续排历史的机组 `l`（`t₀(l)` 不为 null）：

$$
a_l = 1 \;\Longleftrightarrow\; \sum_{t \in T_{avail}(l)} u[l,t] \geq 1
$$

$$
a_l = 1 \;\Longrightarrow\; u[\,l,\, t_0(l)\,] = 1
$$

用大白话说：

- **`aₗ` 是一个"指示灯"**，机组 l 只要本轮任何可用桶有生产，灯就亮
- **灯亮了，续排首桶就必须开机**：保证续排的连续性，不允许机组跳过首桶从后面再开始

### 2.6 图示

```
时间轴:  ... 历史任务 | t₀  t₁  t₂  t₃  t₄  ...
                       ↑
                   续排首桶

情况1: 机组本轮有生产 (aₗ=1)
  t₀: u=1  ← 必须开机（约束5）
  t₁: u=1
  t₂: u=0  （可以停）
  t₃: u=1
  ✓ 合法

情况2: 续排首桶没开机
  t₀: u=0  ← 违反约束5（因为 aₗ=1 但 u[t₀]=0）
  t₁: u=1
  t₂: u=1
  ✗ 非法

情况3: 机组本轮完全没用
  t₀: u=0
  t₁: u=0
  t₂: u=0
  aₗ=0, 约束5不触发
  ✓ 合法（不强制续排机组必须参与本轮）
```

---

## 三、BrandMachinePriorityObjectiveBuilder — 机组牌号优先软目标

### 3.1 一句话总结

**引导求解器把产量优先分配到高优先级机组上**：当产品存在 P1（最高优先级）机组时，惩罚落在非 P1 机组上的产量（Primary）；或者按优先级惩罚系数加权惩罚所有低优先级机组的产量（Secondary）。

### 3.2 业务背景

工厂中同一牌号（产品）可以在多台机组上生产，但不同机组对该牌号有不同的优先级。比如：
- 机组#1 生产牌号A是 P1（最高优先级，专门生产这个牌号）
- 机组#2 生产牌号A是 P2（次优先级，有其他主产牌号）
- 机组#3 生产牌号A是 P3（最低优先级，不太适合生产这个牌号）

业务希望：**如果 P1 机组有产能，就尽量把产量排给 P1 机组，不要排给 P2/P3**。这不是硬性要求（P1 产能不够时仍然可以用 P2/P3 补充），而是软目标——在目标函数中加惩罚项，求解器会倾向于减少低优先级机组上的产量。

### 3.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID（`scheduleOrderPlanDetailId`） |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`，非负整数） |
| `cap[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的最大产能上界 |
| `π(p,l)` | 机组 l 对产品 p 的优先级等级（`priorityLevel`）；`π = 1` 为最高优先级（P1） |
| `pen(p,l)` | 机组 l 对产品 p 的优先级惩罚系数（`priorityPenalty`）；`pen > 0` 时惩罚低优先级产量 |
| `w` | 归一化后的目标权重 |

### 3.4 Primary 目标 — 最小化非 P1 机组产量

#### 业务语义

当某产品存在真正可用的 P1 机组时，最小化落在非 P1 机组上的产量。如果该产品根本没有 P1 机组（所有机组优先级都一样），就不加惩罚——没有"更好的选择"就不惩罚。

#### 数学表达

目标函数追加项：

$$
\min \sum_{\substack{p:\,\exists\,l'\text{ with }\pi(p,l')=1}} \sum_{\substack{l:\,\pi(p,l)\neq 1}} \sum_t w \cdot q[p,l,t]
$$

上界估算：

$$
UB_{primary} = \sum_{\substack{p:\,\exists\,l'\text{ with }\pi(p,l')=1}} \sum_{\substack{l:\,\pi(p,l)\neq 1}} \sum_t cap[p,l,t] \cdot w
$$

#### `hasUsablePriority1Candidate` — 判断产品是否存在可用 P1 机组

```
∃l: π(p,l) = 1 ∧ ∃t: q[p,l,t] ≠ null ∧ cap[p,l,t] > 0
```

不只是看优先级配置，还要确认该 P1 机组确实有建模变量和正产能。如果 P1 机组在本轮排产周期内没有可用产能，那它对产品来说等同于不存在，此时不应惩罚非 P1 机组的产量。

#### 逐行拆解（`appendPrimaryTerm`）

```java
for (PackScheduleProduct product : ctx.getProblem().getProductsSafe()) {
    Long productId = product.getScheduleOrderPlanDetailId();
    // 跳过不存在可用 P1 候选机组的产品
    if (!hasUsablePriority1Candidate(ctx, productId)) {
        continue;
    }
```

第一层：遍历所有产品，**只处理存在可用 P1 机组的产品**。没有 P1 候选的产品，所有机组优先级相同，不需要惩罚。

```java
    for (PackScheduleLine line : ctx.getProblem().getLinesSafe()) {
        Long lineId = line.getLineId();
        Integer priorityLevel = ctx.getProblem().getPriorityLevel(productId, lineId);
        // P1 机组不加惩罚
        if (isPriority1(priorityLevel)) {
            continue;
        }
```

第二层：遍历所有机组，**跳过 P1 机组**。P1 机组是"好选择"，不惩罚。

```java
        for (PackScheduleBucket bucket : ctx.getProblem().getBucketsSafe()) {
            long capacity = ctx.getProblem().getCapacity(productId, lineId, bucket.getIndex());
            if (capacity <= 0L) {
                continue;
            }
            IntVar q = ctx.q(productId, lineId, bucket.getIndex());
            if (q == null) {
                continue;
            }
            // 追加 w · q[p,l,t] 到目标表达式
            objectiveExpr.addTerm(q, weight);
            upperBound = safeAdd(upperBound, safeMultiply(capacity, weight));
        }
```

第三层：遍历所有时间桶，对有正产能且有建模变量的槽位，将 `w · q[p,l,t]` 追加到目标表达式，同时累加上界 `cap[p,l,t] · w`。

### 3.5 Secondary 目标 — 按惩罚系数加权最小化低优先级产量

#### 业务语义

Primary 是"有 P1 就不要用非 P1"的二元判断，Secondary 则是更精细的梯度惩罚：优先级越低的机组，惩罚系数越大，求解器越不想在那里排产量。

#### 数学表达

目标函数追加项：

$$
\min \sum_p \sum_l \sum_t pen(p,l) \cdot w \cdot q[p,l,t]
$$

上界估算：

$$
UB_{secondary} = \sum_p \sum_l \sum_t cap[p,l,t] \cdot pen(p,l) \cdot w
$$

注意：`pen(p,l) ≤ 0` 时不参与求和——惩罚系数为 0 或负值意味着该（产品, 机组）组合不需要被惩罚。

#### 逐行拆解（`appendSecondaryTerm`）

```java
for (PackScheduleProduct product : ctx.getProblem().getProductsSafe()) {
    for (PackScheduleLine line : ctx.getProblem().getLinesSafe()) {
        long priorityPenalty = ctx.getProblem().getPriorityPenalty(
                product.getScheduleOrderPlanDetailId(), line.getLineId());
        // pen(p,l) ≤ 0 时不参与求和
        if (priorityPenalty <= 0L) {
            continue;
        }
        long coefficient = safeMultiply(priorityPenalty, weight);
```

双层循环遍历所有（产品, 机组）对，取出惩罚系数。**只有 `pen > 0` 才惩罚**。系数 = `pen(p,l) · w`。

```java
        for (PackScheduleBucket bucket : ctx.getProblem().getBucketsSafe()) {
            IntVar q = ctx.q(product.getScheduleOrderPlanDetailId(),
                    line.getLineId(), bucket.getIndex());
            if (q == null) {
                continue;
            }
            // 追加 pen(p,l) · w · q[p,l,t] 到目标表达式
            objectiveExpr.addTerm(q, coefficient);
            upperBound = safeAdd(upperBound,
                    safeMultiply(ctx.getProblem().getCapacity(...), coefficient));
        }
```

遍历所有时间桶，追加 `pen(p,l) · w · q[p,l,t]`，累加上界 `cap[p,l,t] · pen(p,l) · w`。

### 3.6 Primary vs Secondary 对比

| 维度 | Primary | Secondary |
|------|---------|-----------|
| 触发条件 | 产品必须存在可用 P1 机组 | 所有 `pen(p,l) > 0` 的（产品, 机组）对 |
| 惩罚对象 | 非 P1 机组上的产量 | 所有有正惩罚系数的（产品, 机组）对上的产量 |
| 惩罚系数 | 统一 `w`（所有非 P1 机组同等对待） | `pen(p,l) · w`（按优先级梯度惩罚） |
| 业务效果 | "有 P1 就不用其他" | "优先级越低越不想用" |
| 粒度 | 粗（二元：P1 vs 非P1） | 细（梯度：P1 → P2 → P3 惩罚递增） |

### 3.7 图示

```
产品A在3台机组上的优先级配置：
  机组#1: π=1 (P1), pen=0    ← 优先级最高，不惩罚
  机组#2: π=2 (P2), pen=3    ← 中等优先级，惩罚系数3
  机组#3: π=3 (P3), pen=5    ← 最低优先级，惩罚系数5

Primary 目标（w=10）：
  惩罚项 = 10·q[A,#2,t] + 10·q[A,#3,t]    （非P1机组统一惩罚）
  机组#1 不参与，机组#2 和 #3 同等被惩罚

Secondary 目标（w=10）：
  惩罚项 = 3·10·q[A,#2,t] + 5·10·q[A,#3,t]  （按梯度惩罚）
  机组#1 不参与，机组#3 比 #2 被惩罚更重

求解器倾向：
  Primary：优先用机组#1，#2 和 #3 无差别
  Secondary：优先用机组#1，其次 #2，最后 #3
```

### 3.8 上界估算方法

`resolvePrimaryRawUpperBound` 和 `resolveSecondaryRawUpperBound` 计算目标项的理论最大值（上界），用于**归一化**——不同目标项的量纲和规模可能差几个数量级，归一化后才能公平加权求和。

方法逻辑与 `append*Term` 完全对应，只是把 `q[p,l,t]`（求解器变量）替换为 `cap[p,l,t]`（最大产能上界），因为 `q` 的上界就是 `cap`。

### 3.9 求解后实际值计算

`calculatePrimaryActualValue` 和 `calculateSecondaryActualValue` 在求解完成后，用 `solver.value(q)` 取出每个 `q` 变量的实际求解值，重新计算目标达成量。用于结果统计和报告——评估"机组牌号优先"目标实际执行得怎么样。

逻辑与 `append*Term` 一一对应，`q[p,l,t]` 替换为 `max(0, solver.value(q[p,l,t]))`（`max(0, ...)` 是防御性处理，正常情况下求解器不会给 `q` 赋负值）。

### 3.10 工具方法

- **`safeAdd` / `safeMultiply`**：溢出安全的加法和乘法，避免 `long` 溢出导致结果异常。乘法还处理了 `≤0` 的情况——负数或零直接返回 0，因为产能和惩罚系数在业务上不应为负。
- **`isPriority1`**：判断优先级等级是否为 1（P1）。
- **`appendTerm` / `resolveRawUpperBound`**：兼容旧调用的委托方法，语义等同于 Secondary。

---

## 四、CapacityConstraintBuilder — 产能约束

### 4.1 一句话总结

**将布尔指派变量 `x` 和整数产量变量 `q` 绑定**：不生产时产量必须为 0，生产时产量至少为 1 且不超过该槽位的产能上界。

### 4.2 业务背景

在排产模型中，每个（产品, 机组, 时间桶）槽位有两个变量：

- `x[p,l,t]`：布尔变量，表示"这个槽位是否在生产"（由 `AssignmentConstraintBuilder` 管控）
- `q[p,l,t]`：整数变量，表示"这个槽位生产了多少"

这两个变量必须语义一致。如果 `x = 0`（没有生产），那 `q` 必须也是 0（没有产量）；如果 `x = 1`（在生产），那 `q` 至少为 1（不能"空占位"——声明在生产但实际产量为 0），且不超过该槽位的最大产能。

如果不绑定这两个变量，求解器可能给出自相矛盾的解：`x = 0` 但 `q = 50`（没生产却有产量），或者 `x = 1` 但 `q = 0`（占着位置却不产出），这两种情况在业务上都是不合理的。

### 4.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `x[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否有正产量（`BoolVar`：0 或 1） |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`：非负整数） |
| `cap[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的最大产能上界 |

### 4.4 逐行拆解

#### 遍历所有产量变量

```java
for (Map.Entry<ProductLineBucketKey, IntVar> entry : ctx.getQVars().entrySet()) {
    ProductLineBucketKey key = entry.getKey();
    IntVar q = entry.getValue();
    BoolVar x = ctx.getXVars().get(key);
    if (x == null) {
        continue;
    }
    long capacity = problem.getCapacity(key.getProductId(), key.getLineId(), key.getBucketIndex());
    if (capacity <= 0) {
        continue;
    }
```

- 遍历所有已创建的 `q` 变量（即所有有建模意义的（产品, 机组, 时间桶）组合）
- 取出同一 key 对应的 `x` 变量；如果 `x` 不存在（该槽位不允许生产该产品），跳过
- 取出产能上界 `cap`；如果 `cap ≤ 0`（该槽位无产能），跳过

#### 约束一：产量不超过"是否生产 × 产能"

```java
    // (1) q[p,l,t] ≤ x[p,l,t] · cap[p,l,t]
    model.addLessOrEqual(q, LinearExpr.term(x, capacity));
```

数学表达：`q[p,l,t] ≤ x[p,l,t] × cap[p,l,t]`

分析 `x` 的两种取值：

- **x = 0（不生产）**：约束变为 `q ≤ 0`，即 `q = 0`。没有生产就没有产量。
- **x = 1（生产）**：约束变为 `q ≤ cap`。生产时产量不超过产能上界。

**`LinearExpr.term(x, capacity)` 是 OR-Tools 的写法**，表示线性表达式 `x × capacity`。当 `x` 是 `BoolVar` 时，这个表达式的值要么是 0（x=0），要么是 capacity（x=1）。

#### 约束二：生产时至少有 1 个单位产量

```java
    // (2) q[p,l,t] ≥ x[p,l,t]
    model.addGreaterOrEqual(q, x);
```

数学表达：`q[p,l,t] ≥ x[p,l,t]`

分析 `x` 的两种取值：

- **x = 0（不生产）**：约束变为 `q ≥ 0`。因为 `q` 是非负整数变量，此约束自动满足。
- **x = 1（生产）**：约束变为 `q ≥ 1`。生产时产量至少为 1，不允许"空占位"。

### 4.5 数学总结

对每个有正产能的 (p, l, t) 槽位（`cap[p,l,t] > 0` 且 `x[p,l,t]`、`q[p,l,t]` 均存在）：

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `q[p,l,t] ≤ x[p,l,t] × cap[p,l,t]` | 不生产时 q=0，生产时 q 不超过产能 |
| (2) | `q[p,l,t] ≥ x[p,l,t]` | 不生产时 q≥0（自动满足），生产时 q≥1 |

两个约束合在一起，`q` 的取值范围：

| x 的值 | q 的取值范围 | 含义 |
|--------|-------------|------|
| x = 0 | q = 0 | 不生产，产量必须为 0 |
| x = 1 | 1 ≤ q ≤ cap | 生产，产量在 1 到产能上界之间 |

### 4.6 图示

```
产品A, 机组#1, 时间桶 9:00-10:00
产能 cap = 120

┌──────────────────────────────────────────┐
│  x[A,1,9] = ?  (0 或 1)                 │
│  q[A,1,9] = ?  (非负整数)                │
│                                          │
│  约束(1): q ≤ x × 120                    │
│  约束(2): q ≥ x                          │
│                                          │
│  x=0 时: 0 ≤ q ≤ 0  ⟹  q = 0           │
│  x=1 时: 1 ≤ q ≤ 120                    │
│                                          │
│  合法解举例:                              │
│    x=0, q=0      ✓ 空闲，无产量          │
│    x=1, q=50     ✓ 生产50箱              │
│    x=1, q=120    ✓ 满产                  │
│                                          │
│  非法解举例:                              │
│    x=0, q=30     ✗ 不生产却有产量（违反1） │
│    x=1, q=0      ✗ 生产却无产量（违反2）   │
│    x=1, q=200    ✗ 超过产能（违反1）       │
└──────────────────────────────────────────┘
```

### 4.7 与 AssignmentConstraintBuilder 的关系

`AssignmentConstraintBuilder` 和 `CapacityConstraintBuilder` 共同定义了 `x` 和 `q` 变量的完整语义：

```
AssignmentConstraintBuilder          CapacityConstraintBuilder
─────────────────────────           ─────────────────────────
Σ x[p,l,t] ≤ 1   （每槽最多一个产品）  q[p,l,t] ≤ x · cap     （不生产则q=0）
Σ x[p,l,t] = u[l,t] （x 决定 u）      q[p,l,t] ≥ x           （生产则q≥1）
```

- **AssignmentConstraintBuilder** 管"谁占这个槽位"——同一槽位最多一个产品，且开机变量 `u` 由 `x` 决定
- **CapacityConstraintBuilder** 管"占了这个槽位产多少"——`x` 和 `q` 必须一致：占着就产、没占就不产、产的量有上下界

两者合在一起，确保排产结果的每个槽位要么空闲（x=0, q=0, u=0），要么在生产某个产品且产量合理（x=1, 1≤q≤cap, u=1）。

---

## 五、ChangeoverConstraintBuilder — 换产事件约束

### 5.1 一句话总结

**机组从一个牌号切换到另一个牌号时，必须为换产预留足够的时间**，换产时间要么在两块之间的空闲时段消化，要么占用目标块首桶的部分产能——首桶的产能需要在"换产"和"生产"之间共享。

### 5.2 业务背景

卷包车间中，机台从生产牌号A切换到牌号B时，需要停机进行物理换产操作（更换材料、调整参数、清洗等），这个操作需要消耗一定时间，称为**换产时间**（换牌时间）。换产时间的长短取决于前后两个牌号的组合，且具有方向性（A→B 和 B→A 可能不同）。

排产模型必须确保：
1. 前一个牌号生产完成后，后一个牌号才能开始——**时序约束**
2. 两块之间的空闲时间要足够容纳换产——**空闲约束**
3. 如果空闲时间不够换产，剩余的换产时间会"吃掉"目标块首桶的部分产能——**产能约束**

### 5.3 核心设计思路

整个构建器采用 **"连续块 + Circuit"** 的建模方式，分为三个阶段：

```
阶段一: 为每个 (产品, 机组) 构建连续生产块 (ProductBlock)
        ↓
阶段二: 用 Circuit 约束为同一机组的块确定唯一前后序排列
        ↓
阶段三: 对每个目标块的入弧汇总换产状态，建立产能约束
```

### 5.4 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `x[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否有正产量（BoolVar） |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（IntVar） |
| `end[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块结束（BoolVar） |
| `start[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块开始（BoolVar） |
| `B(p,l)` | 产品 p 在机组 l 上的连续生产块（ProductBlock） |
| `code(p)` | 产品 p 的紧凑整数编码（1-based，0 保留给"无前序"） |
| `τ(s→t)` | 从物料 s 换产到物料 t 所需分钟数（同物料为 0） |

### 5.5 阶段一：构建 ProductBlock（`buildProductBlock`）

对每个（产品 p, 机组 l），从已有的 `x`、`q`、`end` 变量推导出块的宏观属性。因为 `ContinuityConstraintBuilder` 保证了同一产品同一机组最多一个连续块，所以可以用"尾桶序号 - 选中桶数 + 1"直接推导首桶序号。

#### 推导的 8 个变量

| 变量 | 类型 | 推导公式 | 含义 |
|------|------|----------|------|
| `used` | BoolVar | (1a) `Σ_t end[p,l,t] = used` | 块是否被使用（有结束事件 = 使用） |
| `endOrdinal` | IntVar | (1b) `Σ_t ordinal_t · end[p,l,t] = endOrdinal` | 尾桶在有效时间轴上的序号 |
| `startOrdinal` | IntVar | (1c) `endOrdinal - Σ_t x[p,l,t] + used = startOrdinal` | 首桶在有效时间轴上的序号 |
| `startTime` | IntVar | (1d) `startTime = startMinutes[startOrdinal]`（Element） | 首桶起始时刻（分钟） |
| `endTime` | IntVar | (1e) `Σ_t endMinutes_t · end[p,l,t] = endTime` | 尾桶结束时刻（分钟） |
| `firstQty` | IntVar | (1f) `firstQty = qty[startOrdinal]`（Element） | 首桶产量 |
| `firstCapacity` | IntVar | (1g) `firstCapacity = capacity[startOrdinal]`（Element） | 首桶产能上界 |
| `firstBucketMinutes` | IntVar | (1h) `firstBucketMinutes = bucketMinutes[startOrdinal]`（Element） | 首桶工时（分钟） |

#### 为什么 startOrdinal 可以直接推导？

由连续性约束，同一产品同一机组的被选桶形成一个**连续段**。如果选了 k 个桶，尾桶序号为 e，则首桶序号 = e - k + 1。在公式中：

- `endOrdinal` = 尾桶序号 e
- `Σ x[p,l,t]` = 选中桶数 k（因为 x 是 BoolVar，1 表示选中）
- `used` = 1 时，`startOrdinal = e - k + 1 = endOrdinal - selectedCount + used`

当 `used = 0` 时，`selectedCount = 0`、`endOrdinal = 0`（由 (1a) 和 (1b) 保证），`startOrdinal = 0`，无意义但不影响约束。

### 5.6 阶段二：Circuit 约束确定块排列（`bindBlockSequence`）

使用 OR-Tools 的 **Circuit 约束**来确保同一机组上的生产块形成一个**唯一的线性序列**。

#### Circuit 节点与弧

Circuit 是一个**哈密顿回路**约束：每个节点恰好有一条出弧和一条入弧，形成恰好一个环。

| 节点 | 含义 |
|------|------|
| 0 | 虚拟起点/终点 |
| 1..n | 各生产块 B₁, B₂, ..., Bₙ |

| 弧 | 布尔变量 | 含义 |
|----|----------|------|
| (0→0) | `lineUsed.not()` | 机组未使用时的虚拟自环 |
| (i→i) | `used_i.not()` | 块 i 未被使用时的自环 |
| (0→i) | `first_i` | 块 i 是序列的首块 |
| (i→0) | `last_i` | 块 i 是序列的末块 |
| (i→j) | `arc_ij` | 块 i 的后序是块 j |

#### lineUsed 绑定

```
(2a) lineUsed = 1  ⟹  Σ_i used_i ≥ 1
(2b) lineUsed = 0  ⟹  Σ_i used_i = 0
```

#### 时序约束

```
(2c) arc[i→j] = 1  ⟹  endTime_i ≤ startTime_j
```

如果块 i 的后序是块 j，则块 i 必须在块 j 开始之前结束。这是换产约束的**前提**——只有前序块结束了，才能开始换产。

#### 剪枝优化

`canPrecede(source, target)` 在构建弧之前检查时间范围的可行性：

```
source.earliestEndTime > target.latestStartTime  ⟹  不创建 arc[source→target]
```

如果源块的最早结束时间已经晚于目标块的最晚开始时间，那无论求解器如何决策，时序约束 (2c) 都不可能满足。提前剪掉这些弧可以显著减少变量和约束数量。

#### 图示

```
机组#1 上的 3 个生产块：

Circuit 节点:  0(虚拟)  1(产品A)  2(产品B)  3(产品C)

可能的排列：
  0 → 1 → 2 → 3 → 0    (A首, B中, C末)
  0 → 2 → 1 → 3 → 0    (B首, A中, C末)
  0 → 3 → 1 → 0        (C首, A末; B未使用, 自环)
  0 → 0                 (机组未使用)

每条弧 arc[i→j]=1 时:
  endTime_i ≤ startTime_j  ← 前序块必须先结束
```

### 5.7 阶段三：入弧汇总与换产状态（`bindIncomingChangeover`）

对每个目标块，收集其所有入弧（即"谁排在我前面"），推导换产相关的 6 个变量。

#### 推导的 6 个变量

| 变量 | 类型 | 推导公式 | 含义 |
|------|------|----------|------|
| `hasPredecessor` | BoolVar | (3a) `Σ_i arc[i→target] = hasPredecessor` | 是否有前序块（0/1） |
| `materialChange` | BoolVar | (3b) `Σ_{i: matId_i≠matId_target} arc[i→target] = materialChange` | 是否发生了牌号切换 |
| `predecessorCode` | IntVar | (3c) `Σ_i code_i · arc[i→target] = predecessorCode` | 前序物料的紧凑编码 |
| `requiredMinutes` | IntVar | (3d) `requiredMinutes = durationsToTarget[targetCode][predecessorCode]`（Element） | 前序→目标所需的换产时长 |
| `predecessorEnd` | IntVar | (3e) `predecessorEnd = endTimesByCode[predecessorCode]`（Element） | 前序块的结束时刻 |
| `idleMinutes` | IntVar | (3f) `startTime_target - predecessorEnd = idleMinutes` | 两块之间的空闲时间 |

#### 条件约束（诊断模式递进）

| 约束 | 模式 | 公式 | 含义 |
|------|------|------|------|
| (3g) | IDLE_LIMIT | `hasPredecessor = 1 ⟹ idleMinutes ≤ requiredMinutes` | 有前序时，空闲时间不超过换产需求 |
| (3h) | — | `remainingMinutes = max(requiredMinutes - idleMinutes, 0)` | 剩余换产时长（空闲不够换产的部分） |
| (3i) | REMAINING_LIMIT | `materialChange = 1 ⟹ remainingMinutes ≤ firstBucketMinutes` | 牌号切换时，剩余换产不超过首桶工时 |

**remainingMinutes 的含义**：空闲时间能消化多少换产就消化多少，消化不掉的就是"剩余换产时长"。比如需要 90 分钟换产，两块之间只有 30 分钟空闲，则 idleMinutes=30，remainingMinutes=60。这 60 分钟必须从目标块首桶的产能中扣除。

**约束 (3i) 的含义**：剩余换产时长不能超过首桶的工时分钟数。如果超过，说明换产时间太长、首桶太短，连首桶全部产能用来换产都不够——这种情况在物理上不可行，约束会直接排除。

#### materialChange vs hasPredecessor

- `hasPredecessor`：有前序块（可能是同物料的不同计划，不需要换产）
- `materialChange`：前序是不同物料（真正发生牌号切换，需要换产）

同物料的不同计划只衔接生产，不计换产事件——因为不需要物理换牌操作，`τ(同物料→同物料) = 0`。

### 5.8 产能约束（`bindTargetCapacity`，FULL 模式）

当首桶同时承担"换产"和"生产"时，产能需要在两者之间分配。

设 `bm = bucketMinutes`（首桶工时分钟数），`cap = capacity`（首桶产能上界）：

| 约束 | 公式 | 含义 |
|------|------|------|
| (4a) | `start ∧ materialChange ⟹ qty · bm + remainingMinutes · cap ≤ cap · bm` | 首桶产能上界：换产 + 生产不超过总产能 |
| (4b) | `start ∧ materialChange ∧ ¬end ⟹ qty · bm + remainingMinutes · cap ≥ cap · bm - (bm - 1)` | 非尾首桶产能下界：接近满产，避免碎片 |

#### 约束 (4a) 解释

`qty · bm + remainingMinutes · cap ≤ cap · bm`

- `qty · bm`：产量占用的产能分钟数（每单位产量占 bm 分钟的产能）
- `remainingMinutes · cap`：剩余换产占用的产能分钟数（每分钟换产占 cap 单位的产能）
- `cap · bm`：首桶的总产能分钟数

**大白话**：首桶的总产能要分给"换产"和"生产"两部分，两者之和不能超过总产能。

#### 约束 (4b) 解释

`qty · bm + remainingMinutes · cap ≥ cap · bm - (bm - 1)`

这是对**非尾首桶**（块的中间桶）的满产要求。中间桶不应出现碎片化的小产量，必须接近满产（容差 bm - 1 是取整容差）。

#### 图示

```
首桶产能分配（bm=60分钟, cap=120箱/桶）：

  总产能 = 120 × 60 = 7200 箱·分钟

  情况1: remainingMinutes=0（空闲时间足够换产）
    生产产能 = 7200 / 60 = 120 箱  ← 满产

  情况2: remainingMinutes=30（换产占用30分钟）
    换产占用 = 30 × 120 = 3600 箱·分钟
    生产可用 = 7200 - 3600 = 3600 箱·分钟
    最大产量 = 3600 / 60 = 60 箱   ← 产能减半

  情况3: remainingMinutes=60（换产占满首桶）
    换产占用 = 60 × 120 = 7200 箱·分钟
    生产可用 = 0
    最大产量 = 0 箱                ← 首桶全部用于换产
```

### 5.9 辅助结构

#### EffectiveTimeline（有效时间轴）

排产模型中，某些时间桶是停机/不可用的。换产时长计算必须基于**有效工时**，而不是自然时间。`EffectiveTimeline` 剔除不可用桶，只累计有效桶的工时分钟数，构建一条"紧凑"的时间轴。

```
自然时间轴:  [8:00-9:00] [9:00-10:00] [10:00-11:00] [11:00-12:00] [午休] [13:00-14:00]
有效时间轴:  [0-60min]    [60-120min]   [120-180min]  [180-240min]   跳过   [240-300min]
                                                         ↑ 午休不计入换产
```

#### ChangeoverLookup（换产时长矩阵）

将业务配置的换牌时间（按物料ID索引）转换为按紧凑编码索引的二维数组：

```
durationsToTarget[targetCode][sourceCode] = τ(source → target) 分钟
```

同物料换产时长为 0（不需要换牌操作）。

#### DiagnosticMode（诊断模式）

| 模式 | 包含约束 | 用途 |
|------|----------|------|
| STATE_ONLY | (3a)-(3f), (3h) | 仅推导换产状态变量，不加时序和产能限制 |
| IDLE_LIMIT | + (3g) | 空闲时间不超过换产需求 |
| REMAINING_LIMIT | + (3i) | 剩余换产不超过首桶工时 |
| FULL | + (4a), (4b) | 完整产能约束（正式排产使用） |

分阶段诊断可以逐步排查无解问题：先在 STATE_ONLY 下验证模型可行性，再逐步加入更严格的约束。

### 5.10 与其他约束的关系

`ChangeoverConstraintBuilder` 依赖并协作以下约束：

| 依赖的约束 | 提供的变量/保证 | Changeover 如何使用 |
|------------|----------------|-------------------|
| AssignmentConstraintBuilder | `x[p,l,t]`, `u[l,t]` | `x` 用于推导块的 selectedCount |
| CapacityConstraintBuilder | `q[p,l,t]` | `q` 用于推导首桶产量 firstQty |
| ContinuityConstraintBuilder | 保证每个（产品,机组）最多一个连续块 | 使 startOrdinal = endOrdinal - selectedCount + used 成立 |
| ProductionStructureConstraintBuilder | `start[p,l,t]`, `end[p,l,t]` | `end` 用于推导块的尾位置，`start` 用于产能约束 |

换产约束是整个约束链中**依赖最多、最复杂**的构建器，它把"指派"、"产量"、"连续性"、"块起止"四层变量串联起来，形成完整的换产事件模型。

---

## 六、ContinuityConstraintBuilder — 连续生产块约束

### 6.1 一句话总结

**同一排产明细在同一机组上最多形成一个连续生产块**，不允许同一种产品的生产被拆成多个不连续的段。

### 6.2 业务背景

工厂排产时，同一种产品在同一台机台上的生产应该是**连续的**——一旦开始生产，就应该一直生产到完成，中间不会停下来去做别的产品再回来继续。比如机组#1 从 8:00 开始做品牌A，应该连续做到品牌A结束（比如到 14:00），不应出现"8:00-10:00 做品牌A，10:00-12:00 切去做了品牌B，12:00-14:00 又回来做品牌A"的情况。

这种"断开再回来"的排产方式在工艺上不合理：每次切换都需要换产操作，浪费时间和产能；而且对生产计划的管理和执行带来混乱。

### 6.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `end[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块的结束（BoolVar：0/1） |
| `T_valid(p,l)` | 产品 p 在机组 l 上所有有效时间桶的集合（满足 `isAvailable(l,t)=true`、`q[p,l,t]≠null`、`end[p,l,t]≠null`） |

### 6.4 核心约束的数学表达

对每个有效的（产品 p, 机组 l）组合，当 `|T_valid(p,l)| ≥ 2` 时：

```
(1)  Σ_{t ∈ T_valid(p,l)} end[p,l,t] ≤ 1
```

即：同一排产明细在同一机组上，**结束事件最多发生一次**。

### 6.5 为什么 AtMostOne(end) 保证"最多一个连续块"？

`end[p,l,t]` 的语义由 `ProductionStructureConstraintBuilder` 定义：

```
end[p,l,t] = 1  ⟺  x[p,l,t] = 1  ∧  (t 是最后桶  ∨  x[p,l,t+1] = 0)
```

即"当前桶在生产，且下一个有效桶不在生产" = 连续块在此桶结束。

**一个连续块有且仅有一个结束位置**——最后一个在生产的时间桶。如果 `end` 在两个不同的桶上同时为 1，就说明有两个独立的连续块。

`AtMostOne(end...)` 限制最多一个 `end = 1`，因此最多一个连续块。

### 6.6 逐行拆解

#### 双层循环：遍历所有（产品, 机组）组合

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    for (PackScheduleLine line : problem.getLinesSafe()) {
        List<BoolVar> ends = collectEnds(ctx, problem, product, line);
```

对每个（产品, 机组）对，收集该组合在所有可用时间桶上的 `end` 变量。

#### 跳过优化：end 数量 ≤ 1 时无需约束

```java
if (ends.size() <= 1) {
    skippedGroupCount++;
    continue;
}
```

- **0 个 end**：该产品不能在该机组生产，天然满足约束
- **1 个 end**：最多只能结束一次，天然满足 `Σ end ≤ 1`

这个优化很重要：避免为不必要的情况创建约束，减少求解器负担。

#### 核心约束：AtMostOne

```java
// (1) Σ_{t ∈ T_valid(p,l)} end[p,l,t] ≤ 1
model.addAtMostOne(ends.toArray(new BoolVar[0]));
```

OR-Tools 的 `addAtMostOne` 是专门优化的约束，等价于 `Σ end ≤ 1`，但比手写 `addLessOrEqual` 更高效——求解器内部会使用特殊的传播规则。

#### collectEnds 过滤条件

```java
private List<BoolVar> collectEnds(...) {
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
        // 过滤条件1: 机组在该桶不可用 → 跳过
        if (!problem.isAvailable(lineId, bucketIndex)) { continue; }
        // 过滤条件2: 产品在该机组、该桶没有生产资格（q=null） → 跳过
        if (ctx.q(detailId, lineId, bucketIndex) == null) { continue; }
        // 过滤条件3: 存在 end 变量才加入
        BoolVar end = ctx.end(detailId, lineId, bucketIndex);
        if (end != null) { ends.add(end); }
    }
}
```

三层过滤确保只收集**真正有意义的** end 变量：
1. 机组不可用的桶不参与（停机/维修/节假日）
2. 产品无生产资格的桶不参与（该产品不能在该机组生产）
3. 无 end 变量的桶不参与（建模时未创建）

### 6.7 数学总结

| 条件 | 约束 |
|------|------|
| `|T_valid(p,l)| = 0` | 无约束（产品不能在该机组生产） |
| `|T_valid(p,l)| = 1` | 无约束（天然满足最多一个结束事件） |
| `|T_valid(p,l)| ≥ 2` | `Σ_{t ∈ T_valid(p,l)} end[p,l,t] ≤ 1` |

### 6.8 图示

```
产品A, 机组#1, 时间桶 t0-t7

情况1: 连续块（合法）
  t0  t1  t2  t3  t4  t5  t6  t7
  [A] [A] [A] [A]                     ← 一个连续块，end[t3]=1
   ↑                     ↑
  start                 end

  end 值: 0  0  0  1  0  0  0  0     ← Σ end = 1  ✓

情况2: 两个连续块（非法）
  t0  t1  t2  t3  t4  t5  t6  t7
  [A] [A]          [A] [A]            ← 两个不连续的块
   ↑       ↑        ↑       ↑
 start    end      start    end

  end 值: 0  1  0  0  0  1  0  0     ← Σ end = 2  ✗ 违反 AtMostOne

情况3: 空闲（合法）
  t0  t1  t2  t3  t4  t5  t6  t7
                                      ← 产品A不在机组#1生产

  end 值: 0  0  0  0  0  0  0  0     ← Σ end = 0  ✓
```

### 6.9 与 ProductionStructureConstraintBuilder 的关系

`ProductionStructureConstraintBuilder` 定义了 `start`/`end` 的**语义**，`ContinuityConstraintBuilder` 定义了 `end` 的**使用约束**。两者协作：

```
ProductionStructureConstraintBuilder     ContinuityConstraintBuilder
─────────────────────────────────        ──────────────────────────
end[p,l,t] = x[p,l,t] ∧ ¬x[p,l,t+1]    Σ_{t} end[p,l,t] ≤ 1
  （定义"结束"是什么意思）                  （限制"结束"最多发生一次）

start[p,l,t] = x[p,l,t] ∧ ¬x[p,l,t-1]
  （定义"开始"是什么意思）                  （本构建器不约束 start 数量，
                                           因为 AtMostOne(end) 已隐含保证）
```

`AtMostOne(end)` 之所以能保证"最多一个连续块"而不是"最多一个结束事件"，正是因为 `end` 的语义与 `x` 变量严格绑定。只要 end 的语义正确，限制 end 的数量就等于限制连续块的数量。

### 6.10 与 ChangeoverConstraintBuilder 的关系

`ChangeoverConstraintBuilder` 的 `buildProductBlock` 方法利用了连续性约束的保证来推导块属性：

```
startOrdinal = endOrdinal - Σ x[p,l,t] + used
```

这个公式成立的前提是：**被选中的桶形成且仅形成一个连续段**。如果允许两个连续块，"尾桶序号 - 选中桶数 + 1"就无法正确推出首桶序号（因为中间有间隔）。

```
ContinuityConstraintBuilder → 保证单块
                                    ↓
ChangeoverConstraintBuilder → startOrdinal = endOrdinal - selectedCount + used
                                    ↓
                              可以用 Element 约束映射首桶属性
```

可以说，`ContinuityConstraintBuilder` 是 `ChangeoverConstraintBuilder` 能用简洁公式推导块属性的**基石**。

---

## 七、DemandConstraintBuilder — 需求平衡约束

### 7.1 一句话总结

**已排产量 + 欠产量 = 需求量**——确保每个产品的排产总量与未完成量之和恰好等于其需求量，不会多也不会少。

### 7.2 业务背景

排产的核心目标就是满足需求。每个产品（排产计划明细）都有一个需求量，比如品牌A需要生产 500 箱。排产结果中，品牌A在各机组、各时间桶上的产量之和，加上没有完成的那部分（欠产），必须恰好等于 500 箱。

为什么不直接约束"已排产量 ≥ 需求量"？因为在实际排产中，受产能、时间等限制，**不一定能完全满足所有需求**。允许欠产存在，让求解器在"尽量满足需求"和"其他约束"之间找到最优平衡。欠产量 `unfulfilled` 作为一个变量暴露出来，后续可以被目标函数惩罚——最小化欠产就是"尽量满足需求"。

### 7.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`，非负整数） |
| `D(p)` | 产品 p 的整箱需求量（`demandScaled`，常量） |
| `u(p)` | 产品 p 的未完成需求量（`unfulfilled`，`IntVar`：0 ≤ u(p) ≤ D(p)） |

### 7.4 核心约束的数学表达

对每个产品 p：

```
(1)  Σ_{l,t} q[p,l,t] + u(p) = D(p)
```

即：**所有机组、所有时间桶上的排产总量 + 欠产量 = 需求量**。

### 7.5 逐行拆解

#### 遍历所有产品

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
```

对每个产品独立建立一条需求平衡约束。

#### 汇总所有产量变量

```java
LinearExprBuilder builder = LinearExpr.newBuilder();
for (PackScheduleLine line : problem.getLinesSafe()) {
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
        IntVar q = ctx.q(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucket.getIndex());
        if (q != null) {
            builder.add(q);
            qVarCount++;
        }
    }
}
```

双层循环遍历所有（机组, 时间桶）组合，收集该产品所有有效的 `q[p,l,t]` 变量，加入求和表达式。

`q != null` 表示该产品在该机组、该时间桶上有生产资格——如果 `q` 变量在建模时没有创建（比如该产品不能在该机组生产），自然不参与求和。

#### 创建欠产变量

```java
IntVar unfulfilled = model.newIntVar(
        0L,
        product.getDemandScaled(),
        String.format("unfulfilled_%d", product.getScheduleOrderPlanDetailId()));
ctx.putUnfulfilled(product.getScheduleOrderPlanDetailId(), unfulfilled);
```

- 域：`0 ≤ u(p) ≤ D(p)`——欠产量最少为 0（完全满足需求），最多等于需求量（完全没生产）
- 通过 `ctx.putUnfulfilled` 注册到上下文，供后续目标函数引用

#### 建立需求平衡等式

```java
builder.add(unfulfilled);
// (1) Σ_{l,t} q[p,l,t] + u(p) = D(p)
model.addEquality(builder, product.getDemandScaled());
```

将 `unfulfilled` 加入求和表达式，然后约束整个表达式等于需求量 `D(p)`。

### 7.6 约束的等价变形与含义

从 `(1)` 可以推导出：

```
u(p) = D(p) - Σ_{l,t} q[p,l,t]
```

即：欠产量 = 需求量 - 已排产量。因为 `u(p) ≥ 0`，所以隐含：

```
Σ_{l,t} q[p,l,t] ≤ D(p)
```

即：**总排产量不超过需求量**——排产不会"超额生产"。这在卷包排产中是合理的：多生产出来的产品没有需求对应，浪费产能。

### 7.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `Σ_{l,t} q[p,l,t] + u(p) = D(p)` | 已排产量 + 欠产量 = 需求量 |
| 隐含 | `Σ_{l,t} q[p,l,t] ≤ D(p)` | 总排产量不超过需求量 |
| 隐含 | `u(p) ≥ 0` | 欠产量非负 |
| 域约束 | `0 ≤ u(p) ≤ D(p)` | 欠产量在 0 到需求量之间 |

### 7.8 图示

```
产品A: 需求量 D = 500 箱

机组#1 各桶产量: 100 + 80 + 120 = 300
机组#2 各桶产量: 50 + 70       = 120
机组#3 各桶产量: 40 + 40       =  80
────────────────────────────────────
总排产:                      = 500
欠产 u:                      =   0    ← 完全满足需求 ✓

────────────────────────────────────

产品B: 需求量 D = 300 箱

机组#1 各桶产量: 60 + 50 = 110
机组#2 各桶产量: 40      =  40
────────────────────────────────────
总排产:                   = 150
欠产 u:                   = 150    ← 产能不足，欠产 150 箱

约束检查: 150 + 150 = 300 = D  ✓
```

### 7.9 unfulfilled 变量的后续用途

`unfulfilled` 变量不仅仅是约束的副产品，它还是**目标函数的重要输入**：

- `BrandMachinePriorityObjectiveBuilder` 可以通过最小化 `u(p)` 来驱动"尽量满足需求"
- 如果启用了"必须满足需求"硬约束（`MustFulfillDemandConstraintBuilder`），会直接约束 `u(p) = 0`
- 求解完成后，`u(p)` 的值用于统计欠产情况，评估排产质量

可以说，`DemandConstraintBuilder` 建立了排产模型中最基本的**物质守恒**——产量不会凭空产生，也不会凭空消失。

---

## 八、DueDateConstraintBuilder — 交货期排产窗口约束

### 8.1 一句话总结

**产品的排产必须在交期窗口内进行**：不能早于最早开始日期开工，不能晚于交期继续生产；严格模式下还要求窗口内的产量必须满足全部需求。

### 8.2 业务背景

卷包排产中，每个排产计划明细都有明确的交货期（deadline）和可选的最早开始日期。业务要求：

1. **不能延期生产**：交期之后的时间桶不允许再为该产品排产——交期已过，生产出来也来不及交付
2. **不能提前生产**：如果配置了最早开始日期，该日期之前不允许排产——可能是因为原料未到、前序工序未完成等原因
3. **严格模式下必须按期完成**：如果同时启用了"满足需求"约束，则窗口内的累计产量必须 ≥ 需求量——不允许欠产延期

交期窗口约束本质上是在时间维度上给排产划定**合法区间**，窗口之外的生产活动被禁止。

### 8.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`） |
| `t₀(p)` | 产品 p 的最早开始桶序号（`earliestStartBucketIndex`） |
| `t_d(p)` | 产品 p 的交期桶序号（`dueBucketIndex`） |
| `D_due(p)` | 产品 p 在交期窗口内必须完成的需求量（`dueDemandScaled`） |

交期窗口：`t₀(p) ≤ t ≤ t_d(p)`

### 8.4 约束的数学表达

#### (1) 禁止窗口外生产（宽松模式）

```
t < t₀(p) 或 t > t_d(p) 时，q[p,l,t] = 0
```

等价于：

```
t < t₀(p):  q[p,l,t] = 0    （交期之前，不允许提前生产）
t > t_d(p): q[p,l,t] = 0    （交期之后，不允许延期生产）
```

此约束在 `mustFulfillDemand` 未启用时生效（宽松模式），也作为严格模式的前置约束。

#### (2) 严格模式：窗口内满足需求

```
Σ_{l, t₀(p)≤t≤t_d(p)} q[p,l,t] ≥ D_due(p)
```

此约束仅在 `mustFulfillDemand` 启用时生效（严格模式），要求交期窗口内的累计产量必须满足需求量。

### 8.5 两种模式

| 模式 | 条件 | 约束 | 含义 |
|------|------|------|------|
| 宽松模式 | `mustFulfillDemand` 未启用 | 仅 (1) | 禁止窗口外生产，但允许窗口内欠产 |
| 严格模式 | `mustFulfillDemand` 启用 | (1) + (2) | 禁止窗口外生产，且窗口内必须满足需求 |

宽松模式允许"交期内做不完"——产量不够需求，但不允许拖到交期之后继续做。严格模式则不允许"做不完"——必须在交期内完成。

### 8.6 逐行拆解

#### 模式判断与分支

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    if (diagnosticMode == DiagnosticMode.BOUNDARY_ONLY) {
        if (!problem.isMustFulfillDemandEnabled()) {
            forbidProductionOutsideWindow(model, ctx, problem, product);
        }
        continue;
    }
    if (diagnosticMode == DiagnosticMode.FULL
            && !problem.isMustFulfillDemandEnabled()) {
        forbidProductionOutsideWindow(model, ctx, problem, product);
        continue;
    }
    if (!problem.isMustFulfillDemandEnabled()) {
        continue;
    }
```

三种 `DiagnosticMode` 的行为：

| DiagnosticMode | mustFulfillDemand=false | mustFulfillDemand=true |
|----------------|------------------------|------------------------|
| FULL | 仅约束 (1) | 约束 (1) + (2) |
| BOUNDARY_ONLY | 仅约束 (1) | 不执行（跳过） |
| STRICT_ONLY | 不执行（跳过） | 仅约束 (2) |

#### 严格模式：窗口内产量 ≥ 需求

```java
LinearExprBuilder builder = LinearExpr.newBuilder();
for (PackScheduleLine line : problem.getLinesSafe()) {
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
        // 仅汇总窗口内：t₀(p) ≤ t ≤ t_d(p)
        if (bucket.getIndex() > product.getDueBucketIndex()) {
            continue;
        }
        if (isEarliestStartActive(problem)
                && bucket.getIndex() < product.getEarliestStartBucketIndex()) {
            continue;
        }
        IntVar q = ctx.q(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucket.getIndex());
        if (q != null) {
            builder.add(q);
        }
    }
}
// (2) Σ_{l, t₀(p)≤t≤t_d(p)} q[p,l,t] ≥ D_due(p)
model.addGreaterOrEqual(builder, product.getDueDemandScaled());
```

双层循环遍历所有（机组, 时间桶），但只汇总**交期窗口内**的产量变量，然后约束窗口内总产量 ≥ 需求量。

注意：严格模式下不需要额外调用 `forbidProductionOutsideWindow`，因为约束 (2) 已经隐含了窗口外产量为 0——由 `DemandConstraintBuilder` 的 `Σq + u = D` 和约束 (2) 的 `窗口内Σq ≥ D` 共同保证：窗口内已满足全部需求，窗口外的 q 自然为 0（因为总产量 ≤ 需求量）。

#### 禁止窗口外生产（宽松模式）

```java
private void forbidProductionOutsideWindow(...) {
    for (PackScheduleLine line : problem.getLinesSafe()) {
        for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
            // 窗口内的桶跳过
            if (bucket.getIndex() <= product.getDueBucketIndex()
                    && (!isEarliestStartActive(problem)
                    || bucket.getIndex() >= product.getEarliestStartBucketIndex())) {
                continue;
            }
            // (1) 窗口外：q[p,l,t] = 0
            IntVar q = ctx.q(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucket.getIndex());
            if (q != null) {
                model.addEquality(q, 0L);
            }
        }
    }
}
```

遍历所有（机组, 时间桶），对**交期窗口之外**的桶，强制 `q = 0`。

判断"窗口外"的条件取反：
- 窗口内：`t₀ ≤ t ≤ t_d`
- 窗口外：`t < t₀` 或 `t > t_d`

当 `isEarliestStartActive = false`（未配置最早开始日期）时，窗口简化为 `t ≤ t_d`（只限制不晚于交期），窗口外只有 `t > t_d`。

### 8.7 数学总结

| 约束 | 数学表达 | 条件 | 含义 |
|------|----------|------|------|
| (1a) | `t > t_d(p) ⟹ q[p,l,t] = 0` | 宽松/严格 | 交期之后禁止生产 |
| (1b) | `t < t₀(p) ⟹ q[p,l,t] = 0` | 配置了最早开始日期时 | 最早开始之前禁止生产 |
| (2) | `Σ_{l, t₀≤t≤t_d} q[p,l,t] ≥ D_due(p)` | 严格模式（mustFulfillDemand） | 窗口内产量必须满足需求 |

### 8.8 图示

```
时间轴:   t0  t1  t2  t3  t4  t5  t6  t7  t8  t9
                  ↑               ↑
              最早开始 t₀       交期 t_d

交期窗口:        [======= 合法区间 =======]

约束 (1) 效果:
  t0, t1:       q = 0  ← 早于最早开始，禁止生产
  t6, t7, t8:   q = 0  ← 晚于交期，禁止生产
  t2-t5:        q 自由  ← 窗口内，允许生产

约束 (2) 效果（严格模式）:
  Σ_{t2..t5} q ≥ D_due   ← 窗口内必须做够

宽松模式 vs 严格模式:
  宽松: 窗口内可以做不够（允许欠产），但不准在窗口外补
  严格: 窗口内必须做够（不允许欠产）
```

### 8.9 与 DemandConstraintBuilder 的关系

`DemandConstraintBuilder` 和 `DueDateConstraintBuilder` 在严格模式下协同工作：

```
DemandConstraintBuilder:     Σ_{所有 l,t} q + u = D        （物质守恒）
DueDateConstraintBuilder:    Σ_{窗口内 l,t} q ≥ D_due      （窗口内满足需求）
```

严格模式下的推导：

1. 由约束 (2)：窗口内 Σq ≥ D_due（D_due = D，首版等于总需求）
2. 由 DemandConstraintBuilder：窗口内 Σq + 窗口外 Σq + u = D
3. 代入：D + 窗口外 Σq + u = D，即 窗口外 Σq + u = 0
4. 因为 q ≥ 0 和 u ≥ 0：窗口外 Σq = 0，u = 0

所以严格模式下，约束 (2) 隐含了约束 (1) 和 u = 0，这也是为什么严格模式代码路径不需要额外调用 `forbidProductionOutsideWindow`。

### 8.10 DiagnosticMode 说明

| 模式 | 用途 |
|------|------|
| `FULL` | 正式排产模式，完整执行所有适用的约束 |
| `BOUNDARY_ONLY` | 仅执行窗口边界约束 (1)，跳过严格需求约束 (2)。用于分阶段诊断：先验证窗口边界是否导致无解 |
| `STRICT_ONLY` | 仅执行严格需求约束 (2)，跳过窗口边界约束 (1)。用于验证"如果允许窗口外生产，需求能否满足" |

---

## 九、FirstBucketStartConstraintBuilder — 首桶开工约束

### 9.1 一句话总结

**同一机组在整个排产周期内一旦被使用，则该机组的首个可排产桶必须开工**——后续任意可用桶在生产，首桶就必须在生产。

### 9.2 业务背景

卷包排产中，每台机组在整个排产周期内有一个"首个可排产桶"（即排产时间轴上第一个允许生产的桶）。业务要求：如果该机台在整个周期内有任何生产活动，那么它必须从第一个可用桶就开始——不允许跳过首桶、从更晚的桶才开始生产。

这个约束的工程逻辑：机组一旦启动就应尽早投入生产，避免"前面空着、后面才开"的碎片化排产方式。首桶开工是机组被使用的"启动标志"。

**注意**：这里说的是整个排产周期的第一个可排产桶，不是某一天的第一个桶。

### 9.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（`BoolVar`：0/1） |
| `t_f(l)` | 机组 l 在整个排产周期内的首个可排产桶序号（`firstSchedulableBucket`） |
| `T_avail(l)` | 机组 l 所有可用时间桶的集合（`isAvailable(l,t) = true`） |

### 9.4 约束的数学表达

对每个机组 `l`，对每个后续可用桶 `t ∈ T_avail(l) \ {t_f(l)}`：

$$
u[l,t] = 1 \;\Longrightarrow\; u[l,\, t_f(l)] = 1
$$

即：**任意后续可用桶一旦生产，首桶必须生产**。

等价逆否命题：

$$
u[l,\, t_f(l)] = 0 \;\Longrightarrow\; u[l,t] = 0, \quad \forall\, t \in T_{avail}(l) \setminus \{t_f(l)\}
$$

即：**首桶不生产 ⟹ 所有后续可用桶都不生产**——首桶是"总开关"，首桶不开，整台机组不允许使用。

#### 约束的等价全局形式

上述多条局部蕴含等价于一条全局约束：

$$
\max_{t \in T_{avail}(l)} u[l,t] \;\leq\; u[l,\, t_f(l)]
$$

或更直观地：

$$
\exists\, t \in T_{avail}(l):\, u[l,t] = 1 \;\Longrightarrow\; u[l,\, t_f(l)] = 1
$$

代码中选择用**多条 `addImplication`** 而非一条全局约束，因为局部蕴含的传播效率更高——求解器可以在每个 `u[l,t]` 被赋值为 1 时立刻传播首桶，无需等待全周期求和完成。

### 9.5 逐行拆解

#### 前置守卫：首桶开工开关

```java
if (!problem.isFirstBucketStartControlEnabled()) {
    return;
}
```

首桶开工约束是**可选**的，由 `firstBucketStartControlEnabled` 配置控制。未启用时不约束，求解器可以自由安排首桶是否生产。

#### 遍历所有机组

```java
for (PackScheduleLine line : problem.getLinesSafe()) {
    bindRuleForLine(ctx, problem, model, line);
}
```

对每台机组独立建立约束，机组之间互不影响。

#### 获取首桶索引与变量

```java
Integer firstBucketIndex = problem.getFirstSchedulableBucket(lineId);
if (firstBucketIndex == null) {
    return;
}
BoolVar firstBucketProduction = ctx.u(lineId, firstBucketIndex);
if (firstBucketProduction == null) {
    return;
}
```

- `firstBucketIndex`：机组 l 的首桶序号 `t_f(l)`。如果为 null，说明该机组没有可排产桶（整个周期不可用），直接跳过
- `firstBucketProduction`：首桶的生产状态变量 `u[l, t_f(l)]`。如果为 null，说明该桶建模时未创建 `u` 变量，无法建立蕴含，跳过

#### 对每个后续可用桶建立蕴含

```java
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    int bucketIndex = bucket.getIndex();
    if (!problem.isAvailable(lineId, bucketIndex) || bucketIndex == firstBucketIndex) {
        continue;
    }
    BoolVar bucketProduction = ctx.u(lineId, bucketIndex);
    if (bucketProduction == null) {
        continue;
    }
    // u[l,t] = 1  ⟹  u[l, t_f(l)] = 1
    model.addImplication(bucketProduction, firstBucketProduction);
}
```

三层过滤：
1. **不可用桶跳过**（`!isAvailable`）：停机/维修/节假日的桶不参与
2. **首桶自身跳过**（`bucketIndex == firstBucketIndex`）：不需要对自身建立蕴含
3. **无 u 变量跳过**（`bucketProduction == null`）：建模时未创建变量的桶不参与

对每个通过过滤的后续可用桶，调用 `model.addImplication(bucketProduction, firstBucketProduction)`，建立 `u[l,t] ⟹ u[l, t_f(l)]` 的蕴含约束。

### 9.6 为什么用 addImplication 而非全局线性约束？

一种替代方案是引入辅助变量 `lineUsed`（机组是否被使用）并建立：

```
lineUsed = 1  ⟺  Σ_{t ∈ T_avail(l)} u[l,t] ≥ 1
lineUsed = 1  ⟹  u[l, t_f(l)] = 1
```

即 `AppendStartContinuityConstraintBuilder` 的做法。对比：

| 维度 | addImplication（本类） | lineUsed + 线性约束 |
|------|----------------------|---------------------|
| 变量 | 无额外变量 | 需要 `lineUsed` BoolVar |
| 约束 | n-1 条蕴含（n = 可用桶数） | 3 条约束（Σ≥1、Σ=0、u[t_f]=1） |
| 传播速度 | 局部：单桶赋值立即传播首桶 | 全局：需等待求和变量传播 |
| 求解器效率 | 更高（蕴含是 CP-SAT 原生高效约束） | 略低（线性约束传播较慢） |

本类不需要 `lineUsed` 辅助变量，因为业务只要求"后续桶生产 ⟹ 首桶生产"，不需要反方向"首桶生产 ⟹ 机组被使用"。多条蕴含比全局求和约束更轻量、传播更快。

### 9.7 数学总结

| 条件 | 约束 |
|------|------|
| `firstBucketStartControlEnabled = false` | 无约束 |
| `t_f(l)` 或 `u[l, t_f(l)]` 不存在 | 无约束（机组无可用首桶） |
| 正常情况 | `∀t ∈ T_avail(l) \ {t_f(l)}: u[l,t] = 1 ⟹ u[l, t_f(l)] = 1` |

### 9.8 图示

```
机组#1, 首桶 t_f = t0

时间轴:  t0  t1  t2  t3  t4  t5  t6  t7
          ↑
        首桶

情况1: 机组被使用（合法）
  t0: u=1  ← 首桶开工
  t1: u=1
  t2: u=0
  t3: u=1
  ✓ 所有在生产桶中，首桶也在生产

情况2: 首桶空闲、后续生产（非法）
  t0: u=0  ← 首桶没开工
  t1: u=1  ← 后续桶在生产
  t2: u=1
  ✗ u[t1]=1 ⟹ u[t0]=1，但 u[t0]=0，违反蕴含

情况3: 机组完全空闲（合法）
  t0: u=0
  t1: u=0
  t2: u=0
  ✓ 没有任何桶在生产，不触发蕴含

蕴含传播示意：
  t1=1 ──→ t0=1
  t2=1 ──→ t0=1
  t3=1 ──→ t0=1
  ...
  任意一个后续桶 = 1，首桶立刻被传播为 1
```

### 9.9 与 AppendStartContinuityConstraintBuilder 的对比

两个构建器都涉及"首桶必须开工"，但语义不同：

| 维度 | FirstBucketStart | AppendStartContinuity |
|------|-----------------|----------------------|
| 首桶定义 | 整个排产周期的第一个可排产桶 `t_f(l)` | 历史任务结束后的续排首桶 `t₀(l)` |
| 业务含义 | 机组一旦使用，必须从周期起点开始 | 有历史任务的机组继续排产时，必须紧贴历史任务 |
| 建模方式 | 多条 `addImplication`，无辅助变量 | `lineUsed` + 条件约束 |
| 反向约束 | 无（首桶=1 不要求后续桶=1） | 有（lineUsed=0 ⟹ 所有桶=0） |
| 适用机组 | 所有机组 | 有历史续排任务的机组 |

`FirstBucketStartConstraintBuilder` 是**周期级别**的约束——确保机组从排产时间轴的起点开始；`AppendStartContinuityConstraintBuilder` 是**续排级别**的约束——确保机组从历史任务的衔接点开始。两者可以同时作用于同一机组。

---

## 十、FeederMaterialConsistencyConstraintBuilder — 喂丝机同桶单计划明细约束

### 10.1 一句话总结

**同一喂丝机在同一时间桶中，所有关联机组只能生产同一种产品（计划明细）**——不允许喂丝机的不同关联机组在同一桶生产不同产品。

### 10.2 业务背景

卷包车间中，**喂丝机**（feeder）是一种为多台下游机组供料的共享设备。一台喂丝机同时连接多台机组（如 2-4 台卷接包机组），这些机组共享喂丝机输送的物料。

关键物理约束：**喂丝机同一时刻只能输送一种物料**。如果喂丝机在某个时间段只供品牌A的原料，那么所有连接在该喂丝机上的机组，如果在该时间段生产，就只能是品牌A——不可能同一台喂丝机一半送品牌A的原料、一半送品牌B的原料。

翻译到排产模型：同一喂丝机关联的机组在同一个时间桶内，**最多只能出现一种计划明细**。某些关联机组可以在该桶空闲（不生产），但只要在生产，就必须是同一种产品。

### 10.3 符号约定

| 符号 | 含义 |
|------|------|
| `g` | 喂丝机ID（feederId） |
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `x[p,l,t]` | 产品 p 是否在机组 l、时间桶 t 上生产（`BoolVar`：0/1） |
| `m[g,p,t]` | 喂丝机 g 在时间桶 t 上是否出现产品 p（`BoolVar`：0/1，辅助指示变量） |
| `L(g)` | 喂丝机 g 关联的机组集合（`feederLineGroups`） |

### 10.4 约束的数学表达

#### (1) 指示变量定义

对每个喂丝机 g、每个产品 p、每个时间桶 t：

$$
m[g,p,t] = \max_{l \in L(g)} x[p,l,t]
$$

即：喂丝机 g 的任意关联机组在该桶生产了产品 p，则指示变量 `m = 1`；所有关联机组都没生产 p，则 `m = 0`。

`addMaxEquality(m, [x₁, x₂, ...])` 的语义：`m` 等于所有 `x` 的逻辑或（因为都是 BoolVar，max = OR）。

#### (2) 同桶最多一种产品

对每个喂丝机 g、每个时间桶 t：

$$
\sum_p m[g,p,t] \leq 1
$$

即：同一喂丝机在同一桶内，最多只有一种产品的指示变量为 1。等价于：**同一喂丝机关联的机组在同一桶内只能生产同一种产品**。

### 10.5 逐行拆解

#### 前置守卫：喂丝机关联开关

```java
if (!problem.isFeederRelationshipEnabled()) {
    return;
}
```

喂丝机约束是**可选**的，由 `feederRelationshipEnabled` 配置控制。未启用时不约束——当车间没有喂丝机或不需要建模喂丝机约束时跳过。

#### 遍历喂丝机分组

```java
for (Map.Entry<Long, List<Long>> entry : problem.getFeederLineGroupsSafe().entrySet()) {
    List<Long> lineIds = filterLines(problem, entry.getValue());
    if (lineIds.size() < 2) {
        continue;
    }
```

- `feederLineGroups`：喂丝机 → 关联机组列表的映射。例如 `{ feeder1: [line1, line2, line3] }`
- `filterLines`：过滤有效的机组ID（去 null、去不存在于当前问题的机组、去重保序）
- **关联机组 < 2 时跳过**：只有一台机组关联时，不存在"不同机组选不同产品"的冲突，天然满足约束

#### 逐桶建立约束

```java
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    addPlanDetailConsistencyPerBucket(ctx, model, entry.getKey(), lineIds, bucket);
}
```

对每个喂丝机 g、每个时间桶 t，独立建立约束。

#### 步骤一：为每个产品构建指示变量

```java
for (PackScheduleProduct product : products) {
    List<BoolVar> production = new ArrayList<>();
    for (Long lineId : lineIds) {
        BoolVar x = ctx.x(product.getScheduleOrderPlanDetailId(), lineId, bucket.getIndex());
        if (x != null) {
            production.add(x);
        }
    }
    if (production.isEmpty()) {
        continue;
    }
    BoolVar materialPresent = ctx.feederMaterialPresence(
            feederId, product.getScheduleOrderPlanDetailId(), bucket.getIndex());
    if (materialPresent == null) {
        materialPresent = model.newBoolVar(...);
        // (1) m[g,p,t] = max_{l ∈ L(g)} x[p,l,t]
        model.addMaxEquality(materialPresent, production.toArray(new BoolVar[0]));
        ctx.putFeederMaterialPresence(..., materialPresent);
    }
    present.add(materialPresent);
}
```

对每个产品 p：
1. 收集喂丝机关联机组中，产品 p 在该桶的所有指派变量 `x[p,l,t]`
2. 如果全部为 null（该产品不能在任何关联机组上生产），跳过
3. 从上下文缓存中取出或新建指示变量 `m[g,p,t]`
4. 用 `addMaxEquality` 将 `m` 与所有 `x` 绑定：任一 `x=1` 则 `m=1`
5. 通过 `ctx.putFeederMaterialPresence` 缓存，避免重复创建

**为什么要缓存 `m` 变量？** 同一 (喂丝机, 产品, 桶) 组合可能在多个约束构建器中被引用，缓存确保只创建一次、约束也只添加一次。

#### 步骤二：同桶最多一种产品

```java
if (!present.isEmpty()) {
    // (2) Σ_p m[g,p,t] ≤ 1
    model.addLessOrEqual(LinearExpr.sum(present.toArray(new BoolVar[0])), 1L);
}
```

将所有产品的指示变量求和，约束不超过 1——同桶最多出现一种产品。

### 10.6 指示变量 m 的等价展开

`m[g,p,t] = max_{l ∈ L(g)} x[p,l,t]` 可以展开为两条线性约束：

```
m[g,p,t] ≥ x[p,l,t]        ∀l ∈ L(g)     （任一 x=1 则 m=1）
m[g,p,t] ≤ Σ_{l ∈ L(g)} x[p,l,t]          （所有 x=0 则 m=0）
```

但 `addMaxEquality` 是 CP-SAT 的原生约束，求解器内部使用更高效的传播规则，比手写两条线性约束更优。

### 10.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `m[g,p,t] = max_{l ∈ L(g)} x[p,l,t]` | 指示变量：喂丝机关联机组中任一生产p，则m=1 |
| (2) | `Σ_p m[g,p,t] ≤ 1` | 同桶最多一种产品 |

| 条件 | 行为 |
|------|------|
| `feederRelationshipEnabled = false` | 无约束 |
| `|L(g)| < 2` | 无约束（单机组无冲突） |
| `production` 为空（产品无资格在关联机组生产） | 不创建指示变量，不参与求和 |
| 正常情况 | 建立约束 (1) + (2) |

### 10.8 图示

```
喂丝机 #1 关联机组: line1, line2, line3

时间桶 t=5:
  产品A: x[A,1,5]=1, x[A,2,5]=1, x[A,3,5]=0
  产品B: x[B,1,5]=0, x[B,2,5]=0, x[B,3,5]=0
  产品C: x[C,1,5]=0, x[C,2,5]=0, x[C,3,5]=0

  指示变量:
    m[1,A,5] = max(1,1,0) = 1    ← line1 或 line2 在生产A
    m[1,B,5] = max(0,0,0) = 0
    m[1,C,5] = max(0,0,0) = 0

  约束检查: m[A] + m[B] + m[C] = 1 ≤ 1  ✓
  含义: 喂丝机#1 在 t5 只输送了品牌A的原料

──────────────────────────────────────────

时间桶 t=8 (非法情况):
  产品A: x[A,1,8]=1, x[A,2,8]=0, x[A,3,8]=0
  产品B: x[B,1,8]=0, x[B,2,8]=1, x[B,3,8]=0

  指示变量:
    m[1,A,8] = max(1,0,0) = 1    ← line1 在生产A
    m[1,B,8] = max(0,1,0) = 1    ← line2 在生产B

  约束检查: m[A] + m[B] = 2 ≤ 1  ✗ 违反！
  含义: 喂丝机#1 不可能同时送品牌A和品牌B的原料
```

### 10.9 与 AssignmentConstraintBuilder 的关系

`AssignmentConstraintBuilder` 约束的是**单台机组**内部：一个机组一个桶最多一个产品。`FeederMaterialConsistencyConstraintBuilder` 约束的是**喂丝机组**层面：多台关联机组在同一桶内必须选同一种产品。

```
AssignmentConstraintBuilder              FeederMaterialConsistencyConstraintBuilder
───────────────────────────              ───────────────────────────────────────────
单机组: Σ_p x[p,l,t] ≤ 1               喂丝机: Σ_p m[g,p,t] ≤ 1
（一台机组一个桶最多一个产品）              （喂丝机一个桶最多一种产品）

m[g,p,t] = max_{l ∈ L(g)} x[p,l,t]
（喂丝机层面的"是否出现产品p"由机组层面聚合而来）
```

两者的层次关系：

```
喂丝机 g ─── m[g,p,t] ≤ 1（喂丝机层面：同桶单产品）
   │
   ├── 机组 l₁ ─── Σ_p x[p,l₁,t] ≤ 1（机组层面：单桶单产品）
   ├── 机组 l₂ ─── Σ_p x[p,l₂,t] ≤ 1
   └── 机组 l₃ ─── Σ_p x[p,l₃,t] ≤ 1
```

Assignment 是机组内部的互斥，FeederMaterialConsistency 是机组之间的物料一致性。喂丝机约束**在 Assignment 约束之上**进一步限制：即使每台机组内部合法（各选了一个产品），如果不同机组选了不同产品，喂丝机约束仍然会判非法。

### 10.10 为什么不直接约束"所有关联机组选同一个产品"？

一个直观的想法是：直接约束 `x[p,l₁,t] = x[p,l₂,t]`（关联机组选择一致）。但这种方式：

1. 需要对所有 (产品, 机组对) 组合建立等式，约束数量为 O(|P| × |L(g)|²)
2. 不允许部分关联机组空闲——等式约束会强制所有关联机组同步开停

引入指示变量 `m` 后：

1. 约束数量降为 O(|P|)（指示变量定义）+ O(1)（求和 ≤ 1），显著更少
2. 自然允许部分关联机组空闲——只要没有生产不同产品，`m` 的求和就不超 1

这是用**聚合 + 全局约束**代替**逐对等式**的典型建模技巧。

---

## 十一、ForbidReturnToFinishedMaterialConstraintBuilder — 禁止回切已完成物料约束

### 11.1 一句话总结

**如果机组后面还能继续生产当前物料，就不能提前切走**——一旦机组结束了某物料，该物料的全局累计产量必须已经等于总需求，即"做完了才能换"。

### 11.2 业务背景

卷包排产中，同一台机组可以在不同时间段生产不同牌号。排产时可能出现一种不合理情况：机组在做品牌A，还没做完就切去做品牌B，之后品牌A在别的机组上也没做完，最终品牌A欠产。

更严重的场景：机组做完品牌A后切走，之后品牌A还有欠产，但该机组完全有能力回来继续做品牌A——这种"有产能却不用完就换"的排产方式在工艺上不合理，会导致不必要的换产次数和碎片化排产。

业务规则：**如果某台机组对某物料在后续还有可排产的产能桶，那么该机组一旦结束了该物料，该物料的全局累计产量必须已经等于需求量**。换句话说：只有做完了才能换；没做完就不准换，除非后面确实没有产能了（被"逼"换产）。

### 11.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`） |
| `end[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块的结束（`BoolVar`：0/1） |
| `P(p,t)` | 产品 p 截止到桶 t 的全局累计产量（`IntVar`，辅助变量 `producedThrough`） |
| `D(p)` | 产品 p 的整箱需求量（`demandScaled`，常量） |
| `F(p,l,t)` | 机组 l 在桶 t 之后是否仍存在对产品 p 的可排产正产能桶（布尔条件，编译期判断） |

### 11.4 约束的数学表达

#### (1) 累计产量递推定义

对每个产品 p、每个时间桶 t：

$$
P(p,t) = P(p,t-1) + \sum_l q[p,l,t]
$$

首桶无前序：

$$
P(p,t_0) = \sum_l q[p,l,t_0]
$$

域约束：

$$
0 \leq P(p,t) \leq D(p)
$$

`P(p,t)` 的含义：截止到桶 t（含 t），所有机组上产品 p 的产量之和。这是一个递推定义——每桶在前一桶的累计基础上叠加当前桶的新增产量。

#### (2) 核心约束：结束即完成

对每个有未来产能的 (p, l, t) 组合（即 `F(p,l,t) = true`）：

$$
end[p,l,t] = 1 \;\Longrightarrow\; P(p,t) = D(p)
$$

即：**如果机组 l 在桶 t 结束了产品 p，且该机组后续仍能生产 p，那么截止桶 t 的全局累计产量必须等于需求量**——产品 p 已经做完了，才允许该机组切走。

#### F(p,l,t) 的定义

$$
F(p,l,t) = \text{true} \;\Longleftrightarrow\; \exists\, t' > t:\; \text{isAvailable}(l,t') \;\wedge\; \text{cap}(p,l,t') > 0
$$

即：机组 l 在桶 t 之后，存在至少一个可用且有正产能的桶。这是**编译期**判断——在构建约束时直接计算，不引入求解器变量。如果 `F = false`（机组后续无法再生产该物料），就不建立约束 (2)，允许机组自由结束——因为后续确实没有产能，"有产能却不用完"的问题不存在。

### 11.5 逐行拆解

#### 前置守卫：禁止回切开关

```java
if (!problem.isForbidReturnToFinishedMaterialEnabled()) {
    return;
}
```

约束是**可选**的，由 `forbidReturnToFinishedMaterialEnabled` 配置控制。

#### 步骤一：构建累计产量变量

```java
Map<Long, Map<Integer, IntVar>> producedThroughVars = buildProducedThroughVars(model, ctx, problem);
```

调用 `buildProducedThroughVars` 为每个产品在每个桶构建 `P(p,t)` 变量。

##### buildProducedThroughVars 内部

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    long demandScaled = product.getDemandScaled();
    IntVar previousProducedThrough = null;
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
        IntVar producedThrough = model.newIntVar(0L, demandScaled, ...);
        LinearExprBuilder producedExpr = LinearExpr.newBuilder();
        // 非首桶：叠加前一桶的累计值 P(p,t-1)
        if (previousProducedThrough != null) {
            producedExpr.add(previousProducedThrough);
        }
        // 叠加当前桶所有机组的新增产量 Σ_l q[p,l,t]
        for (PackScheduleLine line : problem.getLinesSafe()) {
            IntVar q = ctx.q(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucketIndex);
            if (q != null) {
                producedExpr.add(q);
            }
        }
        // (1) P(p,t) = P(p,t-1) + Σ_l q[p,l,t]
        model.addEquality(producedThrough, producedExpr);
        previousProducedThrough = producedThrough;
    }
}
```

关键设计：
- `producedThrough` 的域为 `[0, D(p)]`——累计产量不会超过需求量（由 `DemandConstraintBuilder` 的 `Σq + u = D` 保证）
- 首桶时 `previousProducedThrough = null`，表达式只有 `Σ_l q[p,l,t₀]`
- `q != null` 过滤：如果产品 p 不能在某个机组生产，对应的 `q` 变量不存在，自然不参与求和

#### 步骤二：建立条件约束

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    long demandScaled = product.getDemandScaled();
    if (demandScaled <= 0L) { continue; }
    Map<Integer, IntVar> cumulativeByBucket = producedThroughVars.get(...);
    for (PackScheduleLine line : problem.getLinesSafe()) {
        for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
            // F(p,l,t)：是否还有未来产能
            if (!hasFutureCapacity(...)) { continue; }
            BoolVar end = ctx.end(product.getScheduleOrderPlanDetailId(), line.getLineId(), bucketIndex);
            IntVar producedThrough = cumulativeByBucket.get(bucketIndex);
            if (end == null || producedThrough == null) { continue; }
            // (2) end[p,l,t] = 1  ⟹  P(p,t) = D(p)
            model.addEquality(producedThrough, demandScaled).onlyEnforceIf(end);
        }
    }
}
```

三层过滤：
1. **需求量 ≤ 0**：无需求的产品不需要约束
2. **F(p,l,t) = false**：没有未来产能的机组允许自由结束
3. **end 或 P(p,t) 不存在**：建模时未创建的变量不参与

对每个通过过滤的 (p, l, t)，用 `onlyEnforceIf(end)` 建立条件约束：`end = 1` 时强制 `P(p,t) = D(p)`。

#### hasFutureCapacity 的判断逻辑

```java
private boolean hasFutureCapacity(PackScheduleProblem problem, Long productId, Long lineId, int currentBucketIndex) {
    for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
        int futureBucketIndex = bucket.getIndex();
        if (futureBucketIndex <= currentBucketIndex) { continue; }
        if (!problem.isAvailable(lineId, futureBucketIndex)) { continue; }
        if (problem.getCapacity(productId, lineId, futureBucketIndex) > 0L) { return true; }
    }
    return false;
}
```

遍历当前桶之后的所有桶，检查是否存在**可用**且**有正产能**的桶。这是一个纯数据判断，不涉及求解器变量——在约束构建阶段就能确定哪些 (p, l, t) 需要约束，哪些不需要。

### 11.6 累计产量 P(p,t) 的性质

由递推定义 (1) 和 `DemandConstraintBuilder` 的约束 `Σ_{l,t} q + u = D`，可以推导：

$$
P(p, t_{last}) = \sum_{t \leq t_{last}} \sum_l q[p,l,t] = D(p) - u(p)
$$

即：最后一个桶的累计产量 = 需求量 - 欠产量。这是自然的——累计产量就是"到目前为止总共做了多少"。

### 11.7 约束 (2) 的业务效果分析

约束 `end[p,l,t] = 1 ⟹ P(p,t) = D(p)` 有两层含义：

1. **防止"有产能不用完就换"**：如果机组 l 后续还能生产 p（F=true），结束 p 时必须 p 已经做完（P=D）。这排除了"机组 A 做 p 做到一半切走做别的，p 还欠产但 A 后面明明能继续做"的情况。

2. **允许"被逼换产"**：如果 F=false（后续没有产能），约束不建立，机组可以自由结束。这对应物理场景：机组 l 的排产窗口之后是停机/维修/其他不可用时段，确实无法继续生产 p，此时在当前桶结束 p 是唯一选择。

3. **不强制"做完才能在任何机组结束"**：约束只限制**有未来产能的机组**。如果机组 l₂ 后续没有产能，即使 p 还没做完，l₂ 也可以结束——剩下的产量由其他机组承担。

### 11.8 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `P(p,t) = P(p,t-1) + Σ_l q[p,l,t]` | 累计产量递推定义 |
| (1a) | `P(p,t₀) = Σ_l q[p,l,t₀]` | 首桶无前序 |
| (1b) | `0 ≤ P(p,t) ≤ D(p)` | 域约束 |
| (2) | `end[p,l,t] = 1 ⟹ P(p,t) = D(p)`（仅 F(p,l,t) = true 时建立） | 结束即完成 |

| 条件 | 行为 |
|------|------|
| `forbidReturnToFinishedMaterialEnabled = false` | 无约束 |
| `D(p) ≤ 0` | 无约束（无需求） |
| `F(p,l,t) = false` | 无约束（后续无产能，允许自由结束） |
| `end[p,l,t]` 或 `P(p,t)` 不存在 | 无约束（建模时未创建） |
| 正常情况 | 建立约束 (2) |

### 11.9 图示

```
产品A: 需求 D = 500 箱
机组#1 对产品A的产能分布: t0✓ t1✓ t2✓ t3✓ t4✓ t5停机 t6停机

时间轴:  t0   t1   t2   t3   t4   t5   t6
机组#1:  可用  可用  可用  可用  可用  停机  停机

──────────────────────────────────────────

情况1: 在 t2 结束，但产品A没做完（非法）
  t0: q=100  t1: q=80  t2: q=50  ← end[t2]=1
  P(t2) = 100+80+50 = 230 < 500 = D
  F(A,#1,t2) = true（t3、t4 还有产能）
  约束 (2): end=1 ⟹ P=500，但 P=230  ✗ 违反！
  含义: 机组#1 后面还能做A，不应该做到一半就切走

──────────────────────────────────────────

情况2: 在 t4 结束，产品A已做完（合法）
  t0: q=120  t1: q=130  t2: q=100  t3: q=100  t4: q=50  ← end[t4]=1
  P(t4) = 120+130+100+100+50 = 500 = D
  F(A,#1,t4) = true（技术上有，但后面 t5+t6 停机 → 实际 F=false）
  约束 (2): 未建立（F=false）或 P=500 满足  ✓ 合法

──────────────────────────────────────────

情况3: 在 t4 结束，但由其他机组补足（合法）
  机组#1: t0: q=120  t1: q=130  t2: end[t2]=1
  机组#2: t3: q=100  t4: q=150
  P(t2) = 120+130+... = 需要看机组#2 的贡献
  
  如果 P(t2) = 500（其他机组已补足）:
    约束 (2): P=500=D  ✓ 合法
  
  如果 P(t2) = 250（其他机组也没做完）:
    约束 (2): P=250≠500  ✗ 非法——机组#1 后面还有产能，不该切走

──────────────────────────────────────────

F(p,l,t) 的作用:
  t0-t3: F=true  → 需要约束 (2)
  t4:     F=true  → 需要约束 (2)（t4 自身有产能但后面停机，
                        实际 F=false，不需要约束）
  t5-t6:  停机   → 无 end 变量，不参与
```

### 11.10 与 DemandConstraintBuilder 的关系

`DemandConstraintBuilder` 建立物质守恒：`Σq + u = D`。`ForbidReturnToFinishedMaterialConstraintBuilder` 在其基础上进一步限制**何时可以结束**某个物料。

```
DemandConstraintBuilder:                    ForbidReturnToFinishedMaterialConstraintBuilder:
Σ_{l,t} q[p,l,t] + u(p) = D(p)            end[p,l,t]=1 ⟹ P(p,t) = D(p)
（总产量 + 欠产 = 需求）                      （结束即完成，P 由 q 递推而来）
```

关键区别：
- `DemandConstraintBuilder` 只关心**总量**——不关心产量在时间轴上如何分布
- `ForbidReturnToFinishedMaterialConstraintBuilder` 关心**时序**——不允许"中间切走、后面再补"的碎片化排产

如果所有产品都能完全满足需求（`u = 0`），那么 `P(p, t_last) = D(p)` 自然成立。但在中间时点，`P(p,t)` 可能小于 `D(p)`——本约束就是确保：如果机组要提前结束某物料，此时 `P(p,t)` 必须已经等于 `D(p)`。

### 11.11 与 ContinuityConstraintBuilder 的关系

`ContinuityConstraintBuilder` 保证同一产品在同一机组上最多一个连续块。`ForbidReturnToFinishedMaterialConstraintBuilder` 进一步限制这个连续块**何时可以结束**——如果后面还有产能，不能提前结束。

```
ContinuityConstraintBuilder:               ForbidReturnToFinishedMaterialConstraintBuilder:
Σ_t end[p,l,t] ≤ 1                         end[p,l,t]=1 ⟹ P(p,t) = D(p)
（最多一个连续块）                             （有产能时，结束=完成）

Continuity 保证"不会回来重做"（单块）；
ForbidReturn 保证"不做完不准走"（单块必须在物料完成时才能结束）。
```

两者共同作用：每个产品在每个机组上形成一个连续块，且该块要么做到物料完成，要么后续确实没有产能。

---

## 十二、FullBucketBeforeTailConstraintBuilder — 前满后尾约束

### 12.1 一句话总结

**连续生产块中，仅尾桶允许不满产，首桶和中间桶必须满产**；换产首桶豁免，由换产共享容量约束单独管理。

### 12.2 业务背景

卷包排产中，一台机组连续生产同一牌号时，每个时间桶有一个名义产能（如 120 箱/小时）。业务要求：一旦开始生产，就应充分利用产能——**首桶和中间桶必须满产**，只有最后一个桶（尾桶）允许不满。

这一规则的工程逻辑：

1. **减少碎片化**：如果中间桶不满产，排产结果会出现大量零散的小产量桶，不利于生产执行和物料管理
2. **提高产能利用率**：满产意味着每个桶的产能被完全利用，减少浪费
3. **尾桶例外**：连续块的尾桶是"收尾"——剩余需求可能不足一个满桶，强制满产会导致超产

**换产首桶例外**：如果首桶之前发生了牌号切换，换产操作会占用首桶的部分产能和时间，此时首桶的产量由 `ChangeoverConstraintBuilder` 的换产共享容量约束单独计算，本约束不干预。

### 12.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`） |
| `x[p,l,t]` | 产品 p 是否在机组 l、时间桶 t 上生产（`BoolVar`：0/1） |
| `start[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块开始（`BoolVar`：0/1） |
| `end[p,l,t]` | 产品 p 在机组 l、时间桶 t 上是否为连续块结束（`BoolVar`：0/1） |
| `mc[p,l]` | 产品 p 在机组 l 上的连续块是否发生了换产（`BoolVar`：0/1，`blockMaterialChange`） |
| `cap[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的名义桶产能上界 |

### 12.4 约束的数学表达

#### 核心不等式

对每个有效的 (p, l, t)：

$$
q[p,l,t] + cap[p,l,t] \cdot end[p,l,t] - cap[p,l,t] \cdot x[p,l,t] \geq 0
$$

即：

$$
q[p,l,t] \geq cap[p,l,t] \cdot (x[p,l,t] - end[p,l,t])
$$

#### 四种情况的推导

| x | end | x - end | 约束变为 | 含义 |
|---|-----|---------|----------|------|
| 0 | 0 | 0 | `q ≥ 0` | 不生产，自动满足（q ≥ 0 由变量域保证） |
| 0 | 1 | -1 | `q ≥ -cap` | 不可能：`end=1` 隐含 `x=1`（`end` 的语义要求当前桶在生产） |
| 1 | 0 | 1 | `q ≥ cap` | **在生产且非尾桶 → 必须满产** |
| 1 | 1 | 0 | `q ≥ 0` | **在生产且是尾桶 → 允许不满** |

关键观察：`x=1, end=0`（非尾桶在生产）时，约束退化为 `q ≥ cap`，即**满产**；`x=1, end=1`（尾桶）时，约束退化为 `q ≥ 0`，即**自由**。

结合 `CapacityConstraintBuilder` 的 `q ≤ x · cap`，非尾桶的产量被精确锁定为 `q = cap`（满产）。

#### 条件施加策略

核心不等式需要排除**换产首桶**——换产时首桶的部分产能用于换产操作，不能要求满产。

代码使用 `onlyEnforceIf` 实现三路分支：

| 条件 | 施加方式 | 含义 |
|------|----------|------|
| `start` 或 `mc` 不存在 | 无条件施加 | 退化为简单场景，不涉及换产 |
| `start = 0`（非首桶） | `onlyEnforceIf(start.not())` | 非首桶必须满产 |
| `mc = 0`（非换产首桶） | `onlyEnforceIf(mc.not())` | 非换产首桶必须满产 |
| `start = 1` 且 `mc = 1` | 两条 `onlyEnforceIf` 均不触发 | **换产首桶豁免** |

两条条件约束的交集：当 `start=1, mc=1` 时，两条 `onlyEnforceIf` 的守卫条件都不满足，约束不施加——换产首桶的产量由 `ChangeoverConstraintBuilder` 的 (4a)/(4b) 约束管理。

### 12.5 逐行拆解

#### 双层循环：遍历所有 (p, l) 组合

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    for (PackScheduleLine line : problem.getLinesSafe()) {
        bindProductLineBlock(ctx, model, problem, product, line);
    }
}
```

对每个 (产品, 机组) 组合独立建立约束。

#### 获取换产状态

```java
BoolVar materialChange = ctx.blockMaterialChange(productId, lineId);
```

`mc[p,l]` 由 `ChangeoverConstraintBuilder` 的 `bindIncomingChangeover` 方法创建并注册到上下文。如果该 (p, l) 没有参与换产建模（如没有 Circuit 约束），`mc` 为 null。

#### 逐桶建立约束

```java
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    if (!problem.isAvailable(lineId, bucketIndex)) { continue; }
    IntVar qty = ctx.q(productId, lineId, bucketIndex);
    BoolVar selected = ctx.x(productId, lineId, bucketIndex);
    BoolVar end = ctx.end(productId, lineId, bucketIndex);
    if (qty == null || selected == null || end == null) { continue; }
    long capacity = Math.max(0L, problem.getCapacity(productId, lineId, bucketIndex));
    if (capacity <= 0L) { continue; }
```

五层过滤：
1. 不可用桶跳过
2. `q`、`x`、`end` 任一不存在则跳过
3. 产能 ≤ 0 跳过

#### 构建核心表达式

```java
LinearExprBuilder fullBeforeTail = LinearExpr.newBuilder();
fullBeforeTail.add(qty);                        // + q
fullBeforeTail.addTerm(end, capacity);          // + cap · end
fullBeforeTail.addTerm(selected, -capacity);    // - cap · x
```

构建 `q + cap·end - cap·x`，即核心不等式的左端。

#### 条件施加

```java
BoolVar start = ctx.start(productId, lineId, bucketIndex);
if (start == null || materialChange == null) {
    // 无条件施加：q + cap·end - cap·x ≥ 0
    model.addGreaterOrEqual(fullBeforeTail, 0L);
    continue;
}
// start=0（非首桶）时施加
model.addGreaterOrEqual(fullBeforeTail, 0L).onlyEnforceIf(start.not());
// mc=0（非换产首桶）时施加
model.addGreaterOrEqual(fullBeforeTail, 0L).onlyEnforceIf(materialChange.not());
```

当 `start` 和 `mc` 都存在时，用两条条件约束覆盖三种场景：

| start | mc | start.not() | mc.not() | 约束是否施加 |
|-------|----|------------|---------|------------|
| 0 | 0 | 1 | 1 | 施加（两条都触发，等价于一条） |
| 1 | 0 | 0 | 1 | 施加（mc.not() 触发） |
| 0 | 1 | 1 | 0 | 施加（start.not() 触发） |
| 1 | 1 | 0 | 0 | **不施加**（换产首桶豁免） |

### 12.6 为什么用两条 onlyEnforceIf 而非一条？

换产首桶需要同时满足 `start=1` 和 `mc=1` 才豁免。如果只用一条 `onlyEnforceIf(start.not().or(mc.not()))`，CP-SAT 不直接支持"或"条件的守卫。拆成两条 `onlyEnforceIf`，每条独立触发，覆盖所有需要施加约束的场景，只有 `start=1 ∧ mc=1` 时两条都不触发——等价于 `¬(start=1 ∧ mc=1)` 的守卫。

### 12.7 数学总结

| 约束 | 数学表达 | 条件 | 含义 |
|------|----------|------|------|
| (1) | `q[p,l,t] + cap·end - cap·x ≥ 0` | start 或 mc 不存在 | 无条件满产约束 |
| (1a) | `q[p,l,t] + cap·end - cap·x ≥ 0` | `start=0`（非首桶） | 非首桶满产 |
| (1b) | `q[p,l,t] + cap·end - cap·x ≥ 0` | `mc=0`（非换产首桶） | 非换产首桶满产 |
| 豁免 | — | `start=1 ∧ mc=1` | 换产首桶由 ChangeoverConstraintBuilder 管理 |

| x | end | 约束效果 |
|---|-----|----------|
| 0 | 0 | `q ≥ 0`（自动满足） |
| 1 | 0 | `q ≥ cap`（满产） |
| 1 | 1 | `q ≥ 0`（尾桶自由） |

### 12.8 图示

```
产品A, 机组#1, 连续块 t0-t4, 产能 cap=120 箱/桶

  t0       t1       t2       t3       t4
  start=1  start=0  start=0  start=0  start=0
  end=0    end=0    end=0    end=0    end=1    ← 尾桶
  x=1      x=1      x=1      x=1      x=1

  非换产首桶（mc=0）:
    t0: q + 120·0 - 120·1 ≥ 0  ⟹  q ≥ 120  ← 满产
    t1: q + 120·0 - 120·1 ≥ 0  ⟹  q ≥ 120  ← 满产
    t2: q + 120·0 - 120·1 ≥ 0  ⟹  q ≥ 120  ← 满产
    t3: q + 120·0 - 120·1 ≥ 0  ⟹  q ≥ 120  ← 满产
    t4: q + 120·1 - 120·1 ≥ 0  ⟹  q ≥ 0    ← 尾桶自由

  合法解: q=[120, 120, 120, 120, 40]
    t0-t3 满产，t4 只做了 40 箱（尾桶允许）  ✓

  非法解: q=[120, 80, 120, 120, 40]
    t1: 80 < 120  ✗ 非尾桶不满产

──────────────────────────────────────────

换产首桶（mc=1）:
    t0: start=1, mc=1 → 约束豁免
    t0 的产量由 ChangeoverConstraintBuilder 管理:
      例如换产占 30 分钟，剩余 30 分钟生产：
      q·60 + 30·120 ≤ 120·60 → q ≤ 60
      首桶最多 60 箱（而非 120），满产约束不适用  ✓
```

### 12.9 与 CapacityConstraintBuilder 的关系

`CapacityConstraintBuilder` 建立产量上下界：`x·1 ≤ q ≤ x·cap`。`FullBucketBeforeTailConstraintBuilder` 在其基础上进一步收紧**非尾桶的下界**：

```
CapacityConstraintBuilder:                 FullBucketBeforeTailConstraintBuilder:
x=1 时: 1 ≤ q ≤ cap                       x=1, end=0 时: q ≥ cap
（产量在 1 到产能之间）                       （非尾桶必须满产：q = cap）

x=1, end=1 时: 1 ≤ q ≤ cap                无额外约束
（尾桶产量在 1 到产能之间）                    （尾桶保持自由：1 ≤ q ≤ cap）
```

两者合在一起，非尾桶的产量被精确锁定：

| 桶类型 | CapacityConstraint | FullBucketBeforeTail | 综合效果 |
|--------|-------------------|---------------------|----------|
| 不生产 (x=0) | q = 0 | q ≥ 0 | q = 0 |
| 尾桶 (x=1, end=1) | 1 ≤ q ≤ cap | q ≥ 0 | 1 ≤ q ≤ cap |
| 非尾桶 (x=1, end=0) | 1 ≤ q ≤ cap | q ≥ cap | **q = cap** |
| 换产首桶 (start=1, mc=1) | 1 ≤ q ≤ cap | 豁免 | 由 Changeover 管理 |

### 12.10 与 ChangeoverConstraintBuilder 的协作

`ChangeoverConstraintBuilder` 在换产场景下计算首桶的可用产能：

$$
start \wedge mc \;\Longrightarrow\; q \cdot bm + rem \cdot cap \leq cap \cdot bm
$$

其中 `rem` 是剩余换产时长，`bm` 是桶工时分钟数。换产占用的产能使得首桶的最大产量低于 `cap`，此时 `FullBucketBeforeTailConstraintBuilder` 的满产约束不能施加（否则会导致无解）。

协作流程：

```
ChangeoverConstraintBuilder:
  计算 mc[p,l]、rem、首桶产能上界
  建立换产共享容量约束 (4a)/(4b)
        ↓
FullBucketBeforeTailConstraintBuilder:
  读取 mc[p,l]
  对 start=1 ∧ mc=1 的桶豁免满产约束
  对其他桶施加满产约束
```

`mc[p,l]` 是两者之间的"握手变量"——由 `ChangeoverConstraintBuilder` 创建，由 `FullBucketBeforeTailConstraintBuilder` 消费，确保换产首桶的产能管理权归 `ChangeoverConstraintBuilder` 所有。

---

## 十三、LeadingIdleConstraintBuilder — 前置空闲辅助变量构建器

### 13.1 一句话总结

**将"最终会被使用但尚未开工"的空闲桶显式建模为 `leadingIdle` 变量**，供目标函数惩罚——不再强制首桶开工，而是通过软目标引导求解器尽早启动机组。

### 13.2 业务背景

卷包排产中，机组可能不在排产周期的第一天就开工——前面几天可能因为需求安排等原因空闲。但"能开工却拖延"是不合理的：机组最终被使用，却在首桶之后才开工，意味着前面有**不必要的空闲等待**。

旧方案用硬约束 `FirstBucketStartConstraintBuilder` 强制首桶开工，但有时过于严格——如果需求确实不需要首桶开工，强制开工反而导致无解。

新方案（本构建器）改用**软目标**策略：
1. 不强制首桶开工
2. 将"最终被使用但尚未开工"的桶标记为 `leadingIdle`
3. 由目标函数对 `leadingIdle` 加权惩罚，引导求解器倾向于尽早开工
4. 如果确实需要延迟开工（如需求不足），求解器仍然可以接受少量 `leadingIdle`，不会导致无解

### 13.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（`BoolVar`：0/1） |
| `s[l]` | 机组 l 本期是否最终被使用（`BoolVar`：`lineUsed`） |
| `S[l,t]` | 截止桶 t，机组 l 是否已经开工过（`BoolVar`：`startedBy`，前缀 OR） |
| `i[l,t]` | 机组 l 在桶 t 是否为前置空闲（`BoolVar`：`leadingIdle`） |
| `t_f(l)` | 机组 l 的首个可排产桶序号 |

### 13.4 约束的数学表达

#### (1) lineUsed 绑定

对每个机组 l：

$$
s[l] = 1 \;\Longleftrightarrow\; \sum_t u[l,t] \geq 1
$$

等价于两条条件约束：

$$
s[l] = 1 \;\Longrightarrow\; \sum_t u[l,t] \geq 1 \quad\text{(1a)}
$$

$$
s[l] = 0 \;\Longrightarrow\; \sum_t u[l,t] = 0 \quad\text{(1b)}
$$

`s[l]` 是机组 l 的"是否被使用"指示变量——只要任何一个桶在生产，`s = 1`；所有桶都空闲，`s = 0`。

#### (2) startedBy 递推定义（前缀 OR）

`S[l,t]` 表示"截止桶 t，机组 l 是否已经开工过"。这是一个**单调递增**的前缀变量——一旦开工，后续桶的 `S` 永远为 1。

首个有 `u` 变量的桶 t₀：

$$
S[l,t_0] = u[l,t_0] \quad\text{(2a)}
$$

后续桶 t（prev = S[l,t-1]）：

$$
S[l,t] \geq S[l,t-1] \quad\text{(2b)}
$$

$$
S[l,t] \geq u[l,t] \quad\text{(2c)}
$$

$$
S[l,t] - S[l,t-1] - u[l,t] \leq 0 \quad\text{(2d)}
$$

合在一起：**S[l,t] = S[l,t-1] ∨ u[l,t]**（布尔 OR）。

三条约束的语义：
- (2b)：**单调性**——一旦开工，S 不会回退到 0
- (2c)：**充分性**——当前桶在生产，S 必须为 1
- (2d)：**必要性**——S 只能由前序开工或当前桶生产触发，不能凭空变 1

#### (3) leadingIdle 定义

`i[l,t]` 表示"机组 l 在桶 t 是前置空闲"——最终会被使用但尚未开工。

首桶之前（t < t_f(l)）：

$$
i[l,t] = 0 \quad\text{(3a)}
$$

首桶及之后（t ≥ t_f(l)）：

$$
i[l,t] - s[l] \leq 0 \quad\text{(3b)}
$$

$$
i[l,t] + S[l,t] \leq 1 \quad\text{(3c)}
$$

$$
i[l,t] + S[l,t] - s[l] \geq 0 \quad\text{(3d)}
$$

三条约束的语义：
- (3b)：`i ≤ s`——只有最终被使用的机组才有前置空闲（不被使用的机组没有前置空闲概念）
- (3c)：`i + S ≤ 1`——已开工的桶不是前置空闲（`S=1` 时 `i=0`）
- (3d)：`i + S ≥ s`——被使用时，要么已开工（S=1），要么是前置空闲（i=1）

合在一起：**i[l,t] = s[l] ∧ ¬S[l,t]**（最终被使用且尚未开工）。

### 13.5 i[l,t] 的真值表

| s[l] | S[l,t] | i[l,t] | 含义 |
|------|--------|--------|------|
| 0 | 0 | 0 | 机组不被使用，无前置空闲 |
| 0 | 1 | 0 | 不可能（S=1 隐含 s=1） |
| 1 | 0 | **1** | **最终被使用且尚未开工 → 前置空闲** |
| 1 | 1 | 0 | 已开工，不是前置空闲 |

验证三条约束：

| s | S | i | (3b) i-s≤0 | (3c) i+S≤1 | (3d) i+S-s≥0 | 全满足 |
|---|---|---|------------|------------|--------------|--------|
| 0 | 0 | 0 | 0-0=0 ≤ 0 ✓ | 0+0=0 ≤ 1 ✓ | 0+0-0=0 ≥ 0 ✓ | ✓ |
| 1 | 0 | 1 | 1-1=0 ≤ 0 ✓ | 1+0=1 ≤ 1 ✓ | 1+0-1=0 ≥ 0 ✓ | ✓ |
| 1 | 1 | 0 | 0-1=-1 ≤ 0 ✓ | 0+1=1 ≤ 1 ✓ | 0+1-1=0 ≥ 0 ✓ | ✓ |

任何其他 i 值至少违反一条约束，因此三条约束唯一确定了 `i = s ∧ ¬S`。

### 13.6 逐行拆解

#### 遍历所有机组，创建 lineUsed 并绑定

```java
for (PackScheduleLine line : problem.getLinesSafe()) {
    BoolVar lineUsed = model.newBoolVar(String.format("line_used_%d", line.getLineId()));
    ctx.putLineUsed(line.getLineId(), lineUsed);
    bindLineUsed(model, ctx, problem, line.getLineId(), lineUsed);
    bindStartedAndLeadingIdle(model, ctx, problem, line.getLineId(), lineUsed);
}
```

对每台机组 l，创建 `s[l]`，然后分别绑定 lineUsed 和 startedBy/leadingIdle。

#### bindLineUsed：绑定 s[l] 与 u[l,t]

```java
LinearExprBuilder usedDays = LinearExpr.newBuilder();
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    BoolVar production = ctx.u(lineId, bucket.getIndex());
    if (production != null) {
        usedDays.add(production);
    }
}
// (1a) s[l] = 1 ⟹ Σ_t u[l,t] ≥ 1
model.addGreaterOrEqual(usedDays, 1L).onlyEnforceIf(lineUsed);
// (1b) s[l] = 0 ⟹ Σ_t u[l,t] = 0
model.addEquality(usedDays, 0L).onlyEnforceIf(lineUsed.not());
```

汇总所有桶的 `u[l,t]`，建立 `s[l]` 与"机组是否有生产"的等价关系。

#### bindStartedAndLeadingIdle：递推 S[l,t] 并定义 i[l,t]

```java
BoolVar previousStartedBy = null;
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    BoolVar production = ctx.u(lineId, bucketIndex);
    if (production == null) { continue; }
    BoolVar startedBy = model.newBoolVar(...);
    ctx.putStartedBy(lineId, bucketIndex, startedBy);
```

对每个有 `u` 变量的桶创建 `S[l,t]`，跳过无变量的桶。

```java
    if (previousStartedBy == null) {
        // (2a) 首桶：S[l,t₀] = u[l,t₀]
        model.addEquality(startedBy, production);
    } else {
        // (2b) S[l,t] ≥ S[l,t-1]
        model.addGreaterOrEqual(startedBy, previousStartedBy);
        // (2c) S[l,t] ≥ u[l,t]
        model.addGreaterOrEqual(startedBy, production);
        // (2d) S[l,t] - S[l,t-1] - u[l,t] ≤ 0
        LinearExprBuilder startedUpperBound = LinearExpr.newBuilder();
        startedUpperBound.add(startedBy);
        startedUpperBound.addTerm(previousStartedBy, -1L);
        startedUpperBound.addTerm(production, -1L);
        model.addLessOrEqual(startedUpperBound, 0L);
    }
```

递推 `S[l,t]`：首桶直接等于 `u`，后续桶用三条约束实现布尔 OR。

```java
    BoolVar leadingIdle = model.newBoolVar(...);
    ctx.putLeadingIdle(lineId, bucketIndex, leadingIdle);
    if (firstSchedulableBucket == null || bucketIndex < firstSchedulableBucket) {
        // (3a) 首桶之前：i[l,t] = 0
        model.addEquality(leadingIdle, 0L);
    } else {
        // (3b) i[l,t] - s[l] ≤ 0
        LinearExprBuilder idleMinusUsed = LinearExpr.newBuilder();
        idleMinusUsed.add(leadingIdle);
        idleMinusUsed.addTerm(lineUsed, -1L);
        model.addLessOrEqual(idleMinusUsed, 0L);
        // (3c) i[l,t] + S[l,t] ≤ 1
        LinearExprBuilder idlePlusStarted = LinearExpr.newBuilder();
        idlePlusStarted.add(leadingIdle);
        idlePlusStarted.add(startedBy);
        model.addLessOrEqual(idlePlusStarted, 1L);
        // (3d) i[l,t] + S[l,t] - s[l] ≥ 0
        LinearExprBuilder idleLowerBound = LinearExpr.newBuilder();
        idleLowerBound.add(leadingIdle);
        idleLowerBound.add(startedBy);
        idleLowerBound.addTerm(lineUsed, -1L);
        model.addGreaterOrEqual(idleLowerBound, 0L);
    }
    previousStartedBy = startedBy;
```

定义 `i[l,t]`：首桶之前强制为 0，首桶及之后用三条约束实现 `i = s ∧ ¬S`。

### 13.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1a) | `s[l]=1 ⟹ Σ_t u[l,t] ≥ 1` | 被使用 ⟹ 至少一个桶在生产 |
| (1b) | `s[l]=0 ⟹ Σ_t u[l,t] = 0` | 未被使用 ⟹ 所有桶都不生产 |
| (2a) | `S[l,t₀] = u[l,t₀]` | 首桶 startedBy = 首桶生产状态 |
| (2b) | `S[l,t] ≥ S[l,t-1]` | 单调性：一旦开工不回退 |
| (2c) | `S[l,t] ≥ u[l,t]` | 当前桶生产 ⟹ startedBy=1 |
| (2d) | `S[l,t] ≤ S[l,t-1] + u[l,t]` | 必要性：不能凭空变 1 |
| (3a) | `t < t_f(l): i[l,t] = 0` | 首桶之前无前置空闲 |
| (3b) | `i[l,t] ≤ s[l]` | 只有被使用的机组有前置空闲 |
| (3c) | `i[l,t] + S[l,t] ≤ 1` | 已开工 ⟹ 非前置空闲 |
| (3d) | `i[l,t] + S[l,t] ≥ s[l]` | 被使用时：已开工或前置空闲 |

### 13.8 图示

```
机组#1, 首桶 t_f = t0

时间轴:  t0  t1  t2  t3  t4  t5  t6  t7
u[l,t]:   0   0   1   1   0   0   0   0    ← t2,t3 在生产
s[l]:     1                              ← 机组被使用

S[l,t] 递推:
  t0: S = u = 0                    ← 尚未开工
  t1: S = S[t0]∨u = 0∨0 = 0       ← 尚未开工
  t2: S = S[t1]∨u = 0∨1 = 1       ← ← t2 开工了！
  t3: S = S[t2]∨u = 1∨1 = 1       ← 已开工（单调性）
  t4: S = S[t3]∨u = 1∨0 = 1       ← 已开工（不回退）
  t5-t7: S = 1                     ← 已开工

i[l,t] = s ∧ ¬S:
  t0: i = 1∧¬0 = 1   ← 前置空闲！最终会用但还没开工
  t1: i = 1∧¬0 = 1   ← 前置空闲！
  t2: i = 1∧¬1 = 0   ← 已开工，不是前置空闲
  t3-t7: i = 1∧¬1 = 0  ← 已开工

目标函数惩罚:
  Σ_t i[l,t] = 2  →  惩罚 2 个桶的前置空闲
  求解器倾向：减少 i=1 的桶数，即尽早开工

──────────────────────────────────────────

如果机组完全不用:
  u 全部 = 0, s = 0
  S 全部 = 0
  i 全部 = 0∧¬0 = 0   ← 不被使用的机组无前置空闲

如果机组从首桶就开工:
  t0: u=1, S=1
  i[t0] = 1∧¬1 = 0    ← 首桶开工，无前置空闲
  所有 i = 0           ← 无惩罚，最优
```

### 13.9 与 FirstBucketStartConstraintBuilder 的对比

两个构建器都涉及"尽早开工"，但策略完全不同：

| 维度 | FirstBucketStart（硬约束） | LeadingIdle（软目标） |
|------|--------------------------|---------------------|
| 约束类型 | 硬约束：`u[l,t]=1 ⟹ u[l,t_f]=1` | 软目标：最小化 Σ i[l,t] |
| 语义 | "后续桶生产则首桶必须生产" | "最终会用但还没开工的桶要惩罚" |
| 可违反性 | 不可违反 | 可以违反（接受少量前置空闲） |
| 无解风险 | 存在（约束冲突时无解） | 无（惩罚只是倾向，不强制） |
| 建模方式 | 多条蕴含 | 辅助变量 + 条件约束 |
| 灵活性 | 低（一刀切） | 高（目标权重可调） |

`LeadingIdleConstraintBuilder` 是 `FirstBucketStartConstraintBuilder` 的**软目标替代**——不再强制首桶开工，而是用惩罚引导。当约束链复杂、强制首桶开工可能导致无解时，改用本构建器可以保留可行性。

### 13.10 变量的后续用途

本构建器创建的三个变量都会被后续组件消费：

| 变量 | 消费者 | 用途 |
|------|--------|------|
| `s[l]`（lineUsed） | 目标函数、其他约束构建器 | 判断机组是否被使用 |
| `S[l,t]`（startedBy） | `BrandPlanQtyPriorityConstraintBuilder` | 控制产品排产优先级（先来后到） |
| `i[l,t]`（leadingIdle） | 目标函数 | 惩罚前置空闲，引导尽早开工 |

特别是 `i[l,t]`，目标函数中会以 `Σ_{l,t} w · i[l,t]` 的形式出现——`w` 越大，求解器越倾向于尽早开工；`w = 0` 时等效于不约束。

---

## 十四、MakespanConstraintBuilder — 完成时间约束

### 14.1 一句话总结

**为每台机组计算最终完工时刻，再聚合成全局最晚完工时间（makespan）**——使用桶尾分钟数而非桶下标，确保时间跨度的精确比较。

### 14.2 业务背景

排产结果的一个关键指标是**工期（makespan）**——所有机组中最后完工的那台机组的完成时刻。工期越短，整体排产越紧凑。目标函数中最小化 makespan 可以引导求解器尽量早完工，避免不必要的拖延。

计算工期的朴素想法是用"最后一次生产发生的桶下标"，但桶下标只是一个序号，不同桶的实际时间跨度可能不同（如 8:00-9:00 是 60 分钟，9:00-9:30 是 30 分钟的短桶）。本构建器使用**桶尾分钟偏移**（`bucketEndOffsetMinutes`）来表达完工时刻，确保跨桶时间比较基于真实时间而非桶序号。

### 14.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（`BoolVar`：0/1） |
| `e(t)` | 时间桶 t 的结束分钟偏移（`bucketEndOffsetMinutes`，常量） |
| `C(l)` | 机组 l 的最终完工时刻（`IntVar`：`lineCompletion`，未投产时为 0） |
| `M` | 全局最晚完工时刻（`IntVar`：`makespanBucket`，所有机组中的最大完工时刻） |

`e(t)` 的含义：从排产周期起点到桶 t 结束的累计分钟数。例如：
- 桶 0：8:00-9:00 → e(0) = 60
- 桶 1：9:00-10:00 → e(1) = 120
- 桶 2：10:00-10:30（短桶）→ e(2) = 150

### 14.4 约束的数学表达

#### (1) 单机组完工时刻

对每台机组 l（`lineCompletion` 变量存在时）：

$$
C(l) = \max_{t:\, u[l,t] \neq \text{null}} u[l,t] \cdot e(t)
$$

即：机组 l 的完工时刻 = 该机组所有在生产桶中，最大的桶尾时间。

分析：
- `u[l,t] = 1` 的桶贡献 `e(t)` 分钟偏移
- `u[l,t] = 0` 的桶贡献 0（不参与 max）
- 多个桶同时生产时，取最大的 `e(t)`——即最后一个生产桶的结束时刻
- 未投产机组（所有 `u = 0`）：候选列表为空，`C(l) = 0`

无可用桶时：

$$
C(l) = 0 \quad\text{(1a)}
$$

有可用桶时：

$$
C(l) = \max_t u[l,t] \cdot e(t) \quad\text{(1b)}
$$

#### (2) 全局 makespan

$$
M = \max_l C(l)
$$

即：所有机组完工时刻中的最大值。

无机组参与时：

$$
M = 0 \quad\text{(2a)}
$$

有机组参与时：

$$
M = \max_l C(l) \quad\text{(2b)}
$$

### 14.5 为什么用 MaxEquality 而非手写约束？

`addMaxEquality(target, [expr₁, expr₂, ...])` 是 CP-SAT 的原生约束，语义为 `target = max(expr₁, expr₂, ...)`。

手写等价方案需要：
1. 对每个候选值 `cᵢ = u[l,tᵢ] · e(tᵢ)`，建立 `C(l) ≥ cᵢ`
2. 引入辅助布尔变量 `bᵢ` 表示"C(l) 由候选 cᵢ 决定"
3. 建立 `Σ bᵢ = 1`（恰好一个候选决定最大值）
4. 建立 `bᵢ = 1 ⟹ C(l) = cᵢ`

这需要大量辅助变量和约束。`addMaxEquality` 让求解器内部高效处理，且支持直接接收 `LinearExpr`（如 `LinearExpr.term(u, e)`），无需为每个候选创建中间变量。

### 14.6 逐行拆解

#### 遍历所有机组

```java
for (PackScheduleLine line : problem.getLinesSafe()) {
    IntVar lineCompletion = ctx.lineCompletion(line.getLineId());
    if (lineCompletion == null) {
        continue;
    }
```

取出预创建的 `C(l)` 变量。如果 `lineCompletion` 为 null（如不包含目标辅助变量的场景），跳过该机组。

#### 收集候选值

```java
List<LinearArgument> completionCandidates = new ArrayList<>();
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    BoolVar u = ctx.u(line.getLineId(), bucket.getIndex());
    if (u == null) {
        continue;
    }
    long endOffsetMinutes = problem.getBucketEndOffsetMinutes(bucket.getIndex());
    completionCandidates.add(LinearExpr.term(u, endOffsetMinutes));
}
```

对每个有 `u` 变量的桶，构建候选值 `u[l,t] · e(t)`：
- `u = 1` 时贡献 `e(t)`
- `u = 0` 时贡献 0（不影响 max）

`LinearExpr.term(u, e)` 是 OR-Tools 的线性表达式，表示 `u × e`。`addMaxEquality` 可以直接接收 `LinearArgument` 数组，无需为每个候选创建独立的 `IntVar`。

#### 绑定单机组完工时刻

```java
if (completionCandidates.isEmpty()) {
    // (1a) C(l) = 0
    model.addEquality(lineCompletion, 0L);
} else {
    // (1b) C(l) = max_t u[l,t] · e(t)
    model.addMaxEquality(lineCompletion, completionCandidates.toArray(new LinearArgument[0]));
}
lineCompletionVars.add(lineCompletion);
```

无候选值（机组无可用桶）时强制 `C(l) = 0`；有候选值时用 `addMaxEquality` 取最大值。

#### 绑定全局 makespan

```java
if (ctx.getMakespanBucketVar() == null) {
    return;
}
if (lineCompletionVars.isEmpty()) {
    // (2a) M = 0
    model.addEquality(ctx.getMakespanBucketVar(), 0L);
} else {
    // (2b) M = max_l C(l)
    model.addMaxEquality(ctx.getMakespanBucketVar(), lineCompletionVars.toArray(new IntVar[0]));
}
```

`makespanBucketVar` 是可选的——某些场景只关心机组级完工时刻，不需要全局聚合。变量存在时，用 `addMaxEquality` 取所有机组完工时刻的最大值。

### 14.7 变量的创建与消费

本构建器**不创建** `C(l)` 和 `M` 变量，它们由 `PackScheduleVariableBuilder` 预先创建：

| 变量 | 创建位置 | 域 | 含义 |
|------|----------|----|------|
| `C(l)` | `PackScheduleVariableBuilder` | `[0, makespanUpperBound]` | 机组完工时刻 |
| `M` | `PackScheduleVariableBuilder` | `[0, makespanUpperBound]` | 全局 makespan |

`makespanUpperBound = max_t e(t)`——完工时刻不会超过最后一个桶的结束时间。

消费方：

| 变量 | 消费者 | 用途 |
|------|--------|------|
| `C(l)` | `PackScheduleSolutionMapper` | 输出每台机组的完成时间 |
| `M` | `PackScheduleObjectiveBuilder` | 目标函数：最小化 makespan |
| `M` | `PackScheduleSolutionMapper` | 输出全局最晚完工时间和对应桶下标 |

### 14.8 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1a) | `C(l) = 0` | 未投产机组的完工时刻 |
| (1b) | `C(l) = max_t u[l,t] · e(t)` | 在产机组的完工时刻 |
| (2a) | `M = 0` | 无机组参与的全局 makespan |
| (2b) | `M = max_l C(l)` | 全局最晚完工时间 |

| 条件 | 行为 |
|------|------|
| `lineCompletion` 为 null | 跳过该机组（不参与 makespan 聚合） |
| `makespanBucketVar` 为 null | 不建立全局 makespan 约束 |
| 候选列表为空 | `C(l) = 0` |

### 14.9 图示

```
排产周期: 8:00-16:00, 8个时间桶
e(t): t0=60  t1=120  t2=180  t3=240  t4=300  t5=360  t6=420  t7=480

机组#1:
  u:  1  1  1  0  0  0  0  0     ← t0-t2 在生产
  候选值: 1×60, 1×120, 1×180, 0×240, ...
  C(#1) = max(60, 120, 180, 0, ...) = 180    ← t2 结束时刻 11:00

机组#2:
  u:  0  0  0  1  1  1  1  0     ← t3-t6 在生产
  候选值: 0×60, 0×120, 0×180, 1×240, 1×300, 1×360, 1×420, 0×480
  C(#2) = max(0, 0, 0, 240, 300, 360, 420, 0) = 420    ← t6 结束时刻 15:00

机组#3:
  u:  0  0  0  0  0  0  0  0     ← 未投产
  候选列表为空
  C(#3) = 0

全局 makespan:
  M = max(180, 420, 0) = 420     ← 最晚完工在 t6 (15:00)

目标函数:
  min M → 引导求解器缩小最晚完工时刻
```

### 14.10 为什么用分钟偏移而非桶下标？

桶下标（0, 1, 2, ...）只是序号，不反映真实时间。两种情况下同一个桶下标可能代表完全不同的时间跨度：

```
方案A（均匀桶）: t0=60min  t1=120min  t2=180min ...
  C = t2 → 180 分钟偏移

方案B（含短桶）: t0=60min  t1=120min  t2=150min(30min短桶) t3=210min ...
  C = t2 → 150 分钟偏移（同一桶下标，但时间不同）
```

使用分钟偏移 `e(t)` 确保：
1. 目标函数中不同方案的时间跨度可直接比较
2. 跨日/跨班次等非均匀时间轴不影响精度
3. 求解后的 `M` 值可以直接映射回自然时间（如 420 分钟 = 15:00）

### 14.11 与其他约束的关系

本构建器是**纯推导型**——不引入业务限制，只是把 `u[l,t]` 变量的信息聚合为完工时刻变量。它不依赖其他约束构建器（除了 `u` 变量的存在），也不被其他约束构建器依赖（`C(l)` 和 `M` 主要被目标函数和结果映射消费）。

唯一间接关联：`LeadingIdleConstraintBuilder` 的 `s[l]`（lineUsed）和本构建器的 `C(l)` 都与机组的生产状态相关，但建模方式完全不同——`s[l]` 关心"是否被使用"（二元），`C(l)` 关心"何时完工"（连续值）。

---

## 十五、MatMonthContinueConstraintBuilder — 上月连续约束

### 15.1 一句话总结

**上月末在生产的牌号，本月该机组必须先从该牌号开始生产**——强制牌号未开工前，其他牌号不允许占用该机组。

### 15.2 业务背景

卷包车间中，机组月末可能正在生产某个牌号。跨月排产时，如果该牌号本月仍有需求，且机组仍有产能生产该牌号，则该机组本月的第一段生产必须先从上月末的牌号开始，不允许切换到其他牌号。

这一约束的工艺逻辑：机组从牌号A切换到牌号B需要换产操作（停机、换丝、调参等），如果本月确实还要做牌号A，那么最经济的做法是**继续做A，做完后再切换到B**。如果先切到B再做A，就多了一次不必要的换产。

关键点：约束只限制**该机组的第一次生产**——强制牌号开工后，后续桶可以自由切换到其他牌号。

### 15.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `p` | 产品/排产计划明细ID |
| `m*` | 上月末段牌号ID（`forcedProductId`） |
| `P(m*)` | 属于牌号 m* 的所有排产计划明细集合（`productsForMaterial`） |
| `t` | 时间桶序号 |
| `t_f(l)` | 机组 l 的首个可排产桶序号 |
| `x[p,l,t]` | 产品 p 是否在机组 l、时间桶 t 上生产（`BoolVar`：0/1） |
| `u_p[l,p]` | 产品 p 是否使用了机组 l（`BoolVar`：`productLineUsed`） |
| `f[l,t]` | 机组 l 在桶 t 是否在生产强制牌号 m*（`BoolVar`，辅助变量） |
| `s[l,t]` | 截止桶 t，机组 l 本月是否已开始生产强制牌号（`BoolVar`，前缀 OR） |

### 15.4 约束的数学表达

#### (1) 强制牌号必须使用该机组

$$
\sum_{p \in P(m^*)} u_p[l,p] \geq 1
$$

即：属于上月末牌号 m* 的排产计划中，至少有一个使用了机组 l。这确保强制牌号本月不会被完全挤出该机组。

#### (2) 强制牌号生产指示

对每个时间桶 t：

$$
f[l,t] = \sum_{p \in P(m^*)} x[p,l,t]
$$

即：`f=1` 当且仅当机组 l 在桶 t 生产了强制牌号的某个计划明细。因为 `AssignmentConstraintBuilder` 保证 `Σ_p x[p,l,t] ≤ 1`，所以 `f` 也是 BoolVar（0 或 1）。

#### (3) started 前缀 OR 递推

`s[l,t]` 表示"截止桶 t，机组 l 本月是否已开始生产强制牌号"——一旦开始，后续桶的 `s` 不会回退。

首桶之前：

$$
t < t_f(l):\; s[l,t] = 0 \quad\text{(3a)}
$$

首个可排产桶：

$$
s[l,t_f] = f[l,t_f] \quad\text{(3b)}
$$

后续桶：

$$
s[l,t] \geq s[l,t-1] \quad\text{(3c)}
$$

$$
s[l,t] \geq f[l,t] \quad\text{(3d)}
$$

$$
s[l,t] - s[l,t-1] - f[l,t] \leq 0 \quad\text{(3e)}
$$

合在一起：**s[l,t] = s[l,t-1] ∨ f[l,t]**（布尔 OR，与前缀 OR 结构完全一致）。

#### (4) 其他牌号门控

对每个不属于强制牌号的产品 p（`p ∉ P(m*)`）：

$$
x[p,l,t] \leq s[l,t]
$$

即：**强制牌号未开工前（s=0），其他牌号不允许在该机组生产**（x ≤ 0 ⟹ x = 0）。强制牌号开工后（s=1），门控解除（x ≤ 1，无额外限制）。

### 15.5 门控约束的效果分析

| s[l,t] | x[p,l,t] 的约束 | 含义 |
|---------|-----------------|------|
| 0 | x ≤ 0 → x = 0 | 强制牌号未开工，其他牌号禁止生产 |
| 1 | x ≤ 1 | 强制牌号已开工，其他牌号允许生产 |

结合 `s` 的递推定义，门控的效果是：

1. **首个可排产桶**：如果该桶没有生产强制牌号（`f=0`），则 `s=0`，所有其他牌号的 `x=0`——该桶要么空闲，要么生产强制牌号
2. **后续桶**：如果强制牌号已经在某个更早的桶开工了（`s=1`），后续桶的门控完全解除
3. **如果强制牌号从未开工**：`s` 永远为 0，所有桶都禁止其他牌号——但这被约束 (1) 阻止（强制牌号必须至少使用该机组一次）

### 15.6 逐行拆解

#### 前置守卫与可行性检查

```java
if (!problem.isMatMonthContinueEnabled()) {
    return;
}
Map<Long, Long> lastMonthProduction = problem.getLastMonthProduction();
```

读取配置和上月末生产记录。

```java
for (PackScheduleLine line : problem.getLinesSafe()) {
    Long forcedProductId = lastMonthProduction.get(lineId);
    if (forcedProductId == null) { continue; }
    List<PackScheduleProduct> forcedProducts = problem.getProductsForMaterial(forcedProductId);
    if (forcedProducts.isEmpty()) { continue; }
```

对每台机组，查找上月末段牌号。如果机组无上月记录或该牌号本月无排产计划，跳过。

```java
if (firstSchedulableBucket == null) {
    throw buildContinuityFailure(..., "本月没有首个可排产时间桶");
}
if (!hasSchedulableCapacity(...)) {
    throw buildContinuityFailure(..., "没有可用于连续生产的能力");
}
if (!hasSchedulableVariable(...)) {
    throw buildContinuityFailure(..., "模型未生成可用于连续生产的决策变量");
}
```

**三重可行性检查**——任何一个不满足都说明约束无法执行，直接抛异常：
1. 机组没有可排产桶
2. 从首桶开始没有产能生产强制牌号
3. 模型中没有对应的决策变量（建模阶段遗漏）

这些检查是**防御性**的——如果配置了上月连续约束但模型无法满足，应该尽早暴露而非让求解器无解。

#### 约束 (1)：强制牌号必须使用该机组

```java
LinearExprBuilder forcedLineUsage = LinearExpr.newBuilder();
for (PackScheduleProduct candidate : forcedProducts) {
    BoolVar usage = ctx.productLineUsed(candidate.getScheduleOrderPlanDetailId(), lineId);
    if (usage != null) {
        forcedLineUsage.add(usage);
    }
}
if (!hasUsageVariable) {
    throw buildContinuityFailure(...);
}
// (1) Σ_{p ∈ P(m*)} u_p[l,p] ≥ 1
model.addGreaterOrEqual(forcedLineUsage, 1L);
```

汇总所有属于强制牌号的 `productLineUsed` 变量，约束至少一个为 1。

#### bindForcedFirstProduction：门控约束

```java
BoolVar previousStarted = null;
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    // (2) f[l,t] = Σ_{p ∈ P(m*)} x[p,l,t]
    BoolVar forcedProduction = model.newBoolVar(...);
    model.addEquality(forcedProduction, forcedProductionExpr);
    BoolVar started = model.newBoolVar(...);

    if (bucketIndex < firstSchedulableBucket) {
        // (3a) s[l,t] = 0
        model.addEquality(started, 0L);
    } else if (previousStarted == null) {
        // (3b) s[l,t_f] = f[l,t_f]
        model.addEquality(started, forcedProduction);
    } else {
        // (3c)-(3e) s[l,t] = s[l,t-1] ∨ f[l,t]
        model.addGreaterOrEqual(started, previousStarted);
        model.addGreaterOrEqual(started, forcedProduction);
        LinearExprBuilder upperBound = LinearExpr.newBuilder();
        upperBound.add(started);
        upperBound.addTerm(previousStarted, -1L);
        upperBound.addTerm(forcedProduction, -1L);
        model.addLessOrEqual(upperBound, 0L);
    }
```

递推 `s[l,t]`——与 `LeadingIdleConstraintBuilder` 的 `startedBy` 递推结构完全一致（前缀 OR）。

```java
    for (PackScheduleProduct product : problem.getProductsSafe()) {
        if (forcedProductId.equals(product.getProductId())) { continue; }
        BoolVar otherProduction = ctx.x(productId, lineId, bucketIndex);
        if (otherProduction == null) { continue; }
        // (4) x[p,l,t] ≤ s[l,t]
        model.addLessOrEqual(otherProduction, LinearExpr.term(started, 1L));
    }
    previousStarted = started;
```

对每个非强制牌号的产品，建立门控约束 (4)。`x[p,l,t] ≤ s[l,t]`：s=0 时禁止其他牌号，s=1 时允许。

### 15.7 为什么需要约束 (1)？

约束 (4) 只保证了"s=0 时其他牌号不能生产"，但没有保证"强制牌号一定会生产"。理论上，求解器可以选择**该机组整个月都不生产任何东西**——此时 s 永远为 0，门控永远生效，但也没有违反任何约束。

约束 (1) 补充了这一缺口：**强制牌号本月必须至少使用该机组一次**。结合 (1) 和 (4)，保证了：
1. 强制牌号确实会在该机组生产（约束 1）
2. 强制牌号生产之前，其他牌号不能插队（约束 4）

### 15.8 P(m*) vs 单个产品

同一牌号可能有多个排产计划明细（同一物料的不同需求批次）。代码用 `productsForMaterial` 获取该牌号下的所有明细，而非只取一个。这确保：

- 约束 (1)：任一明细使用该机组即可满足
- 约束 (2)：任一明细在该桶生产即算"生产了强制牌号"
- 约束 (4)：排除同一牌号的所有明细（`forcedProductId.equals(product.getProductId())`）

### 15.9 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `Σ_{p ∈ P(m*)} u_p[l,p] ≥ 1` | 强制牌号必须使用该机组 |
| (2) | `f[l,t] = Σ_{p ∈ P(m*)} x[p,l,t]` | 强制牌号生产指示 |
| (3a) | `t < t_f(l): s[l,t] = 0` | 首桶之前未开始 |
| (3b) | `s[l,t_f] = f[l,t_f]` | 首桶 started = 强制牌号生产状态 |
| (3c) | `s[l,t] ≥ s[l,t-1]` | 单调性 |
| (3d) | `s[l,t] ≥ f[l,t]` | 当前桶生产强制牌号 ⟹ s=1 |
| (3e) | `s[l,t] ≤ s[l,t-1] + f[l,t]` | 必要性 |
| (4) | `x[p,l,t] ≤ s[l,t]`（∀p ∉ P(m*)） | 其他牌号门控 |

| 条件 | 行为 |
|------|------|
| `matMonthContinueEnabled = false` | 无约束 |
| 无上月末段牌号 | 无约束 |
| 可行性检查失败 | 抛异常（模型无法满足） |

### 15.10 图示

```
机组#1, 上月末段牌号 = 品牌A (m*)
本月排产: 品牌A有2个计划明细(A1, A2), 品牌B有1个, 品牌C有1个

时间轴:  t0  t1  t2  t3  t4  t5  t6  t7
首桶 t_f = t0

──────────────────────────────────────────

情况1: 首桶生产品牌A，后续自由切换（合法）
  t0: x[A1]=1  f=1, s=1  ← 强制牌号首桶开工
  t1: x[A1]=1  f=1, s=1
  t2: x[B]=1   f=0, s=1  ← 门控已开，品牌B允许
  t3: x[C]=1   f=0, s=1
  ✓ 约束(4): x[B,t2]=1 ≤ s[t2]=1; x[C,t3]=1 ≤ s[t3]=1

──────────────────────────────────────────

情况2: 首桶生产品牌B，品牌A未先开工（非法）
  t0: x[B]=1   f=0, s=0  ← 强制牌号未开工
  约束(4): x[B,t0]=1 ≤ s[t0]=0  ✗ 违反！
  含义: 强制牌号未开工前，品牌B不能占用该机组

──────────────────────────────────────────

情况3: 首桶空闲，t1 生产品牌A（合法）
  t0: 全部 x=0  f=0, s=0  ← 空闲
  t1: x[A1]=1   f=1, s=1  ← t1 才开工
  t2: x[B]=1    f=0, s=1  ← 门控已开

  t0 时约束(4)检查: 所有 x[p ∉ P(m*)] ≤ 0 → 全部为0  ✓
  含义: 首桶可以空闲，但一旦生产就必须先做强制牌号

──────────────────────────────────────────

情况4: 品牌A整月不生产（非法，约束1拦截）
  如果 x[A1]=x[A2]=0 在所有桶:
    u_p[A1,l] + u_p[A2,l] = 0 < 1  ✗ 违反约束(1)
```

### 15.11 与 LeadingIdleConstraintBuilder 的结构对比

两者的前缀 OR 递推结构完全一致：

| 维度 | LeadingIdle | MatMonthContinue |
|------|-------------|-----------------|
| 前缀变量 | `startedBy[l,t]`：是否已开工过 | `started[l,t]`：强制牌号是否已开工 |
| 输入信号 | `u[l,t]`：机组是否在生产 | `f[l,t]`：是否在生产强制牌号 |
| 门控对象 | `leadingIdle`：前置空闲定义 | `x[p,l,t]`：其他牌号门控 |
| 约束类型 | 软目标辅助变量 | 硬约束门控 |
| 语义 | "什么时候开工" | "开工时必须先做强制牌号" |

`LeadingIdle` 关心的是**何时开工**，`MatMonthContinue` 关心的是**开工时做什么**——两者可以同时作用于同一机组。

---

## 十六、MaxSimultaneousMachinesConstraintBuilder — 最大同时开台数约束

### 16.1 一句话总结

**每个时间桶同时运行的机组数量不超过配置上限**——限制同一时刻有多少台机组可以同时生产。

### 16.2 业务背景

卷包车间中，机组的运行需要消耗共享资源：操作工、原料供应、电力等。工厂可能因为人手限制、原料供应能力、电力容量等原因，无法在同一时刻让所有机组全部开机。

例如：车间有 6 台机组，但当前班次只有 4 名操作工，则同一时刻最多只能开 4 台——即使 6 台都有生产任务，也必须排队分批执行。

最大同时开台数约束将这一物理限制编码到模型中：每个时间桶中，`u[l,t] = 1` 的机组数量之和不超过该桶的上限 `K(t)`。

### 16.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（`BoolVar`：0/1） |
| `K(t)` | 时间桶 t 的最大同时开台数上限（`maxOpen`，常量） |

`K(t)` 的取值逻辑（由 `PackScheduleProblemBuilder` 计算）：

$$
K(t) = \min\big(\text{configuredMaxOpen},\; |\{l : \text{isAvailable}(l,t)\}|\big)
$$

即：上限取"配置的最大开台数"和"该桶可用机组数"的较小值——不可能让 5 台机组同时开机如果该桶只有 3 台可用。

### 16.4 约束的数学表达

对每个时间桶 t：

$$
\sum_l u[l,t] \leq K(t)
$$

即：该桶所有在生产机组数量之和不超过上限。

分析：
- `u[l,t] = 1`：机组 l 在桶 t 生产，贡献 1
- `u[l,t] = 0`：机组 l 在桶 t 空闲，贡献 0
- 求和 = 该桶同时开机的机组数
- 约束确保：同时开机数 ≤ K(t)

### 16.5 逐行拆解

#### 双层循环：对每个桶汇总开台数

```java
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    LinearExprBuilder openLines = LinearExpr.newBuilder();
    for (PackScheduleLine line : problem.getLinesSafe()) {
        if (ctx.u(line.getLineId(), bucket.getIndex()) != null) {
            openLines.add(ctx.u(line.getLineId(), bucket.getIndex()));
        }
    }
    // (1) Σ_l u[l,t] ≤ K(t)
    model.addLessOrEqual(openLines, problem.getMaxOpen(bucket.getIndex()));
}
```

外层遍历每个时间桶，内层遍历每台机组，收集该桶所有 `u` 变量到求和表达式，然后约束求和结果不超过 `K(t)`。

`u[l,t] != null` 过滤：建模时未创建 `u` 变量的桶不参与求和（如该桶对该机组不可用）。

#### 为什么是逐桶约束而非全局约束？

开台数限制是**时间维度的局部约束**——每个桶独立限制，不同桶的上限可能不同（如白天班次人手充足 K=6，夜班人手不足 K=3）。逐桶建模自然支持非均匀上限。

### 16.6 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `Σ_l u[l,t] ≤ K(t)` | 每个桶同时开台数不超过上限 |

| 条件 | 行为 |
|------|------|
| `u[l,t]` 为 null | 不参与求和（建模时未创建） |
| `K(t) ≥ |L|` | 约束自动满足（上限 ≥ 机组总数） |
| `K(t) = 0` | 该桶不允许任何机组开机 |

### 16.7 图示

```
车间有 6 台机组 (line1-line6)
配置最大开台数: 4

时间轴:  t0  t1  t2  t3  t4  t5
K(t):     4   4   3   4   4   4  ← t2 夜班人手不足，上限降至3

──────────────────────────────────────────

情况1: t0 时 3 台开机（合法）
  u[#1,t0]=1  u[#2,t0]=1  u[#3,t0]=1
  u[#4,t0]=0  u[#5,t0]=0  u[#6,t0]=0
  Σ u = 3 ≤ 4 = K(t0)  ✓

──────────────────────────────────────────

情况2: t2 时 4 台开机（非法）
  u[#1,t2]=1  u[#2,t2]=1  u[#3,t2]=1  u[#4,t2]=1
  u[#5,t2]=0  u[#6,t2]=0
  Σ u = 4 > 3 = K(t2)  ✗ 违反！
  含义: t2 夜班只能开 3 台，不允许 4 台同时运行

──────────────────────────────────────────

情况3: t5 时全部 6 台开机（非法）
  Σ u = 6 > 4 = K(t5)  ✗ 违反！
  含义: 车间资源最多支撑 4 台同时运行

求解器行为:
  K(t)=4 时：最多选 4 台开机，其余停机
  K(t)=3 时：最多选 3 台，求解器按需求优先级分配
```

### 16.8 与 AssignmentConstraintBuilder 的关系

`AssignmentConstraintBuilder` 约束的是**机组内部**：一台机组一个桶最多一个产品。`MaxSimultaneousMachinesConstraintBuilder` 约束的是**车间层面**：所有机组一个桶最多 K 台同时开机。

```
AssignmentConstraintBuilder:              MaxSimultaneousMachinesConstraintBuilder:
单机组: Σ_p x[p,l,t] ≤ 1                车间: Σ_l u[l,t] ≤ K(t)
（一台机组一个桶最多一个产品）              （一个桶最多K台机组同时生产）

关系:
  u[l,t] = Σ_p x[p,l,t]（由 AssignmentConstraintBuilder 绑定）
  所以: Σ_l u[l,t] = Σ_l Σ_p x[p,l,t] ≤ K(t)
  即: 整个车间在该桶的指派总数 ≤ K(t)
```

MaxSimultaneousMachines 在 Assignment 之上增加了一层**跨机组**的限制：即使每台机组内部合法（各选了一个产品），如果同时开机的台数超过 K，仍然非法。

### 16.9 约束的松紧与模型可行性

`K(t)` 的设置直接影响模型可行性：

| K(t) 值 | 效果 |
|----------|------|
| `K(t) ≥ |L|` | 无约束效果（上限 ≥ 机组总数，天然满足） |
| `K(t) = 0` | 该桶强制所有机组停机 |
| `K(t)` 过小 | 可能导致无解——所有需求无法在有限开台数内完成 |

`PackScheduleProblemBuilder` 用 `min(configuredMaxOpen, availableCount)` 确保上限不超过可用机组数，避免"要求开 5 台但只有 3 台可用"的矛盾。但如果 `configuredMaxOpen` 本身设置过小（如 1），即使所有桶都可用，需求也可能无法满足——这是业务配置问题，约束本身无法修复。

### 16.10 本构建器的简洁性

本构建器是整个约束链中**最简洁**的构建器之一——只有一条约束 `Σ u ≤ K`，无辅助变量、无递推、无条件分支。简洁的原因：

1. `u[l,t]` 变量已由其他构建器（AssignmentConstraintBuilder）正确定义
2. `K(t)` 是编译期常量，无需在模型中建模
3. 约束语义直观，无需复杂推导

这也体现了约束链的分层设计：**底层构建器**（Assignment、Capacity）定义变量语义，**中层构建器**（Continuity、Changeover）定义块结构和时序，**顶层构建器**（MaxSimultaneousMachines）在全局层面施加资源限制——每层只关心自己的维度，组合起来形成完整模型。

---

## 十七、MustFulfillDemandConstraintBuilder — 必须满足需求约束

### 17.1 一句话总结

**将欠产变量强制归零**——配合 `DemandConstraintBuilder` 的物质守恒等式，等价于"总排产必须等于需求量"，不允许任何欠产。

### 17.2 业务背景

卷包排产中，`DemandConstraintBuilder` 建立了物质守恒：`Σq + u = D`，其中 `u`（unfulfilled）是欠产变量。默认情况下，`u` 可以取正值——求解器允许部分需求未被满足，在其他约束（产能、时间等）限制下找到最优的欠产分配。

但某些业务场景要求**必须满足全部需求**——不允许欠产。例如：
- 核心牌号必须按时交付，否则影响下游工序
- 客户订单有严格交期，欠产不可接受
- 安全库存必须补齐

本构建器将 `u(p)` 强制为 0，使需求从**软约束**（允许欠产）升级为**硬约束**（必须满足）。一旦启用，求解器必须找到满足所有需求的排产方案——如果产能不足，模型会返回无解而非"部分满足"。

### 17.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `u(p)` | 产品 p 的未完成需求量（`IntVar`：`unfulfilled`，由 `DemandConstraintBuilder` 创建） |
| `D(p)` | 产品 p 的整箱需求量（`demandScaled`，常量） |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量 |
| `P_enabled` | 需要强制满足需求的产品集合（`enabledDetailIds`，null 表示全部） |

### 17.4 约束的数学表达

#### (1) 欠产归零

对每个产品 p ∈ P_enabled：

$$
u(p) = 0
$$

#### 等价推导：总排产 = 需求量

由 `DemandConstraintBuilder` 的物质守恒等式：

$$
\sum_{l,t} q[p,l,t] + u(p) = D(p)
$$

代入 `u(p) = 0`：

$$
\sum_{l,t} q[p,l,t] = D(p)
$$

即：**总排产量必须恰好等于需求量**——不多不少。

### 17.5 约束的等价含义分析

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| DemandConstraintBuilder | `Σq + u = D`，`0 ≤ u ≤ D` | 允许欠产，总排产 ≤ 需求 |
| MustFulfillDemand | `u = 0` | 不允许欠产，总排产 = 需求 |

MustFulfillDemand 本质上是 DemandConstraintBuilder 的**收紧**——将 `u` 的域从 `[0, D]` 收紧到 `{0}`。

### 17.6 逐行拆解

#### 构造函数：可选的产品范围

```java
public MustFulfillDemandConstraintBuilder(Set<Long> enabledDetailIds) {
    this.enabledDetailIds = enabledDetailIds == null
            ? null : new LinkedHashSet<>(enabledDetailIds);
}
```

- `enabledDetailIds = null`：对所有产品生效
- `enabledDetailIds = {id1, id2}`：仅对集合中的产品生效

这提供了**精确控制**——可以让部分产品必须满足需求（核心牌号），同时允许其他产品欠产（非关键牌号）。

#### 前置守卫

```java
if (!problem.isMustFulfillDemandEnabled()) {
    return;
}
```

全局开关 `mustFulfillDemandEnabled`。未启用时所有产品都允许欠产。

#### 逐产品归零

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    Long detailId = product.getScheduleOrderPlanDetailId();
    if (enabledDetailIds != null && !enabledDetailIds.contains(detailId)) {
        continue;
    }
    IntVar unfulfilled = ctx.unfulfilled(detailId);
    if (unfulfilled != null) {
        // (1) u(p) = 0
        ctx.getModel().addEquality(unfulfilled, 0L);
    }
}
```

两层过滤：
1. `enabledDetailIds` 不为 null 时，只处理集合中的产品
2. `unfulfilled` 变量不存在时跳过（防御性检查）

对每个通过过滤的产品，强制 `u(p) = 0`。

### 17.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `u(p) = 0` | 欠产归零 |
| 隐含 | `Σ_{l,t} q[p,l,t] = D(p)` | 总排产 = 需求量 |

| 条件 | 行为 |
|------|------|
| `mustFulfillDemandEnabled = false` | 无约束 |
| `enabledDetailIds` 为 null | 对所有产品生效 |
| `enabledDetailIds` 非 null | 仅对集合中的产品生效 |
| `unfulfilled` 变量不存在 | 跳过（防御性） |

### 17.8 图示

```
产品A: D = 500 箱, u(A) 原本域为 [0, 500]
产品B: D = 300 箱, u(B) 原本域为 [0, 300]
产品C: D = 200 箱, u(C) 原本域为 [0, 200]

──────────────────────────────────────────

情况1: 全局启用（enabledDetailIds = null）
  u(A) = 0  →  Σq[A] = 500  ← 必须做完
  u(B) = 0  →  Σq[B] = 300  ← 必须做完
  u(C) = 0  →  Σq[C] = 200  ← 必须做完

  如果总产能不足 1000 箱 → 模型无解

──────────────────────────────────────────

情况2: 部分启用（enabledDetailIds = {A}）
  u(A) = 0  →  Σq[A] = 500  ← 必须做完
  u(B) 自由 →  Σq[B] ≤ 300  ← 允许欠产
  u(C) 自由 →  Σq[C] ≤ 200  ← 允许欠产

  求解器：优先满足 A，B/C 按产能分配
  如果总产能 = 800:
    Σq[A] = 500（必须），剩余 300 给 B/C
    u(B) + u(C) = 200（B/C 欠产 200 箱）

──────────────────────────────────────────

情况3: 未启用（mustFulfillDemandEnabled = false）
  所有 u 自由 → 允许全部产品欠产
  求解器按目标函数（最小化 Σu 或其他）分配
```

### 17.9 与 DemandConstraintBuilder 的关系

`DemandConstraintBuilder` 和 `MustFulfillDemandConstraintBuilder` 共同定义了需求约束的**松紧程度**：

```
DemandConstraintBuilder:                    MustFulfillDemandConstraintBuilder:
Σ_{l,t} q[p,l,t] + u(p) = D(p)            u(p) = 0
（物质守恒：产量 + 欠产 = 需求）              （欠产归零）

宽松模式（仅 Demand）: Σq ≤ D（允许欠产）
严格模式（Demand + MustFulfill）: Σq = D（必须满足）
```

`MustFulfillDemandConstraintBuilder` 是 `DemandConstraintBuilder` 的**收紧器**——它在 Demand 的基础上进一步限制 `u`，使需求从"尽量满足"升级为"必须满足"。

### 17.10 与 DueDateConstraintBuilder 的关系

`DueDateConstraintBuilder` 的严格模式也要求窗口内产量满足需求：

```
DueDateConstraintBuilder（严格模式）:
  Σ_{l, t₀≤t≤t_d} q[p,l,t] ≥ D_due(p)
```

这个约束与 `MustFulfillDemandConstraintBuilder` 的 `u(p) = 0` 有重叠但侧重点不同：

| 维度 | MustFulfillDemand | DueDate（严格模式） |
|------|-------------------|-------------------|
| 约束范围 | 全局：整个排产周期 | 局部：交期窗口内 |
| 约束形式 | `u(p) = 0` → `Σq = D` | `Σ_{窗口内} q ≥ D_due` |
| 时间限制 | 无（任何时间做完即可） | 有（必须在交期窗口内） |

`MustFulfillDemand` 只关心"做没做完"，不关心"什么时候做完"。`DueDate` 的严格模式既关心"做没做完"又关心"什么时候做完"。

两者同时启用时，`DueDate` 的严格模式隐含了 `MustFulfillDemand`——因为窗口内产量 ≥ D 且总产量 ≤ D（由 Demand 保证），所以窗口内产量 = D，窗口外产量 = 0，u = 0。

### 17.11 无解风险

`u(p) = 0` 将需求从软约束变为硬约束，**增加了模型无解的风险**。如果产能不足、时间不够或其他约束冲突导致无法满足所有需求，模型会返回 INFEASIBLE 而非"部分满足的排产方案"。

缓解策略：
1. 使用 `enabledDetailIds` 只对核心产品启用，非核心产品允许欠产
2. 确保产能配置合理——如果总需求超过总产能，强制满足必然无解
3. 使用诊断模式（`DiagnosticMode`）逐步排查无解原因

### 17.12 本构建器的简洁性

本构建器与 `MaxSimultaneousMachinesConstraintBuilder` 一样简洁——只有一条约束 `u(p) = 0`，无辅助变量、无递推、无条件分支。简洁的原因同样是**变量已由其他构建器创建**——`unfulfilled` 由 `DemandConstraintBuilder` 创建并注册到上下文，本构建器只需将其归零。

这也体现了 DDD 分层设计的优势：`DemandConstraintBuilder` 负责"定义需求守恒"（创建变量、建立等式），`MustFulfillDemandConstraintBuilder` 负责"收紧需求"（归零欠产）——职责分离，互不耦合。

---

## 十八、NoGapBetweenBlocksConstraintBuilder — 机组生产无间隙约束

### 18.1 一句话总结

**同一机组最多形成一个连续生产块**——允许晚开始、连续生产、正常结束，但禁止"生产-空闲-再生产"的碎片化排产。

### 18.2 业务背景

卷包排产中，如果一台机组在排产周期内出现"做一段时间A、停一段时间、再做一段时间A"的碎片化排产，会带来一系列问题：

1. **额外换产**：每次重新启动可能需要换产操作（即使同牌号，停机重启也有调整成本）
2. **管理复杂**：碎片化的生产段增加了调度和监控难度
3. **产能浪费**：中间空闲的桶没有充分利用

本构建器通过限制每台机组最多启动一次生产块，确保机组的生产行为是"一段连续运行"而非多段碎片。

**与换产约束的互斥**：当启用换产结构控制（`ChangeoverConstraintBuilder`）时，块间空闲由换产时长约束管理——两个不同牌号的连续块之间允许存在换产时间。此时本构建器自动跳过，避免约束冲突。

### 18.3 符号约定

| 符号 | 含义 |
|------|------|
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u[l,t]` | 机组 l 在时间桶 t 是否在生产（`BoolVar`：0/1） |
| `b[l,t]` | 机组 l 在桶 t 是否为块启动点（`BoolVar`，辅助变量 `blockStart`） |
| `T_eff(l)` | 机组 l 的有效生产桶序列（`u` 变量非 null 的桶，按序排列） |
| `t_prev` | 沿有效桶序列，当前桶的前一个有效桶 |

### 18.4 约束的数学表达

#### (1) 块启动点定义

**0→1 跳变检测**：当前桶生产且前一桶空闲，即为块启动点。

首个有效桶（无前序）：

$$
b[l,t_0] = u[l,t_0] \quad\text{(1a)}
$$

后续有效桶：

$$
b[l,t] = u[l,t] \wedge \neg u[l,t_{prev}] \quad\text{(1b)}
$$

用三条线性约束实现布尔 AND：

$$
b[l,t] \leq u[l,t] \quad\text{(1b-i)} \quad \text{当前不生产则不启动}
$$

$$
b[l,t] + u[l,t_{prev}] \leq 1 \quad\text{(1b-ii)} \quad \text{前一桶在生产则不启动}
$$

$$
b[l,t] - u[l,t] + u[l,t_{prev}] \geq 0 \quad\text{(1b-iii)} \quad \text{当前生产且前序空闲则必须启动}
$$

三条约束合在一起唯一确定 `b = u ∧ ¬prev`。

#### (2) 最多一个块启动点

$$
\sum_{t \in T_{eff}(l)} b[l,t] \leq 1
$$

即：有效生产桶序列中，最多发生一次 0→1 跳变——意味着最多一个连续生产块。

### 18.5 块启动点 b 的真值表

| u[l,t] | u[l,t_prev] | b[l,t] | 含义 |
|---------|-------------|---------|------|
| 0 | 0 | 0 | 空闲，不是启动点 |
| 0 | 1 | 0 | 块结束（1→0 跳变），不是启动点 |
| 1 | 1 | 0 | 块内部，不是启动点 |
| 1 | 0 | **1** | **0→1 跳变，块启动点** |

验证三条约束：

| u | prev | b | (i) b≤u | (ii) b+prev≤1 | (iii) b-u+prev≥0 | 全满足 |
|---|------|---|---------|---------------|-------------------|--------|
| 0 | 0 | 0 | 0≤0 ✓ | 0+0=0≤1 ✓ | 0-0+0=0≥0 ✓ | ✓ |
| 0 | 1 | 0 | 0≤0 ✓ | 0+1=1≤1 ✓ | 0-0+1=1≥0 ✓ | ✓ |
| 1 | 1 | 0 | 0≤1 ✓ | 0+1=1≤1 ✓ | 0-1+1=0≥0 ✓ | ✓ |
| 1 | 0 | 1 | 1≤1 ✓ | 1+0=1≤1 ✓ | 1-1+0=0≥0 ✓ | ✓ |

### 18.6 有效桶序列与休息日处理

`u[l,t] = null` 的桶（停机/维修/节假日）不参与连续性判断，但 `previousProduction` 保持不变。这意味着休息日前后的有效桶按连续序列处理——休息日不切断连续性。

```
自然时间轴:  t0  t1  [休息]  t2  t3  t4
u 变量:      1   1    null   1   1   0
有效序列:    1   1           1   1   0

previousProduction 沿有效序列:
  t0: prev=null → b[t0]=u[t0]=1（启动）
  t1: prev=u[t0]=1 → b[t1]=u[t1]∧¬prev=1∧¬1=0
  [休息]: 跳过，prev 保持为 u[t1]=1
  t2: prev=u[t1]=1 → b[t2]=u[t2]∧¬prev=1∧¬1=0
  t3: prev=u[t2]=1 → b[t3]=u[t3]∧¬prev=1∧¬1=0
  t4: prev=u[t3]=1 → b[t4]=u[t4]∧¬prev=0∧¬1=0

Σb = 1 ≤ 1 ✓  一个连续块跨越休息日
```

### 18.7 逐行拆解

#### 前置守卫

```java
if (!problem.isNoGapBetweenBlocksEnabled()) {
    return;
}
if (problem.isChangeoverStructureControlEnabled()) {
    return;
}
```

两个跳过条件：
1. 未启用本约束
2. 已启用换产结构控制——块间空闲由 `ChangeoverConstraintBuilder` 管理，本约束让位

#### 逐机组构建

```java
BoolVar previousProduction = null;
LinearExprBuilder startCount = LinearExpr.newBuilder();
```

- `previousProduction`：沿有效桶序列追踪前一桶的生产状态
- `startCount`：累加所有块启动点

#### 首个有效桶

```java
if (previousProduction == null) {
    // (1a) b[l,t₀] = u[l,t₀]
    startCount.add(production);
}
```

首个有效桶的生产状态直接作为启动点——`u=1` 表示启动了生产块。

#### 后续有效桶

```java
BoolVar blockStart = model.newBoolVar(...);

// (1b-i) b ≤ u
model.addLessOrEqual(blockStart, production);
// (1b-ii) b + prev ≤ 1
model.addLessOrEqual(previousUpperBound, 1L);
// (1b-iii) b - u + prev ≥ 0
model.addGreaterOrEqual(lowerBound, 0L);

startCount.add(blockStart);
```

创建 `b[l,t]` 辅助变量，用三条约束实现 `b = u ∧ ¬prev`，加入启动点计数。

#### 最终约束

```java
if (effectiveBucketCount > 0) {
    // (2) Σ b[l,t] ≤ 1
    model.addLessOrEqual(startCount, 1L);
}
```

无有效桶时无需约束。

### 18.8 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1a) | `b[l,t₀] = u[l,t₀]` | 首个有效桶的启动点 |
| (1b-i) | `b[l,t] ≤ u[l,t]` | 当前不生产则不启动 |
| (1b-ii) | `b[l,t] + u[l,t_prev] ≤ 1` | 前一桶在生产则不启动 |
| (1b-iii) | `b[l,t] - u[l,t] + u[l,t_prev] ≥ 0` | 当前生产且前序空闲则启动 |
| (2) | `Σ_{t ∈ T_eff(l)} b[l,t] ≤ 1` | 最多一个块启动点 |

| 条件 | 行为 |
|------|------|
| `noGapBetweenBlocksEnabled = false` | 无约束 |
| `changeoverStructureControlEnabled = true` | 无约束（让位给换产约束） |
| `effectiveBucketCount = 0` | 无约束（无有效桶） |

### 18.9 图示

```
机组#1, 有效桶序列 t0-t7

情况1: 一个连续块（合法）
  u:  0  0  1  1  1  1  0  0
  b:  0  0  1  0  0  0  0  0    ← t2 为唯一启动点
  Σb = 1 ≤ 1  ✓

──────────────────────────────────────────

情况2: 两个块（非法）
  u:  1  1  0  0  1  1  0  0
  b:  1  0  0  0  1  0  0  0    ← t0 和 t4 都是启动点
  Σb = 2 > 1  ✗ 违反！

──────────────────────────────────────────

情况3: 完全空闲（合法）
  u:  0  0  0  0  0  0  0  0
  b:  0  0  0  0  0  0  0  0
  Σb = 0 ≤ 1  ✓

──────────────────────────────────────────

情况4: 晚开始，一个连续块（合法）
  u:  0  0  0  1  1  1  1  0
  b:  0  0  0  1  0  0  0  0    ← t3 为唯一启动点
  Σb = 1 ≤ 1  ✓  允许晚开始

──────────────────────────────────────────

含休息日的情况:
  自然时间轴:  t0  t1  [休]  t2  t3  [休]  t4  t5
  u:           1   1   null  1   1   null  1   0
  有效序列:    1   1         1   1         1   0
  b:           1   0         0   0         0   0
  Σb = 1  ✓  一个块跨越休息日
```

### 18.10 与 ContinuityConstraintBuilder 的关系

两者都限制"最多一个连续块"，但视角不同：

| 维度 | NoGapBetweenBlocks | Continuity |
|------|-------------------|------------|
| 约束对象 | 机组级别：`u[l,t]` | 产品-机组级别：`end[p,l,t]` |
| 变量 | `u[l,t]`（机组是否在生产） | `end[p,l,t]`（产品在机组的连续块结束） |
| 检测方式 | 0→1 跳变计数 | AtMostOne(end) |
| 粒度 | 整台机组的生产行为 | 每个产品在该机组的生产行为 |

```
NoGapBetweenBlocks:                     Continuity:
Σ b[l,t] ≤ 1                            Σ_t end[p,l,t] ≤ 1
（机组级别的单块约束）                      （产品-机组级别的单块约束）
```

**关键区别**：NoGapBetweenBlocks 限制的是**机组层面**的连续性——不管生产什么产品，机组的生产行为只能是一段连续运行。Continuity 限制的是**产品层面**的连续性——同一产品在同一机组上只能有一个连续块，但不同产品可以在机组上交替生产。

如果两者同时启用：
- NoGapBetweenBlocks：机组只能有一段连续生产
- Continuity：每个产品在机组上只能有一个连续块

合在一起：机组一段连续运行中，可能生产多个产品（每个产品各一个连续块），但机组整体不停机。

### 18.11 与 ChangeoverConstraintBuilder 的互斥关系

当 `changeoverStructureControlEnabled = true` 时，本构建器自动跳过。原因：

`ChangeoverConstraintBuilder` 的 Circuit 约束允许同一机组上有多个连续块（不同牌号），块之间由换产时长约束管理。如果同时启用 NoGapBetweenBlocks，多个块的 Circuit 结构会被 `Σb ≤ 1` 禁止——导致无解。

```
换产场景（changeoverStructureControlEnabled=true）:
  机组#1: [品牌A连续块] → [换产时间] → [品牌B连续块]
  这需要两个块启动点 b=1, b=1 → Σb=2 > 1 ✗ 与 NoGap 冲突

因此：换产结构控制启用时，NoGap 自动让位
```

### 18.12 为什么用跳变计数而非 AtMostOne(end)？

本构建器用 `Σb ≤ 1`（0→1 跳变计数）而非 `AtMostOne(end)`（AtMostOne 约束），原因：

1. **变量不同**：`end[p,l,t]` 是产品-机组级别的变量，由 `ProductionStructureConstraintBuilder` 创建；`u[l,t]` 是机组级别的变量，更早可用
2. **语义不同**：`end` 标记的是"产品 p 在机组 l 的连续块结束"，`b` 标记的是"机组 l 的生产块启动"——两者视角不同
3. **无换产时等价**：当不启用换产结构控制时，机组只会生产一个产品（由 Continuity 保证单块 × 无换产 → 单产品），此时 `Σb ≤ 1` 和 `AtMostOne(end)` 语义等价

如果换产控制启用，`end` 变量可以标记多个产品的块结束（允许），但 `Σb ≤ 1` 禁止多个机组级块（不允许）——这就是两者互斥的原因。

---

## 十九、ProductionStructureConstraintBuilder — 基础生产结构约束

### 19.1 一句话总结

**定义 start、end、productLineUsed 三个结构变量的语义**——它们不是独立的决策变量，而是由指派变量 `x` 推导而来的"观察变量"，为后续约束和目标提供块级别的抽象。

### 19.2 业务背景

排产模型的核心决策变量是 `x[p,l,t]`（产品 p 是否在机组 l、桶 t 上生产）和 `q[p,l,t]`（排产数量）。但很多约束和目标需要在**块级别**（连续生产段）而非**桶级别**操作，例如：

- "连续块的第一桶不能满产"（换产场景）→ 需要知道哪个桶是 start
- "连续块最多一个"→ 需要知道 end 出现了几次
- "产品是否使用了该机组"→ 需要知道 productLineUsed

本构建器将这些块级别的语义变量与桶级别的 `x` 变量绑定，使后续约束可以直接引用 `start`/`end`/`productLineUsed` 而无需自行推导。

### 19.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `x[p,l,t]` | 产品 p 是否在机组 l、时间桶 t 上生产（`BoolVar`：0/1） |
| `start[p,l,t]` | 产品 p 在机组 l、桶 t 上是否为连续块的开始（`BoolVar`：0/1） |
| `end[p,l,t]` | 产品 p 在机组 l、桶 t 上是否为连续块的结束（`BoolVar`：0/1） |
| `u_p[l,p]` | 产品 p 是否使用了机组 l（`BoolVar`：`productLineUsed`） |
| `t_prev` | 沿可用桶序列，当前桶的前一个有效桶 |
| `t_next` | 沿可用桶序列，当前桶的后一个有效桶 |

### 19.4 约束的数学表达

#### (1) start 语义

$$
start[p,l,t] = x[p,l,t] \wedge \neg x[p,l,t_{prev}]
$$

即：**当前桶生产且前一桶不生产 → 块开始**。

首个有效桶（无前序）：

$$
start[p,l,t_0] = x[p,l,t_0] \quad\text{(1a)}
$$

后续有效桶，用三条约束实现 `start ⟺ x ∧ ¬prev`：

$$
start \Rightarrow x \quad\text{(1b)} \quad \text{start=1 则当前必须生产}
$$

$$
start \Rightarrow \neg prev \quad\text{(1c)} \quad \text{start=1 则前一桶必须不生产}
$$

$$
\neg x \vee prev \vee start \quad\text{(1d)} \quad \text{当前生产且前一桶空闲 ⟹ start=1}
$$

(1d) 是 (1b) 和 (1c) 的逆否方向的合并：`x ∧ ¬prev ⟹ start`，等价于 `¬x ∨ prev ∨ start`（De Morgan）。

#### (2) end 语义

$$
end[p,l,t] = x[p,l,t] \wedge \neg x[p,l,t_{next}]
$$

即：**当前桶生产且后一桶不生产 → 块结束**。

最后有效桶（无后继）：

$$
end[p,l,t_{last}] = x[p,l,t_{last}] \quad\text{(2a)}
$$

后续有效桶（反向遍历视角），用三条约束实现 `end ⟺ x ∧ ¬next`：

$$
end \Rightarrow x \quad\text{(2b)}
$$

$$
end \Rightarrow \neg next \quad\text{(2c)}
$$

$$
\neg x \vee next \vee end \quad\text{(2d)}
$$

#### (3) productLineUsed 语义

$$
u_p[l,p] = 1 \;\Longleftrightarrow\; \sum_t x[p,l,t] \geq 1
$$

即：**产品 p 在机组 l 上至少一个桶在生产 ⟹ 产品使用了该机组**。

两条条件约束：

$$
u_p = 1 \;\Longrightarrow\; \sum_t x[p,l,t] \geq 1 \quad\text{(3a)}
$$

$$
u_p = 0 \;\Longrightarrow\; \sum_t x[p,l,t] = 0 \quad\text{(3b)}
$$

无生产变量时：

$$
u_p[l,p] = 0 \quad\text{(3c)}
$$

### 19.5 start/end 的真值表

| x（当前） | x_prev/x_next | start/end | 含义 |
|-----------|---------------|-----------|------|
| 0 | 0 | 0 | 空闲，不是开始/结束 |
| 0 | 1 | 0 | 块内部（0→0 或 1→0 过渡的接收方） |
| 1 | 1 | 0 | 块内部（连续生产） |
| 1 | 0 | **1** | **0→1（start）或 1→0（end）跳变** |

验证 start 的三条约束（end 对称相同）：

| x | prev | start | (1b) start⟹x | (1c) start⟹¬prev | (1d) ¬x∨prev∨start | 全满足 |
|---|------|-------|--------------|-----------------|---------------------|--------|
| 0 | 0 | 0 | 0⟹0 ✓ | 0⟹1 ✓ | 1∨0∨0=1 ✓ | ✓ |
| 0 | 1 | 0 | 0⟹0 ✓ | 0⟹0 ✓ | 1∨1∨0=1 ✓ | ✓ |
| 1 | 1 | 0 | 0⟹1 ✓ | 0⟹0 ✓ | 0∨1∨0=1 ✓ | ✓ |
| 1 | 0 | 1 | 1⟹1 ✓ | 1⟹1 ✓ | 0∨0∨1=1 ✓ | ✓ |

### 19.6 逐行拆解

#### 主体循环

```java
for (PackScheduleProduct product : problem.getProductsSafe()) {
    for (PackScheduleLine line : problem.getLinesSafe()) {
        if (hasStartVariables) { bindStarts(ctx, model, problem, product, line); }
        bindEnds(ctx, model, problem, product, line);
        bindProductLineUsed(ctx, model, problem, product, line);
    }
}
```

对每个 (p, l) 组合，分别绑定 start、end、productLineUsed。`start` 变量是可选的（`hasStartVariables` 检查），`end` 和 `productLineUsed` 始终绑定。

#### bindStarts：正向遍历绑定 start

```java
BoolVar previousProduction = null;
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    if (!problem.isAvailable(line.getLineId(), bucketIndex)) { continue; }
    BoolVar currentProduction = ctx.x(productId, lineId, bucketIndex);
    if (currentProduction != null) {
        BoolVar start = ctx.start(productId, lineId, bucketIndex);
        if (start != null) {
            bindStart(model, currentProduction, previousProduction, start);
        }
    }
    // x=null 的可用桶视为常量 0，截断连续块
    previousProduction = currentProduction;
}
```

正向遍历有效桶（可用且有 x 变量），对每个桶调用 `bindStart`。`x=null` 的桶（可用但无产能）将 `previousProduction` 设为 null——等效于"前一桶不生产"，截断连续性。

#### bindStart：start = x ∧ ¬prev

```java
if (previousProduction == null) {
    // (1a) 首个有效桶：start = x
    model.addEquality(start, currentProduction);
    return;
}
// (1b) start ⟹ x
model.addImplication(start, currentProduction);
// (1c) start ⟹ ¬prev
model.addImplication(start, previousProduction.not());
// (1d) ¬x ∨ prev ∨ start  （x ∧ ¬prev ⟹ start）
model.addBoolOr(new Literal[]{currentProduction.not(), previousProduction, start});
```

三条约束实现双向蕴含 `start ⟺ x ∧ ¬prev`。

#### bindEnds：反向遍历绑定 end

```java
BoolVar nextProduction = null;
for (int cursor = problem.getBucketsSafe().size() - 1; cursor >= 0; cursor--) {
    BoolVar currentProduction = ctx.x(productId, lineId, bucketIndex);
    if (currentProduction != null) {
        BoolVar end = ctx.end(productId, lineId, bucketIndex);
        if (end != null) {
            bindEnd(model, currentProduction, nextProduction, end);
        }
    }
    nextProduction = currentProduction;
}
```

**反向遍历**——从最后一个桶向前，使 `nextProduction` 自然成为"当前桶的后继"。逻辑与 `bindStarts` 对称。

#### bindEnd：end = x ∧ ¬next

```java
if (nextProduction == null) {
    // (2a) 最后有效桶：end = x
    model.addEquality(end, currentProduction);
    return;
}
// (2b) end ⟹ x
model.addImplication(end, currentProduction);
// (2c) end ⟹ ¬next
model.addImplication(end, nextProduction.not());
// (2d) ¬x ∨ next ∨ end  （x ∧ ¬next ⟹ end）
model.addBoolOr(new Literal[]{currentProduction.not(), nextProduction, end});
```

结构与 `bindStart` 完全对称。

#### bindProductLineUsed：productLineUsed ⇔ Σx ≥ 1

```java
BoolVar productLineUsed = ctx.productLineUsed(productId, lineId);
if (productLineUsed == null) { return; }

LinearExprBuilder usedBuckets = LinearExpr.newBuilder();
for (PackScheduleBucket bucket : problem.getBucketsSafe()) {
    BoolVar x = ctx.x(productId, lineId, bucketIndex);
    if (x == null) { continue; }
    usedBuckets.add(x);
}
if (!hasProductionVariable) {
    // (3c) 无生产变量：u_p = 0
    model.addEquality(productLineUsed, 0L);
    return;
}
// (3a) u_p = 1 ⟹ Σx ≥ 1
model.addGreaterOrEqual(usedBuckets, 1L).onlyEnforceIf(productLineUsed);
// (3b) u_p = 0 ⟹ Σx = 0
model.addEquality(usedBuckets, 0L).onlyEnforceIf(productLineUsed.not());
```

汇总所有 `x[p,l,t]`，用两条条件约束建立 `productLineUsed` 的等价语义。

### 19.7 x=null 的桶对连续性的影响

可用但无该物料能力的桶（`x = null`）在遍历中被跳过，但 `previousProduction`/`nextProduction` 被设为 `null`。这意味着：

- `bindStarts`：跳过 x=null 的桶后，下一个有效桶的 `previousProduction = null`，等效于"前一桶不生产"
- `bindEnds`：同理，下一个有效桶的 `nextProduction = null`，等效于"后一桶不生产"

效果：**x=null 的桶截断连续性**——即使该桶可用，由于该物料没有产能，连续块不能跨越它。

```
可用桶序列:  t0(x=1)  t1(x=0)  t2(x=null)  t3(x=1)  t4(x=1)
                                     ↑ 无该物料能力

start/end 计算:
  t0: start=1（prev=null→视为0），end=0（next=x[t1]=0）
  t1: start=0（x=0），end=1（x=1 ∧ next=null→视为0）
  t2: 跳过（x=null）
  t3: start=1（prev=null→截断），end=0（next=x[t4]=1）
  t4: start=0（prev=x[t3]=1），end=1（next=null→最后桶）

结果：两个独立的连续块 [t0-t1] 和 [t3-t4]
  t2（无产能）截断了连续性
```

### 19.8 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1a) | `start = x`（首个有效桶） | 生产即开始 |
| (1b) | `start ⟹ x` | start=1 则当前必须生产 |
| (1c) | `start ⟹ ¬prev` | start=1 则前一桶必须空闲 |
| (1d) | `¬x ∨ prev ∨ start` | 当前生产且前一桶空闲 ⟹ start=1 |
| (2a) | `end = x`（最后有效桶） | 生产即结束 |
| (2b) | `end ⟹ x` | end=1 则当前必须生产 |
| (2c) | `end ⟹ ¬next` | end=1 则后一桶必须空闲 |
| (2d) | `¬x ∨ next ∨ end` | 当前生产且后一桶空闲 ⟹ end=1 |
| (3a) | `u_p = 1 ⟹ Σx ≥ 1` | 使用 ⟹ 至少一个桶生产 |
| (3b) | `u_p = 0 ⟹ Σx = 0` | 未使用 ⟹ 所有桶都不生产 |
| (3c) | `u_p = 0`（无生产变量） | 无产能则未使用 |

### 19.9 图示

```
产品A, 机组#1, 有效桶 t0-t5

x[p,l,t]:  0  1  1  1  0  0

start 计算（正向遍历）:
  t0: start = x=0 = 0        （首桶，不生产）
  t1: start = x∧¬prev = 1∧¬0 = 1  ← 块开始！
  t2: start = x∧¬prev = 1∧¬1 = 0
  t3: start = x∧¬prev = 1∧¬1 = 0
  t4: start = x∧¬prev = 0∧¬1 = 0
  t5: start = x∧¬prev = 0∧¬0 = 0

end 计算（反向遍历）:
  t5: end = x=0 = 0          （末桶，不生产）
  t4: end = x∧¬next = 0∧¬0 = 0
  t3: end = x∧¬next = 1∧¬0 = 1  ← 块结束！
  t2: end = x∧¬next = 1∧¬1 = 0
  t1: end = x∧¬next = 1∧¬1 = 0
  t0: end = x∧¬next = 0∧¬1 = 0

连续块: t1(开) → t2 → t3(关)
  start[t1]=1, end[t3]=1

productLineUsed:
  Σx = 0+1+1+1+0+0 = 3 ≥ 1  →  u_p = 1  ← 产品A使用了机组#1
```

### 19.10 作为"基础设施"构建器的地位

本构建器是整个约束链的**基础设施**——它不引入业务限制，只定义变量语义。几乎所有其他构建器都依赖它：

| 依赖方 | 使用的变量 | 用途 |
|--------|-----------|------|
| `ContinuityConstraintBuilder` | `end` | AtMostOne(end)：最多一个连续块 |
| `ChangeoverConstraintBuilder` | `start`, `end` | 块起止位置推导、换产容量约束 |
| `FullBucketBeforeTailConstraintBuilder` | `start` | 换产首桶豁免满产 |
| `ForbidReturnToFinishedMaterialConstraintBuilder` | `end` | end=1 ⟹ 全局累计产量=需求 |
| `MatMonthContinueConstraintBuilder` | `productLineUsed` | 强制牌号必须使用该机组 |

没有 `ProductionStructureConstraintBuilder`，这些构建器无法正确解读 `x` 变量背后的块结构。可以说，**本构建器将桶级别的 `x` 翻译成块级别的 `start/end/productLineUsed`，是桶视图到块视图的桥梁**。

### 19.11 start 变量为何可选？

`start` 变量只在特定场景需要创建：

| 场景 | 需要 start | 原因 |
|------|-----------|------|
| 换产结构控制 | 是 | 首桶产能约束需要 start |
| 齐开齐停 | 是 | 同步起始桶需要 start |
| 牌号计划量优先 | 是 | 排产顺序控制需要 start |
| 其他场景 | 否 | 只需 end 和 productLineUsed |

`PackScheduleVariableBuilder` 根据配置决定是否创建 `start` 变量。本构建器通过 `hasStartVariables` 检查，未创建时跳过 `bindStarts`——避免为不需要的场景创建不必要的变量和约束。

### 19.12 为什么用三条约束而非 addMaxEquality？

`start ⟺ x ∧ ¬prev` 可以用三条线性约束实现（如本构建器），也可以用其他方式实现。选择三条约束的原因：

1. **addImplication 是 CP-SAT 原生高效约束**——比手写线性不等式传播更快
2. **addBoolOr 实现逆否方向**——`¬x ∨ prev ∨ start` 是子句形式，CP-SAT 的 SAT 引擎处理子句效率极高
3. **避免中间变量**——如果用 `addMaxEquality` 实现 AND，需要额外的辅助变量

同样，`end ⟺ x ∧ ¬next` 也用对称的三条约束实现。

---

## 二十、SameMaterialPlanOrderConstraintBuilder — 同物料计划顺序约束

### 20.1 一句话总结

**同一物料的后序计划开工前，前序计划必须已完成**——同一牌号的不同需求批次按交期排序，先交期的做完才能做后交期的。

### 20.2 业务背景

卷包排产中，同一牌号（物料）可能有多个排产计划明细——对应不同客户订单或不同交期。例如牌号A有：

- 计划A1：交期 3月5日，需求 300 箱
- 计划A2：交期 3月10日，需求 200 箱

业务要求：**先做A1，做完再做A2**。这不只是"总量凑够就行"——不同计划明细可能对应不同客户、不同交付承诺，先交期的必须优先完成。

如果允许A2在A1未完成时开工，可能出现"后交期的先做了，先交期的反而欠产"的不合理情况。

### 20.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `m` | 物料ID（`productId`） |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `x[p,l,t]` | 产品 p 是否在机组 l、时间桶 t 上生产（`BoolVar`：0/1） |
| `q[p,l,t]` | 产品 p 在机组 l、时间桶 t 上的排产数量（`IntVar`） |
| `D(p)` | 产品 p 的整箱需求量（`demandScaled`，常量） |
| `P(m, t)` | 截止桶 t（含 t），物料 m 的前序计划在所有机组上的累计产量 |
| `p_prev`, `p_curr` | 同一物料 m 的相邻前序/后序计划（按交期、ID排序） |

### 20.4 约束的数学表达

#### (1) 顺序约束

对同一物料的每一对相邻计划（p_prev, p_curr），对每个 (l, t)：

$$
x[p_{curr}, l, t] = 1 \;\Longrightarrow\; P(m, t-1) \geq D(p_{prev})
$$

其中：

$$
P(m, t-1) = \sum_{t' \leq t-1} \sum_l q[p_{prev}, l, t']
$$

即：**后序计划在桶 t 开工时，截止前一个桶，前序计划的累计产量必须已满足其需求量**。

#### 关键时序：先检查再累加

代码中，每个桶 t 的处理顺序是：
1. **先**用当前 `producedBefore`（反映 t-1 时刻的累计值）建立条件约束
2. **后**累加当前桶的前序计划产量，使下一桶的 `producedBefore` 反映 t 时刻

这确保了条件约束中的 `producedBefore` 是"截止前一桶"的累计值，而非"截止当前桶"——因为 `x[p_curr, l, t] = 1` 表示"在桶 t 开始生产"，此时桶 t 的产量尚未产出。

### 20.5 逐行拆解

#### 按物料分组，取相邻计划对

```java
Map<Long, PackScheduleProduct> previousByMaterial = new LinkedHashMap<>();
for (PackScheduleProduct product : ctx.getProblem().getProductsSafe()) {
    PackScheduleProduct previous = previousByMaterial.put(product.getProductId(), product);
    if (previous == null) {
        continue;
    }
    bindOrder(ctx, previous, product);
}
```

`productsSafe` 已按交期、计划明细ID排序。遍历过程中，`previousByMaterial.put` 返回同一物料的上一个计划——即前序计划。对每个相邻计划对调用 `bindOrder`。

如果同一物料只有 1 个计划，`previous` 为 null，跳过——无需顺序约束。

#### bindOrder：逐桶累积并建立条件约束

```java
LinearExprBuilder producedBefore = LinearExpr.newBuilder();
for (PackScheduleBucket bucket : ctx.getProblem().getBucketsSafe()) {
    // 步骤一：用 producedBefore（反映 t-1 累计值）建立条件约束
    for (PackScheduleLine line : ctx.getProblem().getLinesSafe()) {
        BoolVar assigned = ctx.x(current.getScheduleOrderPlanDetailId(), lineId, bucketIndex);
        if (assigned != null) {
            // (1) x[p_curr, l, t] = 1 ⟹ P(m, t-1) ≥ D(p_prev)
            ctx.getModel().addGreaterOrEqual(
                    producedBefore, previous.getDemandScaled()).onlyEnforceIf(assigned);
        }
    }
    // 步骤二：累加前序计划在当前桶的产量
    for (PackScheduleLine line : ctx.getProblem().getLinesSafe()) {
        IntVar quantity = ctx.q(previous.getScheduleOrderPlanDetailId(), lineId, bucketIndex);
        if (quantity != null) {
            producedBefore.add(quantity);
        }
    }
}
```

双层循环的内层分两步：
1. 对后序计划的每个 `x` 变量，建立 `x=1 ⟹ producedBefore ≥ D(p_prev)` 的条件约束
2. 累加前序计划在当前桶的 `q` 变量到 `producedBefore`

注意：第一个桶 t₀ 的 `producedBefore` 为空（求和表达式无项），等效于 `P(m, t₀-1) = 0`——这意味着如果后序计划在第一个桶开工，前序计划必须在排产开始前就已完成（否则约束 `0 ≥ D(p_prev)` 只有在 `D = 0` 时才满足）。

### 20.6 producedBefore 的递增过程

```
桶 t=0:  producedBefore = []                          → P=0
          约束: x[p_curr,t=0]=1 ⟹ 0 ≥ D(p_prev)
          累加: + Σ_l q[p_prev, l, 0]

桶 t=1:  producedBefore = [Σ_l q[p_prev, l, 0]]      → P=前序在t0的产量
          约束: x[p_curr,t=1]=1 ⟹ P ≥ D(p_prev)
          累加: + Σ_l q[p_prev, l, 1]

桶 t=2:  producedBefore = [Σ_{t'≤1} Σ_l q[p_prev,l,t']] → P=前序在t0+t1的产量
          约束: x[p_curr,t=2]=1 ⟹ P ≥ D(p_prev)
          累加: + Σ_l q[p_prev, l, 2]
          ...

随着 t 递增，P 逐渐增大。
当 P ≥ D(p_prev) 时，后序计划可以在该桶及之后开工。
```

### 20.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `x[p_curr,l,t]=1 ⟹ Σ_{t'≤t-1} Σ_l q[p_prev,l,t'] ≥ D(p_prev)` | 后序开工前前序必须完成 |

| 条件 | 行为 |
|------|------|
| 同一物料只有 1 个计划 | 无约束 |
| 同一物料有 N 个计划 | N-1 对相邻计划各建一组约束 |
| 后序计划在首个桶开工 | `0 ≥ D(p_prev)`——除非前序需求为 0，否则不可行 |

### 20.8 图示

```
牌号A (m=1):
  p_prev = A1, D = 300 箱, 交期 3月5日
  p_curr = A2, D = 200 箱, 交期 3月10日

时间轴:  t0   t1   t2   t3   t4   t5   t6

──────────────────────────────────────────

情况1: A1 在 t0-t2 完成，A2 从 t3 开始（合法）
  A1 产量: t0=100  t1=100  t2=100  t3=0   t4=0
  producedBefore (A1 截止前一桶):
    t0: P=0       → x[A2,t0]=1 ⟹ 0≥300 ✗ （A2不能在t0开工）
    t1: P=100     → x[A2,t1]=1 ⟹ 100≥300 ✗
    t2: P=200     → x[A2,t2]=1 ⟹ 200≥300 ✗
    t3: P=300     → x[A2,t3]=1 ⟹ 300≥300 ✓ （A1已完成，A2可以开工）
    t4: P=300     → x[A2,t4]=1 ⟹ 300≥300 ✓

  A2 在 t3 开工: x[A2,t3]=1, 300≥300 ✓ 合法

──────────────────────────────────────────

情况2: A1 在 t0-t1 只做了 200，A2 在 t2 就开工（非法）
  A1 产量: t0=100  t1=100  t2=0
  producedBefore:
    t2: P=200     → x[A2,t2]=1 ⟹ 200≥300 ✗ 违反！
  含义: A1 还没做完（欠产100），A2 不能开工

──────────────────────────────────────────

情况3: A1 完全没做，A2 任意桶开工（非法）
  producedBefore 始终 = 0
  x[A2,任意桶]=1 ⟹ 0≥300 ✗ 全部违反
  A2 只能在所有桶 x=0（不生产）
```

### 20.9 多个计划的链式约束

同一物料如果有 3 个计划（A1, A2, A3），代码会建立两对约束：

```
A1 → A2: x[A2,t]=1 ⟹ P(A1, t-1) ≥ D(A1)
A2 → A3: x[A3,t]=1 ⟹ P(A2, t-1) ≥ D(A2)
```

注意：A3 的约束只检查 A2 的完成情况，**不直接检查 A1**。但由于 A2 开工前 A1 必须完成，A3 开工前 A2 必须完成，链式传递保证了 A1 → A2 → A3 的顺序。

```
时间轴: [A1 完成] → [A2 开工] → [A2 完成] → [A3 开工]

链式推导:
  x[A3,t]=1 ⟹ P(A2, t-1) ≥ D(A2)  （A2已完成）
  P(A2, t-1) ≥ D(A2) ⟹ A2 在 t-1 之前开工
  A2 开工 ⟹ P(A1, 开工桶-1) ≥ D(A1)  （A1已完成）
  ⟹ A1 在 A2 之前完成，A2 在 A3 之前完成
```

### 20.10 与 DemandConstraintBuilder 的关系

`DemandConstraintBuilder` 保证物质守恒：`Σq + u = D`。`SameMaterialPlanOrderConstraintBuilder` 在此基础上增加**时序**限制——不同计划的产量在时间轴上有先后顺序。

```
DemandConstraintBuilder:                    SameMaterialPlanOrder:
Σ_{l,t} q[p,l,t] + u(p) = D(p)            x[p_curr,t]=1 ⟹ P(p_prev, t-1) ≥ D(p_prev)
（总量守恒，不关心时间分布）                    （时序约束：前序完成才能开工后序）
```

如果两个计划的产能充足，Demand 约束自然满足（u=0），但 SameMaterialPlanOrder 进一步确保"先交期的先做"——即使总产能够，也不能让后交期插队。

### 20.11 与 ForbidReturnToFinishedMaterialConstraintBuilder 的关系

两者都涉及"做完才能切换"，但粒度和对象不同：

| 维度 | SameMaterialPlanOrder | ForbidReturnToFinished |
|------|----------------------|----------------------|
| 约束对象 | 不同计划之间（p_prev → p_curr） | 同一计划内部（end=1 ⟹ 全局累计=D） |
| 粒度 | 计划级别 | 计划-机组级别 |
| 语义 | 前序计划做完才能做后序 | 有产能的机组不能提前结束该物料 |

`SameMaterialPlanOrder` 是**计划间**的顺序约束——A1 做完才能做 A2。`ForbidReturnToFinished` 是**计划内**的完整性约束——A1 在某台机组上不能提前切走。

两者互补：`ForbidReturnToFinished` 确保每台机组上的 A1 块做到物料完成，`SameMaterialPlanOrder` 确保 A1 整体完成后才启动 A2。

### 20.12 代码的精巧之处

`producedBefore` 使用 `LinearExprBuilder` 逐桶累积，而非创建独立的 `IntVar`——这意味着条件约束中的 `producedBefore` 是一个**不断增长的线性表达式**，而非一个固定变量。

OR-Tools CP-SAT 支持在线性表达式中直接使用条件约束（`addGreaterOrEqual(expr, value).onlyEnforceIf(literal)`），无需为 `producedBefore` 创建中间 `IntVar`。这减少了变量数量，提高了求解效率。

代价是 `producedBefore` 表达式在后面的桶中会越来越长（包含所有历史桶的 `q` 变量），但 CP-SAT 的预求解器会自动简化冗余项。

---

## 二十一、SynchronizedBoundaryConstraintBuilder — 齐开/齐停约束

### 21.1 一句话总结

**同一计划明细使用的所有机台必须在同一个时间桶开工（齐开）或完工（齐停）**——通过公共边界变量 `β(p)` 实现离散 channeling，确保所有机台的边界桶号一致。

### 21.2 业务背景

卷包排产中，同一牌号可能在多台机组上同时生产。业务要求这些机组必须**齐开齐停**——同时开工、同时完工。

- **齐开**：所有机台在同一时间桶开始生产该牌号。避免"有的先做、有的后做"导致物料供应和调度不同步。
- **齐停**：所有机台在同一时间桶停止生产该牌号。避免"有的停了、有的还在做"导致后续工序衔接困难。

齐开齐停的本质是**同步性**——多台机组像一个整体行动，统一开始、统一结束。

### 21.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u_p[l,p]` | 产品 p 是否使用了机组 l（`BoolVar`：`productLineUsed`） |
| `b[p,l,t]` | 产品 p 在机组 l、桶 t 上的边界变量（齐开 = `start[p,l,t]`，齐停 = `end[p,l,t]`） |
| `L(p)` | 产品 p 可能使用的机台集合（有边界变量且有 `productLineUsed`） |
| `T_b(l,p)` | 机组 l 对产品 p 的边界候选桶集合（有 start/end 变量的桶序号） |
| `β(p)` | 产品 p 的公共边界桶序号（`IntVar`：`commonBoundary`） |

### 21.4 约束的数学表达

#### (1) 边界变量求和 = 机台使用状态

对每台机组 l ∈ L(p)：

$$
\sum_{t \in T_b(l,p)} b[p,l,t] = u_p[l,p]
$$

即：
- 使用该机台（`u_p = 1`）时，恰好一个边界点（`Σb = 1`）
- 未使用该机台（`u_p = 0`）时，无边界点（`Σb = 0`）

这个约束利用了 `ContinuityConstraintBuilder` 保证的"最多一个连续块"——一个连续块恰好一个 start 和一个 end，所以 `Σb = 1`（使用时）或 `Σb = 0`（未使用时）。

#### (2) 离散 channeling：边界桶 → 公共边界

对每个边界变量 `b[p,l,t]`：

$$
b[p,l,t] = 1 \;\Longrightarrow\; \beta(p) = t
$$

即：机台 l 的边界桶为 t 时，公共边界变量必须等于 t。

**所有机台的 channel 合在一起**：如果机台 l₁ 的边界桶为 t₁，机台 l₂ 的边界桶为 t₂，则 `β(p) = t₁` 且 `β(p) = t₂`——只有 `t₁ = t₂` 时才相容。因此，所有实际使用机台的边界桶必须相同。

#### (3) 不兼容机台对互斥

对没有共同候选桶的机台对 (l₁, l₂)（`T_b(l₁,p) ∩ T_b(l₂,p) = ∅`）：

$$
u_p[l_1,p] + u_p[l_2,p] \leq 1
$$

即：不可能齐开/齐停的机台对不能同时被使用。例如机台 A 只能在桶 1-3 开工，机台 B 只能在桶 5-7 开工，它们不可能齐开——如果同时使用，channeling 约束会矛盾。

### 21.5 约束组合效果

约束 (1) + (2) + (3) 的综合效果：

| 情况 | 约束效果 |
|------|----------|
| 只使用 1 台机组 | 无齐开/齐停约束（`L(p) ≤ 1` 时跳过） |
| 使用多台且候选桶有交集 | 齐开/齐停：所有机台边界桶相同 |
| 使用多台且某些对无交集 | 互斥：不兼容机台对不能同时使用 |
| 所有机台互不兼容 | 每台机组独立，最多使用 1 台 |

### 21.6 逐行拆解

#### 按物料分组，取相关机台

```java
List<Long> lineIds = resolveRelevantLineIds(ctx, planDetailId);
if (lineIds.size() <= 1) {
    return;
}
```

收集有 `productLineUsed` 和边界变量的机台。只有 1 台时无需约束。

#### 构建候选桶集合

```java
Map<Long, Set<Integer>> bucketsByLine = buildBucketIndexesByLine(ctx, planDetailId, lineIds);
Set<Integer> candidateBuckets = new TreeSet<>();
for (Set<Integer> lineBuckets : bucketsByLine.values()) {
    candidateBuckets.addAll(lineBuckets);
}
```

- `bucketsByLine`：每台机台有边界变量的桶序号集合
- `candidateBuckets`：所有机台候选桶的并集，用于构建 `β(p)` 的域

#### 创建公共边界变量

```java
long[] candidateBucketValues = new long[candidateBuckets.size()];
IntVar commonBoundary = model.newIntVarFromDomain(
        Domain.fromValues(candidateBucketValues), ...);
```

`β(p)` 的域是**离散值集合**而非连续区间 `[0, maxBucketIndex]`。这加强了传播——求解器知道 `β(p)` 只能取真实候选桶值，排除不可能的值。

#### 绑定不兼容机台对

```java
List<String> incompatibleLinePairs = bindIncompatibleLinePairs(
        ctx, planDetailId, lineIds, bucketsByLine, enforcementLiterals);
```

对每对机台，检查候选桶是否有交集。无交集时建立互斥约束 (3)。

#### 绑定边界变量与 channeling

```java
for (Long lineId : lineIds) {
    BoolVar used = ctx.productLineUsed(planDetailId, lineId);
    List<BoundaryVariable> boundaryVariables = buildBoundaryVariables(ctx, planDetailId, lineId);
    // (1) Σ b[p,l,t] = u_p[l,p]
    model.addEquality(LinearExpr.sum(boundaryArguments), used);
    // (2) b[p,l,t]=1 ⟹ β(p) = t
    for (BoundaryVariable boundaryVariable : boundaryVariables) {
        Constraint sameBoundary = model.addEquality(commonBoundary, boundaryVariable.bucketIndex);
        sameBoundary.onlyEnforceIf(boundaryVariable.variable);
    }
}
```

对每台机台：先绑定 (1) 使边界变量与使用状态一致，再逐个绑定 (2) 使边界桶指向公共边界。

### 21.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `Σ_{t ∈ T_b(l,p)} b[p,l,t] = u_p[l,p]` | 边界变量求和 = 机台使用状态 |
| (2) | `b[p,l,t]=1 ⟹ β(p) = t` | 离散 channeling → 齐开/齐停 |
| (3) | `u_p[l₁,p] + u_p[l₂,p] ≤ 1` | 不兼容机台对互斥 |

| 条件 | 行为 |
|------|------|
| `syncStartEnabled` / `syncStopEnabled` = false | 无约束 |
| `|L(p)| ≤ 1` | 无约束（单台无需齐开/齐停） |
| 候选桶为空 | 无约束 |
| 机台对有共同候选桶 | channeling 约束 (2) |
| 机台对无共同候选桶 | 互斥约束 (3) |

### 21.8 图示

```
牌号A, 3台机组 (#1, #2, #3), 齐开约束

机组#1 可开工桶: t2, t3, t4
机组#2 可开工桶: t2, t3, t5
机组#3 可开工桶: t2, t4

候选桶并集: {t2, t3, t4, t5}
β(A) ∈ {t2, t3, t4, t5}

──────────────────────────────────────────

情况1: β = t2, 所有机台在 t2 开工（合法）
  #1: start[t2]=1 → β=t2 ✓
  #2: start[t2]=1 → β=t2 ✓
  #3: start[t2]=1 → β=t2 ✓
  齐开 ✓

──────────────────────────────────────────

情况2: #1 在 t2 开工, #2 在 t3 开工（非法）
  #1: start[t2]=1 → β=t2
  #2: start[t3]=1 → β=t3
  β 不能同时 = t2 和 t3  ✗ 违反 channeling

──────────────────────────────────────────

情况3: #1 在 t2 开工, #3 不使用（合法）
  #1: start[t2]=1 → β=t2
  #3: u_p=0 → Σb=0 → 无 channeling
  β=t2, #3 不参与  ✓

──────────────────────────────────────────

不兼容机台对（齐停场景）:
  #1 可完工桶: t4, t5
  #2 可完工桶: t6, t7
  交集为空 → #1 和 #2 不能同时被使用
  u_p[#1] + u_p[#2] ≤ 1  （互斥约束 (3)）
```

### 21.9 离散 channeling vs 连续域

`β(p)` 的域是离散值集合 `{t2, t3, t4, t5}`，而非连续区间 `[0, 7]`。选择离散域的原因：

| 域类型 | 值范围 | 传播效果 |
|--------|--------|----------|
| 连续 `[0, 7]` | β 可取 0,1,5,6,7 等 | 弱：求解器不知道 0,1,5,6,7 不可行 |
| 离散 `{t2,t3,t4,t5}` | β 只能取候选桶值 | 强：当某机台的边界桶确定后，β 立即被赋值 |

离散域让 CP-SAT 的域传播更精确，减少不必要的搜索。`Domain.fromValues` 直接构建离散域，OR-Tools 内部使用稀疏域表示。

### 21.10 诊断模式（assumption）

诊断模式下，约束被 `assumption` 变量保护：

```java
assumption = model.newBoolVar("sync_all_start_assumption_...");
model.addAssumption(assumption);
```

- `addAssumption`：将 `assumption` 加入 OR-Tools 的假设列表
- 求解器在找到无解时，可以提取不可行核心——哪些假设导致了无解
- 齐开/齐停约束的 channeling 和互斥都受 `assumption` 保护

正常排产模式不使用 `assumption`，因为 OR-Tools 的假设机制会强制退化为单线程搜索，影响性能。

### 21.11 与 ContinuityConstraintBuilder 的关系

约束 (1) `Σb = u_p` 依赖 `ContinuityConstraintBuilder` 的保证：

```
ContinuityConstraintBuilder:               本约束器 (1):
Σ_t end[p,l,t] ≤ 1                         Σ_t b[p,l,t] = u_p[l,p]
（最多一个连续块）                            （边界点 = 使用状态）
```

`ContinuityConstraintBuilder` 保证最多一个 end（最多一个连续块），因此最多一个 start 和一个 end。这确保了 `Σb = 1`（使用时）或 `Σb = 0`（未使用时），使约束 (1) 的等式成立。

如果允许多个连续块，`Σb` 可能为 2 或更多，与 `u_p = 1` 矛盾——约束 (1) 会直接导致无解。

---

## 二十二、SynchronizedBoundaryPreferenceBuilder — 齐开/齐停偏好（软目标）

### 22.1 一句话总结

**奖励同一产品中边界桶相同的机组对**——以软目标形式鼓励齐开/齐停，而非硬约束强制。

### 22.2 业务背景

`SynchronizedBoundaryConstraintBuilder` 是硬约束：所有使用机台的边界桶必须完全相同。但有时硬约束过于严格——某些机组的时间窗口不完全重叠，强制齐开/齐停可能导致无解。

偏好构建器采用**软目标**策略：不强制齐开/齐停，而是给"同边界桶"的机组对以奖励（负权重），引导求解器倾向于同步，但如果确实无法同步，也可以接受。

### 22.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l₁`, `l₂` | 同一产品的两台机组 |
| `t` | 时间桶序号 |
| `b[p,l,t]` | 产品 p 在机组 l、桶 t 上的边界变量（齐开 = `start`，齐停 = `end`） |
| `s[p,l₁,l₂,t]` | 机组 l₁ 和 l₂ 在桶 t 是否同边界（`BoolVar`：`sameAtBucket`） |
| `S[p,l₁,l₂]` | 机组 l₁ 和 l₂ 是否同边界（`BoolVar`：`samePair`） |
| `w` | 奖励权重（正数，目标中以 `-w` 出现） |

### 22.4 约束/定义的数学表达

#### (1) 逐桶同边界指示：s = b₁ ∧ b₂

对每个有边界变量的桶 t：

$$
s[p,l_1,l_2,t] = b[p,l_1,t] \wedge b[p,l_2,t]
$$

即：两台机组在同一桶都有边界点时，`s = 1`。

三条线性约束实现布尔 AND：

$$
s \leq b_1 \quad\text{(1a)} \quad \text{左机台无边界点则 s=0}
$$

$$
s \leq b_2 \quad\text{(1b)} \quad \text{右机台无边界点则 s=0}
$$

$$
s - b_1 - b_2 \geq -1 \quad\text{(1c)} \quad b_1=1 \wedge b_2=1 \;\Longrightarrow\; s=1
$$

#### (2) 机组对级别同边界指示：S = max_t s

$$
S[p,l_1,l_2] = \max_{t:\, b_1,b_2 \neq \text{null}} s[p,l_1,l_2,t]
$$

即：只要存在任意一个桶两台机组同边界，`S = 1`；所有桶都不同边界，`S = 0`。

只有一个候选桶时 `S = s`（无需 `addMaxEquality`）；多个候选桶时用 `addMaxEquality` 取最大值。

#### (3) 目标追加

$$
\text{objective} \mathrel{-}= w \cdot S[p,l_1,l_2]
$$

即：**奖励同边界的机组对**。在最小化目标中，`-w·S` 使得求解器倾向于让 `S = 1`（同边界）以降低目标值。

总目标项：`-w · Σ_{(l₁,l₂)} S[p,l₁,l₂]`——对所有机组对求和。

### 22.5 s 的真值表

| b₁ | b₂ | s | 含义 |
|----|-----|---|------|
| 0 | 0 | 0 | 两台都不在该桶有边界点 |
| 0 | 1 | 0 | 左机台无边界点 |
| 1 | 0 | 0 | 右机台无边界点 |
| 1 | 1 | **1** | **两台在同一桶都有边界点 → 同边界** |

验证三条约束：

| b₁ | b₂ | s | (1a) s≤b₁ | (1b) s≤b₂ | (1c) s-b₁-b₂≥-1 | 全满足 |
|----|-----|---|-----------|-----------|-------------------|--------|
| 0 | 0 | 0 | 0≤0 ✓ | 0≤0 ✓ | 0-0-0=0≥-1 ✓ | ✓ |
| 0 | 1 | 0 | 0≤0 ✓ | 0≤1 ✓ | 0-0-1=-1≥-1 ✓ | ✓ |
| 1 | 0 | 0 | 0≤1 ✓ | 0≤0 ✓ | 0-1-0=-1≥-1 ✓ | ✓ |
| 1 | 1 | 1 | 1≤1 ✓ | 1≤1 ✓ | 1-1-1=-1≥-1 ✓ | ✓ |

### 22.6 逐行拆解（appendPairPenalty）

#### 三层循环：产品 → 机组对 → 桶

```java
for (PackScheduleProduct product : ...) {
    List<Long> lineIds = relevantLineIds(ctx, planDetailId, startBoundary);
    for (int left = 0; left < lineIds.size(); left++) {
        for (int right = left + 1; right < lineIds.size(); right++) {
            for (PackScheduleBucket bucket : ...) {
                // 构建 s[p,l₁,l₂,t]
            }
            // 构建 S[p,l₁,l₂]，追加目标
        }
    }
}
```

外层产品，中层机组对（去重），内层桶。对每个 (p, l₁, l₂, t) 组合构建同边界指示变量。

#### 构建 s[p,l₁,l₂,t]

```java
BoolVar leftBoundary = boundaryVar(ctx, planDetailId, leftLineId, bucketIndex, startBoundary);
BoolVar rightBoundary = boundaryVar(ctx, planDetailId, rightLineId, bucketIndex, startBoundary);
if (leftBoundary == null || rightBoundary == null) {
    continue;
}
BoolVar sameAtBucket = model.newBoolVar(...);
// (1a) s ≤ b₁
model.addLessOrEqual(sameAtBucket, leftBoundary);
// (1b) s ≤ b₂
model.addLessOrEqual(sameAtBucket, rightBoundary);
// (1c) s - b₁ - b₂ ≥ -1
LinearExprBuilder andLowerBound = LinearExpr.newBuilder();
andLowerBound.addTerm(sameAtBucket, 1L);
andLowerBound.addTerm(leftBoundary, -1L);
andLowerBound.addTerm(rightBoundary, -1L);
model.addGreaterOrEqual(andLowerBound, -1L);
```

三步实现 `s = b₁ ∧ b₂`。

#### 构建 S[p,l₁,l₂]

```java
BoolVar samePair = sameAtBuckets.get(0);
if (sameAtBuckets.size() > 1) {
    samePair = model.newBoolVar(...);
    // (2) S = max_t s
    model.addMaxEquality(samePair, sameAtBuckets.toArray(...));
}
```

- 只有 1 个候选桶时 `S = s`（直接引用，无需新变量）
- 多个候选桶时用 `addMaxEquality` 取最大值

#### 追加目标

```java
// (3) 目标追加 -w · S
objectiveExpr.addTerm(samePair, -weight);
potentialPairs++;
```

负权重奖励同边界机组对。

### 22.7 calculatePairPenalty：求解后计算未同步惩罚

```java
public long calculatePairPenalty(...) {
    long penalty = countPotentialPairs(ctx, startBoundary);
    for (...) {
        for (...) {
            // 检查机组对是否有共同边界桶
            if (solver.value(leftBoundary) == 1L && solver.value(rightBoundary) == 1L) {
                penalty--;
                break;
            }
        }
    }
    return penalty;
}
```

- 初始 `penalty = 总机组对数`
- 每发现一对同边界的机组对，`penalty--`
- 返回值 = 未同步的机组对数

### 22.8 calculateBoundarySpread：求解后计算边界分散度

```java
public long calculateBoundarySpread(...) {
    for (Long lineId : relevantLineIds(...)) {
        if (solver.value(ctx.productLineUsed(planDetailId, lineId)) == 0L) {
            continue;
        }
        long position = 0L;
        for (PackScheduleBucket bucket : ...) {
            BoolVar variable = boundaryVar(ctx, planDetailId, lineId, bucket.getIndex(), startBoundary);
            if (variable != null) {
                position += bucket.getIndex() * solver.value(variable);
            }
        }
        minimum = Math.min(minimum, position);
        maximum = Math.max(maximum, position);
    }
    if (usedCount > 1) {
        total += maximum - minimum;
    }
}
```

- 对每台使用的机台，计算其边界桶位置（`position = Σ t · b[p,l,t]`）
- 由于 `Σb = 1`（恰好一个边界点），`position` 就是该机台的边界桶序号
- `spread = max - min`：同一产品中使用机台的边界桶最大距离
- `total` = 所有产品的 spread 之和

spread 越小越好（0 = 完全齐开/齐停），是衡量同步程度的另一个指标。

### 22.9 数学总结

| 约束/定义 | 数学表达 | 含义 |
|----------|----------|------|
| (1a) | `s ≤ b₁` | 左机台无边界点则 s=0 |
| (1b) | `s ≤ b₂` | 右机台无边界点则 s=0 |
| (1c) | `s - b₁ - b₂ ≥ -1` | 两台都有边界点则 s=1 |
| (2) | `S = max_t s` | 机组对级别同边界指示 |
| (3) | `objective -= w · S` | 奖励同边界机组对 |

| 指标 | 计算方式 | 含义 |
|------|----------|------|
| `potentialPairs` | 候选机组对数 | 有共同边界桶的机组对总数 |
| `penalty` | potentialPairs - 同边界对数 | 未同步的机组对数 |
| `spread` | max(边界桶) - min(边界桶) | 边界桶分散度 |

### 22.10 图示

```
牌号A, 3台机组, 齐开偏好 (w=100)

机组#1 可开工桶: t2, t3, t4    → start 可能在 t2/t3/t4
机组#2 可开工桶: t2, t3, t5    → start 可能在 t2/t3/t5
机组#3 可开工桶: t2, t4         → start 可能在 t2/t4

候选机组对: (#1,#2), (#1,#3), (#2,#3)

──────────────────────────────────────────

情况1: #1 在 t2 开工, #2 在 t2 开工, #3 在 t2 开工（完全齐开）
  s[#1,#2,t2] = 1∧1 = 1  → S[#1,#2] = 1  （同步）
  s[#1,#3,t2] = 1∧1 = 1  → S[#1,#3] = 1  （同步）
  s[#2,#3,t2] = 1∧1 = 1  → S[#2,#3] = 1  （同步）
  目标奖励: -100×3 = -300   ← 最大奖励
  spread = max(t2) - min(t2) = 0

──────────────────────────────────────────

情况2: #1 在 t2 开工, #2 在 t3 开工, #3 在 t4 开工（完全不同步）
  s[#1,#2,t2] = 1∧0 = 0
  s[#1,#2,t3] = 0∧1 = 0
  S[#1,#2] = 0  （未同步）
  S[#1,#3] = 0  （未同步）
  S[#2,#3] = 0  （未同步）
  目标奖励: 0               ← 无奖励
  penalty = 3, spread = t4-t2 = 2

──────────────────────────────────────────

情况3: #1 在 t2, #2 在 t2, #3 在 t4（部分同步）
  S[#1,#2] = 1  （#1 和 #2 同边界）
  S[#1,#3] = 0
  S[#2,#3] = 0
  目标奖励: -100×1 = -100
  penalty = 2, spread = t4-t2 = 2
```

### 22.11 与 SynchronizedBoundaryConstraintBuilder 的关系

两者是**硬/软互补**关系：

| 维度 | SynchronizedBoundary（硬约束） | SynchronizedBoundaryPreference（软目标） |
|------|-------------------------------|---------------------------------------|
| 约束类型 | 硬约束：必须齐开/齐停 | 软目标：鼓励齐开/齐停，可违反 |
| 实现方式 | 公共边界变量 β + 离散 channeling | 机组对级别的同边界指示 S + 负权重 |
| 无解风险 | 有（不兼容机台对可能导致无解） | 无（偏好只是倾向，不强制） |
| 粒度 | 全局：所有机台同一边界桶 | 局部：机组对是否同边界 |
| 互斥处理 | 不兼容机台对强制 u_p[l₁]+u_p[l₂] ≤ 1 | 不处理（允许不兼容对同时使用） |

硬约束保证"齐"，软目标鼓励"齐"但不保证——两者通常不同时启用，而是根据业务需求选择其一。

---

## 二十三、SynchronizedStartStopConstraintBuilder — 齐开齐停硬约束

### 23.1 一句话总结

**从实际使用机台中选出最多 K 台作为同步成员，同步成员必须在同一个时间桶开工（齐开），齐开齐停模式下还必须在同一个时间桶完工（齐停）。**

### 23.2 业务背景

与 `SynchronizedBoundaryConstraintBuilder` 不同，本构建器支持**部分同步**：不要求所有使用机台齐开齐停，而是选出最多 K 台作为同步组，组内机台必须同步，组外机台自由调度。

这在实际排产中更灵活：例如 6 台机组中只有 3 台需要同步生产，其余 3 台可以独立调度。`syncMachineCount` 配置项控制同步组的最大规模。

### 23.3 符号约定

| 符号 | 含义 |
|------|------|
| `p` | 产品/排产计划明细ID |
| `l` | 机组ID |
| `t` | 时间桶序号 |
| `u_p[l,p]` | 产品 p 是否使用了机组 l（`BoolVar`：`productLineUsed`） |
| `σ[p,l]` | 机组 l 是否为产品 p 的同步成员（`BoolVar`：`syncMember`） |
| `n_used(p)` | 产品 p 实际使用的机组数量（`IntVar`：`usedCount`） |
| `K` | 配置的同步机台数上限（`syncMachineCount`，常量） |
| `n_eff(p)` | 有效同步成员数量 = min(n_used(p), K)（`IntVar`：`effectiveCount`） |
| `T_s(l,p)` | 机组 l 对产品 p 的开工候选桶集合（有 `start` 变量的桶序号） |
| `T_e(l,p)` | 机组 l 对产品 p 的完工候选桶集合（有 `end` 变量的桶序号） |
| `β_start(p)` | 产品 p 的同步组公共开工桶序号（`IntVar`：`groupStartBucket`） |
| `β_end(p)` | 产品 p 的同步组公共完工桶序号（`IntVar`：`groupEndBucket`，仅齐开齐停模式） |

### 23.4 约束的数学表达

#### (1) 同步成员 ≤ 机台使用状态

对每台机组 l：

$$
\sigma[p,l] \leq u_p[l,p]
$$

只有被产品 p 使用的机组才能成为同步成员。

#### (2) 同步成员数 = min(实际使用数, 配置上限)

$$
\sum_l \sigma[p,l] = \min(n_{used}(p), K)
$$

即：同步成员恰好等于 min(实际使用数, K) 台。如果所有机组都被使用且使用数 >= K，则恰好 K 台同步成员；如果使用数 < K，则所有使用机台都是同步成员。

`addMinEquality` 实现 `n_eff = min(n_used, K)`，再令 `Σσ = n_eff`。

#### (3) 不兼容机台对互斥

对无共同开工桶或完工桶的机台对 (l₁, l₂)：

$$
\sigma[p,l_1] + \sigma[p,l_2] \leq 1
$$

即：不可能齐开/齐停的机台对不能同时成为同步成员。

判断条件：
- 齐开模式：`T_s(l₁,p) ∩ T_s(l₂,p) = ∅`
- 齐开齐停模式：`T_s(l₁,p) ∩ T_s(l₂,p) = ∅` 或 `T_e(l₁,p) ∩ T_e(l₂,p) = ∅`

#### (4) 同步成员的开工桶 = 公共开工桶

对每台同步成员 l（`σ[p,l] = 1` 时）：

$$
\sum_{t \in T_s(l,p)} t \cdot start[p,l,t] = \beta_{start}(p)
$$

`start` 是 BoolVar，由于 `ContinuityConstraintBuilder` 保证 `Σstart = 1`（使用时恰好一个开始桶），所以 `Σ t·start` 恰好等于开工桶的全局序号。这个等式约束使所有同步成员的开工桶都等于 `β_start(p)`。

#### (5) 同步成员的完工桶 = 公共完工桶（仅齐开齐停模式）

对每台同步成员 l（`σ[p,l] = 1` 时）：

$$
\sum_{t \in T_e(l,p)} t \cdot end[p,l,t] = \beta_{end}(p)
$$

同理，`Σ t·end` 给出完工桶序号，所有同步成员的完工桶都等于 `β_end(p)`。

### 23.5 Σ t·start 恒等式的巧妙之处

由于 `ProductionStructureConstraintBuilder` 保证 `Σstart = u_p`，且 `σ ≤ u_p`，所以 `σ = 1` 时 `Σstart = 1`。这意味着恰好一个 `start` 为 1，`Σ t·start` 就是那个桶的序号——不需要额外枚举 `(机台, 桶)` 候选组，直接用线性表达式实现 channeling。

```
start 变量:   t2=0  t3=1  t4=0  t5=0
Σ t·start =  2·0 + 3·1 + 4·0 + 5·0 = 3

start 变量:   t2=0  t3=0  t4=1  t5=0
Σ t·start =  2·0 + 3·0 + 4·1 + 5·0 = 4
```

### 23.6 逐行拆解

#### 收集相关机台

```java
List<Long> relevantLineIds = resolveRelevantLineIds(ctx, planDetailId);
if (relevantLineIds.size() <= 1) { return; }
```

过滤条件：有 `productLineUsed` 变量、有 start 变量（齐开齐停模式还要求有 end 变量）。<=1 台时无需同步约束。

#### 创建同步成员变量

```java
BoolVar syncMember = model.newBoolVar(String.format("sync_member_%d_%d", productId, lineId));
// (1) σ ≤ u_p
model.addLessOrEqual(syncMember, used).onlyEnforceIf(enforcementLiterals);
```

每台机台创建 `σ` 变量，约束 (1) 确保只有被使用的机台才能成为同步成员。

#### 绑定同步成员数量

```java
IntVar usedCount = model.newIntVar(0L, lineCount, ...);
model.addEquality(usedCountExpr, usedCount).onlyEnforceIf(enforcementLiterals);
IntVar effectiveCount = model.newIntVar(0L, maxEffectiveCount, ...);
model.addMinEquality(effectiveCount, new LinearArgument[]{usedCount, model.newConstant(syncMachineCount)});
// (2) Σσ = min(n_used, K)
model.addEquality(memberCountExpr, effectiveCount).onlyEnforceIf(enforcementLiterals);
```

- `usedCount`：实际使用机台数，由 `Σ u_p` 求和得出
- `effectiveCount`：有效同步成员数 = `min(usedCount, K)`
- `Σσ = effectiveCount`：同步成员数恰好等于有效数

#### 不兼容机台对互斥

```java
List<String> incompatibleLinePairs = bindIncompatibleLinePairs(
        model, ctx, relevantLineIds, syncMemberVars,
        startBucketsByLine, endBucketsByLine, enforcementLiterals);
```

遍历所有机台对，检查开工/完工候选桶是否有交集。无交集时建立互斥约束 (3)。

#### 公共开工/完工桶

```java
IntVar groupStartBucket = model.newIntVar(0L, maxBucketIndex, ...);
IntVar groupEndBucket = model.newIntVar(0L, maxBucketIndex, ...);  // 仅齐开齐停模式
```

`β_start` 和 `β_end` 的域为 `[0, maxBucketIndex]`（连续域，与 `SynchronizedBoundaryConstraintBuilder` 的离散域不同）。

#### 绑定开工桶 (4)

```java
for (int lineIndex = 0; lineIndex < relevantLineIds.size(); lineIndex++) {
    BoolVar syncMember = syncMemberVars.get(lineIndex);
    Literal[] memberEnforcement = memberEnforcement(enforcementLiterals, syncMember);
    LinearExprBuilder startBucketExpr = LinearExpr.newBuilder();
    for (PackScheduleBucket bucket : ctx.getProblem().getBucketsSafe()) {
        BoolVar start = ctx.start(productId, lineId, bucket.getIndex());
        if (start != null) {
            startBucketExpr.addTerm(start, bucket.getIndex());
        }
    }
    // (4) σ=1 ⟹ Σ t·start = β_start
    model.addEquality(startBucketExpr, groupStartBucket)
            .onlyEnforceIf(memberEnforcement);
}
```

对每台机台，构建 `Σ t·start` 表达式，在 `σ=1` 时约束其等于公共开工桶。

#### 绑定完工桶 (5)

```java
// (5) σ=1 ⟹ Σ t·end = β_end
model.addEquality(endBucketExpr, groupEndBucket)
        .onlyEnforceIf(memberEnforcement);
```

齐开齐停模式下，同理约束完工桶。

### 23.7 数学总结

| 约束 | 数学表达 | 含义 |
|------|----------|------|
| (1) | `σ[p,l] ≤ u_p[l,p]` | 同步成员 <= 机台使用状态 |
| (2) | `Σ_l σ[p,l] = min(n_used(p), K)` | 同步成员数 = min(使用数, 上限) |
| (3) | `σ[l₁] + σ[l₂] <= 1`（不兼容对） | 不兼容机台对不能同时为同步成员 |
| (4) | `σ=1 ⟹ Σ t·start = β_start` | 同步成员开工桶 = 公共开工桶 |
| (5) | `σ=1 ⟹ Σ t·end = β_end` | 同步成员完工桶 = 公共完工桶（齐开齐停模式） |

### 23.8 图示

```
牌号A, 3台机组, K=2（最多2台同步）

可用桶: t2, t3, t4, t5

──────────────────────────────────────────

假设求解结果: #1 在 t3 开工, #2 在 t3 开工, #3 在 t5 开工

同步成员选择: #1, #2 (σ=1), #3 (σ=0)
  n_used = 3, n_eff = min(3,2) = 2  ✓ (恰好2台同步成员)

──────────────────────────────────────────

绑定过程:
  β_start = 3  （公共开工桶）

  #1 (σ=1): Σ t·start = 3·1 = 3 = β_start  ✓  (同步)
  #2 (σ=1): Σ t·start = 3·1 = 3 = β_start  ✓  (同步)
  #3 (σ=0): 无约束  （不同步，自由调度）

齐开齐停模式 (β_end):
  β_end = 5  （公共完工桶）

  #1: Σ t·end = 5  ✓
  #2: Σ t·end = 5  ✓
  #3: 无约束

──────────────────────────────────────────

假设求解结果: #1 在 t2 开工, #2 在 t4 开工（无共同开工桶）

不兼容对检测:
  #1, #2: T_s(#1)={t2}, T_s(#2)={t4}, 交集=∅ → 互斥
  (3) σ[#1] + σ[#2] ≤ 1  →  不能同时为同步成员

  可能选择: #1 同步 #2 不同步, 或 #2 同步 #1 不同步
```

### 23.9 与其他同步约束的关系

| 维度 | SynchronizedBoundary | SynchronizedBoundaryPreference | SynchronizedStartStop |
|------|---------------------|-------------------------------|----------------------|
| 同步范围 | **所有**使用机台 | **所有**使用机台（偏好） | **最多 K 台** |
| 约束类型 | 硬约束 | 软目标 | 硬约束 |
| 变量模型 | 公共边界变量 β + 离散 channeling | 机组对同边界指示 S + 负权重 | 同步成员 σ + Σ t·start = β |
| 桶绑定 | `Σ b = 1`（二进制边界点） | `S = max_t s`（机组对指示） | `Σ t·start = β`（直接序号） |
| 不兼容处理 | 互斥（`u[l₁]+u[l₂] ≤ 1`） | 不处理 | 互斥（`σ[l₁]+σ[l₂] ≤ 1`） |
| 灵活性 | 低（全强制） | 高（可违反） | 中（可选同步组） |
