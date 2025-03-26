---
title: Python：总结使用Pandas过程中的问题
createTime: 2025/02/27 11:00:31
permalink: /article/c1na9wa8/
tags:
  - python
  - pandas
---



## 一、问题总结

### 1.1 No frequency information was provided, so inferred frequency MS will be used.

[Pandas ValueWarning: No frequency information was provided, so inferred frequency MS will be used错误](https://deepinout.com/pandas/pandas-questions/472_pandas_valuewarning_no_frequency_information_was_provided_so_inferred_frequency_ms_will_be_used.html)

大概意思就是使用时间作为index，但是没有制定时间的跨度，及时freq这个属性，pd默认生成freq='MS'的索引。

涉及到的函数：

```python
pd.date_range('20240101', '20241201', freq="MS")
- M：月份末尾
- MS：月份开头
- A：年末
- AS：年初
- W：周末
- D：天
```



```python
np.random.randm(len())
pd.Series(values, index=idx)
```

