---
title: OR-Tools使用总结
createTime: 2026/09/14 10:41:43
permalink: /article/vzfnthpu/
tags:
  - ortools
  - cpsat
---







## OR-Tools CP-SAT API 总结

| API                                     | 作用                                           |
| --------------------------------------- | ---------------------------------------------- |
| `model.newBoolVar(name)`                | 创建布尔变量 `{0,1}`                           |
| `model.newIntVar(min, max, name)`       | 创建有限域整数变量 `[min, max]`                |
| `model.addAssumption(literal)`          | 注册假设变量，用于不可行核心分析               |
| `model.addEquality(expr, var/constant)` | 添加等式约束 `expr == var`                     |
| `model.addLessOrEqual(expr, value)`     | 添加不等式约束 `expr ≤ value`                  |
| `.onlyEnforceIf(literals)`              | 条件约束：仅当所有 literals 为 true 时约束生效 |
| `LinearExpr.newBuilder()`               | 创建线性表达式构建器                           |
| `builder.addTerm(var, coeff)`           | 添加 `coeff × var` 项                          |
| `LinearExpr.sum(args)`                  | 快捷构造求和表达式                             |
| `BoolVar.getIndex()`                    | 获取变量在模型中的索引，用于匹配不可行核心     |

