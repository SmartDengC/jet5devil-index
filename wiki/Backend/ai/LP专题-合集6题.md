---
title: LP专题-合集6题
createTime: 2025/08/26 10:51:10
permalink: /article/74k9n7cy/
---

阿里云优化求解器：[优化求解器](https://www.aliyun.com/product/ai/opt)

能够解决的问题类型：

线性规划
$$
f(x)_{min} = -c^f + c^T * x \\ 
l^r <= Ax <= u^r \\ 
l^c <= x <= u^c
$$


混合整数线性规划
$$
f(x)_{min} = -c^f + c^T * x \\ 
l^r <= Ax <= u^r \\ 
l^c <= x <= u^c \\ 
部分 x ∈ Z^n
$$


凸二次规划
$$
f(x)_{min} = -c^f + c^T * x + \frac{1}{2}x^TQx \\ 
l^r <= Ax <= u^r \\ 
l^c <= x <= u^c
$$


半定规划
$$
f(x)_{min} = <C, X> \\ 
$$


## 天池案例集

你知道嘛，你其实已经学会运筹学-线性规划

- 小球在路面上直线匀速行使，走过的路程与时间的关系

$$
s = vt
$$

![](https://opt.aliyun.com/market/shareModel/download?path=/./images/%E6%9B%B2%E7%BA%BF%E5%9B%BE-01.jpg&codeModelCode=9D8E4703-5197-49EE-A6A5-0EFDF9EB5E23&type=1&tenantId=9126)

- 小球从楼上掉下来，受到地球重力加速度的影响，走过的路程与时间的关系（不是线性比例）

$$
s = v_0 t + \frac{1}{2}gt^2
$$

![](https://opt.aliyun.com/market/shareModel/download?path=/./images/%E6%9B%B2%E7%BA%BF%E5%9B%BE-02.jpg&codeModelCode=9D8E4703-5197-49EE-A6A5-0EFDF9EB5E23&type=1&tenantId=9126)

- 当然我们直线也可以线性上升，线性下降，比如计算小车举例终点的举例，随时间越来越小。

$$
s = s_0 - vt
$$

![](https://opt.aliyun.com/market/shareModel/download?path=/./images/%E6%9B%B2%E7%BA%BF%E5%9B%BE-03.jpg&codeModelCode=9D8E4703-5197-49EE-A6A5-0EFDF9EB5E23&type=1&tenantId=9126)

简单来说，线性规划的“线性”意味着文笔包含的是线性关系，“规划”是只寻找问题的最优解决方案。把遇到的问题描述为：目标、变量、约数会更清晰。



### 001、案例二种植计划

[种植计划](https://opt.aliyun.com/studio/market/model/detail/9D8E4703-5197-49EE-A6A5-0EFDF9EB5E23/src/LP01_%E7%A7%8D%E6%A4%8D%E8%AE%A1%E5%88%92_solver_Python_api.ipynb)

6块地，共300亩，每块地大小不一样。

每块地对不同蔬菜有不一样的收益。

$C_{ij}$ 收益

$ i∈I$表示农产品, 

$j∈J$表示地块

$L_i$代表农产品的播种最大限制

$M_j$表示每块地的面积最大限制



**目标：**最大化总收益

**变量：**要安排种植计划，我们这里把每个地块上种不同作物的面积设个未知数，用$X_{ij}$代替。

**约数：**由于地块面积不同有限制，计划播种面积也有不同，因此根据未知数可以列出不同未知数的加和是有限制的。

目标的计算公式：

目标函数：求$f(x)=sumproduct(\text{收益}C_{ij} * \text{面积}X_{ij})$的最大值，即每个小作物地块对应收益总和的最大值：
$$
𝑓(𝑋)=[𝐶11∗𝑥11+𝐶12∗𝑐12+...+𝐶16∗𝑥26]+[𝐶21∗𝑥21+𝐶22∗𝑥22+...+𝐶26∗𝑥26]+...+[𝐶41∗𝑥41+𝐶42∗𝑥42+...+𝐶46∗𝑥46] \\ 
 
=[500∗𝑥11+550∗𝑥12+...+700∗𝑥26]+[800∗𝑥21+700∗𝑥22+...+930∗𝑥26]+...+[1000∗𝑥41+960∗𝑥42+...+700∗𝑥46]
$$
即求解$X_{ij}$取值等于多少，可得到fx的最大值。

### 002、案例二营养调配

问题背景

营养调配问题的目标是优化模型来设定每日饮食菜单，在满足各类营养的需求同时更能优化总成本，营养调配问题是可以用线性优化来表达的。

- 决策变量：以下事物调配多少量：cheeseburget、hamburger、hamsanwich、fish-sandwish、fries、orange juice
- 约束条件：卡路里cal、碳水化合物carbo、蛋白质portiem、维生素A/D、铁iron、钙质Calc每日摄取上下限，以及总量volume限制。
- 目标函数：总成本最小化



问题定义

问题类型：线性优化问题，我们先用集合和参数表明后面变量的取值关联信息

集合

- J = [chesebruger, hamsandwich ...]
- I =[ cal, carbo, protein, vita, vitc, calc, iron, volume...]

参数

- $c_j$ 食物j的单位成本
- $a_{ij}$ 每单位的食物j中所富含的营养i总量
- $l_i$：营养i的单日摄取上限和显现
- $v_j$：食物j的容积
- $v$：所有食物的容积总量上界

决策变量

-  $x_j$ ：食物j所摄取的单位量

目标函数：

- $min_j(c_j * x_j)$ ：总成本最小化

约数条件：

## 排产排程

排产排程、原料采购、仓储存放等是制造业降本增效的关键问题，如何合理安排采购量和生产计划，让利润更高，也可以运用数学规划的方法来建模求解。

[排产排程](https://opt.aliyun.com/studio/market/model/detail/A9125F2E-DD9B-422E-917C-465BF1C9BB34/)

### 001、一周各产品生产数量是多少，利润最高

问题描述

考虑如下决策沃尔特你，某钢铁厂一周将要生产bands，  coils和plate三种产品

- 一致该工厂每小时能生产200吨bands， 或140吨coils，或者160吨plate
- 每吨bands活力25元，每吨coils获利30元，每吨plate获利29元
- 一致每周最多能够生产6000t bands， 4000t coils 和3500tplate， 且工厂每周最多工作40h
- 先规定每周bands生产数量不得少于1000t，coils不得少于500t， plate不得少于750t

问下周生产多少吨bands和coils能让工厂利润最大化？

数学规划模型

集合：

- 产品集合p
- 混合集合D（由生产效率rate，每小时获利profit，最低生产量commit和最大生产量profit四个元素组成）

参数

- 工厂每周最大工作时间avail
- 工厂生产产品p的效率$r_p$
- 每吨产品p获利$p_p$
- 产品p每天最低生产量$c_p$
- 产品p每天最大生产量$m_p$

决策变量

工厂一周生产产品p的数量 $c_p <= make_p <= m_p$

目标函数

工厂要求最大化利润    $$\max \sum_{p \in P} p_p \cdot \text{make}_p$$



### 002、采购多少原料？生产多少产品？利润最高



### 003、采购价格变动时，如何安排采购和生产



##  工业智能排产

现在要进行对卷包月计划的排产，主要目的就是通过排产，计划相应的设备生产什么牌号的这样一个问题。

假设

有M台设备，每台设备为$M_i$

有N种牌号，每个牌号为$N_j$

每个设备对牌号的生产效率是不一样的，使用$C_{i,j}$表示设备$M_i$生产牌号$N_j$的能力。

牌号的计划量用P表示， $P_{j,k}$表示牌号$N_j$的计划量。



目标函数： 
$$
t = ?
$$



机组牌号优先级，机组M生产牌号N的优先级

设备能力，机组M生产牌号N的能力，箱/小时

卷包换牌时间，从牌号$N_1$ 切换到牌号$N_2$损耗的时间



现在假设每台设备上班时间都是24小时。

每台设备，每天生产那种牌号，计划量多少



每台设备每天生产什么牌号，计划量是多少？



假设只有一台设备，多个牌号的话，那么所有的牌号只能排在这一个机台上。



选择、交叉、变异

[进化计算-遗传算法之史上最全选择策略](https://blog.csdn.net/hba646333407/article/details/103251008)



了解到一个java库，但是需要jdk11+或以上才能使用， [optaplanner](https://www.optaplanner.org/)

[【optaplanner教程9】OptaPlanner优化算法](https://zhuanlan.zhihu.com/p/706410092)



https://zread.ai/RKQF-JVS/jvs-aps-/6-java-service-structure
