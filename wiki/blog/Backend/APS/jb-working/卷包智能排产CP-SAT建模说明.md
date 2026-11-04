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

`PackScheduleVariableBuilder` 创建稀疏变量；

`PackScheduleConstraintPlanBuilder` 决定实际硬约束装配；

`PackScheduleObjectiveBuilder` 描述、绑定目标层；

`ObjectiveLock` 实现跨层锁定。类注释、规则目录、枚举键的存在本身不表示规则已生效。

当前模型的重要事实：

- 正式模型始终完成全部待排需求，`must_fulfill_demand=false` 不会把需求等式改成允许欠产。
- `makespan` 仅最小化全局最晚完工时间的分钟偏移，不包含产量前移复合评分。
- 同一 priority 的业务目标及其内部分项归一化后加权求和，不因分项名称而产生额外优先级。
- 本文依据当前工作区实现（含未提交修改），不把历史服务器日志中的参数、规模及耗时当作固定模型定义。

### 1.2 时间桶与时间坐标

对每个工作日，汇总截断续排边界后的机组开台窗口，取最早开始至最晚结束的外包区间，按一小时切分；不足一小时保留尾桶。只对生成的桶编号：

$$
\mathcal T=\{0,\ldots,T-1\}.
$$

机组净有效工时从开台窗口左端向后分配，未分配的尾部视为损耗、日常停机。设 $A_{lt}\in\{0,1\}$ 表示日历有效且获分配正工时，$w_{lt}$ 为有效小时：

$$
\mathcal T_l^{cal}=\{t:A_{lt}=1\},\qquad h_{lt}=\max(0,\operatorname{round}(60w_{lt})).
$$

桶序号和自然时间必须区分：

| 时间坐标 | 单位 | 用途 |
| --- | --- | --- |
| 全局桶序号 $t$ | 桶 | 计划顺序、连续性、交期、同步和人员利用率 |
| 自然结束偏移 $E_t$ | 分钟 | 桶结束时刻距全局首桶开始的偏移，包含跨日休息；用于 makespan、全厂齐停跨度 |

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

仅为 $\Omega$ 创建 $x,q,s$，为 $\mathcal U$ 创建 $u$，为候选明细—机组创建 $y$。未创建的组合在下文求和、逻辑式中视为常量 0。

## 2. 符号、参数与变量字典

### 2.1 集合、索引与输入参数

| 符号 | 代码来源／含义 |
| --- | --- |
| $p\in\mathcal P$ | `scheduleOrderPlanDetailId`，一条待排计划明细；$m(p)$ 是物料 ID |
| $l\in\mathcal L,\ t\in\mathcal T$ | 机组、全局时间桶 |
| $D_p,C_{plt}$ | `demandScaled`、`getCapacity`，整箱需求与名义桶产能 |
| $A_{lt},\mathcal T_l^{cal}$ | 机组日历可用状态、按时间排序的可用桶序列 |
| $\operatorname{prev}_l(t),\operatorname{next}_l(t)$ | 日历可用序列中的前后桶；不是简单的 $t\pm1$ |
| $E_t,E_{max}$ | 桶结束相对全局首桶开始的分钟偏移、该偏移的最大值 |
| $K_t$ | `getMaxOpen(t)`，逐桶实际开台上限 |
| $f_l,f_l^{app}$ | `getFirstSchedulableBucket`、`getAppendFirstSchedulableBucket` |
| $\pi_{pl},\rho_{pl},\sigma_l$ | 机组牌号优先级、优先级惩罚、速度等级惩罚 |
| $g\in\mathcal G,\mathcal L_g$ | 喂丝机及其关联机组集合 |

无变量的组合按 0 理解，但未定义的边界辅助变量不能直接视为已装配能力。日历不可用桶不打断有效桶连续性；日历可用、但当前明细无产能的桶按 $x=0$ 处理。

### 2.2 核心变量

| 符号 | 代码名称／访问器 | 域及含义 |
| --- | --- | --- |
| $x_{plt}$ | `x` | 布尔；该明细在机组、桶上有正产量 |
| $q_{plt}$ | `q` | $[0,C_{plt}]$ 整箱产量 |
| $s_{plt}$ | `start` | 布尔；该明细在机组上连续生产段的启动事件 |
| $u_{lt}$ | `u` | 布尔；该机组、桶是否实际生产 |
| $y_{pl}$ | `productLineUsed` | 布尔；该明细是否使用该机组 |
| $C_l$ | `lineCompletion` | $[0,E_{max}]$，机组最终完工分钟偏移 |
| $M$ | `makespanBucketVar`，变量名 `makespan_bucket` | $[0,E_{max}]$，全局最晚完工**分钟偏移**，不是桶序号 |

$x,q,s,u,y$ 为基础稀疏变量；是否创建 $C_l,M$ 由目标辅助变量场景控制。`PackScheduleVariableBuilder` 只创建变量与域，语义由后续约束绑定。

### 2.3 按需边界及业务辅助变量

| 符号 | 代码名称／访问器 | 含义 |
| --- | --- | --- |
| $e_{plt}$ | `production_end_*`、`endEvent` | 尾桶事件；仅依赖它的规则需要时创建 |
| $F_{pl},L_{pl}$ | `first_production_position_*`、`last_production_position_*` | 首生产桶的零基序号、末生产桶序号加 1；未使用时为 0 |
| $B_p$ | `plan_completion_*` | 明细全局末生产桶序号加 1 |
| $v_p$ | `plan_fulfilled_*` | 总产量是否等于需求 |
| $a_l^{app}$ | `append_line_used_*` | 续排机组本轮是否被使用 |
| $z_{lt}$ | `previous_detail_after_*` 等 | 机组最近实际生产明细的编码，空闲桶保留前值；0 为首次生产前的哨兵 |
| $b_{gpt}$ | `feeder_material_*` | 喂丝机在该桶是否生产明细 $p$ |
| $\beta_p$ | `sync_all_stop_bucket_*` | 硬齐停公共末桶序号 |

边界由 `PackScheduleBoundarySupport` 按需定义：

$$
e_{plt}=x_{plt}(1-x_{pl,\operatorname{next}_l(t)}),\qquad
L_{pl}=\max_t (t+1)x_{plt},\qquad B_p=\max_l L_{pl}.
$$

不存在后桶时其生产状态视为 0。`endPosition(..., 0)` 返回 $L_{pl}-y_{pl}$，用于零基尾桶比较；`endPosition(..., 1)` 返回 $L_{pl}$。未使用机组的首位置映射为 0，求最小候选时另用周期末哨兵排除未生产桶。

### 2.4 目标辅助变量

前置空闲使用 `lineUsed`、`startedBy`、`leadingIdle`；机组协同使用启停差异和门控罚分；喂丝机集中度、启用偏好分别创建喂丝机—明细使用标记。齐开／齐停 pair、spread、全厂完工跨度和人员利用率也仅按实际目标前缀需要创建辅助模型。

这些定义等式仍须精确满足，但它们服务于软评分，不等于新增业务硬要求。文档不再将旧 `block*`、Circuit 弧、换牌位置变量列为当前正式变量。

## 3. 正式硬约束

### 3.1 单机单桶指派与正产量绑定（始终装配）

$$
\sum_p x_{plt}=u_{lt},\qquad x_{plt}\le q_{plt}\le C_{plt}x_{plt}.
\tag{H1}
$$

因此同一机组一桶至多生产一条明细，选中后至少生产 1 箱，不能以零产量占位。分别对应 `AssignmentConstraintBuilder`、`ProductionCapacityConstraintBuilder`。

### 3.2 单次启动、连续性与内部桶满产（始终装配）

在机组日历可用序列上，首个有效桶以前的生产状态取 0：

$$
s_{plt}=x_{plt}(1-x_{pl,\operatorname{prev}_l(t)}),\qquad
y_{pl}=\max_t x_{plt},\qquad \sum_t s_{plt}=y_{pl}.
\tag{H2}
$$

使用该明细—机组组合时必须且只能启动一次，形成 $0^*1^*0^*$；不允许有效空闲后重新启动同一明细，或转到其他明细后再返回。日历休息不算有效空闲。

若前、当前、后一个日历可用桶均有该明细生产：

$$
x_{pl,\operatorname{prev}_l(t)}=x_{plt}=x_{pl,\operatorname{next}_l(t)}=1
\Longrightarrow q_{plt}=C_{plt}.
\tag{H3}
$$

当前实现仅强制**内部桶**满产；首桶和尾桶仍受 H1，但不因此强制满产。单桶、双桶段也不能套用旧“普通首桶满产”公式。没有额外 Circuit 换牌结构或首桶换牌时长扣产能模型。

### 3.3 需求平衡与同物料计划顺序（始终装配）

$$
\sum_{l,t}q_{plt}=D_p.
\tag{H4}
$$

`MustFulfillDemandConstraintBuilder` 无条件装配需求等式，不允许超产或欠产，也没有欠产最小化变量。`must_fulfill_demand` 的配置／检查状态不能替代此实际装配行为。

同一物料的计划明细按 `productsSafe` 中的顺序，依次约束相邻前后明细 $p^-,p$：

$$
x_{plt}=1\Longrightarrow \sum_{l',\tau<t}q_{p^-l'\tau}\ge D_{p^-}.
\tag{H5}
$$

前序必须在当前桶**之前**全局完成，不能同桶完成后立即计为可转序。若同物料只有一条明细，此构建器不新增约束。

### 3.4 最大同时开台数（显式配置时装配）

$$
\sum_l u_{lt}\le K_t.
\tag{H6}
$$

`getMaxOpen(t)` 综合策略上限及日历可用设备数。只有实际正产量生产计开台；等待时间没有另一个占台状态。

### 3.5 交期窗口（显式配置并启用时装配）

对明细最早开始桶 $a_p$、最晚桶 $d_p$：

$$
q_{plt}=0\ (t\notin[a_p,d_p]),\qquad
\sum_{l,t\in[a_p,d_p]}q_{plt}=D_p^{due}.
\tag{H7}
$$

窗口内需求取 `dueDemandScaled`，同时仍满足 H4。正需求的空窗口保留常量约束，由求解器判不可行；不是自动取消需求。包含交期规则的模型在建变量时也裁剪窗口，较早诊断阶段保留未裁剪候选域。

### 3.6 喂丝机同桶单明细（关系启用时装配）

对过滤后至少有两台有效机组的喂丝机组：

$$
b_{gpt}=\max_{l\in\mathcal L_g}x_{plt},\qquad \sum_p b_{gpt}\le1.
\tag{H8}
$$

一致性按**计划明细**统计，不把同物料不同明细合并；允许关联机组空闲，并不强制所有机组同桶开停。只有一个候选明细时无需额外添加求和上限。

### 3.7 原明细全局完成前不转产（开关启用时装配）

设 $c_p$ 为明细编码，当前桶生产编码 $c_{lt}=\sum_pc_px_{plt}$；$z^-_{lt}$ 是机组最近一次生产的明细编码，空闲桶保留该状态。0 编码哨兵视为已完成、完成位置为 0。

$$
u_{lt}=1\land c_{lt}\ne z^-_{lt}
\Longrightarrow v_{z^-_{lt}}=1\land B_{z^-_{lt}}\le t.
\tag{H9}
$$

允许机组提前退出当前明细并等待，但转到下一明细前，原明细须在所有机组全局完成。实现通过 `addElement` 按编码选择完成标志和完成位置，不使用旧 Circuit 弧。H2 另行保证同一明细在该机组不重启；两者不是同一条约束，也不等同于按物料汇总的 ABA 检查。

### 3.8 跨月首段牌号（显式配置并启用时装配）

若机组 $l$ 上月末段物料为 $m_l^*$，且本期仍有该物料需求，令 $f^*_{lt}=\sum_{p:m(p)=m_l^*}x_{plt}$，$h^*_{lt}$ 为该物料已开始生产的前缀 OR：

$$
\sum_{p:m(p)=m_l^*}y_{pl}\ge1,\qquad
h^*_{lt}=\max_{\tau\le t} f^*_{l\tau},\qquad
x_{plt}\le h^*_{lt}\quad(m(p)\ne m_l^*).
\tag{H10}
$$

首个可排桶之前前缀固定为 0。强制物料未开工前，其他物料不能先在该机组生产；此规则本身不保证物料在首个可排桶开工。没有本期需求时跳过；仍有需求但缺可排桶、候选产能或变量时构建失败。

### 3.9 历史续排贴边（显式配置并启用时装配）

仅对有续排首桶的机组，定义 $a_l^{app}=1\iff\sum_{t\in\mathcal T_l^{cal}}u_{lt}\ge1$：

$$
a_l^{app}=1\Longrightarrow u_{l,f_l^{app}}=1.
\tag{H11}
$$

若续排首桶无生产变量则 $a_l^{app}=0$，该机组本轮不能被使用。对应当前 `append_start_continuity`，不套用旧 `history_start_continuity` 的装配说明。

### 3.10 硬齐停（显式配置 HARD 时装配）

同一明细实际使用的各机组共享零基尾桶：

$$
y_{pl}=1\Longrightarrow L_{pl}-y_{pl}=\beta_p.
\tag{H12}
$$

公共边界域取候选尾桶的并集；无公共候选尾桶的机组对不能同时使用。仅诊断模型添加 assumption 以定位不可行核心；正式模型直接生效。`Boundary.START` 保留兼容，但不施加硬齐开。`FACTORY_FIRST`、`EQUIPMENT_FIRST` 追加软齐停目标，不装配 H12。

### 3.11 首桶开工控制（开关启用时装配）

未启用最大同时开台约束时，后续任何桶生产都蕴含机组首个可排桶生产：

$$
u_{lt}=1\Longrightarrow u_{l,f_l}=1.
\tag{H13}
$$

启用最大同时开台约束时，复用第 4.4 节的前置空闲状态 $I_{lt}$，采用满台豁免：

$$
I_{lt}=1\Longrightarrow\sum_{l'}u_{l't}\ge K_t.
\tag{H14}
$$

结合 H6，等待首次开工时该桶必须已满台；只有开关启用才施加此硬规则。为其准备前置空闲辅助变量不等于自动加入前置空闲软目标。没有可排桶／相关变量的机组或桶按构建器分支跳过。

## 4. 软约束、业务目标与系统决胜项

所有目标均最小化。目标的定义辅助约束必须成立，但不要求软评分为 0。只有通过目录和规则校验、权重有效、原始上界及实际贡献为正的目标进入绑定。

### 4.1 最短完成时间：`makespan`

$$
C_l=\max_t E_tu_{lt},\qquad M=\max_l C_l,\qquad g_{mk}=M.
\tag{O1}
$$

无生产的机组完工偏移为 0；原始上界为 $E_{max}$。目标层实际最小化归一化系数乘 $M$，所以目标评分与实际分钟数仍需区分，但**没有**旧的“makespan 乘大常数再加产量前移”公式。单一正权重、业务 priority=1 的 makespan 层还添加产能推导的完工下界，并关闭 probing 以提速。

### 4.2 高速机优先：`speed_level_priority_control`

$$
g_{speed}=\sum_{p,l,t}\sigma_lq_{plt}.
\tag{O2}
$$

仅正惩罚项参与；上界为同一集合的 $\sum\sigma_l C_{plt}$。复用现有产量变量，不新建生产状态。

### 4.3 机组牌号优先：`brand_machine_priority`

基础业务规则在**同一 priority 层**展开三个分项，而非三层字典序优化：

$$
g_{P1}=\sum_{p:\exists\text{可用P1候选}}\sum_{l:\pi_{pl}\ne1}\sum_tq_{plt},\qquad
g_{priority}=\sum_{p,l,t}\rho_{pl}q_{plt}.
\tag{O3}
$$

P1 候选必须实际存在正产能及产量变量；没有可用 P1 的明细不计第一项。两项分别使用 `priorityLevel` 和 `priorityPenalty`，不能互相替代。

关联机组协同分项按“同明细、共享喂丝机的候选机组对”去重，记集合为 $\mathcal Q$。双方都实际使用时惩罚逐桶启动与结束事件差异：

$$
g_{coord}=\sum_{(p,l,r)\in\mathcal Q}y_{pl}y_{pr}
\sum_t\left(|s_{plt}-s_{prt}|+|e_{plt}-e_{prt}|\right).
\tag{O4}
$$

实现用 `addAbsEquality` 与布尔门控定义差异／罚分，不直接使用乘积表达式；原始上界为 $2|\mathcal T||\mathcal Q|$。未使用任一机组不计罚。逐机组对、逐桶、逐事件创建辅助变量，是模型增长的重要来源，不应描述为仅给已有产量变量加权。

三个分项分别归一化，并在有效分项之间共享原规则权重；同层其他业务目标仍按各自权重参与，见第 5.1 节。

### 4.4 前置空闲：`leading_idle_control`

对机组存在生产变量的桶序列，$a_l=\max_tu_{lt}$，$H_{lt}$ 为截至当前桶是否已经开工：

$$
H_{lt}=\max(H_{l,t^-},u_{lt}),\qquad
I_{lt}=a_l(1-H_{lt}),\qquad g_{leading}=\sum_{l,t}I_{lt}.
\tag{O5}
$$

前缀初值为 0；首个可排桶之前或没有首个可排桶时，前置空闲固定为 0。首次开工当前桶不算前置空闲；全期未使用机组不计。实现创建 `lineUsed`、`startedBy`、`leadingIdle` 并绑定逻辑。它不处罚首次开工后的内部等待。

### 4.5 人员利用率：`personnel_utilization_control`

仅显式配置正数 `max_simultaneous_machines` 时有正上界。令该**配置人员上限**为 $K$，逆序定义当前或未来是否仍有生产：

$$
R_T=0,\qquad R_t=\max(R_{t+1},\max_lu_{lt}),\qquad
g_{personnel}=\sum_t\left(KR_t-\sum_lu_{lt}\right).
\tag{O6}
$$

原始上界为 $K|\mathcal T|$。从全局首个生成桶计至最后生产桶，前置和中间空闲计分；完工后不计分。不是百分比，也不按实际桶分钟加权。此处采用配置 $K$，与硬约束的逐桶 $K_t$ 有区别。当前实现没有 `equipment_utilization_control` 的平方差额评分及其启用配置。

### 4.6 同明细少占机台：`product_line_spread_tiebreaker`

$$
g_{line}=\sum_{p,l}y_{pl}.
\tag{O7}
$$

按计划明细统计，非按聚合物料统计；策略显式配置后作为业务目标，不因名称带 tiebreaker 就自动追加系统层。

### 4.7 喂丝机集中度与喂丝机组启用偏好

$$
f_{gp}=\max_t b_{gpt},\quad g_{feeder}=\sum_{g,p}f_{gp};\qquad
h_{gp}=\max_{l\in\mathcal L_g}y_{pl},\quad g_{activation}=\sum_{g,p}h_{gp}.
\tag{O8}
$$

`feeder_material_concentration` 复用 H8 的桶级 presence，按跨桶 OR 统计喂丝机—明细对。`feeder_group_activation` 直接从机组使用状态统计喂丝机组—明细对。两项上界分别按实际可创建的对数量计算，都不是启停次数或强制一起开停。

喂丝机关系启用、且对应项未显式配置时，按集中度、启用偏好顺序自动追加系统层；无有效上界的层在绑定时跳过。组启用项当前不在正式策略目标准入白名单，其主要正式入口是自动系统层。

### 4.8 齐开／齐停系统偏好

对同一明细的候选机组对，$same_{plr}=1$ 当且仅当两台实际使用且边界位置一致。设候选对总数为 $N_{pair}$：

$$
g_{pair}=N_{pair}-\sum_{p,l<r}same_{plr},\qquad
g_{spread}=\sum_p\left(\max_{l:y_{pl}=1}b_{pl}-\min_{l:y_{pl}=1}b_{pl}\right).
\tag{O9}
$$

无实际使用机组时跨度为 0；未使用机组通过哨兵排除出最小值。$b$ 为开工桶或末生产桶的零基位置。pair 项是“候选对总数减齐边界对数”，未共同使用的候选对也留下常数罚分，不能误写成只统计双方实际生产的不齐对数。

全厂齐停另以自然时间分钟定义：

$$
g_{factory}=\max_l C_l-\min_{l:\sum_tu_{lt}>0}C_l.
\tag{O10}
$$

全厂跨度构建器自建完工变量，不依赖必须配置 makespan；全期无生产时为 0。各模式追加次序见第 5.2 节。跨度偏好不能等同于硬齐停承诺。

## 5. 权重、分层目标与求解机制

### 5.1 目标准入与整数归一化

构题将业务权重取整为 $w_k=\operatorname{round}(w_k^{cfg})$，非正值过滤。规则须在目录中注册、类型与引擎适用，且通过 `PackScheduleObjectiveRuleValidator` 白名单；枚举中存在的键不一定可由策略启用。

对层 $j$，有效项原始上界为 $U_k>0$，分母 $d_k$ 包括配置分母及同规则有效分项数量；牌号优先只在有正上界的分项间共享权重。取公共整数精度倍数：

$$
P_j=\max\left(1,\max_k\left\lceil\frac{100U_k\max(1,d_k)}{10000w_k}\right\rceil\right),\qquad
\widehat w_k=\max\left(1,\operatorname{round}\frac{10000w_kP_j}{U_k\max(1,d_k)}\right),\qquad
Z_j=\sum_k\widehat w_kg_k.
\tag{L1}
$$

同层整体放大精度，使正系数取整误差受控；不是给某一项额外提高业务优先级。绑定时跳过无上界／无贡献项，空层不求解，检查整数溢出并调用模型校验。日志中的整数 `normalizedWeight` 才是实际系数。

### 5.2 真实层顺序与锁定

1. 业务 priority 升序，同 priority 合成 `priority_<n>`；牌号优先三个分项也留在该层。正式构题未配置 priority 使用 `Integer.MAX_VALUE`，直接构造空 priority term 时描述层回退为 1000。
2. `HARD` 齐停模式先追加齐开 pair、齐开 spread：`sync_boundary_pair_tiebreaker`、`sync_boundary_spread_tiebreaker`。
3. 喂丝机关系启用时，按条件追加 `feeder_material_concentration_tiebreaker`、`feeder_group_activation_tiebreaker`。
4. `FACTORY_FIRST` 最后追加 `factory_sync_stop_spread` → `equipment_sync_stop_pair` → `equipment_sync_stop_spread`；`EQUIPMENT_FIRST` 只追加后两层。其他模式不追加这组软齐停层。

系统层按列表追加位置执行，不按名称或其数值 priority 重新穿插进业务层。默认前置空闲系统层、活跃生产桶系统层的追加调用已注释。

对已求解层值 $Z_j^*$，当前 `ObjectiveLock` 的行为是：

$$
Z_j=Z_j^*\quad(\text{OPTIMAL}),\qquad
Z_j\le Z_j^*\quad(\text{FEASIBLE}).
\tag{L2}
$$

`OPTIMAL` 可能仅代表满足求解器的 gap 容差，不能因此宣称数学上零间隙最优；实现仍按该状态等式锁定。后续层重建全新模型，只绑定截至当前层的目标前缀，按原始层索引重建锁定，不跨模型复用旧变量句柄。锁定对象是整层加权评分，不是各分项分别锁定。

### 5.3 完整种子、阶段提示与失败回退

- 优化前先取得业务硬约束可行种子。根据配置选择完整冷启动或逐阶段累加；阶段已有同类型构建器时复用，注册列表缺失时回退默认构建器，不能静默跳过产能等基础规则。
- 阶段可行时按能力复用排程变量提示；重试时是否清空提示按阶段控制。约束未变的阶段可以复用上一结果，但早期放松阶段可行不能直接作为完整排产成功。
- 分阶段种子结束时，以完整业务约束计划检查最终阶段的构建器覆盖；仅排除 makespan 辅助定义。缺少业务构建器直接失败。
- 普通目标层得到 FEASIBLE 可上界锁定继续；UNKNOWN 或后续预算不足时，回退最近已确认满足完整业务硬约束的解。没有完整可行种子时，超时不能当作可行。
- INFEASIBLE 是已证明不可行，MODEL_INVALID 等按失败处理。返回时还进行等待原因验收；`unexplained` 表示等待原因未被诊断解释，不应直接当作某条求解硬约束违规或已证明可消除。

### 5.4 共享预算与 priority=1 gap 验收

`CpSatTimeBudget` 使用单调时钟，建模、提示复制、搜索和同预算内导出等开销都会扣减总预算。普通层按层级限制、单次限制及剩余预算分配实际时限；以阶段日志的实际分配为准，不把配置字段值一律当成每次调用的上限。

仅**非系统、业务 priority=1** 的目标层强制验收：

$$
\operatorname{gap}=\frac{|Z-\operatorname{bestBound}|}{\max(1,|Z|)}\le\texttt{relativeGapLimit}.
\tag{L3}
$$

该层使用全部剩余总预算，不受普通单层／单次时限截短。建模／分配前无预算、UNKNOWN，或虽有可行解但 gap 未达标，均失败，不能降级为排产成功。此规则不取决于层名称或它是否恰好第一个执行，也适用于 priority=1 的混合业务目标层。后续普通层允许近似接受；最终显示的单层 gap 不能充当所有业务目标或工期的统一误差。

### 5.5 单一 makespan 层的停滞搜索重启

仅对非系统、业务 priority=1、单一正权重 makespan 层启用。每次尝试使用同一目标模型、共享原总预算；取得本次可行解后开始计时，严格改善本次目标值才重置计时。下界改善不重置目标停滞时间。

- 合并已获得的最好可行目标与有效下界；达到 gap 即停止。
- 目标停滞至少 120 秒、且剩余预算严格大于 120 秒时，停止本次搜索再尝试。尚无本次可行解时不触发该停滞停止。
- 下一尝试清空旧提示，使用最好排程解重新提示，随机种子按基础值加尝试序号并循环到合法非负范围；重新分配剩余预算。
- 保留最好解及对应求解器句柄，独立汇总同一模型各尝试的最大有效下界；UNKNOWN 不覆盖已有可行解。已有可行解后再次返回 INFEASIBLE 视为异常。
- 达到 gap、不是因停滞而停止、或预算耗尽时退出尝试循环，再做 priority=1 验收，不伪造 OPTIMAL 状态。

这是**搜索重启**；生产重启指机组空闲后再生产，受 H2 等规则影响，两者不能混称。

## 6. 已注册、保留或不可达能力

| 能力／键 | 当前正式口径 |
| --- | --- |
| `changeover_control`、`restart_gap_control` | 目录／枚举保留，但不在正式目标白名单，目标分派也不构建对应评分；不能因策略配置了这些键就宣称生效 |
| 旧 Circuit、块换牌、首桶扣产能 | 当前正式装配链及相应旧构建器已移除；不可沿用旧模型公式 |
| `full_bucket_before_tail` | 旧开关不能代表当前独立构建器；实际内部满产由 `ProductionCapacityConstraintBuilder` 的 H3 实现 |
| `no_gap_between_blocks`、`changeover_structure_control` | 策略检查返回未启用，不增加旧块间结构；不等同于 H2 的同明细单次启动 |
| `brand_plan_qty_priority` | 软评分及硬构建器有保留代码，基础软键不在正式目标准入，硬构建器不在正式装配链；不作为正式规则 |
| `demand_fulfillment` | 不在正式目标白名单；需求由 H4 等式保证，不进行欠产最小化 |
| `sync_start` | 不施加硬齐开；HARD 齐停后的系统齐开偏好仍可能追加 |
| `equipment_utilization_control` | 当前目录、枚举和评分实现不支持；使用第 4.5 节实际存在的人员利用率口径 |
| `active_production_bucket_tiebreaker` | 有内部构建器／分派，自动追加调用已注释，不在正式策略白名单 |
| 默认前置空闲系统层 | 自动追加调用已注释；显式 `leading_idle_control` 和首桶硬规则按各自条件生效 |
| 其他上下文历史槽位 | 未由正式装配／当前前缀创建的变量，不当作已生效规则 |

保留实现不构成当前可行域或目标。阶段枚举、目录展示、类注释和独立单元测试中可直接调用的分支，应与正式入口装配区分。文档不把尚不存在的实现或旧日志行为解释成当前能力。

## 7. 源码追溯与核验

### 7.1 正式装配顺序

指派 → 产能／单次启动／内部满产 → 需求等式 → 可选续排贴边 → 可选开台上限 → 可选交期 → 可选喂丝机一致性 → 同物料计划顺序 → 可选原明细完成前禁止转产 → 可选跨月首段 → 可选硬齐停 → 可选首桶开工 → 完工辅助定义。

正式约束计划与阶段诊断共用装配入口。实际是否新增约束，还取决于适用数据、候选变量、开关及当前目标前缀。目标辅助变量按前缀需求创建，不能用一次服务器日志的变量／约束数量定义所有实例规模。

### 7.2 求解文件与日志

配置 `exportModelDir` 后，按一次运行的 `runId` 创建目录，每次真实求解在独立尝试子目录保存：

| 文件 | 内容 |
| --- | --- |
| `model.pb` | 参数、提示及当前模型准备完成后的实际 CP 模型 |
| `var_map.txt` | 变量索引、名称与域，用于解释响应中的变量值 |
| `parameters.pbtxt` | 实际求解参数，包括该次时限、随机种子及最终日志参数 |
| `response.pb` | 求解器原始响应、状态及可用的完整变量赋值 |

导出发生在实际 solve 前后；响应先保存，再进行可能抛异常的 gap 验收。重试、局部尝试、并发运行不会共用一个覆盖目录；导出失败仅告警，不改变排产结果。重启跨尝试汇总的最好解／下界与每次原始响应需分别读取，不能把某个响应直接当作整个运行汇总。

日志包含建模阶段变量／约束增量、线性项数量、目标前缀、归一化权重、阶段时限及剩余预算、求解状态、分支／冲突、阶段耗时与等待验收。建模耗时、求解器 walltime 和请求总耗时不是同一个指标；`availableProcessors`、JVM 最大堆及配置线程数也不是实测 CPU／内存使用量。

最终 `PackScheduleSolutionMapper` 会依据返回排程重算各层分项实际值及加权贡献；此前 FEASIBLE 上界锁定的目标可能在后续层进一步改善。因此“该层结束时评分”“锁定阈值”“最终排程的该层评分”须分别读取，原始响应的下界仍只属于对应模型／目标。

### 7.3 源码索引与核验边界

下表链接相对本文；数学公式按当前工作区实现静态核对，不代表已运行服务器排产或 Maven 验证。整箱、小时桶、自然分钟偏移和日历压缩均会影响结果。求解状态必须结合 gap、目标层及回退标志解读。

| 文件／构建器 | 对应内容 |
| --- | --- |
| [PackScheduleProblemBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleProblemBuilder.java) | 离散化、整数化、构题与规则过滤 |
| [PackScheduleVariableBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/PackScheduleVariableBuilder.java) | 第 2 节核心稀疏变量 |
| [PackScheduleModelContext](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleModelContext.java) | 变量登记及共享状态 |
| [PackScheduleBoundarySupport](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleBoundarySupport.java) | 首尾事件与位置 |
| [PackScheduleConstraintPlanBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleConstraintPlanBuilder.java) | 正式／阶段装配与完整种子覆盖检查 |
| [PackScheduleConstraintPolicy](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleConstraintPolicy.java) | 配置检查口径 |
| [AssignmentConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/AssignmentConstraintBuilder.java) | H1 指派 |
| [ProductionCapacityConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/ProductionCapacityConstraintBuilder.java) | H1—H3 正产量、单次启动及内部满产 |
| [MustFulfillDemandConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MustFulfillDemandConstraintBuilder.java) | H4 需求等式 |
| [SameMaterialPlanOrderConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SameMaterialPlanOrderConstraintBuilder.java) | H5 同物料明细顺序 |
| [MaxSimultaneousMachinesConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MaxSimultaneousMachinesConstraintBuilder.java) | H6 开台上限 |
| [DueDateConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/DueDateConstraintBuilder.java) | H7 窗口 |
| [FeederMaterialConsistencyConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/FeederMaterialConsistencyConstraintBuilder.java) | H8 喂丝机一致性 |
| [ForbidReturnToFinishedMaterialConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/ForbidReturnToFinishedMaterialConstraintBuilder.java) | H9 明细全局完成前不转产 |
| [MatMonthContinueConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/MatMonthContinueConstraintBuilder.java) | H10 跨月首段 |
| [AppendStartContinuityConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/AppendStartContinuityConstraintBuilder.java) | H11 续排贴边 |
| [SynchronizedBoundaryConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SynchronizedBoundaryConstraintBuilder.java) | H12 硬齐停 |
| [FirstBucketStartConstraintBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/FirstBucketStartConstraintBuilder.java) | H13—H14 首桶开工 |
| [MakespanObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/objective/MakespanObjectiveBuilder.java) | O1 完工时间与产能下界 |
| [SpeedLevelPriorityObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/SpeedLevelPriorityObjectiveBuilder.java) | O2 速度 |
| [BrandMachinePriorityObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/BrandMachinePriorityObjectiveBuilder.java) | O3 牌号优先 |
| [MachineCoordinationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/MachineCoordinationObjectiveBuilder.java) | O4 关联机组协同 |
| [LeadingIdleObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/LeadingIdleObjectiveBuilder.java) | O5 前置空闲 |
| [PersonnelUtilizationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/PersonnelUtilizationObjectiveBuilder.java) | O6 人员利用率 |
| [ProductLineSpreadObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/ProductLineSpreadObjectiveBuilder.java) | O7 机组占用数 |
| [FeederMaterialConcentrationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/FeederMaterialConcentrationObjectiveBuilder.java) | O8 喂丝机集中度 |
| [FeederGroupActivationObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/FeederGroupActivationObjectiveBuilder.java) | O8 喂丝机组启用 |
| [SynchronizedBoundaryPreferenceBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/hard/SynchronizedBoundaryPreferenceBuilder.java) | O9 pair／spread，虽在 hard 包但构建软评分 |
| [FactorySyncStopPreferenceBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/constraint/soft/FactorySyncStopPreferenceBuilder.java) | O10 全厂完工跨度 |
| [PackScheduleObjectiveBuilder](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleObjectiveBuilder.java) | L1 归一化、目标前缀与系统层顺序 |
| [ObjectiveLock](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/ObjectiveLock.java) | L2 锁定 |
| [PackScheduleObjectiveRuleValidator](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleObjectiveRuleValidator.java) | 正式业务目标白名单 |
| [CpSatTimeBudget](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/CpSatTimeBudget.java) | 共享预算与实际时限分配 |
| [CpSatSearchRestart](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/CpSatSearchRestart.java) | 停滞搜索重启及跨尝试结果 |
| [CpSatRunArtifacts](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/CpSatRunArtifacts.java) | 逐运行／尝试导出 |
| [PackScheduleSolverConfig](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/config/PackScheduleSolverConfig.java) | 默认求解参数与可配置字段 |
| [PackScheduleCpSatService](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleCpSatService.java) | 完整求解、验收、回退与日志 |
| [PackScheduleSolutionMapper](../factory-production-application/src/main/java/ys/project/sdyth/factory/production/application/schedule/cpsat/PackScheduleSolutionMapper.java) | 结果映射及目标层展示 |
