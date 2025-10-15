---
title: 聊聊MES中的工厂日历
author: 代码艺术家
createTime: 2024/03/06 23:58:09
permalink: /article/uat9ahsq/
tags: 
  - mes
  - calendar
---

在 mes 里面，排班都是一个工厂最基本的内容，考虑安排人员的上班情况，mes 里面的工厂日历就是需要能够方便的将这个人员上班的计划排出来。

谈到工厂日历的话，就绕不开班次和班组。
比如说班次定义的话，常见的就是早班、中班和晚班，班组的话常见的就是甲班、乙班、丙班和丁班。

由班次和班组衍生出来了排班规则，是几班机运转的规则，比如一下常见的工厂的排班规则就是三班两运转。这里的三班指的是由三个班组，两运转是指上两个班，早班中班。

说到运转规则，离不开的就是倒班规则，就是几天倒班；比如倒班规则为 2 天的话，就可以理解甲班组要上两个早班才会换到中班。



里面需要面临的一个问题，就是工厂日历跨月的情况，跨月的话需要是月份之间排班平滑度过，不能说1号从甲班开始，到了下个月1号还是从甲班开始，这样是不行的。

对象

Team -> id, name

Shift -> id, name, start_time, end_time

ShiftSchedule -> {Shift, Team} // 这个对象就是包含班次对象和班组对象的对象（Shift， Team）， 一个ShiftSchedule想到与一个Shift， 一个Team

DaySchedule ->  [{早班，甲班}, {中班，乙班}]   // DaySchedule就是ShiftSchedule的集合， 多个ShiftScheule

Result -> date, List[DaySchedule]  date就是表示日期，list[DaySchedule]就表示当天的一个日历计划

服务

ShiftTemplateService  // 这个就是用来创建ShiftSchedule的， 可以先不创建

DayTemplate  // 这个就是用来创建DaySchedule的， 可以先不创建

RuleService

ManageService







## Finally（20240337 更新）

这里在知乎上面看到一篇文章，题目叫做[MES 中关于生产排程的经典算法都有哪些？有哪些公式更能真的的反映，并优化企业排产？
](https://www.zhihu.com/question/19732664?sort=created)，里面谈到了关于一下 mes 应用的观点，感觉还是很有借鉴的，里面涉及到一篇论文，关于 aps，正好是自己需要的知识，这个后面抽时间看。

[Multi-Agent Based Hyper-Heuristics for Multi-Objective Flexible Job Shop Scheduling: A Case Study in an Aero-Engine Blade Manufacturing Plant](https://ieeexplore.ieee.org/document/8635479)
