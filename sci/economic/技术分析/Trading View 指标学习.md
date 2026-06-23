---
title: Trading View 指标学习
createTime: 2026/06/12 06:40:34
permalink: /economic/x6o9y3dt/
---



指标

Fib retracement

SuperBollingTred

MACD

ADX and DI



## Basic Index

交易阶段

- 研究指标：指标都是滞后的
- 研究趋势：明白了交易执行和资金管理的重要
- 量化策略：量化策略形成了交易系统
- 底层规律：理解了市场底层规律才真正做到盈利。

学习知识，提升认知，锻炼能力，战胜欲望



### Volume

判断突破是否有效。

### Moving Average

[均线的用法和策略丨技术指标丨分析市场丨均线策略丨研究方向【Jim】](https://www.bilibili.com/video/BV12L4y1L7TA?spm_id_from=333.788.videopod.sections&vd_source=35e7dde81183ac464990a0a0ab794bce)

5日均线，10日均线，20日均线。

短期看5、10日均线，中长期看20日均线。

葛南纬八大法则，四大买点四大买点

- 单根均线：短/中期均线提供买卖点
- 双均线：短/中期均线，
  - 金叉：短周期均线上穿长周期均线，提示买入
  - 死叉：短周期均线下穿长周期均线，提示卖出
- 均线组合：短/中/长周期均线，判断趋势

 构建策略

比如在金叉的时候入场，在死叉的时候出场，中间的差值。

出现死叉，可能已经走了一段下跌了，这个时候就需要严格按照策略来交易，不要看着已经下跌挺多了，不买死扛这种。

策略盈亏取决于标的出现这样行情的概率、频率、成功率。

要研究市场，研究标的在什么情况下经常出现什么样的走势，然后用合适的指标参数去构建策略，交易这样的走势。

### Bollinger

布林线三根线，分别是上轨线、中轨线、下轨线 。

### MACD

[十分钟搞懂【MACD】技术指标丨交易投资基础【Jim】](https://www.bilibili.com/video/BV12Z4y1b72D?spm_id_from=333.788.videopod.sections&vd_source=35e7dde81183ac464990a0a0ab794bce)

MACD指标叫作指数平滑同移动平均线，有单线和双线的概念，0轴， DIF快线，DEA慢线，能量柱，当快线DIF在慢线DEA之上时，能量柱在上方为红色，快线DIF在慢线DEA之下时，能量柱在下方为绿色。

金叉，就是快线DIF从下向上穿过慢线；死叉，就是快线DIF从上方向下穿过慢线DEA。

又分零上金叉⭐、零下金叉⭐⭐、零上死叉⭐⭐⭐、零下死叉⭐⭐⭐⭐⭐，后面为赚钱难度，所以零下死叉就是再怎么都要走的。

需要了解什么情况下是反转，什么情况下是反弹。

（12EMA，26EMA，9）

快线DIF = 12EMA  - 26EMA

差离值的正负

- 价格上涨，12EMA在上方，快线DIF在0轴上方
- 价格下跌，12EMA在下方，快线DIF在0轴下方

差离值的变化

- 上涨速度慢，均线差离值小
- 上涨速度块，均线差离值大

### RSI

相对强弱指标 

[十分钟搞懂【RSI指标】丨出场信号丨技术分析基础【Jim】](https://www.bilibili.com/video/BV1S94y127DZ/?spm_id_from=333.337.search-card.all.click&vd_source=35e7dde81183ac464990a0a0ab794bce)

RSI指标（出场指标）

- 名称：相对强弱指标
- 参数：默认 14
- 组成：RSI线，70轴，50轴，30轴
- 取值：0-100

极弱0-30叫作超卖区、弱30-50、强50-70、极强70-100叫作超买区

50轴就是强弱的分界线

（RSI6、RSI12、RSI24）

**RSI指标计算**

A = 近14根k线阳线涨幅之和

B = 近14根k线阴线跌幅之和的绝对值
$$
RSI = \frac{A}{A+B} * 100
$$


超买区炒卖区的入场信号

- 在超卖区出现的拐头上穿30轴的信号作为入场做多的信号
- 在超买区出现的拐头下穿70轴的信号作为入场的做空的信号

RSI指标的背离

- 价格不断在创新高，但是RSI指标的峰值在不断的降低，出现了背离的状态，通常用来作为判断行情可能反转，作为入场的信号

## Advance Index

### Fib Retracement

看一段趋势的回撤

- 1、寻找一段趋势的明显最高点和最低点
- 2、绘制的皆是影线，并非实体（很重要）
- 3、皆是由左边拉到右边（其他使用方法并不是）
- 4、参数 1 轴是起点，0 轴是终点
- 5、参数 0、0.236、0.382、0.5、0.618、0.786、1

一段下跌过程中的上涨 percent。

看一段趋势的回撤

- 在下跌的过程中，我们就不能卖在最低点，我们应该在反弹的时候出货

![image-20260612065934327](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202606120659541.png)

看一段趋势的上涨（上涨的画法）

- 在上涨的过程中， 我们不能立即买入，应该在回调的时候买入

![image-20260612070053524](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202606120700577.png)

摘要

- 1、需要搭配支撑阻力指标等其他分析方式综合使用
- 2、大时间级别先参考，小于 15 分钟以下不建议使用
- 3、并非万能，也有失效的时候
- 4、惠子出来应该要符合 k 先价格位置或者重合支撑阻力。

#### 斐波那契的延伸应用

方法二、看一段趋势回撤后的目标价格

- 1、寻找一段趋势的明显最高点最低点
- 2、绘制皆是影线，并非实体（很重要）
- 3、皆是由右边拉到左边
- 4、参数 1 轴是起点，0 轴是终点

看涨画法：

![image-20260612071847376](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202606120718446.png)

看跌画法：

![image-20260612072200797](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202606120722858.png)

摘要

- 1、通常搭配趋势线突破、形态等综合使用
- 2、行情之所以会有等比涨幅，是因为常常出现对称走势
- 3、我的个人习惯会在 1 轴阶段性止盈，并上好套保
- 4、若如期到了目标价格，不代表趋势完结（后面可能继续涨）
- 5、也时长出现碰到 1 轴后就无法上涨，形成双顶/底结构

如何使用？

1、需要判断现在的趋势是上涨趋势还是下跌趋势？

- 如果是上涨，从左往右画，从下往上画
- 上涨过程，形成更高高点，更高低点的过程
- 下跌过程，形成更低高点，更低低点的过程。

### Support and Resistance Logistic 

Author：Fluxchart 

支撑和阻力

### SuperBollingerTrend 

Author：Zeiierman

超级布林趋势

### Order Block Finder

Author：wugamlo

订单块查找器

### ICT Fair Value Gap

Author：lmatl

公允价值缺口

### Smart Money Concepts 

Author：luxalgo

聪明钱概念指标

bullish ob 看涨

bearish ob 看跌

BOS, Break of Structure 突破结构

CHoCH, Change of Character 特征改变

Order Blocks 订单块

EQH/EQL Equal Highs/Lows 相对高点/低点

Fair Value Gap 公允价值缺口

Previous High & Lows 前高点/低点
