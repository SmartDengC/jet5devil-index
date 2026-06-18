---
title: Word in Leetcode
author:
createTime: 2024/03/30 21:55:26
permalink: /English/sfkspzzd/
tags:
  - English
  - words
---

### Jun 16, 2026

[3614. Process String with Special Operations II](https://leetcode.com/problems/process-string-with-special-operations-ii/)

`s` consists of only lowercase English letters and special characters `*`, `#` and `%`

consist of 由什么组成

### Mar 30, 2024

[2952. Minimum Number of Coins to be Added](https://leetcode.com/problems/minimum-number-of-coins-to-be-added/)

1 Sort the coins array and maintain the smallest sum that is unobtainable by induction.

maintain 维护

unobtainable adj 难得的 不能得到的

2 If we don’t use any coins, the smallest integer that we cannot obtain by sum is `1`. Suppose currently, for a fixed set of the first several coins the smallest integer that we cannot obtain is `x + 1`, namely we can form all integers in the range `[1, x]` but not `x + 1`.

Suppose 假想假定

several 几个数个

3 If the next unused coin’s value is NOT `x + 1` (note the array is sorted), we have to add `x + 1` to the array. After this addition, we can form all values from `x + 1` to `2 * x + 1` by adding `x + 1` in `[1, x]`'s formations. So now we can form all the numbers of `[1, 2 * x + 1]`. After this iteration the new value of `x` becomes `2 * x + 1`.
