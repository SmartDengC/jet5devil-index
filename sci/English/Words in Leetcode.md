---
title: Word in Leetcode
author:
createTime: 2024/03/30 21:55:26
permalink: /English/sfkspzzd/
tags:
  - English
  - words
---

## [2952. 需要添加的硬币的最小数量](https://leetcode.cn/problems/minimum-number-of-coins-to-be-added/)

1 Sort the coins array and maintain the smallest sum that is unobtainable by induction.

maintain 维护

unobtainable adj 难得的 不能得到的

2 If we don’t use any coins, the smallest integer that we cannot obtain by sum is `1`. Suppose currently, for a fixed set of the first several coins the smallest integer that we cannot obtain is `x + 1`, namely we can form all integers in the range `[1, x]` but not `x + 1`.

Suppose 假想假定

several 几个数个

3 If the next unused coin’s value is NOT `x + 1` (note the array is sorted), we have to add `x + 1` to the array. After this addition, we can form all values from `x + 1` to `2 * x + 1` by adding `x + 1` in `[1, x]`'s formations. So now we can form all the numbers of `[1, 2 * x + 1]`. After this iteration the new value of `x` becomes `2 * x + 1`.
