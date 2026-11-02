---
title: 卷包智能排产CP-SAT建模说明
createTime: 2026/10/26 10:14:22
permalink: /article/jttk1i1l/
cover: https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/20261102103500815.jpg
tags:
- aps
---
根据现有代码抽象出来建模信息。

方便查阅。

<!-- more -->

# 卷包智能排产 CP-SAT 建模

![46520d76f594bb7d3b74199bd3ac469c](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/20261102103500815.jpg)

## 1. 模型范围、入口与离散化

### 1.1 范围与调用链

仅覆盖 `application/schedule/cpsat` 的卷包模型，不包含滤棒、制丝、GA 和落库后处理。文中“产品”是**一条订单计划明细**，不是聚合后的牌号。

正式入口：`TSchedulePlanVersionController.cpSatSchedule` → `TSchedulePlanVersionAppService.cpSatSchedule` → `TSchedulePlanVersionCpSatScheduleAppService.cpSatAutoSchedule` → `PackScheduleProblemBuilder.build` → `PackScheduleCpSatService.solve`。

`PackScheduleVariableBuilder` 创建稀疏变量；`PackScheduleConstraintPlanBuilder` 决定实际硬约束装配；`PackScheduleObjectiveBuilder` 描述、绑定目标层；`ObjectiveLock` 实现跨层锁定。类注释、规则目录、枚举键的存在本身不表示规则已生效。

当前模型的三个重要事实：

- 正式模型始终完成全部待排需求，`must_fulfill_demand=false` 不会把需求等式改成允许欠产。
- `makespan` 的实际指标为“完工时间优先、其次产量前移”的复合整数目标；返回的 makespan 时间与该目标评分不是同一个数值。

### 1.2 时间桶与两条时间轴

对每个工作日，汇总截断续排边界后的机组开台窗口，取最早开始至最晚结束的外包区间，按一小时切分；不足一小时保留尾桶。只对生成的桶编号：

$$
\mathcal T=\{0,\ldots,T-1\}.
$$

机组净有效工时从开台窗口左端向后分配，未分配的尾部视为损耗、日常停机。设 $A_{lt}\in\{0,1\}$ 表示日历有效且获分配正工时，$w_{lt}$ 为有效小时：

$$
\mathcal T_l^{cal}=\{t:A_{lt}=1\},\qquad h_{lt}=\max(0,\operatorname{round}(60w_{lt})).
$$

两条时间轴必须区分：

| 时间坐标 | 单位 | 用途 |
| --- | --- | --- |
| 全局桶序号 $t$ | 桶 | 计划顺序、连续性、交期、同步和人员利用率 |
| 自然结束偏移 $E_t$ | 分钟 | 桶结束时刻距全局首桶开始的偏移，包含跨日休息；用于 makespan、产量前移 |
| 机组有效工时轴 $\alpha_{lk},\eta_{lk}$ | 分钟 | 仅累计机组有效桶工时；用于块排序和换牌，不计节假日及日历休息 |

### 1.3 数量、产能和稀疏组合

原始待排需求为 $d_p$，容差 $\varepsilon=10^{-6}$。构题时要求：

$$
D_p=\operatorname{round}(d_p),\qquad |d_p-D_p|\le\varepsilon.
$$

非整箱需求直接报错；仅保留 $D_p>0$ 且存在有效计划明细、物料 ID 的产品。数量缩放单位是 **1 箱**。

机组 $l$ 生产牌号 $m(p)$ 的小时产能为 $v_{l,m(p)}$，工作日 $d$ 的净有效工时为 $W_{ld}$：

$$
C^{day}_{pld}=\max(0,\lceil v_{l,m(p)}W_{ld}-\varepsilon\rceil).
$$

先按桶工时比例分配整箱下界，再将余数从左到右补入有正小数余量的桶；仍有剩余时再从左到右补齐：

$$
C^{base}_{plt}=\left\lfloor C^{day}_{pld}\frac{w_{lt}}{\sum_{r\in\mathcal T_{ld}}w_{lr}}+\varepsilon\right\rfloor,
\qquad \sum_{t\in\mathcal T_{ld}}C_{plt}=C^{day}_{pld}.
$$

$\mathcal T_{ld}$ 为机组 $l$ 当日获分配正工时的桶。余数补偿按时间先后，不是按小数余量大小排序。

$$
\Omega=\{(p,l,t):A_{lt}=1,\ C_{plt}>0\},\quad
\mathcal U=\{(l,t):\exists p,(p,l,t)\in\Omega\},\quad
\mathcal B_l=\{(p,l):\exists t,(p,l,t)\in\Omega\}.
$$

仅为 $\Omega$ 创建 $x,q,s,e$，为 $\mathcal U$ 创建 $u$，为候选明细—机组创建 $y$。未创建的组合在下文求和、逻辑式中视为常量 0。

## 2. 符号、参数与变量字典

### 2.1 集合、索引与输入参数

| 符号 | 代码对应或来源 | 含义／单位 |
| --- | --- | --- |
| $\mathcal P,p$ | `products`、`scheduleOrderPlanDetailId` | 待排计划明细集合及明细索引 |
| $\mathcal M,m(p)$ | `productId` / `matId` | 牌号集合及明细所属物料；同牌号可有多条明细 |
| $\mathcal L,l$ | `lines`、`lineId` | 机组集合及索引 |
| $\mathcal P_m$ | `getProductsForMaterial` | 同物料明细，按交期升序、空交期最后、明细 ID 升序 |
| $t_l(k),n_l$ | `EffectiveTimeline.buckets` | 机组第 $k$ 个日历有效桶及有效桶数，$k=0,\ldots,n_l-1$ |
| $\mathcal G,\mathcal L_g$ | `feederLineGroups` | 喂丝机及关联有效机组；硬建模时去重、过滤，至少两台才成组 |
| $D_p$ | `demandScaled` | 明细待排需求，正整数箱 |
| $C_{plt}$ | `getCapacity` | 名义桶产能，非负整数箱 |
| $w_{lt},h_{lt}$ | `getWorkHours`、`bucketMinutes` | 有效小时及整数化分钟 |
| $E_t,E_{max}$ | `getBucketEndOffsetMinutes`、`getMaxBucketEndOffsetMinutes` | 桶自然结束偏移及全期最大偏移，整数分钟 |
| $K,K_t$ | `maxSimultaneousMachines`、`getMaxOpen` | 显式人员／开台上限及逐桶截断上限，台；$K_t=\min(K,\sum_l A_{lt})$ |
| $a_p,b_p$ | `earliestStartBucketIndex`、`dueBucketIndex` | 最早开始桶及交期桶；边界外可分别取 $T$、$-1$ |
| $f_l,f_l^{app}$ | `firstSchedulableBucketByLine`、`appendFirstSchedulableBucketByLine` | 全期首个正产能桶、需续排机组的首桶 |
| $m_l^-$ | `lastMonthProduction` | 上月末段牌号 |
| $\tau_{ij}$ | `ChangeoverTimeResolver` | 相邻块物料换牌分钟数，四舍五入并取非负；同物料为 0 |
| $\pi_{pl},\rho_{pl}$ | `getPriorityLevel`、`getPriorityPenalty` | 原始机组牌号优先级及产量惩罚系数，见 4.4 |
| $\sigma_l$ | `getSpeedPenalty` | 高速 0、中速 1、低速／未知 2 |

以下 $i=(p,l)$ 表示候选生产块，$p(i)$、$m(i)$ 是其明细和物料。候选弧 $i\to j$ 均在同一机组内。除特别说明外，布尔变量取 $\{0,1\}$，箱数、分钟、位置变量均取非负整数。

### 2.2 核心决策变量

| 符号 | 代码名称／访问器 | 变量域及含义 |
| --- | --- | --- |
| $x_{plt}$ | `x_*` / `x` | 布尔；该明细在该机组、该桶有正产量 |
| $q_{plt}$ | `q_*` / `q` | $[0,C_{plt}]\cap\mathbb Z$；桶产量，箱 |
| $u_{lt}$ | `u_*` / `u` | 布尔；机组该桶实际生产 |
| $y_{pl}$ | `product_line_used_*` / `productLineUsed` | 布尔；明细当期使用该机组 |
| $s_{plt},e_{plt}$ | `start_*`、`end_*` | 布尔；连续块首桶、尾桶标识 |

### 2.3 块、换牌及完成辅助变量

| 符号 | 代码名称／访问器 | 变量域及含义 |
| --- | --- | --- |
| $z_i$ | `changeover_block_used_*` / `blockUsed` | 布尔；块使用标识，在当前连续性约束下等于 $y_{pl}$ |
| $o_i^S,o_i^E$ | `blockStartOrdinal`、`blockEndOrdinal` | $[0,n_l-1]$；块首尾在机组有效桶序列中的紧凑序号 |
| $S_i,E_i$ | `blockStartTime`、`blockEndTime` | $[0,\sum_t h_{lt}]$ 分钟；有效轴块首／尾时刻 |
| $Q_i^F,C_i^F$ | `blockFirstQty`、`blockFirstCapacity` | $[0,\max_t C_{plt}]$ 箱；首桶产量、名义产能 |
| $H_i^F$ | `blockFirstBucketMinutes` | $[0,\max_t h_{lt}]$ 分钟；首桶有效工时 |
| $P_i^{prev}$ | `blockPreviousActiveAtStart` | 布尔；首桶前一有效桶的机组开台标识；仅为派生属性 |
| $v_l$ | `changeover_line_used_*` | 布尔；Circuit 中机组是否有已用块 |
| $\phi_i,\psi_i$ | `changeover_first_*`、`changeover_last_*` | 布尔；虚拟节点到首块、末块到虚拟节点的弧 |
| $\gamma_{ij}$ | `changeover_arc_*` | 布尔；块 $i$ 是否为块 $j$ 的直接前序 |
| $\mu_i,\lambda_i$ | `material_change_*`、`changeover_capacity_loss_*` | 布尔；前序是否异物料、是否异物料且换牌时长大于 0 |
| $R_i$ | `remaining_changeover_minutes_*` | $[0,\max H_i^F]$ 分钟；进入首桶后仍需消耗的换牌时间 |
| $w_i^{multi}$ | `full_multi_bucket_*` | 布尔；块至少占两个有效桶，仅块级首桶编码创建 |
| $F_p$ | `plan_fulfilled_*` | 布尔；全部需求是否完成，仅 ABA 开启时创建 |
| $G_p$ | `plan_completion_*` | $[0,T]$；明细全局最晚结束桶的后一位置，未生产为 0 |
| $V_{pl}$ | `plan_release_*` | $[0,\sum_t h_{lt}]$ 分钟；全局完成位置映射到机组有效轴的释放时刻，仅 ABA 开启时创建 |

未使用块的 $o_i^S=o_i^E=0$，Element 仍取数组第 0 项；因此其 $S_i,C_i^F,H_i^F$ 不一定为 0。这些属性不代表真实生产，必须结合 $z_i$、弧条件解释。

### 2.4 资源、同步和目标辅助变量

| 符号 | 代码名称／访问器 | 域及含义／创建条件 |
| --- | --- | --- |
| $a_l^{app}$ | `append_line_used_*` | 布尔；续排机组本轮是否实际生产 |
| $r_{lt}^-,R_{lt}^-$ | `month_continue_material_*`、`month_continue_started_*` | 布尔；上月牌号当前生产、截至当前桶是否已开始；跨月规则开启 |
| $m_{gpt}$ | `feeder_material_*` / `feederMaterialPresence` | 布尔；喂丝机该桶供给明细 $p$；有效喂丝机关系开启 |
| $f_{gp}$ | `feeder_plan_active_*` | 布尔；该喂丝机全期供给过该明细；集中度目标绑定时创建 |
| $\beta_p^E$ | `sync_all_stop_bucket_*` | 候选结束桶集合中的整数；硬齐停公共结束桶 |
| $\ell_l,B_{lt},I_{lt}$ | `line_used_*`、`started_by_*`、`leading_idle_*` | 布尔；最终使用、截至当前已开工、前置空闲；前置空闲目标绑定时创建 |
| $H_t$ | `equipment_remaining_*` | 布尔；当前或未来桶仍有生产；设备利用率目标进入当前前缀时创建 |
| $J$ | `equipment_utilization_penalty` | 全厂完工前按桶分钟数加权的设备空闲名额平方和 |
| $C_l^{end},M$ | `line_completion_*`、`makespan_bucket` | $[0,E_{max}]$ 分钟；机组完工、全厂最晚完工；正式目标帧创建 |
| $d_{pl_1l_2t}^r,D_{pl_1l_2}^r$ | `soft_sync_*`、`soft_sync_*_pair_*` | 布尔；同桶边界 AND、整期是否同桶；同步 pair 目标绑定时创建 |
| $\operatorname{pos}_{pl}^r$ | `sync_*_position_*` | $[0,T-1]$；边界桶位置，$r=S$ 为开始、$r=E$ 为结束 |
| $L_{pl}^r,U_{pl}^r$ | `sync_*_min_candidate_*`、`sync_*_max_candidate_*` | $[0,T-1]$；带未使用机组哨兵的最小／最大候选 |
| $A_p^r,\underline b_p^r,\overline b_p^r,\Delta_p^r$ | `sync_*_any_used_*`、`sync_*_min_*`、`sync_*_max_*`、`sync_*_spread_*` | 布尔使用标识及 $[0,T-1]$ 的最小边界、最大边界、跨度 |
| $Z_j$ | `objective_layer_*` | 非负整数；第 $j$ 个目标层的实际整数评分，上界为各项加权上界之和 |

目标辅助变量的定义是求解器中的硬等式／不等式，但只是为了计算软评分，不应列成新的业务硬规则。未创建的历史槽位、未生效目标的变量见第 6 节。

## 3. 正式硬约束

### 3.1 单机单桶指派与正产量关联（始终装配）

对 $(l,t)\in\mathcal U$、$(p,l,t)\in\Omega$：

$$
\sum_p x_{plt}=u_{lt}\le1,\qquad x_{plt}\le q_{plt}\le C_{plt}x_{plt}.
\tag{H1}
$$

因此一台机组一桶至多生产一条计划明细，生产至少 1 箱。无日历或无产能组合没有变量，不能用零产量伪造占位。对应 `AssignmentConstraintBuilder`、`CapacityConstraintBuilder`。

### 3.2 块首尾、使用标识与单块连续性（始终装配）

沿 $\mathcal T_l^{cal}$ 定义前驱 $\operatorname{prev}_l(t)$、后继 $\operatorname{next}_l(t)$；边界外取 $x=0$：

$$
s_{plt}=x_{plt}\land\neg x_{pl,\operatorname{prev}_l(t)},\quad
e_{plt}=x_{plt}\land\neg x_{pl,\operatorname{next}_l(t)},\quad
y_{pl}=\bigvee_t x_{plt}.
\tag{H2}
$$

例如 $s=x\land\neg x'$ 的等价整数线性式是 $s\le x$、$s\le1-x'$、$s\ge x-x'$；代码以蕴含和 BoolOr 实现相同语义。

$$
\sum_t e_{plt}\le1\qquad\forall(p,l)\in\mathcal B_l.
\tag{H3}
$$

H2、H3 共同使生产序列属于 $0^*1^*0^*$。日历不可用桶跳过，不打断有效桶连续性；日历可用但该明细无产能的桶作为 $x=0$，会截断连续块。默认 `ATMOST_ONE` 使用尾标识至多一个；`SEQUENTIAL` 和 `AUTOMATON` 是同一连续性语义的其他编码。

对应 `BlockSemanticsConstraintBuilder`、`ContinuityConstraintBuilder`。单块限制按**明细—机组**执行，并非按物料汇总后执行。

### 3.3 需求等式（始终装配）

$$
\sum_{l,t}q_{plt}=D_p\qquad\forall p\in\mathcal P.
\tag{H4}
$$

`MustFulfillDemandConstraintBuilder` 无条件添加等式，不允许超产或欠产，也没有欠产量变量。`PackScheduleConstraintPolicy` 对 `must_fulfill_demand` 的展示／检查判断仍依赖配置，不能用其判断替代实际装配行为。配置标识还影响交期构建器采用的表达方式，见 3.10。

### 3.4 最大同时开台数（显式配置时装配）

$$
\sum_l u_{lt}\le K_t\qquad\forall t\in\mathcal T.
\tag{H5}
$$

启用条件：`configuredHardConstraintKeys` 含 `max_simultaneous_machines`。未配置时构题可计算机组数回退值，但正式计划不会因此装配 H5。$u$ 表示有正产量，不单独统计只进行换牌而没有生产的机组。对应 `MaxSimultaneousMachinesConstraintBuilder`。

### 3.5 同物料计划明细顺序（始终装配）

对 $\mathcal P_m$ 中相邻明细 $p^-\prec p$，对后序明细的每个生产组合：

$$
x_{plt}=1\Longrightarrow\sum_l\sum_{r<t}q_{p^-lr}\ge D_{p^-}.
\tag{H6}
$$

必须在更早桶完成前序需求，不允许前后明细同桶并行；约束不限于后序的首桶。对应 `SameMaterialPlanOrderConstraintBuilder`。

### 3.6 块属性推导（始终装配）

机组有效轴定义：

$$
\alpha_{lk}=\sum_{r<k}h_{l,t_l(r)},\qquad\eta_{lk}=\alpha_{lk}+h_{l,t_l(k)}.
$$

对候选块 $i=(p,l)$：

$$
\begin{aligned}
z_i&=\sum_k e_{p,l,t_l(k)},& o_i^E&=\sum_k k e_{p,l,t_l(k)},\\
o_i^S&=o_i^E-\sum_k x_{p,l,t_l(k)}+z_i,&
S_i&=\alpha_{l,o_i^S},\\
E_i&=\sum_k\eta_{lk}e_{p,l,t_l(k)},&
Q_i^F&=q_{p,l,t_l(o_i^S)},\\
C_i^F&=C_{p,l,t_l(o_i^S)},& H_i^F&=h_{l,t_l(o_i^S)}.
\end{aligned}
\tag{H7}
$$

$P_i^{prev}$ 由 Element 取 $o_i^S$ 前一有效桶的 $u$，序号为 0 时取 0。对应 `PackScheduleBlockVariableBuilder`；Element 表示由整数序号选取数组元素的等式约束。

### 3.7 换牌 Circuit、块时序及首桶扣产能（始终装配）

**块排序。** 每台机组引入虚拟节点 0：

$$
\Gamma_l=\{(0,0,1-v_l)\}\cup\{(i,i,1-z_i)\}
\cup\{(0,i,\phi_i),(i,0,\psi_i)\}
\cup\{(i,j,\gamma_{ij}):i\ne j,\ i\to j\text{ 为保留候选弧}\},
$$

$$
v_l=\bigvee_{i\in\mathcal B_l}z_i,\qquad \operatorname{Circuit}(\Gamma_l).
\tag{H8}
$$

Circuit 的数学含义：每个节点恰有一条选中入弧、一条选中出弧；被自环选中的未使用节点退出；其余节点形成一个连通有向环。存在已用块时，该环经过虚拟节点 0，去掉 0 后得到所有已用块的唯一直线序列。不能仅用节点入出度等式替代连通性要求。代码预先剪去由首尾候选范围可证明不可行的方向弧。

**释放时刻。** 设 $B_l(g)$ 为全局桶位置 $g$ 结束前累计的机组有效分钟：

$$
B_l(g)=\sum_{t<g}h_{lt},\qquad
V_{pl}=\begin{cases}B_l(G_p),&\text{ABA 开启},\\ E_{(p,l)},&\text{ABA 关闭}.\end{cases}
\tag{H9}
$$

无效桶取 $h=0$；这等价于代码查表时用最近有效结束时刻补齐缺口。ABA 开启时须先创建 3.8 的 $G_p$，不可把其他机组的局部分钟直接拿来比较。

对真实候选弧 $i\to j$：

$$
\gamma_{ij}=1\Longrightarrow
\left\{\begin{aligned}
&0\le S_j-V_{p(i),l}\le\tau_{ij},\\
&V_{p(i),l}+\tau_{ij}\le S_j+H_j^F.
\end{aligned}\right.
\tag{H10}
$$

该模型允许换牌的一部分在下一生产首桶内完成；首桶必须容纳剩余换牌。ABA 关闭时空档至多为换牌时间，同物料 $\tau=0$ 则要求有效轴紧接。ABA 开启时可等待原明细全局完成，等待本身不算换牌时长。

$$
\mu_j=\sum_{i:m(i)\ne m(j)}\gamma_{ij},\qquad
\lambda_j=\sum_{i:m(i)\ne m(j),\tau_{ij}>0}\gamma_{ij}.
\tag{H11}
$$

当选中的入弧是异物料且 $\tau_{ij}>0$：

$$
R_j=\tau_{ij}+V_{p(i),l}-S_j.
\tag{H12}
$$

首块、未用块、同物料入弧或零时长入弧均令 $R_j=0$。对块 $j$ 的候选首桶 $t$：

$$
\lambda_j=s_{p(j)lt}=1\Longrightarrow
h_{lt}q_{p(j)lt}+C_{p(j)lt}R_j\le C_{p(j)lt}h_{lt}.
\tag{H13}
$$

若首桶不是尾桶，再加：

$$
\lambda_j=s_{p(j)lt}=1,\ e_{p(j)lt}=0\Longrightarrow
h_{lt}q_{p(j)lt}+C_{p(j)lt}R_j\ge C_{p(j)lt}h_{lt}-(h_{lt}-1).
\tag{H14}
$$

当 $h_{lt}>0$ 时，非尾首桶的整箱产量精确等于 $\lfloor C_{p(j)lt}(h_{lt}-R_j)/h_{lt}\rfloor$；单桶块仅受上界约束，允许需求尾量。H1 同时保证真实生产量至少一箱。

对应 `ChangeoverConstraintBuilder`。`changeover_structure_control`、`no_gap_between_blocks` 的旧开关不关闭这套正式基础结构；独立 `NoGapBetweenBlocksConstraintBuilder` 未装配。

### 3.8 ABA：允许退出，完成前不转产（开关启用时装配）

启用条件：`forbid_return_to_finished_material=true`，构题默认 false。定义：

$$
F_p=1\iff\sum_{l,t}q_{plt}=D_p,\qquad
G_p=\max_l\left\{\sum_t(t+1)e_{plt}\right\}.
\tag{H15}
$$

对每条保留的真实后序弧 $i\to j$：

$$
\gamma_{ij}=1\Longrightarrow
F_{p(i)}=1\ \land\ \sum_t t\,s_{p(j)lt}\ge G_{p(i)}.
\tag{H16}
$$

所有机组可在不同桶退出原明细；转产必须晚于原明细在所有机组的最后生产桶。$G_p$ 使用 $t+1$，后序开始使用 $t$，所以 H16 排除了同桶转产。同物料不同明细的弧也受该规则约束。

当前 H4 已保证 $F_p=1$，H16 的实质额外限制是转产必须等待**全局**完成；H9、H10 相应改用全局完成的释放时刻。没有“每台机组尾桶必须等于全局尾桶”的等式。对应 `ForbidReturnToFinishedMaterialConstraintBuilder`。

### 3.9 前满后尾（分两阶段始终装配）

内部桶：

$$
q_{plt}+C_{plt}s_{plt}+C_{plt}e_{plt}\ge C_{plt}x_{plt}.
\tag{H17}
$$

非首非尾的生产桶必须满产。普通多桶块首桶：

$$
w_i^{multi}=1\iff o_i^E-o_i^S\ge1,\qquad
z_i=1,\ \mu_i=0,\ w_i^{multi}=1\Longrightarrow Q_i^F=C_i^F.
\tag{H18}
$$

默认 `BLOCK_ELEMENT` 使用 H18；`PER_BUCKET` 使用等价条件 $s_{plt}=1,e_{plt}=0,\mu_i=0\Rightarrow q_{plt}=C_{plt}$。换牌首桶由 H13、H14 处理；尾桶可不满。

代码以 **$\mu_i=0$（没有异物料换牌）** 判定普通首桶，而不是 $\lambda_i=0$。因此异物料但换牌时长为 0 的块，其首桶也不会被 H18 强制满产，且不会进入 H13、H14 的正时长扣产能约束。对应 `FullBucketBeforeTailConstraintBuilder`；旧 `full_bucket_before_tail` 开关不关闭正式装配。

### 3.10 最早开始与交期窗口（显式配置并启用时装配）

启用条件：硬配置含 `due_date_control` 且值为 true。最早开始日期忽略时分秒，映射到当日或之后首桶；交期为纯日期时取当日结束，否则保留具体时刻，取结束不晚于交期的最后桶。未给交期取末桶，未给最早日期取首桶。

正式调用使用 FULL 模式。`mustFulfillDemandEnabled=true` 时：

$$
\sum_l\sum_{a_p\le t\le b_p}q_{plt}\ge D_p.
\tag{H19}
$$

该标识为 false 时，直接令窗口外 $q_{plt}=0$。结合始终存在的 H4，两种表达在正式模型中均要求全部需求在 $[a_p,b_p]$ 完成。空窗口且正需求会导致不可行。

对应 `DueDateConstraintBuilder`。诊断可使用 `STRICT_ONLY`、`BOUNDARY_ONLY` 拆分表达；不能把单个诊断阶段当作正式完整模型。

### 3.11 跨月首段牌号（显式配置并启用时装配）

对有上月末段牌号 $m_l^-$ 且该物料本期仍有待排明细的机组：

$$
\sum_{p\in\mathcal P_{m_l^-}}y_{pl}\ge1,\quad
r_{lt}^-=\sum_{p\in\mathcal P_{m_l^-}}x_{plt},\quad
R_{lt}^-=R_{l,t-1}^-\lor r_{lt}^-,\quad
x_{plt}\le R_{lt}^-\ (m(p)\ne m_l^-).
\tag{H20}
$$

前缀初值为 0；$f_l$ 之前强制前缀为 0。该规则既强制机组使用过上月牌号，又禁止在它开工之前生产其他牌号。**自身不强制在 $f_l$ 开工**。

启用条件：显式配置 `mat_month_continue=true`。若本期没有该物料需求则跳过；有需求但机组没有可用桶、该牌号候选产能或变量时，构建阶段报错。候选能力检查是“首桶起及之后是否存在”，不等价于首桶一定有该牌号能力。对应 `MatMonthContinueConstraintBuilder`。

### 3.12 历史续排贴边

**续排贴边：** 对构题筛出的历史续排机组，无条件装配：

$$
a_l^{app}=\bigvee_t u_{lt},\qquad a_l^{app}\le u_{l,f_l^{app}}.
\tag{H21}
$$

若续排首桶无 $u$ 变量，则令 $a_l^{app}=0$；无历史续排任务的普通机组不受此项影响。对应 `HistoryStartContinuityConstraintBuilder`，旧 `history_start_continuity` 开关不控制装配。

### 3.13 喂丝机同桶单明细（关系开关启用时装配）

对有效喂丝机组、桶及有候选生产变量的明细：

$$
m_{gpt}=\max_{l\in\mathcal L_g}x_{plt},\qquad\sum_p m_{gpt}\le1.
\tag{H23}
$$

关联机组允许部分空闲；正在生产的机组必须使用同一条计划明细。同物料但不同明细仍互斥。启用条件：`feeder_sync_production=true`，且去重过滤后至少两台有效机组。对应 `FeederMaterialConsistencyConstraintBuilder`。

### 3.14 硬齐停（显式配置 HARD 时装配）

对同一明细的候选机组超过一台时：

$$
\sum_t e_{plt}=y_{pl},\qquad e_{plt}=1\Longrightarrow\beta_p^E=t.
\tag{H24}
$$

若两台候选机组没有共同结束候选桶，预加 $y_{pl_1}+y_{pl_2}\le1$。实际使用的全部机组必须在同一全局桶结束，不是同一分钟结束。

启用条件：硬配置含 `sync_stop` 且解析为 HARD。MAKESPAN_FIRST 不装配 H24；它追加软齐停层。旧 `sync_start` 仅读取，正式模型没有硬齐开。对应 `SynchronizedBoundaryConstraintBuilder`。

## 4. 软约束、业务目标与系统决胜项

所有实际指标均最小化。软约束是可付出代价的偏好，不额外要求评分为 0；其辅助变量定义仍须精确满足。配置项须通过规则校验、整数权重大于 0，绑定时原始上界和有效贡献也须大于 0。

### 4.1 最短完成时间及产量前移：`makespan`

先定义完工辅助变量：

$$
C_l^{end}=\max_t\{E_tu_{lt}\},\qquad M=\max_l C_l^{end}.
\tag{O1}
$$

无生产机组的完成值为 0。再定义总需求 $D_{\Sigma}=\sum_pD_p$、产量时间成本 $P^{time}$ 及支配系数 $A$：

$$
P^{time}=\sum_{(p,l,t)\in\Omega}E_tq_{plt},\quad
A=D_{\Sigma}E_{max}+1,\quad
g_{mk}=A M+P^{time}.
\tag{O2}
$$

$$
U_{mk}=A E_{max}+D_{\Sigma}E_{max}.
$$

由于 $0\le P^{time}\le D_{\Sigma}E_{max}$，单独优化 $g_{mk}$ 时，改善 1 分钟的 $M$ 优先于任何产量时间成本变化；同一 makespan 下，倾向把更多产量安排到早桶。若与其他目标同层混合，整个层仍按加权和优化，不保证相对其他指标的绝对 makespan 优先。

`makespan_bucket` 虽名称含 bucket，值实际为自然分钟。指标采用桶末时刻，未计算尾桶内精确完工分钟。对应 `MakespanObjectiveBuilder`；需求、支配系数、加权上界超出整数范围时会报错。

### 4.2 最少换牌次数：`changeover_control`

$$
g_{chg}=\sum_l\sum_{i\in\mathcal B_l}\mu_i.
\tag{O3}
$$

跨不同物料的块入弧计一次；首块不计，同物料不同明细不计；异物料但时长为 0 仍计一次。原始上界为已登记的 `blockMaterialChange` 变量数。对应 `ChangeoverControlObjectiveBuilder`。

### 4.3 高速机优先：`speed_level_priority_control`

$$
g_{speed}=\sum_{(p,l,t)\in\Omega}\sigma_lq_{plt},\qquad
U_{speed}=\sum_{(p,l,t)\in\Omega}\sigma_lC_{plt}.
\tag{O4}
$$

这是按产量惩罚低速机，不是按开台次数。对应 `SpeedLevelPriorityObjectiveBuilder`。

### 4.4 机组牌号优先：`brand_machine_priority`

在存在真实正产能 P1 候选机组的明细集合 $\mathcal P^{P1}$ 内，先最小化非 P1 产量：

$$
\mathcal P^{P1}=\{p:\exists(l,t),(p,l,t)\in\Omega,\pi_{pl}=1\},\quad
g_{P1}=\sum_{p\in\mathcal P^{P1}}\sum_{l:\pi_{pl}\ne1}\sum_tq_{plt}.
\tag{O5}
$$

再最小化优先级差值产量：

$$
g_{prio}=\sum_{(p,l,t)\in\Omega}\rho_{pl}q_{plt},\qquad
\rho_{pl}=\begin{cases}
\max(0,\pi_{pl}-\pi_p^{min}),&\pi_{pl}\text{ 已配置},\\
\pi_p^{max}-\pi_p^{min}+1,&p\text{ 有其他机组配置但本机组缺失},\\
0,&p\text{ 无任何机组配置}.
\end{cases}
\tag{O6}
$$

$\pi_p^{min},\pi_p^{max}$ 为构题时全部候选机组中已配置级别的最小、最大值。两项上界分别为相同求和集合上的产能和、惩罚系数乘产能之和。

该业务项拆成连续的 `brand_machine_priority_primary`、`brand_machine_priority_secondary` 两层，而非在单层直接相加。缺失 P1 候选时不计 O5，但仍可计 O6。对应 `BrandMachinePriorityObjectiveBuilder`。

### 4.5 同牌号少占机台：`product_line_spread_tiebreaker`

$$
g_{line}=\sum_{p,l}y_{pl},\qquad U_{line}=\#\{(p,l):y_{pl}\text{ 已创建}\}.
\tag{O7}
$$

名称称“同牌号”，实际计量是**明细—机组使用对数**。同牌号的多条明细分别计数，并非物料—机组全期去重数。对应 `ProductLineSpreadObjectiveBuilder`，仅策略显式有效配置时生效，不自动追加。

### 4.6 前置空闲：`leading_idle_control`

对有 $u$ 变量的机组桶序列递推，前缀初值为 0：

$$
\ell_l=\bigvee_tu_{lt},\qquad B_{lt}=B_{l,prev(t)}\lor u_{lt},\qquad
I_{lt}=\begin{cases}\ell_l\land\neg B_{lt},&t\ge f_l,\\0,&\text{否则},\end{cases}
$$

$$
g_{idle}=\sum_{(l,t)\in\mathcal U}I_{lt},\qquad U_{idle}=\#\{I_{lt}\text{ 已创建}\}.
\tag{O8}
$$

仅最终使用机组首次开工前的可生产桶计分，未用机组及生产后的空档不计。单位是机组·桶，无工时长度加权。该指标可以引导提前开工。对应 `LeadingIdleObjectiveBuilder`；默认前置空闲自动追加调用已注释，不会仅因 makespan 开启而自动生效。

### 4.7 设备利用率：`equipment_utilization_control`

仅适用于 CP-SAT，默认不加载。只有策略显式配置本软约束、权重有效且启用 `max_simultaneous_machines` 硬约束时评分。沿用策略中的 `priority` 和 `weight`，同优先级归一化加权，不自动绑定 Makespan 或插入独立目标层。

复用硬约束中的生产状态 $u_{lt}$ 和逐桶上限 $K_t=\operatorname{getMaxOpen}(t)$。其中 $K_t$ 已取策略上限与日历可用设备数的较小值，不写死为 13。当前模型按实际生产计设备占用，不另外将等待或纯换产时间计为开台。

$$
H_T=0,\qquad H_t=\max\left(H_{t+1},\max_lu_{lt}\right).
\tag{O9}
$$

$$
N_t=\sum_lu_{lt},\quad idle_t=K_t-N_t,\quad
J=\sum_t d_t H_t idle_t^2,\quad
0\le J\le\sum_t d_t K_t^2.
\tag{O10}
$$

$d_t$ 为桶真实起止时长转换的整数分钟（不足一分钟向上取整）。平方罚分通过 `addElement` 查表绑定；最终目标仍为整数线性加权和，表值、时长加权及目标上界均检查 `long` 溢出。仅在目标进入当前求解前缀时创建辅助变量，同一上下文重复绑定时复用。

$H_t=1$ 当且仅当当前或未来仍有生产，因此从排产周期首个生成桶计至最后生产桶，前置等待和中间空闲计分，完工后及全期无生产时不计分。$K_t=0$ 的桶罚分为 0，但仍传递未来生产状态。未生成的休息时段不计分。正产量绑定保证不能通过零产量开机降低罚分。

例如两个一小时桶、上限均为 13：开台数 `[13,11]` 的评分为 240，`[12,12]` 为 120，后者更平滑。罚分不是利用率百分比，也不保证平均开台数提高。若 Makespan 优先级更低，则可能接受更晚完工；同优先级时按权重权衡。

配置示例（加入既有 `OPTIMIZE_RULES` 数组即可启用，移除此项即关闭）：

```json
{
  "key": "equipment_utilization_control",
  "ruleType": "SOFT_CONSTRAINT",
  "engineScope": "CP_SAT",
  "priority": 2,
  "weight": 1
}
```

对应 `EquipmentUtilizationObjectiveBuilder`。旧 `personnel_utilization_control` 已从目录和评分实现删除，历史键按无效规则跳过，不自动迁移或启用新规则；若过滤后无有效目标，沿用原策略有效性校验。

结果日志汇总有效期分钟数、时间加权平均开台数、满额时长占比（零容量桶不算满额）、开台数对应分钟数分布和原始平方罚分。复用既有各层模型规模、求解状态及耗时日志。后层失败时继续返回已确认可行结果，日志可从该结果重新计算实际占用，不依赖新目标是否已经建模。

验证：新增 `PackScheduleEquipmentUtilizationTest` 覆盖平方罚分、长短桶、有效期、零产量、日历上限、默认关闭、旧键跳过、策略权衡、目标延迟绑定及锁定。当前环境离线 Maven 被缺失的 FastDDD `26.09.24` 私有依赖阻断，测试与关闭/开启性能对比尚未运行，不宣称收益已验证。

### 4.8 齐开／齐停系统偏好

设 $b_{plt}^S=s_{plt}$、$b_{plt}^E=e_{plt}$。$r\in\{S,E\}$ 表示目标考察的边界类型，对有共同候选桶的机组对：

$$
d_{pl_1l_2t}^r=b_{pl_1t}^r\land b_{pl_2t}^r,\qquad
D_{pl_1l_2}^r=\max_t d_{pl_1l_2t}^r.
$$

$$
g_{pair}^r=N^r-\sum_{p,l_1<l_2}D_{pl_1l_2}^r.
\tag{O11}
$$

$N^r$ 是全体存在共同候选边界桶的明细—机组对数量，也是该项原始上界。AND 的线性化为 $d\le b_1,d\le b_2,d\ge b_1+b_2-1$。

该评分实质是最大化同桶边界机组对。常数 $N^r$ 包含未使用机组对，**不是仅对实际使用机组之间的不一致计罚**；无共同候选桶的机组对不计。因此它也可能偏好增加同桶使用的机组数，与 O7 的少占机台偏好存在权衡。

再定义边界跨度，$B_{max}=T-1$：

$$
\operatorname{pos}_{pl}^r=\sum_t t\,b_{plt}^r,\quad
L_{pl}^r=\begin{cases}\operatorname{pos}_{pl}^r,&y_{pl}=1,\\B_{max},&y_{pl}=0,\end{cases}\quad
U_{pl}^r=\begin{cases}\operatorname{pos}_{pl}^r,&y_{pl}=1,\\0,&y_{pl}=0.\end{cases}
$$

$$
A_p^r=\max_l y_{pl},\quad \underline b_p^r=\min_l L_{pl}^r,\quad
\overline b_p^r=\max_l U_{pl}^r,\quad
\Delta_p^r=\begin{cases}\overline b_p^r-\underline b_p^r,&A_p^r=1,\\0,&A_p^r=0,\end{cases}\quad
g_{spread}^r=\sum_p\Delta_p^r.
\tag{O12}
$$

仅对有多个候选机组的明细创建跨度结构；零／一台实际使用机组的跨度为 0。原始估计上界 $U_{spread}=|\mathcal P|(T-1)$。跨度单位为桶序号差，不是分钟。

系统装配顺序：

| 模式 | 追加目标，先 pair 后 spread |
| --- | --- |
| `sync_stop=HARD` | O11、O12 的开始边界 $r=S$，在硬齐停前提下尽量齐开 |
| `sync_stop=MAKESPAN_FIRST` | O11、O12 的结束边界 $r=E$，尽量齐停 |
| `sync_stop=OFF` | 不追加同步偏好 |

对应 `SynchronizedBoundaryPreferenceBuilder`。这两层均在**全部业务目标层之后**追加；MAKESPAN_FIRST 写入的 priority 虽为 makespan 优先级加 1、加 2，实际不据此重新插入业务层中。该模式自身也不创建 makespan 业务目标，必须由策略另行配置。

### 4.9 喂丝机集中度：`feeder_material_concentration`

$$
f_{gp}=\max_t m_{gpt},\qquad g_{feeder}=\sum_{g,p}f_{gp}.
\tag{O13}
$$

只统计有喂丝机 presence 变量的组合，上界为这些喂丝机—明细对数量。减少的是一条明细跨喂丝机的分散，不是按物料合并后的喂丝机数量。

喂丝机关系开启且未显式配置该目标时，自动在同步层后追加权重 1 的末层决胜项；内部显式目标项则按业务层处理。**当前正式策略校验还要求目录中存在定义，而 `OptimizeRuleCatalogRegistry` 未注册此键，所以通常只能走自动系统层；仅枚举和构建器支持不足以从普通策略配置进入业务层。** 对应 `FeederMaterialConcentrationObjectiveBuilder`。

## 5. 权重、分层目标与求解机制

### 5.1 目标准入及归一化

策略规则需在目录中有定义、类型为 OBJECTIVE 或 SOFT_CONSTRAINT、引擎范围适用、目标键受支持，且权重有限。构题将浮点业务权重 $w_k^{cfg}$ 转为整数：

$$
w_k=\operatorname{round}(w_k^{cfg})>0.
$$

所以正小数权重也可能因取整为 0 被过滤。目标绑定时再对原始上界 $U_k>0$、归一化分母 $d_k$ 计算：

$$
\widehat w_k=\max\left(1,\operatorname{round}\left(\frac{10000w_k}{U_k\max(1,d_k)}\right)\right),\qquad
Z_j=\sum_{k\in\mathcal O_j}\widehat w_k g_k,\qquad\min Z_j.
\tag{L1}
$$

$\mathcal O_j$ 是层 $j$ 内有效项集合。普通业务项未设置额外分母时按 1 处理；权重、上界非正或没有有效贡献的项跳过，空层不求解。取整及最小系数 1 使归一化是近似处理；日志显示的比例公式不应替代实际整数系数。

### 5.2 真实层顺序与锁定

1. 业务 priority 数值升序。正式构题中未配置 priority 使用 `Integer.MAX_VALUE`；直接构造 term 且 priority 为 null 时，`describeLayers` 的回退值是 1000。
2. 同 priority 普通业务项先合并为一层，再展开机组牌号 P1 层、优先级差值层；计划量优先拆层分支存在但当前正式配置不可达，见第 6 节。
3. 所有业务层之后追加同步 pair、spread 层，最后按需追加喂丝机集中度系统层。

对层 $j$ 已取得的评分 $Z_j^*$：

$$
\begin{cases}Z_j=Z_j^*,&\text{该层返回 OPTIMAL},\\
Z_j\le Z_j^*,&\text{该层返回 FEASIBLE}.
\end{cases}
\tag{L2}
$$

后续层重新创建模型，只绑定截至当前层的目标前缀，按原始层索引重建已解层锁定，不跨模型复用旧 `IntVar`。FEASIBLE 后继续后续层，只保证不恶化已取得的高层值；不能宣称所有层都达到严格字典序最优。单个业务项的权重和上界见第 4 节，最终锁定对象是整个层的 $Z_j$。

### 5.3 可行种子、提示与失败回退

- 优化前先找满足完整硬约束的种子；按规模和时间配置可冷启动或逐阶段累加约束。阶段局部可行解不能直接作为正式完整结果。
- hint 只是搜索起点，不改变数学可行域；不同连续性编码、目标前缀重建、重试和局部改善属于求解策略。
- 目标层 OPTIMAL／FEASIBLE 时锁定后继续；目标层 UNKNOWN、后续建模或求解预算不足时，返回最近已确认满足完整硬约束的结果并标记优化回退。
- 尚无完整硬约束可行解时，超时不能当成可行；INFEASIBLE 是已证明不可行，MODEL_INVALID 等按失败处理，不转成业务欠产。
- 可配置 makespan 局部交换及 LNS 改善；触发还要求当前层单一 makespan、FEASIBLE、显式开台限制、差距达到阈值等。局部尝试不新增长期业务规则；未取得更好可行解时保留 incumbent。

## 6. 已注册、保留或不可达能力

本节公式用于解释保留实现，**不加入当前正式可行域或实际目标函数**。

| 能力／键 | 当前装配与准入结论 |
| --- | --- |
| `restart_gap_control` | 目录注册、校验支持、评分构建器存在，但正式链未调用 `putR` 创建重启变量；上界为 0，目标被跳过 |
| `brand_plan_qty_priority` 软项 | 目录已注册，但基础键不在 `PackScheduleObjectiveKey`，规则校验无法通过；错序数量／距离拆层不能由正式构题产生 |
| `brand_plan_qty_priority` 硬项 | 有独立构建器，但未收集为已配置硬键，也未在正式计划装配 |
| `demand_fulfillment` | CP-SAT 校验明确排除，分层也过滤；没有欠产最小化目标，H4 始终要求全量完成 |
| `sync_start` | 构题兼容读取，硬键收集和硬齐开装配已移除；齐开偏好仅来自 HARD 齐停后的系统层 |
| `no_gap_between_blocks` | 独立构建器不装配，旧键保留；块间结构由 Circuit、H9—H10 控制 |
| `changeover_structure_control`、`full_bucket_before_tail`、`history_start_continuity` | 旧键保留，但相应基础结构不按旧开关关闭；续排仍须有适用历史机组 |
| `active_production_bucket_tiebreaker` | 构建器和分派存在，系统层追加已注释，策略目录／准入不使其正式生效 |
| 默认前置空闲系统层 | `appendDefaultLeadingIdleLayer` 调用已注释；显式 `leading_idle_control` 业务项仍有效 |
| `dayUsed`、`active` 等上下文历史槽位 | 未由正式构建链注册相应变量，不作为本文正式变量 |

### 6.1 计划量优先保留实现的数学口径

保留构建器按 $D_p$ 升序（订单排序 ASC）或降序（DESC），同量按明细 ID 排序；只比较**排序后相邻且需求不等**的明细对集合 $\mathcal Q$。同牌号多条明细仍分别排序，不按物料合并。

令哨兵 $B=T+1$，每条明细的首次全局开工位置：

$$
S_p^{first}=\min_l\left\{\sum_t(t+1)s_{plt}+B(1-y_{pl})\right\}.
$$

无候选机组时取 $B$。对 $(p^-,p)\in\mathcal Q$：

$$
v_{p^-p}=1\iff S_{p^-}^{first}>S_p^{first},\qquad
\delta_{p^-p}\ge S_{p^-}^{first}-S_p^{first},\quad0\le\delta_{p^-p}\le B.
$$

$$
\min g_{qty,count}=\sum_{\mathcal Q}v_{p^-p},\qquad
\min g_{qty,distance}=\sum_{\mathcal Q}\delta_{p^-p}.
$$

两层先数量后距离；距离只被下界约束，在最小化达到其最小值时等于 $\max(0,S_{p^-}^{first}-S_p^{first})$，不能写成建模时已施加的精确 max 等式。

保留硬构建器另按相同需求量分组为 $\mathcal D_1,\ldots,\mathcal D_R$，组间按选定方向排序，对相邻需求组要求：

$$
\max_{p\in\mathcal D_j}S_p^{first}\le\min_{p\in\mathcal D_{j+1}}S_p^{first},\qquad j=1,\ldots,R-1.
$$

它约束前组所有明细均不晚于后组任何明细首次开工，比软项只比较排序后相邻明细的集合不同；两者均不属于当前正式启用规则。源码见 [BrandPlanQtyPriorityObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/BrandPlanQtyPriorityObjectiveBuilder.java) 和 [BrandPlanQtyPriorityHardConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/BrandPlanQtyPriorityHardConstraintBuilder.java)。

### 6.2 其他保留评分

重启构建器尝试追加 $g_{restart}=\sum_{l,t}r_{lt}$，其中 $r$ 意图表示空白后重启；当前没有定义这些 $r$ 的约束或变量，因此不能宣称已建成重启惩罚模型。活跃生产桶保留项为 $g_{active}=\sum_{p,l,t}x_{plt}=\sum_{l,t}u_{lt}$（后一个等号由 H1 推得），其源码上界计数为已创建 $x$ 的数量；当前正式目标不追加。源码见 [RestartGapControlObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/RestartGapControlObjectiveBuilder.java) 和 [ActiveProductionBucketObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/ActiveProductionBucketObjectiveBuilder.java)。

## 7. 源码追溯与核验

### 7.1 建模装配顺序

正式约束依次为：指派／产能／结构 → 续排 → 需求 → 可选开台上限 → 可选喂丝机 → 同物料明细顺序 → 连续性 → 块变量 → 内部桶满产 → 换牌 → 可选 ABA 转产等待 → 普通多桶首桶满产 → 可选交期 → 可选跨月 → 可选硬齐停 → 完工辅助定义。目标辅助变量按前缀层需要创建。

正式求解与诊断共用装配入口，但诊断有阶段快照、交期表达模式和齐停 assumption 等专用细节；检查清单中的键状态也不一定等于正式模型的全部基础约束。

### 7.2 代码索引

以下链接相对本文件。硬约束对应 H 编号，目标对应 O 编号，分层对应 L 编号。

| 文件／构建器 | 对应内容 |
| --- | --- |
| [PackScheduleProblemBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleProblemBuilder.java) | 构题、需求与产能整数化、时间桶、配置和目标准入 |
| [PackScheduleVariableBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleVariableBuilder.java) | 稀疏核心变量及完成时间变量 |
| [PackScheduleModelContext](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleModelContext.java) | 所有变量登记、访问器和跨构建器共享 |
| [PackScheduleConstraintPlanBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleConstraintPlanBuilder.java) | 正式装配顺序及可行性阶段 |
| [PackScheduleConstraintPolicy](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleConstraintPolicy.java) | 配置检查／展示启用判断 |
| [AssignmentConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/AssignmentConstraintBuilder.java)、[CapacityConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/CapacityConstraintBuilder.java) | H1 |
| [BlockSemanticsConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/BlockSemanticsConstraintBuilder.java)、[ContinuityConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/ContinuityConstraintBuilder.java) | H2—H3 |
| [MustFulfillDemandConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MustFulfillDemandConstraintBuilder.java) | H4 |
| [MaxSimultaneousMachinesConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MaxSimultaneousMachinesConstraintBuilder.java) | H5 |
| [SameMaterialPlanOrderConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SameMaterialPlanOrderConstraintBuilder.java) | H6 |
| [PackScheduleBlockVariableBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/PackScheduleBlockVariableBuilder.java) | H7 |
| [ChangeoverConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/ChangeoverConstraintBuilder.java) | H8—H14 |
| [ForbidReturnToFinishedMaterialConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/ForbidReturnToFinishedMaterialConstraintBuilder.java) | H15—H16 |
| [FullBucketBeforeTailConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/FullBucketBeforeTailConstraintBuilder.java) | H17—H18 |
| [DueDateConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/DueDateConstraintBuilder.java) | H19 |
| [MatMonthContinueConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MatMonthContinueConstraintBuilder.java) | H20 |
| [HistoryStartContinuityConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/HistoryStartContinuityConstraintBuilder.java) | H21 |
| [FeederMaterialConsistencyConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/FeederMaterialConsistencyConstraintBuilder.java) | H23 |
| [SynchronizedBoundaryConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SynchronizedBoundaryConstraintBuilder.java) | H24 |
| [MakespanObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/objective/MakespanObjectiveBuilder.java) | O1—O2 |
| [ChangeoverControlObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/ChangeoverControlObjectiveBuilder.java) | O3 |
| [SpeedLevelPriorityObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/SpeedLevelPriorityObjectiveBuilder.java) | O4 |
| [BrandMachinePriorityObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/BrandMachinePriorityObjectiveBuilder.java) | O5—O6 |
| [ProductLineSpreadObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/ProductLineSpreadObjectiveBuilder.java) | O7 |
| [LeadingIdleObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/LeadingIdleObjectiveBuilder.java) | O8 |
| [PersonnelUtilizationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/PersonnelUtilizationObjectiveBuilder.java) | O9—O10 |
| [SynchronizedBoundaryPreferenceBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SynchronizedBoundaryPreferenceBuilder.java) | O11—O12；虽位于 hard 包，负责软评分 |
| [FeederMaterialConcentrationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/FeederMaterialConcentrationObjectiveBuilder.java) | O13 |
| [PackScheduleObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleObjectiveBuilder.java)、[ObjectiveLock](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/ObjectiveLock.java) | L1—L2、目标前缀、拆层及系统层 |
| [PackScheduleObjectiveRuleValidator](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleObjectiveRuleValidator.java)、[PackScheduleObjectiveKey](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleObjectiveKey.java)、[OptimizeRuleCatalogRegistry](../factory-production-domain/src/main/java/ys/project/sdyth/factory/production/domain/bo/OptimizeRuleCatalogRegistry.java) | 目标实际准入与不可达项判断 |
| [PackScheduleCpSatService](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleCpSatService.java) | 完整种子、逐层求解、锁定、回退和局部改善 |

### 7.3 核验边界与阅读提示

本文按变量构建器、正式约束装配器、各评分构建器及分层求解代码进行静态核对，不运行 Maven、求解实例或修改业务实现。公式还原的是当前整数桶模型，不是连续时间模型；小时桶、整箱、整数分钟、日历压缩及按明细统计均会影响结果。

求解状态 OPTIMAL 应结合配置的差距容差、目标界和停止条件解读；FEASIBLE 或优化回退仅表示已取得可行方案，不代表全部目标已最优。本文不将规则目录描述、未装配代码或未提交前的旧文档说明当作当前生效证据。
