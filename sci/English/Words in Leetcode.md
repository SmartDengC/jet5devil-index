---
title: Word in Leetcode
author:
createTime: 2024/03/30 21:55:26
permalink: /English/sfkspzzd/
tags:
  - English
  - words
---

## Jul, 2026

### Jul 17, 2026

maximize active section with trade 

inactive section 

convert a contiguous block of 0 s that is surround by 1 s to all 1 s

afterward, convert a contiguous block of 0 s that is surrounded by 1 s to all 1 s

Split the string into serveral zero-one segments

For each one-segment, if it has two neighbors(i.e., )

### Jul 01, 2026

remove dupicates from sorted array.

non-decreasing order 

remove the duplicates in-place such that each unique element appears only once.

duplicates adj 完全一致的

in-place 原地的

unique adj 独一无二的，独特的，这里是形容词，unique element 唯一的元素

The relative order of the elements shouled be kept the same. 元素的相对位置需要保持一致。

Consider the number of unique elements in nums to be k.After removing duplicates, return the number of unique elements k.

考虑到 nums 不同的元素数量是 k 的话，删除重复元素之后返回的数量也是 k。

## Jun, 2026

### Jun 27, 2026

presentation n 仪式，颁奖，奖项

[128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

consecutive adj 连续的，连续不断的

Given an unsorted array of integer nums, return the length of the longest consecutive elments sequence.

You must write an algorithm that runs in O(n)  time

subset 子集

### Jun 24, 2026

contaminate v 污染，contaminated adj 被污染的

Now the binary tree is contaminated, which means all treeNode.val have been changed to -1

### Jun 23, 2026

no two adjacent elements are equal 相邻两个元素不相等

adjacent adj 相邻的

no threee consecutive elements from a strictly increasing or strictly decreasing sequence  连续的三个元素不严格递增或者严格递减

consecutive adj 连续的

triplets n 三胞胎

### Jun 21, 2026

vehicel n 交通工具，车辆

trip n 旅行，出门

passenger n 乘客旅客

the locations to pick them up 

drop them off

### Jun 16, 2026

[3614. Process String with Special Operations II](https://leetcode.com/problems/process-string-with-special-operations-ii/)

`s` consists of only lowercase English letters and special characters `*`, `#` and `%`

consist of 由什么组成

## Mar, 2024

### Mar 30, 2024

[2952. Minimum Number of Coins to be Added](https://leetcode.com/problems/minimum-number-of-coins-to-be-added/)

1 Sort the coins array and maintain the smallest sum that is unobtainable by induction.

maintain 维护

unobtainable adj 难得的 不能得到的

2 If we don’t use any coins, the smallest integer that we cannot obtain by sum is `1`. Suppose currently, for a fixed set of the first several coins the smallest integer that we cannot obtain is `x + 1`, namely we can form all integers in the range `[1, x]` but not `x + 1`.

Suppose 假想假定

several 几个数个

3 If the next unused coin’s value is NOT `x + 1` (note the array is sorted), we have to add `x + 1` to the array. After this addition, we can form all values from `x + 1` to `2 * x + 1` by adding `x + 1` in `[1, x]`'s formations. So now we can form all the numbers of `[1, 2 * x + 1]`. After this iteration the new value of `x` becomes `2 * x + 1`.
