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



## OR-Tools CP-SAT API 总结表

| API                                    | 出现位置               | 作用                                               |
| -------------------------------------- | ---------------------- | -------------------------------------------------- |
| `model.newBoolVar(name)`               | 82, 98, 160行          | 创建布尔变量 `{0,1}`                               |
| `model.newIntVar(min, max, name)`      |                        | 创建整数变量 `[min,max]`                           |
| `model.addMaxEquality(target, args)`   | 84, 101, 163, 169行    | 约束 `target = max(args)`；布尔变量时等价于 OR     |
| `model.addMinEquality(target, args)`   | 168行                  | 约束 `target = min(args)`                          |
| `model.addEquality(var, expr)`         | 115, 149-152, 173-176, | 约束 `var == expr`                                 |
| `.onlyEnforceIf(literal)`              | 149-152, 175, 176行    | 条件约束：仅当 literal=true 时生效                 |
| `literal.not()`                        | 150, 152, 176行        | 取否定，用于 `.onlyEnforceIf` 中表达"当条件为假时" |
| `LinearExpr.newBuilder()`              | 110, 195行             | 创建线性表达式构建器                               |
| `builder.addTerm(var, coeff)`          | 112-114, 201行         | 添加 `coeff × var` 项                              |
| `LinearExpr.weightedSum(args, coeffs)` | 173行                  | 静态方法，构造 `∑(coeff[i] × arg[i])`              |

## 建模核心技巧总结

1. **`addMaxEquality` 实现 OR**：对布尔变量数组取 max = 逻辑 OR，CP-SAT 中没有 `addOrConstraint`，这是标准替代
2. **条件参与极值**：通过 `onlyEnforceIf` + 候选变量设极值（min 候选=上界，max 候选=0），让未使用的机组不影响极值计算
3. **`onlyEnforceIf` 实现逻辑蕴含**：`literal → constraint`，是 CP-SAT 条件建模的核心机制
4. **加权线性表达式**：`addTerm` 构建线性式，`weightedSum` 快捷构造差值/求和，CP-SAT 只支持线性约束
