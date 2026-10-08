---
title: ORTools使用总结
createTime: 2026/09/14 10:41:43
permalink: /article/vzfnthpu/
tags:
  - ortools
  - cpsat
---

## API

### CpModel

| API                                     | 作用                                           | 数学含义      |
| --------------------------------------- | ---------------------------------------------- | ------------- |
| `model.newBoolVar(name)`                | 创建布尔变量 `{0,1}`                           |               |
| `model.newIntVar(min, max, name)`       | 创建有限域整数变量 `[min, max]`                |               |
| `model.addAssumption(literal)`          | 注册假设变量，用于不可行核心分析               |               |
| `model.addMaxEquality(target, args)`    | 约束 `target = max(args)`；布尔变量时等价于 OR |               |
| `model.addMinEquality(target, args)`    | 约束 `target = min(args)`                      |               |
| `model.addEquality(expr, var/constant)` | 添加等式约束 `expr == var`                     |               |
| `model.addLessOrEqual(expr, value)`     | 添加不等式约束 `expr ≤ value`                  |               |
| `.onlyEnforceIf(literals)`              | 条件约束：仅当所有 literals 为 true 时约束生效 |               |
| `model.addExactlyOne`                   | 恰好选择一个                                   | $\sum b_i=1$  |
| `model.addAtMostOne`                    | 最多只有一个                                   | $\sum b_i<=1$ |
| `model.addAtLeastOne`                   | 至少选择一个                                   | $\sum b_i>=1$ |
| `model.addImplication(a,b)`             | 如果 a 成立，b 必须成立                        |               |
|                                         |                                                |               |

#### model.newBoolVar()

例如：

```java
CpModel model = new CpModel();
BoolVar isProduction = model.newBoolVar("isProduction");
```

数学含义就是：
$$
isProduction \in \{0,1\}
$$


其中：

| 值   | 含义              |
| ---- | ----------------- |
| `0`  | false，机组不生产 |
| `1`  | true，机组生产    |

需要注意：`newBoolVar()` 不是给变量赋值，而是创建一个由求解器决定取值的决策变量。

更多例子：

```python
b = model.NewBoolVar('b')

# 仅当 b 为真时，x + y <= 5 才生效
model.Add(x + y <= 5)
		.OnlyEnforceIf(b)

# 仅当 b 为假时，x + y >= 10 才生效
model.Add(x + y >= 10)
		.OnlyEnforceIf(b.Not())
```

#### model.addBoolAnd()

```java
// y == min(x1, x2)  (对 0/1 变量即逻辑与)
model.addMinEquality(y, new IntVar[] {x1, x2});

// y == x1 AND x2
model.addBoolAnd(new Literal[] {x1, x2}, y);
```

### LinearExpr

| API                                    | 作用                                       |
| -------------------------------------- | ------------------------------------------ |
| `LinearExpr.newBuilder()`              | 创建线性表达式构建器                       |
| `builder.addTerm(var, coeff)`          | 添加 `coeff × var` 项                      |
| `LinearExpr.sum(args)`                 | 快捷构造求和表达式                         |
| `BoolVar.getIndex()`                   | 获取变量在模型中的索引，用于匹配不可行核心 |
| `LinearExpr.weightedSum(args, coeffs)` | 静态方法，构造 `∑(coeff[i] × arg[i])`      |



`LinearExprBuilder.addTerm(p, q)` 的含义是：**向正在构建的线性表达式中，添加一个系数为 `q`、变量为 `p` 的项**。

也就是说，它相当于在数学表达式里加上 `q * p`。

- `addTerm(p, q)`**：添加一项 **`q * p`。它接收两个参数，`p` 是变量，`q` 是它的系数（`double` 类型）。
- `add(p)`：添加 `1 * p`（或一个常数）。它只接收一个参数，如果传入变量，默认系数为 **1**；如果传入常数，则直接加上这个数。
