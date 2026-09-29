---
title: 卷包智能排产CP-SAT完整数学模型
createTime: 2026/09/29 21:53:56
permalink: /article/f8x8avvi/
---
# 卷包智能排产 CP-SAT 完整数学模型

## 1. 范围与建模口径

本文档把智能排产接口中策略码 `CP` 实际调用的卷包 CP-SAT 代码转写为数学模型。模型以当前工作区中的 `PackScheduleProblemBuilder`、`PackScheduleVariableBuilder`、`PackScheduleCpSatService.buildConstraintPlan`、各约束构建器及 `PackScheduleObjectiveBuilder` 为依据。

下列内容不在本文档范围内：

- 滤棒、制丝的独立 CP 模型；
- GA、MILP 求解路径；
- 结果落库、时间坐标平移、甘特图合并等求解后处理；
- 源码中存在但没有被当前正式调用链装配的构建器。

CP-SAT 只接受整数变量与整数约束。数量单位为整箱，换牌及完工时间单位为分钟。文中的“产品 $p$”特指一条订单计划明细 `scheduleOrderPlanDetailId`；物料／牌号由 $m(p)$ 单独表示。因此，同一物料的多条计划明细是不同的决策对象。

## 2. 时间、产能与数量离散化

### 2.1 全局时间桶

对每个工作日，先汇总所有机组的有效开台窗口，取当日最早开始时刻到最晚结束时刻的并集外包区间，再按 1 小时切分为全局时间桶。末尾不足 1 小时时保留尾桶。设

$$
\mathcal T=\{0,1,\ldots,T-1\}
\tag{1}
$$

为全局有序时间桶集合。对机组 $l$，只有日历可用且分配到正有效工时的桶才进入

$$
\mathcal T_l^{\mathrm{cal}}=\{t\in\mathcal T:A_{lt}=1\}.
\tag{2}
$$

$A_{lt}$ 是日历可用参数。机组的净有效工时被视为从开台窗口起点向后连续发生；损耗与日常停机统一落在窗口末尾。历史续排边界会先截断可用窗口。

### 2.2 整箱需求与桶产能

对计划明细 $p$，待排需求 $D_p$ 必须本身为整箱：

$$
D_p=\operatorname{round}(d_p),\qquad
|d_p-D_p|\le \varepsilon,\qquad D_p\in\mathbb Z_+.
\tag{3}
$$

如果原始需求不是整数，构题阶段直接拒绝建模，不会在 CP-SAT 内四舍五入。

设 $v_{lm}$ 为机组 $l$ 生产物料 $m$ 的小时能力，$H_{ld}$ 为机组在工作日 $d$ 的净有效工时。当日总能力先向上取整：

$$
C^{\mathrm{day}}_{pld}
=\left\lceil v_{l,m(p)}H_{ld}-\varepsilon\right\rceil.
\tag{4}
$$

随后按桶有效工时比例取整分配，余数优先从早到晚补入，保证

$$
\sum_{t\in\mathcal T_{ld}}C_{plt}=C^{\mathrm{day}}_{pld},
\qquad C_{plt}\in\mathbb Z_+.
\tag{5}
$$

只对正产能组合创建产品决策变量：

$$
\Omega=\{(p,l,t): A_{lt}=1,\ C_{plt}>0\},
\qquad
\mathcal U=\{(l,t):\exists p,(p,l,t)\in\Omega\}.
\tag{6}
$$

不在 $\Omega$ 中的产品—机组—时间桶组合按常量 0 处理，不创建 $x$、$q$、$s$、$e$ 变量。

## 3. 集合、参数与索引

### 3.1 集合

| 符号 | 含义 |
| --- | --- |
| $\mathcal P$ | 待排订单计划明细集合 |
| $\mathcal M$ | 物料／牌号集合 |
| $\mathcal P_m=\{p:m(p)=m\}$ | 属于物料 $m$ 的计划明细，已按交期、明细 ID 排序 |
| $\mathcal L$ | 卷包机组集合 |
| $\mathcal T$ | 全局有序时间桶集合 |
| $\mathcal T_l^{\mathrm{cal}}$ | 机组 $l$ 的日历可用桶集合 |
| $\Omega$ | 正产能的稀疏决策组合集合 |
| $\mathcal B_l=\{(p,l):\exists t,(p,l,t)\in\Omega\}$ | 机组 $l$ 上的候选计划明细生产块 |
| $\mathcal G$ | 有效喂丝机组集合 |
| $\mathcal L_g$ | 喂丝机 $g$ 关联的机组集合 |

### 3.2 主要参数

| 符号 | 含义 |
| --- | --- |
| $D_p$ | 计划明细 $p$ 的整箱待排需求 |
| $C_{plt}$ | $p$ 在 $l,t$ 上的整箱名义产能上界 |
| $h_{lt}$ | $l,t$ 在机组有效时间轴上的工时分钟数 |
| $E_t$ | 时间桶 $t$ 的自然结束时刻相对全局起点的分钟偏移 |
| $K_t$ | 时间桶 $t$ 允许同时生产的最大机组数 |
| $a_p,b_p$ | $p$ 的最早开始桶与交期桶 |
| $f_l$ | 机组 $l$ 在当期的首个正产能桶 |
| $f_l^{\mathrm{app}}$ | 历史续排机组 $l$ 的续排首桶 |
| $\tau_{ij}$ | 从块 $i$ 的物料切换到块 $j$ 的换牌分钟数 |
| $\pi_{pl}$ | 机组 $l$ 对明细 $p$ 所属物料的配置优先级，1 为 P1 |
| $\rho_{pl}$ | 由配置优先级导出的非负惩罚系数 |
| $\sigma_l$ | 机组速度惩罚：高速 0、中速 1、低速或未知 2 |

## 4. 决策变量

### 4.1 核心变量

| 变量 | 取值 | 含义 |
| --- | --- | --- |
| $x_{plt}$ | $\{0,1\}$ | 明细 $p$ 是否在机组 $l$ 的桶 $t$ 产生正产量 |
| $q_{plt}$ | $\{0,\ldots,C_{plt}\}$ | 明细 $p$ 在 $l,t$ 的整箱产量 |
| $u_{lt}$ | $\{0,1\}$ | 机组 $l$ 在桶 $t$ 是否有任何生产 |
| $y_{pl}$ | $\{0,1\}$ | 明细 $p$ 在当期是否使用机组 $l$ |
| $s_{plt}$ | $\{0,1\}$ | $p$ 在 $l$ 上的连续块是否从桶 $t$ 开始 |
| $e_{plt}$ | $\{0,1\}$ | $p$ 在 $l$ 上的连续块是否在桶 $t$ 结束 |

### 4.2 生产块与换产辅助变量

对块 $i=(p,l)\in\mathcal B_l$ 定义：

| 变量 | 含义 |
| --- | --- |
| $z_i$ | 块 $i$ 是否被使用 |
| $o_i^S,o_i^E$ | 块首、块尾在机组有效桶序列中的紧凑序号 |
| $S_i,E_i$ | 块首、块尾在机组有效工时轴上的分钟时刻 |
| $Q_i^F,C_i^F,H_i^F$ | 块首桶的产量、名义产能、有效分钟数 |
| $\gamma_{ij}$ | 在机组 $l$ 上块 $i$ 是否紧邻块 $j$ |
| $\phi_i,\psi_i$ | 块 $i$ 是否为机组首块、末块 |
| $\mu_i$ | 块 $i$ 的前序块是否与它属于不同物料 |
| $\lambda_i$ | 块 $i$ 是否因正换牌时长发生首桶产能损失 |
| $R_i$ | 进入块 $i$ 首桶后仍需消耗的换牌分钟数 |
| $v_l$ | 换产 Circuit 中机组 $l$ 是否被使用 |

### 4.3 其他辅助变量

| 变量 | 含义 |
| --- | --- |
| $F_p$ | 明细 $p$ 是否已完成全部需求 |
| $L^E_{pl},G^E_p$ | $p$ 在机组 $l$ 上的结束桶位置及其全局最晚结束位置 |
| $m_{gpt}$ | 喂丝机 $g$ 在桶 $t$ 是否供给计划明细 $p$ |
| $\beta_p^S,\beta_p^E$ | 齐开、齐停的公共边界桶 |
| $\ell_l,B_{lt},I_{lt}$ | 机组是否最终使用、截止桶 $t$ 是否已开工、桶 $t$ 是否属于前置空闲 |
| $C_l^{\mathrm{end}},M$ | 机组最终完工分钟及全局 makespan |
| $f_{gp}$ | 喂丝机 $g$ 在本期是否供给过明细 $p$ |
| $a_l^{\mathrm{app}}$ | 历史续排机组 $l$ 在本期是否实际生产 |
| $w_i^{\mathrm{multi}}$ | 块 $i$ 是否跨越至少两个有效桶 |
| $r_{lt}^{-},R_{lt}^{-}$ | 跨月指定物料在桶 $t$ 的生产标识及其前缀 OR |
| $d^r_{pl_1l_2t},D^r_{pl_1l_2}$ | 两台机组的同步边界是否在同一桶、是否存在同桶边界 |
| $\operatorname{pos}_{pl}^r$ | 明细 $p$ 在机组 $l$ 上的开始或结束边界位置 |

当未配置前置空闲目标时，$\ell_l,B_{lt},I_{lt}$ 不创建。当未启用喂丝机关系时，$m_{gpt},f_{gp}$ 不创建。

## 5. 基础生产约束

### 5.1 单机单桶指派与产量

对每个 $(l,t)\in\mathcal U$：

$$
\sum_{p:(p,l,t)\in\Omega}x_{plt}=u_{lt}\le 1.
\tag{7}
$$

因为 $u_{lt}$ 是布尔变量，等式已表示同一机组、同一桶最多安排一条计划明细。产量与生产标识严格关联：

$$
x_{plt}\le q_{plt}\le C_{plt}x_{plt},
\qquad\forall(p,l,t)\in\Omega.
\tag{8}
$$

因此 $x_{plt}=1$ 时至少生产 1 箱，不允许用零产量占位制造伪连续块。

### 5.2 块首、块尾与机组使用

沿机组日历可用桶序列定义前驱 $\operatorname{prev}_l(t)$ 和后继 $\operatorname{next}_l(t)$。可用但对明细 $p$ 无产能的桶视为 $x=0$，并截断连续块：

$$
\begin{aligned}
s_{plt}&=x_{plt}\bigl(1-x_{pl,\operatorname{prev}_l(t)}\bigr),\\
e_{plt}&=x_{plt}\bigl(1-x_{pl,\operatorname{next}_l(t)}\bigr).
\end{aligned}
\tag{9}
$$

首个有效桶取 $s_{plt}=x_{plt}$，最后一个有效桶取 $e_{plt}=x_{plt}$。代码使用等价的布尔蕴含和 `BoolOr` 线性化表达式 (9)。

明细—机组使用标识为

$$
y_{pl}=1\iff \sum_{t:(p,l,t)\in\Omega}x_{plt}\ge1.
\tag{10}
$$

### 5.3 机组首桶开工

这是当前正式模型的无条件基础约束，不依赖策略开关。对机组 $l$ 的任意后续可生产桶：

$$
u_{lt}\le u_{l f_l},
\qquad \forall t\in\mathcal U_l\setminus\{f_l\}.
\tag{11}
$$

即机组只要在当期任一桶生产，其当期首个正产能桶必须生产。

### 5.4 历史续排首段贴边

对有历史任务且当期需续排的机组定义 $a_l^{\mathrm{app}}\in\{0,1\}$：

$$
a_l^{\mathrm{app}}=1
\iff
\sum_{t\in\mathcal U_l}u_{lt}\ge1,
\tag{12}
$$

$$
a_l^{\mathrm{app}}\le u_{l f_l^{\mathrm{app}}}.
\tag{13}
$$

如果续排首桶没有 $u$ 变量，则强制 $a_l^{\mathrm{app}}=0$，即该机组本轮不能在更晚的桶重新启动。

### 5.5 需求上界与必须完成

当前模型没有“欠产量”决策变量。所有模式都不允许超产：

$$
\sum_{(l,t):(p,l,t)\in\Omega}q_{plt}\le D_p,
\qquad\forall p\in\mathcal P.
\tag{14}
$$

仅当 `must_fulfill_demand` 在硬约束配置中显式存在且值为真时，收紧为

$$
\sum_{(l,t):(p,l,t)\in\Omega}q_{plt}=D_p,
\qquad\forall p\in\mathcal P.
\tag{15}
$$

### 5.6 最大同时开台数

仅当 `max_simultaneous_machines` 在硬约束中显式配置时生效：

$$
\sum_{l:(l,t)\in\mathcal U}u_{lt}\le K_t,
\qquad\forall t\in\mathcal T.
\tag{16}
$$

$K_t$ 已预先截断为配置值与当桶可用机组数两者的较小值。

## 6. 顺序、连续性与完成状态

### 6.1 同物料计划明细顺序

对同一物料中按交期、明细 ID 排序的相邻计划 $p^-\prec p$，后序计划在桶 $t$ 的任一机组上生产前，前序计划必须已在更早桶全部完成：

$$
x_{plt}=1
\Longrightarrow
\sum_l\sum_{\tau<t}q_{p^-l\tau}\ge D_{p^-}.
\tag{17}
$$

本约束作用于“后序明细的任一生产桶”，并非只检查块开始标识。因此不允许同物料的前后明细在同一桶并行生产。

### 6.2 单明细单机组至多一个连续块

默认 `ATMOST_ONE` 模式直接限制

$$
\sum_{t:(p,l,t)\in\Omega}e_{plt}\le1,
\qquad\forall(p,l)\in\mathcal B_l.
\tag{18}
$$

与式 (9) 联立后，$x_{plt}$ 只能形成 $0^*1^*0^*$ 序列。求解配置还支持两种等价建模实现：

- `SEQUENTIAL`：使用“截止当前桶是否已启动”的单调前缀状态，禁止第二次 $s_{plt}=1$；
- `AUTOMATON`：使用三状态自动机约束 $0^*1^*0^*$，对日历可用但无该明细产能的桶显式填入常量 0。

### 6.3 完成标识与“未完成前不切走”

明细完成标识由需求上界唯一确定：

$$
F_p=1
\iff
\sum_{l,t}q_{plt}=D_p.
\tag{19}
$$

对明细 $p$ 在机组 $l$ 上的最后生产位置定义

$$
\begin{aligned}
\sum_t e_{plt}&=y_{pl},\\
L^E_{pl}&=\sum_t(t+1)e_{plt},\\
G^E_p&=\max_l L^E_{pl}.
\end{aligned}
\tag{20}
$$

令 $\bar t_{pl}$ 为 $p$ 在 $l$ 上最后一个正产能桶，则当前模型同时施加

$$
y_{pl}=1,\ e_{pl\bar t_{pl}}=0
\Longrightarrow
L^E_{pl}=G^E_p,
\tag{21}
$$

$$
y_{pl}=1
\Longrightarrow
e_{pl\bar t_{pl}}=1\ \lor\ F_p=1.
\tag{22}
$$

含义是：机组如果在自身尚有后续产能时退出该明细，则明细必须已全局完成，且该机组必须在该明细的全局最后生产位置退出。如果已到该机组对此明细的最后产能桶，则允许未完成退出。

## 7. 前满后尾约束

当前实现分两阶段装配该约束：换产结构前加入内部桶满产，换产结构后再补充普通多桶块首桶满产。

### 7.1 内部桶满产

$$
q_{plt}+C_{plt}e_{plt}+C_{plt}s_{plt}
\ge C_{plt}x_{plt},
\qquad\forall(p,l,t)\in\Omega.
\tag{23}
$$

因此，只有连续块的首桶或尾桶可暂时不满；非首非尾的生产桶必须满产。

### 7.2 普通多桶块首桶满产

定义 $w_i^{\mathrm{multi}}\in\{0,1\}$：

$$
w_i^{\mathrm{multi}}=1
\iff o_i^E-o_i^S\ge1.
\tag{24}
$$

对非换牌的普通多桶块：

$$
z_i=1,\ \mu_i=0,\ w_i^{\mathrm{multi}}=1
\Longrightarrow
Q_i^F=C_i^F.
\tag{25}
$$

换牌块首桶不使用式 (25)，其可用产能由第 8 节的换牌剩余分钟约束确定。单桶块允许因需求尾量不满产。

## 8. 换产 Circuit 与首桶产能

### 8.1 机组有效工时轴

对机组 $l$，将 $\mathcal T_l^{\mathrm{cal}}$ 中的桶按全局顺序排列为 $t_l(0),\ldots,t_l(n_l-1)$，只累加各桶净有效工时：

$$
\alpha_{lk}=\sum_{r<k}h_{l,t_l(r)},
\qquad
\eta_{lk}=\alpha_{lk}+h_{l,t_l(k)}.
\tag{26}
$$

自然日之间的休息、停机和日历断档不计入这条有效工时轴。

### 8.2 块属性推导

对块 $i=(p,l)$，令 $k$ 表示机组有效桶紧凑序号，则

$$
\begin{aligned}
z_i&=\sum_k e_{p,l,t_l(k)},\\
o_i^E&=\sum_k k\,e_{p,l,t_l(k)},\\
o_i^S&=o_i^E-\sum_k x_{p,l,t_l(k)}+z_i.
\end{aligned}
\tag{27}
$$

依据紧凑序号使用 Element 约束取得

$$
\begin{aligned}
S_i&=\alpha_{l,o_i^S},\\
E_i&=\sum_k\eta_{lk}e_{p,l,t_l(k)},\\
Q_i^F&=q_{p,l,t_l(o_i^S)},\\
C_i^F&=C_{p,l,t_l(o_i^S)},\\
H_i^F&=h_{l,t_l(o_i^S)}.
\end{aligned}
\tag{28}
$$

未使用块的首尾序号保持在变量域内，但通过 Circuit 自环与 $z_i=0$ 不参与真实序列。

### 8.3 Circuit 块序列

为每台机组增加虚拟节点 0，并对下列弧施加一个 `Circuit` 约束：

$$
\Gamma_l=
\{(0,0,1-v_l)\}
\cup\{(i,i,1-z_i)\}
\cup\{(0,i,\phi_i),(i,0,\psi_i)\}
\cup\{(i,j,\gamma_{ij}):i\ne j\}.
\tag{29}
$$

其中

$$
v_l=1\iff\sum_{i\in\mathcal B_l}z_i\ge1,
\qquad
\operatorname{Circuit}(\Gamma_l).
\tag{30}
$$

Circuit 使已使用块形成唯一的线性前后序；未使用块通过自环退出序列。对候选弧 $i\to j$，当块首尾时间范围预先证明该方向不可能时，代码不创建 $\gamma_{ij}$。

### 8.4 弧级换牌时序

对所有真实候选弧 $i\to j$：

$$
\gamma_{ij}=1
\Longrightarrow
0\le S_j-E_i\le\tau_{ij},
\tag{31}
$$

$$
\gamma_{ij}=1
\Longrightarrow
E_i+\tau_{ij}\le S_j+H_j^F.
\tag{32}
$$

式 (31) 不要求块间空闲覆盖全部换牌时长；它限制块间空闲不得超过换牌时长。式 (32) 要求剩余换牌时间能在目标块首桶内消耗完。

对目标块 $j$ 定义

$$
R_j=
\begin{cases}
\tau_{ij}+E_i-S_j,&\gamma_{ij}=1,\ m(i)\ne m(j),\ \tau_{ij}>0,\\
0,&\phi_j=1\text{ 或 }z_j=0\text{ 或无正换牌时长}.
\end{cases}
\tag{33}
$$

由式 (31)—(32) 可知 $0\le R_j\le H_j^F$。

### 8.5 换牌事件与首桶可用产能

对块 $j$：

$$
\mu_j=\sum_{i:m(i)\ne m(j)}\gamma_{ij},
\qquad
\lambda_j=\sum_{i:m(i)\ne m(j),\ \tau_{ij}>0}\gamma_{ij}.
\tag{34}
$$

对块 $j$ 的候选首桶 $t$，当 $\lambda_j=1$ 且 $s_{p(j),l,t}=1$ 时，施加整数化的产能上界：

$$
h_{lt}q_{p(j)lt}+C_{p(j)lt}R_j
\le C_{p(j)lt}h_{lt}.
\tag{35}
$$

当该首桶同时不是块尾时，还施加

$$
h_{lt}q_{p(j)lt}+C_{p(j)lt}R_j
\ge C_{p(j)lt}h_{lt}-(h_{lt}-1).
\tag{36}
$$

式 (35)—(36) 使非尾首桶的整箱产量等于剩余可用工时按名义产能折算后的整数值；若首桶也是尾桶，则只保留上界，允许需求尾量。

## 9. 交期、跨月、喂丝机与同步约束

### 9.1 交期窗口

仅当 `due_date_control` 在硬约束中显式配置且值为真时生效。未配置交期时，$b_p$ 默认为计划期最后桶；仅有日期的交期按当日结束处理。

宽松需求模式，即式 (15) 未启用时：

$$
q_{plt}=0,
\qquad t<a_p\ \lor\ t>b_p.
\tag{37}
$$

必须完成需求模式：

$$
\sum_l\sum_{a_p\le t\le b_p}q_{plt}\ge D_p.
\tag{38}
$$

式 (38) 与需求上界式 (14)、需求等式 (15) 联立后，窗口外产量自动为 0。

### 9.2 跨月首段牌号

仅当 `mat_month_continue` 显式配置且值为真时生效。设机组 $l$ 上月末牌号为 $m_l^-$，且本期仍存在该牌号需求与产能，则

$$
\sum_{p\in\mathcal P_{m_l^-}}y_{pl}\ge1.
\tag{39}
$$

定义强制牌号在桶 $t$ 的生产标识和前缀状态：

$$
r_{lt}^{-}=\sum_{p\in\mathcal P_{m_l^-}}x_{plt},
\qquad
R_{lt}^{-}=R_{l,\operatorname{prev}(t)}^{-}\lor r_{lt}^{-}.
\tag{40}
$$

在强制牌号尚未开始前，其他牌号不得生产：

$$
x_{plt}\le R_{lt}^{-},
\qquad m(p)\ne m_l^-.
\tag{41}
$$

由于式 (11) 同时生效，适用跨月约束的机组如果本期使用，首个正产能桶必须生产，且首个生产牌号必须为 $m_l^-$。如果该牌号没有可用产能或没有生成决策变量，构建器直接报错，不进入求解。

### 9.3 喂丝机同桶单计划明细

仅当 `feeder_sync_production` 启用且同一喂丝机映射到至少两台有效机组时建模。对每个 $g,p,t$：

$$
m_{gpt}=\max_{l\in\mathcal L_g}x_{plt},
\tag{42}
$$

$$
\sum_{p\in\mathcal P}m_{gpt}\le1.
\tag{43}
$$

本约束允许关联机组空闲；它要求的是同一喂丝机下实际生产的机组在同一桶只能使用同一条计划明细，即使两条明细的物料 ID 相同，也不会被合并。

### 9.4 齐开与齐停

齐开仅在 `sync_start` 显式配置且值为真时为硬约束。齐停仅在 `sync_stop=HARD` 时为硬约束。令 $b_{plt}^{S}=s_{plt}$、$b_{plt}^{E}=e_{plt}$，$r\in\{S,E\}$ 表示选定的边界类型，则

$$
\sum_t b_{plt}^{r}=y_{pl},
\tag{44}
$$

$$
b_{plt}^{r}=1
\Longrightarrow
\beta_p^r=t.
\tag{45}
$$

若两台候选机组对明细 $p$ 没有任何共同边界桶，则

$$
y_{pl_1}+y_{pl_2}\le1.
\tag{46}
$$

因此硬同步作用于该明细实际使用的全部机组，不存在“只选部分同步成员”的另一层决策。`sync_stop=MAKESPAN_FIRST` 不装配式 (44)—(46) 的齐停硬约束，而是在业务目标层之后增加齐停软偏好。

## 10. 完工时间与实际目标函数

### 10.1 完工时间

机组完工时间和全局 makespan 定义为

$$
C_l^{\mathrm{end}}=\max_{t:(l,t)\in\mathcal U}\{E_tu_{lt}\},
\qquad
M=\max_{l\in\mathcal L}C_l^{\mathrm{end}}.
\tag{47}
$$

未生产机组的完工时间为 0。注意，$E_t$ 是相对全局首桶自然时间起点的分钟偏移，包含自然日间隔；它与换产模型中只累加净工时的 $S_i,E_i$ 不是同一条时间轴。

### 10.2 可实际进入目标层的业务指标

下列指标只在策略配置对应目标、权重四舍五入后为正，且实际上界大于 0 时进入求解。

**最晚完工时间：**

$$
g_{\mathrm{mk}}=M.
\tag{48}
$$

**换牌次数：**

$$
g_{\mathrm{chg}}=\sum_l\sum_{i\in\mathcal B_l}\mu_i.
\tag{49}
$$

**高速机优先：**

$$
g_{\mathrm{speed}}=
\sum_{(p,l,t)\in\Omega}\sigma_lq_{plt}.
\tag{50}
$$

**前置空闲：**首先定义

$$
\ell_l=1\iff\sum_tu_{lt}\ge1,
\qquad
B_{lt}=B_{l,\operatorname{prev}(t)}\lor u_{lt},
\tag{51}
$$

$$
I_{lt}=\ell_l\bigl(1-B_{lt}\bigr),
\qquad
g_{\mathrm{idle}}=\sum_{l,t}I_{lt}.
\tag{52}
$$

$I_{lt}$ 在机组首个正产能桶之前强制为 0。由于基础式 (11) 已经要求“使用机组必须生产首桶”，当前正式模型中该指标常被强硬首桶约束压制为 0；文档仍如实保留其已装配的辅助结构与目标表达式。

**机组牌号优先：**该配置会在同一业务优先级位置展开为两个连续字典序层。定义

$$
\mathcal P^{P1}=\{p:\exists l,\ \pi_{pl}=1,\ \exists t,(p,l,t)\in\Omega\}.
\tag{53}
$$

第一层最小化存在真实可用 P1 机组时落在非 P1 机组上的产量：

$$
g_{\mathrm{P1}}=
\sum_{p\in\mathcal P^{P1}}
\sum_{l:\pi_{pl}\ne1}
\sum_tq_{plt}.
\tag{54}
$$

第二层再按优先级差值惩罚产量：

$$
g_{\mathrm{prio}}=
\sum_{(p,l,t)\in\Omega}\rho_{pl}q_{plt}.
\tag{55}
$$

### 10.3 齐开／齐停系统决胜项

对边界 $r\in\{S,E\}$，对明细 $p$ 和候选机组对 $(l_1,l_2)$ 定义同桶边界指示：

$$
d^r_{pl_1l_2t}=b^r_{pl_1t}\land b^r_{pl_2t},
\qquad
D^r_{pl_1l_2}=\max_t d^r_{pl_1l_2t}.
\tag{56}
$$

代码中对 $d$ 使用标准 AND 线性化。设 $N_p^r$ 为有共同边界候选桶的机组对数，则非齐边界机组对指标为

$$
g_{\mathrm{pair}}^r=
\sum_p\left(N_p^r-\sum_{l_1<l_2}D^r_{pl_1l_2}\right).
\tag{57}
$$

再令 $\operatorname{pos}_{pl}^r=\sum_t t\,b_{plt}^r$，忽略 $y_{pl}=0$ 的机组，边界跨度为

$$
g_{\mathrm{spread}}^r=
\sum_p\left(
\max_{l:y_{pl}=1}\operatorname{pos}_{pl}^r
-
\min_{l:y_{pl}=1}\operatorname{pos}_{pl}^r
\right).
\tag{58}
$$

只有一台或没有机组使用时，该明细的跨度为 0。装配条件如下：

- 仅硬齐开时，先增加“未齐停机组对”层，再增加“完工桶跨度”层；
- 仅硬齐停时，先增加“未齐开机组对”层，再增加“开工桶跨度”层；
- `sync_stop=MAKESPAN_FIRST` 时，增加“未齐停机组对”和“完工桶跨度”两层。虽然其记录的优先级值分别是 makespan 优先级加 1、加 2，但当前构建顺序是先追加完所有业务目标层，再追加这两个系统层。

### 10.4 喂丝机物料集中度

当喂丝机关系启用时，定义

$$
f_{gp}=\max_t m_{gpt},
\qquad
g_{\mathrm{feeder}}=\sum_{g,p}f_{gp}.
\tag{59}
$$

目标使同一计划明细尽量集中在更少的喂丝机上。若策略显式配置 `feeder_material_concentration`，则按该业务优先级进入目标层；否则调度器会在同步系统层之后自动追加一个权重为 1 的末层决胜项。

## 11. 分层目标函数

### 11.1 同层归一化

策略目标先按优先级数值升序分组。对目标项 $k$ 设业务权重为 $w_k>0$，代码估计的原始上界为 $U_k>0$，可选归一化分母为 $d_k$（默认 1），则整数系数为

$$
\widehat w_k=
\max\left\{1,
\operatorname{round}\left(
\frac{10000w_k}{U_k\max(1,d_k)}
\right)\right\}.
\tag{60}
$$

对同一优先级层 $r$ 最小化

$$
Z_r=\sum_{k\in\mathcal O_r}\widehat w_k g_k,
\qquad
\min Z_r.
\tag{61}
$$

上界 $U_k\le0$、权重非正或最终没有任何变量贡献的目标项被跳过。归一化系数使用四舍五入和最小值 1，因此它是整数近似，不能解释为完全消除量纲。

### 11.2 目标层顺序

当前实际顺序为：

1. 按优先级数值升序处理所有策略业务目标；
2. 同优先级普通目标先按式 (61) 合并为一层；
3. `brand_machine_priority` 不与同优先级普通项合并，而是在该优先级位置连续展开为式 (54)、(55) 两层；
4. 所有业务层生成后，再追加齐开／齐停系统层；
5. 最后按需要追加喂丝机集中度决胜层。

### 11.3 跨层锁定

设第 $r$ 层得到的当前目标值为 $Z_r^*$。如果求解状态为 `OPTIMAL`，后续层使用精确锁定：

$$
Z_r=Z_r^*.
\tag{62}
$$

如果状态为 `FEASIBLE`，即已找到可行解但未证明当前层最优，后续层使用上界锁定：

$$
Z_r\le Z_r^*.
\tag{63}
$$

因此后续层不得恶化已取得的高层值，但仍可在不超过当前 incumbent 的前提下继续改善该层。当前代码在 `FEASIBLE` 后会继续求解后续目标层，不会直接停止。

## 12. 变量域

汇总后，基础变量域为

$$
\begin{aligned}
&x_{plt},u_{lt},y_{pl},s_{plt},e_{plt},z_i,
\gamma_{ij},\phi_i,\psi_i,\mu_i,\lambda_i,v_l,F_p,m_{gpt},f_{gp},
a_l^{\mathrm{app}},w_i^{\mathrm{multi}},r_{lt}^{-},R_{lt}^{-},
\ell_l,B_{lt},I_{lt},d^r_{pl_1l_2t},D^r_{pl_1l_2}
\in\{0,1\},\\
&q_{plt}\in\{0,1,\ldots,C_{plt}\},\\
&o_i^S,o_i^E,L^E_{pl},G^E_p,\beta_p^S,\beta_p^E,
\operatorname{pos}_{pl}^r\in\mathbb Z_+,\\
&S_i,E_i,Q_i^F,C_i^F,H_i^F,R_i,C_l^{\mathrm{end}},M,Z_r\in\mathbb Z_+.
\end{aligned}
\tag{64}
$$

其他前缀 OR、AND、最小值、最大值及跨度辅助变量的域由对应布尔或时间桶上界限定。

## 13. 求解与回退机制

### 13.1 硬约束种子

目标优化前，求解器先对完整硬约束模型寻找可行种子。如果完整冷启动在时限内返回 `UNKNOWN`，可转入分阶段可行性求解。该分阶段过程依次累加约束，用于找种子和定位首个不可行阶段，不会把只通过部分约束的解当作正式排产结果。

分阶段可行性目录与正式 `buildConstraintPlan` 的累加顺序一致，包括基础指派与产能、首桶、续排、需求、开台数、喂丝机、同物料顺序、连续性、未完成前不切走、内部桶满产、换产结构、普通首桶满产、交期、跨月、前置空闲及同步边界。

### 13.2 搜索提示

上一可行阶段的变量值可作为下一阶段的 CP-SAT hint。提示仅影响搜索起点，不是约束，不会改变本文第 5—9 节定义的可行域。

当前工作区的未提交改动只调整了换产阶段的单次时限与 hint 生成：

- 换产阶段最多使用 90 秒单次时限，并允许对 `UNKNOWN` 重试；
- 不复用块首、块尾或单桶块的产量 hint，只保留内部桶产量 hint；
- 由上一阶段的块首尾时刻推导 $R_j=\max(0,\tau_{ij}+E_i-S_j)$ 的 hint。

上述变化均不新增或删除数学约束。

### 13.3 目标失败回退

- 目标层返回 `OPTIMAL` 或 `FEASIBLE` 时，按式 (62) 或 (63) 锁定并继续下一层。
- 目标层返回 `UNKNOWN` 或全局预算不足以开始下一层时，返回最近一个已确认满足完整硬约束的解。
- 目标层返回 `INFEASIBLE`、`MODEL_INVALID` 等状态时，按异常处理，不把其解释为一般性业务欠产。

### 13.4 makespan 二次改善

仅在当前层是单一 makespan 目标、求解状态为 `FEASIBLE`、已启用最大同时开台约束、相对差距达到触发阈值且改善功能开启时，才进入 makespan 二次改善。

二次改善先根据瓶颈机组、可转移明细和辅助机组尝试局部交换约束；如未改善且 LNS 开启，再进行局部放松搜索。它们是为寻找更好 incumbent 服务的求解策略，不是基础业务数学模型的额外约束。

## 14. 当前未进入正式模型的能力

下表用于防止把类、枚举键或结果字段的“存在”误解为正式求解已生效。

| 能力／键 | 当前代码状态 | 数学模型结论 |
| --- | --- | --- |
| `restart_gap_control` | 目标构建器会查询 $r_{lt}$，但正式调用链没有创建或注册任何 $r_{lt}$ | 原始上界为 0，整个目标项被跳过 |
| `demand_fulfillment` | CP-SAT 目标规则校验显式排除，目标分层也再次排除 | 没有欠产最小化目标；需求只由式 (14)—(15) 控制 |
| `due_progress_gap` | 目标键可被识别，但 `appendTerm` 与上界分派没有实现 | 层内无贡献，被跳过 |
| `soft_sync_start_stop` | 规则校验支持，但没有直接目标表达式 | 不作为业务项进入目标；实际同步软偏好只由系统决胜层生成 |
| `workload_balance` | 规则校验支持，但 CP-SAT 目标分派未实现 | 不进入当前目标函数 |
| `brand_plan_qty_priority` 硬约束 | 存在 `BrandPlanQtyPriorityHardConstraintBuilder`，但 `collectConfiguredHardConstraintKeys` 不收集该键，`buildConstraintPlan` 也不装配该构建器 | 不是当前正式可行域的一部分 |
| `brand_plan_qty_priority` 软目标 | 存在目标构建器分支，但该字符串不在 `PackScheduleObjectiveKey` 中，规则校验无法将其送入 `objectiveTerms` | 不会生成“错序数／错序距离”目标层 |
| `no_gap_between_blocks` | 存在独立构建器与兼容键，但正式计划不装配它 | 不存在额外布尔无间隙约束；已使用块的唯一顺序由 Circuit 与块时序关系表达 |
| `product_line_spread_tiebreaker` | 有目标构建器和分派分支，但没有正式追加目标层 | 当前不生效 |
| `active_production_bucket_tiebreaker` | 目标层追加代码已注释 | 当前不生效 |
| `dayUsed`、`active`等上下文槽位 | 上下文保留了字段，正式构建链未注册对应变量 | 不属于当前模型变量集 |

## 15. 源码追溯与装配总表

### 15.1 硬约束构建器

| 源码构建器 | 数学含义 | 对应公式 | 正式模型中的启用条件 |
| --- | --- | --- | --- |
| `AssignmentConstraintBuilder` | 单机单桶指派 | (7) | 始终装配 |
| `CapacityConstraintBuilder` | 产量—标识关联与稀疏产能 | (8) | 始终装配 |
| `ProductionStructureConstraintBuilder` | 块首、块尾与明细—机组使用标识 | (9)—(10) | 始终装配 |
| `FirstBucketStartConstraintBuilder` | 机组首个正产能桶开工 | (11) | 始终装配 |
| `AppendStartContinuityConstraintBuilder` | 历史续排首段贴边 | (12)—(13) | 存在需续排贴边的历史机组时有效 |
| `DemandUpperBoundConstraintBuilder` | 总产量不超需求 | (14) | 始终装配 |
| `MustFulfillDemandConstraintBuilder` | 必须完成需求 | (15) | 显式配置且启用 `must_fulfill_demand` |
| `MaxSimultaneousMachinesConstraintBuilder` | 最大同时开台 | (16) | 显式配置 `max_simultaneous_machines` |
| `FeederMaterialConsistencyConstraintBuilder` | 喂丝机同桶单明细 | (42)—(43) | 启用 `feeder_sync_production` 且存在有效多机组关系 |
| `SameMaterialPlanOrderConstraintBuilder` | 同物料计划明细顺序 | (17) | 始终装配 |
| `ContinuityConstraintBuilder` | 单明细单机组至多一个连续块 | (18) | 始终装配，实现模式可配置 |
| `ForbidReturnToFinishedMaterialConstraintBuilder` | 未完成前禁止切走 | (19)—(22) | 始终装配 |
| `FullBucketBeforeTailConstraintBuilder` | 内部桶满产、普通多桶块首桶满产 | (23)—(25) | 分两次装配，分别处理内部桶和普通首桶 |
| `ChangeoverConstraintBuilder` | Circuit、有效时间轴、剩余换牌时间与首桶扣产能 | (26)—(36) | 始终装配 |
| `DueDateConstraintBuilder` | 最早开始与交期窗口 | (37)—(38) | 显式配置且启用 `due_date_control` |
| `MatMonthContinueConstraintBuilder` | 上月末牌号作为当期首段 | (39)—(41) | 显式配置且启用 `mat_month_continue` |
| `SynchronizedBoundaryConstraintBuilder` | 齐开或硬齐停公共边界 | (44)—(46) | 齐开启用，或 `sync_stop=HARD` |
| `LeadingIdleConstraintBuilder` | 前置空闲辅助状态 | (51)—(52) | 存在正权重 `leading_idle_control` 目标 |
| `MakespanConstraintBuilder` | 机组完工时间与全局 makespan | (47) | 正式目标建模帧中装配 |

`PackScheduleVariableBuilder` 创建第 4 节的稀疏核心变量，`PackScheduleModelContext` 注册并向上述构建器共享变量、辅助变量和表达式；表中每个运行时可达硬约束构建器只出现一次。未装配构建器统一留在第 14 节，不计入正式可行域。

### 15.2 目标构建器与系统决胜项

| 源码入口 | 目标键／系统层 | 对应指标或公式 | 状态 |
| --- | --- | --- | --- |
| `MakespanObjectiveBuilder` | `makespan` | $g_{\mathrm{mk}}$，式 (48) | 有效业务目标 |
| `ChangeoverControlObjectiveBuilder` | `changeover_control` | $g_{\mathrm{chg}}$，式 (49) | 有效业务目标 |
| `SpeedLevelPriorityObjectiveBuilder` | `speed_level_priority_control` | $g_{\mathrm{speed}}$，式 (50) | 有效业务目标 |
| `LeadingIdleObjectiveBuilder` | `leading_idle_control` | $g_{\mathrm{idle}}$，式 (52) | 有效业务目标 |
| `BrandMachinePriorityObjectiveBuilder` | `brand_machine_priority`，展开为 `brand_machine_priority_primary`、`brand_machine_priority_secondary` | 式 (54)—(55) | 两个连续字典序层 |
| `SynchronizedBoundaryPreferenceBuilder` | `sync_start_pair_tiebreaker`、`sync_start_spread_tiebreaker`、`sync_end_pair_tiebreaker`、`sync_end_spread_tiebreaker` | 式 (56)—(58) | 按同步模式追加的系统层 |
| `FeederMaterialConcentrationObjectiveBuilder` | `feeder_material_concentration` | 式 (59) | 显式业务目标或自动末层决胜项 |
| `PackScheduleObjectiveBuilder` | 同层聚合、归一化与层次编排 | 式 (60)—(63) | 统一目标入口 |

第 14 节列出的 `demand_fulfillment`、`restart_gap_control`、`due_progress_gap`、`soft_sync_start_stop`、`workload_balance`、`product_line_spread_tiebreaker` 和 `active_production_bucket_tiebreaker` 不属于上表的实际有效目标。

## 16. 解读限制

1. “当前数学模型的最优解”不等于所有现场规则的最优解；未进入模型的业务规则不在最优性保证内。
2. `OPTIMAL` 表示求解器在当前差距容差和参数下达到最优性停止条件；解读时仍应同时查看目标界和相对差距。
3. 小时桶、整箱产量、左到右的产能余数分配以及换牌分钟的整数化表达会影响可行域与最优解。
4. 同步边界使用全局桶序号；换产时序使用机组净有效工时轴；makespan 使用自然时间分钟偏移。三者不能混为同一时间坐标。
