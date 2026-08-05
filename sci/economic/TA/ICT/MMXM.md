---
title: MMXM
createTime: 2026/07/13 00:15:57
permalink: /economic/wpl3ff4h/
---

为什么你看不懂价格行为？一篇讲懂 ICT 最复杂的做市商模型 MMXM

[Video Url](https://www.youtube.com/watch?v=5Xgh418rCdM)

## 一、MMXM是什么

Market Maker X(buy/sell) Model （做市商买入/卖出模型）

一个有算法运行的，做市商设计流动性池并拿到流动性的完整价格传递过程。分为做市商买入模型（MMBM）和做市商卖出模型（MMSM）。由 4 个步骤“盘整”，“冲击”，“回调”，“反转”组成。价格行为是连贯的，因此市场在不同周期内，每时每刻都在运行 MMXM。

### 1、MMXM 运行模型

![image-20260713103203287](https://gitee.com/jet5devil/daily-review-picture/raw/master/trading_img/20260713103203321.png)

### 2、重要心得

价格很少会出现工工整整的按照模型图片的走法，因此 MMXM 最重要的是告诉我们价格会以什么样的走法达到某个 DOL，又怎么发生反转，对称与左侧 pd array 的方向转换，给我们提供入场与止盈止损目标

## 二、如何判断SMR的发生

SMR, Smart Money Reverse

- 1、HTF pda（15min 以上）
- 2、价格在左侧出现了原始盘整区域+至少2 次冲击
- 3、HTF + LTF smt
- 4、Cisd/mss
- 5、Stdv 测量，DOL 和结果相符

## 三、补充概念

### 1、HTF PDA

HTF PDA（Higher Time Frame Premium/Discount Array 高阶时间框架溢价/折价阵列）是 ICT 交易理论中用于确立交易大方向（Bias）的核心分析工具，回答了一个最基本的问题：当前市场从宏观角度看，是偏贵（该卖）还是偏便宜（该买）？ 

市场会在一个由近期高点和低点构成的区间来回摆动，这个区间被 50% 中线一份为二：

- 溢价区（Premium Zone）：区间的上半部分，代表市场处于高估状态；交易倾向：寻找做空（sell）机会。
- 折价区（Discount Zone）：区间的下半部分，代表市场处于低估状态；交易倾向：寻找做多（buy）机会。

在 PDA 前面加 HTF（Higher Time Frame 更高时间框架），强调分析的维度，HTF PDA 指在更高的时间框架（日线、4 小时）上定义溢价/折价区域。

HTF PDA 决定了你是该“找机会买”还是“找机会卖”；而具体的入场信号（如 OB，FVG， MSS）则告诉你“何时何地”执行这个方向。

### 2、PD Array

PD Array（Price Delivery Array，价格递送阵列）

指的是由 ICT 理论定义的一整套关键的、算法级别的支撑/阻力价位或区域。它不是一个概念，而是 OB（订单块）、FVG（公允价值缺口）、流动性水平（前高/前低）、均衡价格（POI， Point of Interest）等所有核心元素的总称/集合。

- 1、订单块（Order Block, OB）：机构的挂单成本区
- 2、公允价值缺口（Fair Value Gap）：价格失衡形成的缺口
- 3、流动性水平（Liquidity Levels）：前期的波段高点/低点（Swing High/Low）、相等高/低点（Equal Highs/Lows）
- 4、均衡价格（Point of Interest， POI）：机构常用的斐波那契回撤位
- 5、开盘价水平：如当日开盘价（Daily Open）、周开盘价（Weekly Open）

简单理解：PD Array 就是你在图表上标注出来的“机构可能挂单或者产生反应的所有价位清单”。

