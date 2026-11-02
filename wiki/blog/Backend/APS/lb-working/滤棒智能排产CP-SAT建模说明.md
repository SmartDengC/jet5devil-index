---
title: 滤棒智能排产CP-SAT建模说明
createTime: 2026/10/26 10:14:22
permalink: /article/qy82v0xd/
cover: https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/20261102104111490.jpg
tags: 
- aps
---
根据现有代码抽象出来建模信息。

方便查阅。

<!-- more -->

# 滤棒智能排产 CP-SAT 数学建模与实现设计

![cfa9c0bd6eb61376b01e0edf9bf86737](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/20261102104111490.jpg)

## 1. 建模目标

根据已生效的卷包智能排产明细 `t_schedule_plan_detail`，计算各滤棒物料在不同日期的需求，并生成滤棒设备生产计划。

滤棒计划必须满足：

1. 卷包开始生产前，所需滤棒已经生产完成。
2. 滤棒生产完成后必须存放指定时长，达到可用状态后才能供应卷包。
3. 满足滤棒设备能力、设备日历、物料适配及换牌时间约束。
4. 首版不考虑现有库存，期初可用库存按 0 建模。
5. 在满足卷包需求的前提下，尽量晚生产、减少库存等待和换牌损耗。
6. 滤棒排产不能修改卷包计划，只能根据卷包计划生成上游供应计划。

## 2. 数据关系

### 2.1 卷包需求来源

从指定的卷包排产版本读取：

```text
t_schedule_plan_version
        │
        └── t_schedule_plan_detail
                ├── mat_id
                ├── plan_qty
                ├── plan_date
                └── plan_start_time
```

一次滤棒排产只能关联一个确定的卷包排产版本，不能把不同版本的明细混合计算。

滤棒排产版本应保存：

```text
source_pack_schedule_plan_version_id
```

用于追踪滤棒计划依据的卷包版本。

### 2.2 卷烟与滤棒映射

通过 `t_filter_cost` 建立转换关系：

```text
卷烟成品物料 mat_id
        │
        ├── filter_mat_id        滤棒物料
        ├── unit_consume_qty     标准单耗
        ├── switch_consume       是否使用统计单耗
        └── statistic_consume    统计单耗
```

有效单耗定义为：

```text
if switch_consume = 1 and statistic_consume > 0:
    effective_consume = statistic_consume
else:
    effective_consume = unit_consume_qty
```

单耗缺失、非正或单位不一致时，应在进入求解器前终止，并返回配置错误。

### 2.3 滤棒固化时间表

新增配置表：

```text
t_filter_solidify_time_config
```

字段设计：

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | BIGINT | 主键 |
| `model_site_id` | BIGINT | 工厂 ID |
| `work_shop_id` | BIGINT | 滤棒车间 ID |
| `filter_mat_id` | BIGINT | 滤棒物料 ID |
| `scope_type` | TINYINT | 1 工厂默认、2 车间默认、3 物料级 |
| `solidify_min_minutes` | DECIMAL(12,2) | 最短固化时间，单位分钟 |
| `solidify_max_minutes` | DECIMAL(12,2) | 最长固化时间，单位分钟，可为空 |
| `enable` | TINYINT | 是否启用 |
| `remark` | VARCHAR(500) | 配置说明 |
| `tid` | VARCHAR(100) | 标识解析码 |
| 基础字段 | - | 按 `BasePO` 规范处理 |

配置读取顺序：

```text
物料级配置 > 车间默认配置 > 工厂默认配置
```

校验规则：

```text
solidify_min_minutes > 0
solidify_max_minutes 为空
或 solidify_max_minutes >= solidify_min_minutes
```

同一范围只能存在一条启用规则。物料级规则必须填写 `filter_mat_id`；默认规则不填写物料 ID。

### 2.4 三张排产表的复用原则与关联关系

复用卷包排产表的职责和主要字段结构，但新建独立的滤棒表，不与卷包共用物理表或业务记录。以下为建议结构，不代表已经建表；字段类型、长度为设计建议，并非现有卷包数据库 DDL 的原样复制。公共主键、审计、租户及逻辑删除字段按项目 `BasePO` 和持久化规范统一处理，不重复定义。

| 卷包参考表 | 建议滤棒表 | 职责 |
|---|---|---|
| `t_schedule_plan_version` | `t_filter_schedule_plan_version` | 一次滤棒排产的版本、来源和运行范围 |
| `t_schedule_order_plan_detail` | `t_filter_schedule_order_plan_detail` | 由卷包结果转换得到的滤棒需求订单 |
| `t_schedule_plan_detail` | `t_filter_schedule_plan_detail` | 求解完成后生成的滤棒设备生产安排 |

```text
指定卷包版本 → 卷包 t_schedule_plan_detail（只读）
                         │ 按单耗换算、按滤棒物料和需求日期聚合
                         ▼
t_filter_schedule_plan_version
  │ source_pack_schedule_plan_version_id → 来源卷包版本
  ├─ t_filter_schedule_order_plan_detail（需求输入）
  │      │ 一条需求可由多条生产明细满足
  └─ t_filter_schedule_plan_detail（求解结果）
         └─ schedule_order_plan_detail_id → 滤棒需求订单
```

卷包的排产结果是滤棒的需求来源，不能直接复制成滤棒的设备排产结果。三张表中的版本、订单和设备关联均使用滤棒自己的 ID；只有来源卷包版本字段指向卷包数据。

### 2.5 滤棒排产版本表

建议表名：`t_filter_schedule_plan_version`。

| 字段 | 建议类型 | 字段描述 |
|---|---|---|
| `id` | BIGINT | 滤棒排产版本主键 |
| `plan_month` | VARCHAR(7) | 计划归属月份，格式 `yyyy-MM`；生产明细允许跨到上月 |
| `version_code` | VARCHAR(100) | 滤棒排产版本编码 |
| `source_pack_schedule_plan_version_id` | BIGINT | 必填，唯一确定本版本依据的卷包排产版本；多个滤棒版本可以引用同一卷包版本 |
| `equ_work_plan_version_id` | BIGINT | 本次使用的滤棒开台计划版本，不是卷包开台计划版本 |
| `source_version_id` | BIGINT | 可空，复制本版本时的源滤棒版本 ID，不兼作来源卷包版本 |
| `plan_start_time` | DATETIME | 本版本排产窗口开始时间，包含跨月前置生产窗口 |
| `plan_end_time` | DATETIME | 本版本排产窗口结束时间 |
| `plan_type` | TINYINT | 复用计划类型含义：1 预测计划、2 正式计划；不用于区分卷包和滤棒 |
| `state_type_id` | BIGINT | 滤棒排产状态类型，不直接沿用卷包 `JbZnPc` 状态绑定 |
| `state_id` | BIGINT | 滤棒排产版本当前状态 |
| `model_site_id` | BIGINT | 工厂 ID |
| `work_shop_id` | BIGINT | 滤棒车间 ID |
| `schedule_strategy_id` | BIGINT | 可空，使用的滤棒排产策略 ID |
| `schedule_strategy` | VARCHAR(100) | 可空，排产策略标识 |
| `schedule_score` | DECIMAL(20,6) | 可空，排产评价得分 |
| `report_message` | TEXT | 可空，排产报告或无解诊断摘要 |
| `tid` | VARCHAR(100) | 标识解析码，按项目规范维护 |
| 基础字段 | - | 按 `BasePO` 规范处理 |

不直接复制卷包专用的 `month_plan_version_id`、`no_bar_plan_version_id`、`export_plan_version_id`。卷包中的滚动排产、上报、延迟等扩展字段，待滤棒确有对应功能时再引入，首版不为结构一致而全部照搬。

### 2.6 滤棒需求订单明细表

建议表名：`t_filter_schedule_order_plan_detail`。这里的订单是卷包产生的内部供应需求，并非必须对应销售订单。

| 字段 | 建议类型 | 字段描述 |
|---|---|---|
| `id` | BIGINT | 滤棒需求订单明细主键，也是求解输入的需求身份 |
| `schedule_plan_version_id` | BIGINT | 所属滤棒排产版本 ID |
| `mat_id` | BIGINT | 滤棒物料 ID，不是卷烟成品物料 ID |
| `plan_qty` | DECIMAL(20,6) | 滤棒需求量，单位万支，由各条卷包明细先换算后聚合 |
| `schedule_qty` | DECIMAL(20,6) | 已安排的生产数量，初始为 0；不表示已固化可用量或实际库存 |
| `demand_date` | DATE | 对应的卷包需求日期，同一滤棒不同日期保留独立订单 |
| `demand_time` | DATETIME | 卷包需求截止时间，取当天相关卷包明细最早开台时间 |
| `solidify_min_minutes` | DECIMAL(12,2) | 本次采用的最短固化时间快照，必须大于 0 |
| `solidify_max_minutes` | DECIMAL(12,2) | 最长固化时间快照，可空；非空时不得小于最短时间 |
| `dead_line` | DATETIME | 最晚生产完成时间，等于 `demand_time - solidify_min_minutes`，不是卷包使用时间 |
| `start_date` | DATE | 可空，预留生产日期范围下界；首版不用于表达固化下界 |
| `end_date` | DATE | 可空，预留生产日期范围上界；不能替代精确到时刻的 `dead_line` |
| `order_code` | VARCHAR(100) | 内部需求订单编号 |
| `order_source` | VARCHAR(100) | 订单来源标识，表达由卷包排产计划派生 |
| `order_type` | VARCHAR(100) | 内部供应需求订单类型 |
| `product_method` | VARCHAR(100) | 可空，滤棒生产方式；不直接复制卷包生产方式 |
| 基础字段 | - | 按 `BasePO` 规范处理 |

同一有效滤棒版本内，按 `(mat_id, demand_date)` 聚合一条日需求，重复生成时应防止重复累加。逻辑删除后的历史记录不参与有效需求聚合。源卷包版本通过所属滤棒版本追溯；由于一条滤棒需求可来自多条卷包明细，不能用单个卷包明细 ID 表示全部来源。

固化参数使用生成需求时的快照，避免配置变化后历史计划被重新解释。配置更新不静默覆盖已生成订单；重新排产时按版本流程重新解析配置和生成需求。

对于需求时间 $T_{f,d}^{due}$，生产完成时间应满足：

$$
T_{f,d}^{due} - L_f^{max}
\le T_b^{finish}
\le T_{f,d}^{due} - L_f^{min}
$$

最长固化时间为空时不设左边界。该窗口约束的是生产完成时间，不是开工时间，因此不能把 `demand_time - solidify_max_minutes` 直接写入 `start_date` 当作最早开工时间。仅设置 `dead_line` 不能保证最长固化约束，仍需第 6 节的模型约束。

### 2.7 滤棒排产结果明细表

建议表名：`t_filter_schedule_plan_detail`。只在求解得到有效方案后保存正式结果，不能将需求量直接当作设备生产安排落入此表。

| 字段 | 建议类型 | 字段描述 |
|---|---|---|
| `id` | BIGINT | 滤棒排产结果明细主键 |
| `schedule_plan_version_id` | BIGINT | 所属滤棒排产版本 ID |
| `schedule_order_plan_detail_id` | BIGINT | 对应滤棒需求订单明细 ID，不关联卷包需求订单 |
| `manage_area_id` | BIGINT | 滤棒生产设备或机台对应的管理区域 ID |
| `mat_id` | BIGINT | 本条生产的滤棒物料 ID，须与关联需求一致 |
| `plan_qty` | DECIMAL(20,6) | 本条安排生产数量，单位万支 |
| `actual_qty` | DECIMAL(20,6) | 可空，实际生产反馈数量，单位万支；求解计划量不能冒充实绩 |
| `plan_date` | DATE | 滤棒生产归属日，按滤棒工厂日历确定，不复制卷包需求日期 |
| `plan_start_time` | DATETIME | 计划展示口径的生产开始时间 |
| `plan_end_time` | DATETIME | 计划展示口径的生产结束时间，不写入固化后可用时间 |
| `actual_start_time` | DATETIME | 排产阶段按日历映射的生产开始时间，不代表已经发生的生产反馈 |
| `actual_end_time` | DATETIME | 排产阶段按日历映射的生产完成时间，不包含固化等待时间 |
| `work_hours` | DECIMAL(12,6) | 有效生产工时，单位小时，不包含固化时长 |
| `display_group_id` | BIGINT | 可空，甘特图显示分组 ID |
| `product_method` | VARCHAR(100) | 可空，滤棒生产方式 |
| `fixed_data` | TINYINT | 是否固定排产明细，0 否、1 是；无固定需求时为 0 |
| `deleted` | TINYINT | 逻辑删除标志，按现有项目约定处理；与基础字段去重 |
| `tid` | VARCHAR(100) | 标识解析码，按项目规范维护 |
| 基础字段 | - | 按 `BasePO` 规范处理 |

需求订单与结果明细必须属于同一滤棒版本。首版无库存、无超产时，同一需求订单关联的有效结果 `plan_qty` 合计应等于该订单 `plan_qty`，并回写 `schedule_qty`；这只是已排数量校验，不能替代固化可用性校验。

累计供需模型仍按物料建模，不要求预先把每个生产桶绑定订单。结果转换时，应按需求截止时间顺序，将满足固化窗口的生产量分配给需求订单，并保留数量关联。一个桶覆盖多条需求时可按数量拆成多条结果记录；这些记录共用生产时段，属于同一桶的数量拆分，不是多次占用设备，产量和工时不得重复计入设备负荷。

相邻桶只在同一设备、同一滤棒、同一需求订单且时间连续时合并；合并后还须检查所有被合并桶的固化窗口，不能仅用末桶时间替代全部产量的成熟、过期时间。若合并会丢失供需或固化校验依据，保留桶级明细。首版不新增第四张分配关系表。

### 2.8 转换示例与复用边界

9 月 10 日，卷烟 A 生产 100 箱，单耗 0.05 万支/箱；卷烟 B 生产 80 箱，单耗 0.025 万支/箱，两者均使用 F01，则先分别计算 5 万支和 2 万支，再形成 F01 的 7 万支日需求订单。若 9 月 11 日也需要 F01，应另建该日订单，不能合并为一条月需求。

当 9 月 10 日需求时间为 07:30、最短固化 8 小时、最长固化 48 小时时，允许的生产完成窗口为 9 月 8 日 07:30 至 9 月 9 日 23:30。订单的 `dead_line` 为 9 月 9 日 23:30；设备生产日期由求解器决定，可以跨日、跨月，不照搬卷包明细日期。

表结构复用不等于卷包求解器只换表名即可使用。现有卷包输入区分物料 ID 和需求订单 ID，可借鉴其组织方式；但滤棒仍需独立处理万支整数缩放、滤棒能力与日历、换牌以及最短和最长固化约束。数据库数量精度不等于 CP-SAT 最小数量粒度，必须在输入层按第 5 节统一转换，不能直接使用卷包的整箱转换逻辑。

建议为订单的版本关联、结果的版本与设备日期查询、结果的需求订单关联、版本的来源卷包版本关联建立相应索引。外键关联的版本一致性、物料一致性和删除过滤必须校验，具体数据库约束随后续建表实施确定。本阶段仅记录设计，不创建表，不改动卷包状态机、Java、SQL 或配置文件。

## 3. 卷包需求转换

### 3.1 单条明细转换

当前卷包 CP-SAT 明细的 `plan_qty` 按“箱”处理。

对于卷包明细 $i$：

- 卷包计划量：$P_i$，单位为箱；
- 对应滤棒物料：$f(i)$；
- 单箱滤棒消耗：$C_i$，单位为万支/箱。

滤棒需求为：

$$
D_i = P_i \times C_i
$$

单位为万支。

这里不再执行 `planQty / 5`。如果后续需要兼容其他排产分支，应先在输入适配层统一转换成“箱”，不能把单位换算散落在求解代码中。

### 3.2 日需求聚合

同一天可能有多个卷烟牌号使用同一种滤棒。

对滤棒物料 $f$ 和生产日期 $d$：

$$
D_{f,d} = \sum_{i \in I(f,d)} D_i
$$

需求截止时间取当天相关卷包明细最早的开台时间：

$$
T_{f,d}^{due}
=
\min_{i \in I(f,d)}
planStartTime_i
$$

因此形成如下需求事件：

```text
滤棒物料 | 需求日期   | 需求截止时间     | 需求量
F01      | 2026-09-10 | 2026-09-10 07:30 | 120万支
F01      | 2026-09-11 | 2026-09-11 07:30 | 100万支
```

使用累计需求而不是逐条绑定，可以让前一天的剩余滤棒继续覆盖后续需求。

## 4. 时间模型

### 4.1 时间粒度

首版使用小时桶建模。

每个时间桶来自滤棒车间工厂日历：

```text
bucket.start_time
bucket.end_time
bucket.machine_id
bucket.available_capacity
```

非工作时间不生成生产变量。

如果换牌时间不是整小时，应按照实际分钟数扣减相邻时间桶的有效能力，不能直接忽略或简单四舍五入。

### 4.2 固化后的可用时间

滤棒物料 $f$ 的最短固化时间为 $L_f^{min}$，最长固化时间为 $L_f^{max}$。

时间桶 $b$ 的产量统一视为在桶结束时完成，其可用时间为：

$$
T_{f,b}^{available}
=
T_b^{end} + L_f^{min}
$$

只有满足以下条件的产量才能供应截止时间 $t$ 的卷包需求：

$$
T_{f,b}^{available} \le t
$$

如果配置了最长固化时间，则生产批次的过期时间为：

$$
T_{f,b}^{expire}
=
T_b^{end} + L_f^{max}
$$

该处理可以避免把仍在生产、尚未完成固化或已经超期的滤棒计入可用库存。

## 5. 决策变量

定义：

$$
x_{f,m,b} \in \{0,1\}
$$

表示滤棒物料 $f$ 是否在设备 $m$ 的时间桶 $b$ 上生产。

$$
q_{f,m,b} \in \mathbb{Z}_{\ge 0}
$$

表示对应时间桶的滤棒产量。

为避免 CP-SAT 使用浮点数，所有产量应统一放大成整数。例如以 `0.01 万支` 为最小单位：

```text
scaledQty = round(quantityWanZhi × 100)
```

所有需求、产能和求解结果必须使用相同缩放比例。

## 6. 硬约束

### 6.1 设备物料适配

只有 `t_filter_equ_capacity` 存在有效能力配置时，设备才能生产该滤棒：

$$
q_{f,m,b}=0
\quad
\text{if } capacity_{f,m} \text{ is unavailable}
$$

### 6.2 单机互斥

同一设备、同一时间桶最多生产一种滤棒：

$$
\sum_f x_{f,m,b} \le 1
$$

### 6.3 设备能力

$$
0 \le q_{f,m,b}
\le Capacity_{f,m,b} \times x_{f,m,b}
$$

其中 `Capacity` 根据设备小时能力和时间桶有效工作时长计算。

### 6.4 工厂日历

生产变量只能建立在滤棒设备有效开台时间内。

休息日、停机班次和非工作时段的能力为 0。

### 6.5 换牌时间

设备从滤棒 $f_1$ 切换到 $f_2$ 时，需要满足：

$$
Start(f_2)
\ge
End(f_1) + ChangeTime(f_1,f_2)
$$

换牌时间来自 `t_filter_change_brand_time`。

相同滤棒连续生产不产生换牌时间。

### 6.6 累计供应保障

定义截止时刻 $t$ 前已经完成存放的累计产量：

$$
A_f(t)
=
\sum_{m,b:
T_{f,b}^{available}\le t}
q_{f,m,b}
$$

定义截止时刻 $t$ 前的累计需求：

$$
D_f(t)
=
\sum_{d:
T_{f,d}^{due}\le t}
D_{f,d}
$$

首版期初库存为 0，因此必须满足：

$$
A_f(t) \ge D_f(t)
$$

该约束需要在每个需求截止时刻建立，而不是只在排产周期结束时检查。

### 6.7 最长固化时间约束

已达到最长固化时间的滤棒必须在对应时刻前被卷包需求消耗：

$$
\sum_{\substack{m,b\\
T_b^{end}+L_f^{max}\le t}}
q_{f,m,b}
\le
D_f(t)
$$

当 `solidify_max_minutes` 为空时，不建立该约束。该约束采用硬约束，保证滤棒不会在达到最长固化时间后继续作为可用库存。

### 6.8 总量约束

首版不考虑安全库存，也不允许无意义超产：

$$
\sum_{m,b} q_{f,m,b}
=
\sum_d D_{f,d}
$$

如果未来增加最小批量或整托盘约束，可以将等式改为允许少量尾差，并单独最小化超产量。

## 7. 自动向前扩展排产窗口

由于期初库存为 0，月初卷包需求通常需要在上月末提前生产。

例如：

```text
卷包需求时间：09-01 07:30
滤棒最短固化时间：8小时
```

则滤棒必须在以下时间前完成生产：

```text
08-31 23:30
```

排产起点不能固定为计划月份第一天。

定义最早生产时间：

$$
T^{earliestProduction}
=
T^{firstDemandDue} - L_f^{min}
$$

如果生产过早导致：

$$
T_b^{end}+L_f^{max}
<
T_{f,d}^{due}
$$

则该产量会在需求到达前过期，不应被模型选用。

窗口计算流程：

1. 找到所有需求中最早的截止时间。
2. 减去对应滤棒的最短固化时间。
3. 按滤棒设备日历向前累计可用产能。
4. 如果前置产能不足，继续向前加载工作日。
5. 直到各滤棒理论产能和设备总产能能够覆盖前置需求。
6. 若已经没有更早日历或设备始终无能力，返回无解诊断。

上月末生成的明细仍归属于本次滤棒排产版本，通过明细日期体现实际生产时间。

## 8. 优化目标

采用分层优化，避免不同目标的权重互相覆盖。

### 第一层：满足卷包生产

正式求解中累计供应保障为硬约束，不允许缺料。

### 第二层：尽量晚生产

在不缺料的前提下，最大化生产时间位置，使滤棒尽量靠近需求时间完成存放。

等价于最小化提前库存时间：

$$
\min
\sum_{f,m,b}
q_{f,m,b}
\times
HoldingTime_{f,b}
$$

### 第三层：减少换牌

$$
\min \sum Changeover_{m,b}
$$

优先让同一种滤棒连续生产，减少换牌损耗。

### 第四层：设备优先级

根据 `t_filter_equ_group_brand_priority`，优先把滤棒安排到推荐设备。

### 第五层：设备负荷平衡

在不影响前四层目标的前提下，减少设备间负荷差异，避免部分设备长期满负荷而其他设备空闲。

## 9. 无解诊断模型

正式模型无解时，不保存排产结果。

诊断模型在累计保障约束中增加缺口变量：

$$
A_f(t) + Shortage_f(t) \ge D_f(t)
$$

其中：

$$
Shortage_f(t) \ge 0
$$

诊断模型第一目标为：

$$
\min \sum_{f,t} Shortage_f(t)
$$

为优先保障较早的卷包计划，应让越早的需求缺口惩罚越大。

诊断结果至少输出：

```text
滤棒物料
需求日期
卷包开台时间
累计需求量
可用产量
缺口量
最晚应完成生产时间
主要原因
```

主要原因包括：

- 卷烟物料未配置滤棒单耗；
- 滤棒未配置固化时间；
- 没有可生产该滤棒的设备；
- 工厂日历没有足够工作时间；
- 固化提前期不足；
- 设备总产能不足；
- 换牌时间导致可用产能不足。

## 10. 实现思路

### 10.1 输入装载层

建立独立的滤棒排产上下文装载器，负责：

1. 加载指定卷包排产版本；
2. 查询卷包日进度明细；
3. 批量加载 `t_filter_cost`；
4. 转换并聚合滤棒日需求；
5. 加载滤棒最短、最长固化时间；
6. 加载设备能力、机组优先级和换牌矩阵；
7. 加载滤棒车间日历；
8. 计算自动向前扩展后的排产窗口；
9. 完成单位转换和输入校验。

所有数据库查询和业务单位转换应在该层完成，求解器只接收已经标准化的整数模型。

### 10.2 固化时间解析层

增加独立的 `FilterSolidifyTimeResolver`，输入：

```text
modelSiteId
workShopId
filterMatId
```

输出：

```text
solidifyMinMinutes
solidifyMaxMinutes
sourceScopeType
configId
```

解析顺序为：物料级配置、车间默认配置、工厂默认配置。全部缺失时返回配置错误，不进入 CP-SAT。解析结果应放入排产上下文，便于结果解释和后续配置快照。

### 10.3 问题模型层

建立独立的 `FilterScheduleProblem`，包含：

```text
sourcePackVersionId
scheduleStartTime
scheduleEndTime
filterMaterials
demandEvents
machines
timeBuckets
capacityMap
changeoverMap
solidifyMinMinutesMap
solidifyMaxMinutesMap
solidifyConfigSourceMap
machinePriorityMap
```

不要让 CP-SAT 代码直接查询数据库。

### 10.4 求解层

滤棒 CP-SAT 可以沿用卷包求解器的组织方式：

```text
ProblemBuilder
VariableBuilder
ConstraintBuilder
ObjectiveBuilder
SolutionMapper
FeasibilityAnalyzer
```

可以复用卷包排产中的设计思想，但首版不应为了代码复用而重构现有卷包 CP-SAT。滤棒使用独立类和独立模型，稳定后再评估是否抽取公共时间桶、日历和换牌组件。

### 10.5 结果转换层

按第 2.7 节规则，将同一设备、相同滤棒、同一需求订单的连续小时桶合并为一条滤棒排产明细；不能丢失固化校验依据：

```text
manageAreaId
matId
planQty
planDate
planStartTime
planEndTime
actualStartTime
actualEndTime
workHours
```

同时保存对应需求身份或滤棒订单计划明细 ID，保证能够解释这批滤棒服务于哪些日期的卷包需求。

### 10.6 版本一致性

滤棒计划生成后，应记录源卷包版本。

如果源卷包版本被作废、重新发布或日进度发生变化，滤棒版本应标记为“需求已变化”，必须重新排产，不能继续作为有效供应计划。

## 11. 后续库存扩展

首版：

$$
InitialInventory_f = 0
$$

未来接入库存后，累计保障约束扩展为：

$$
InitialUsableInventory_f
+
FutureMaturedInventory_f(t)
+
A_f(t)
\ge
D_f(t)
$$

其中：

- `InitialUsableInventory`：排产开始时已经完成固化的库存；
- `FutureMaturedInventory(t)`：当前尚未完成固化、但会在时刻 $t$ 前成熟的库存；
- `A_f(t)`：本次滤棒排产产生的可用量。

因此首版模型不需要推翻，只需增加两类外部供应事件。

## 12. 验收场景

1. 9 月 10 日卷包生产 100 箱，单耗 0.05 万支/箱，应生成 5 万支滤棒需求。
2. 两个卷烟牌号映射到同一种滤棒时，应合并成一个累计需求。
3. 最短固化时间为 8 小时，09-10 07:30 的需求只能由 09-09 23:30 前完成的产量覆盖。
4. 最长固化时间为 48 小时，09-07 生产的滤棒不能用于 09-10 之后的需求。
5. 物料级配置优先于车间默认配置，车间默认配置优先于工厂默认配置。
6. `solidify_min_minutes` 非正时拒绝保存。
7. `solidify_max_minutes` 小于最短固化时间时拒绝保存。
8. 最长固化时间为空时，只建立最短固化约束。
9. 已达到最长固化时间的产量必须在截止时刻前被需求消耗。
10. 缺少全部固化时间配置时不进入 CP-SAT。
11. 不修改现有卷包排产及其他代码逻辑。
12. 09-09 提前生产的剩余量可以继续覆盖 09-10、09-11 的需求。
13. 09-01 的需求可以自动在 08-31 或更早日期排产。
14. 未完成固化的产量不能计入可用量。
15. 缺少单耗、固化配置或设备能力时，不进入求解器。
16. 正式模型无解时不保存结果，诊断模型能够给出具体物料、截止时间和缺口。
17. 滤棒排产始终读取同一个明确的卷包版本。
18. 首版所有需求均由本次排产生产，库存贡献固定为 0。
19. 卷包明细先转换为滤棒需求订单，求解成功后才生成滤棒设备生产明细，不直接复制卷包结果。
20. 同一滤棒同一天的多条卷包需求先分别换算后聚合；不同日期保留不同订单 ID 和需求时间。
21. 滤棒版本、订单、结果之间的关联保持同版本、同物料；来源卷包版本与源滤棒复制版本分开保存。
22. `schedule_qty` 仅表示已排产量，未固化数量不能因已排产而被视为可用库存。
23. 需求时间 09-10 07:30、最短固化 8 小时、最长固化 48 小时时，允许生产完成窗口为 09-08 07:30 至 09-09 23:30。
24. 一个生产桶分配到多条需求订单时，拆分记录的数量合计保持不变，设备产能与工时不得重复计算。

## 13. 设计假设

- 当前卷包 CP-SAT 明细的 `plan_qty` 单位为箱，`t_filter_cost` 单耗单位为万支/箱。
- 固化时间统一以分钟存储，避免 `07:30`、换牌分钟数和跨日时间计算产生误差。
- 最长固化时间采用硬约束；未配置最长固化时间时不建立最长固化约束。
- 默认配置按工厂和车间范围维护，物料级配置可以覆盖默认配置。
- 当前不读取 `t_stock_balance_filter_detail`，期初库存按 0 处理。
- 后续接入库存时，将已固化库存和未固化库存作为带有可用时间、过期时间的外部供应事件加入累计约束。
