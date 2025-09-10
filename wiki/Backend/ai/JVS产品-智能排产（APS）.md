---
title: JVS产品-智能排产（APS）
createTime: 2025/08/31 23:21:29
permalink: /article/c2af48rf/
---
[智能排产产品文档](https://doc.bctools.cn/#/knowledge/all/dd37733c43c064ac1c4f1c2155e04ce6)



- 智能优化（求解器）

先进算法：采用遗传算法、模拟退货算法等先进的优化算法，实现全局最优的生产计划和调度。



排产入口代码：

```java
    @ApiOperation("生成排产计划")
    @PostMapping("/generate")
    public R<String> generate(@Validated @RequestBody GeneratePlanningSmartDTO generatePlanningSmart) {
        planningSmartService.generate(generatePlanningSmart);
        return R.ok();
    }
```

