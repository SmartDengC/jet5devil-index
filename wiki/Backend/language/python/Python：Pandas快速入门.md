---
title: Python：Pandas快速入门
createTime: 2025/02/12 18:40:37
permalink: /article/qcwe48kg/
tags:
  - python
  - pandas
  - df
  - Series
---

80%原则。



## 一、Series、

[2.Pandas Series和DataFrame是什么？【Pandas入门教程2】](https://turingplanet.org/2021/04/08/pandas-intro2/)

什么是Series？就是带有标签（index）的一位数组。

```python
s = pd.Series([1,2,3,4,5], index=['a', 'b', 'c', 'd', 'e'])

a    1
b    2
c    3
d    4
e    5
dtype: int64
```

[2_Series.ipynb](http://8.137.124.148:9270/notebooks/2_Series.ipynb)

## 二、DataFrame

什么是DataFrame？由各种数据类型的列组成的。

这里面的'one', 'two', 'country' 就是数据结构中的列， 没有指定索引，默认从0开始递增。

```python
dit = {
    'one': [1,2,3,4], 
    'two': [7,6,5,4], 
    'country': ['China', 'jpan', ' canan', np.nan]
}
df = pd.DataFrame(dit)
df
	one	two	country
0	1	7	China
1	2	6	jpan
2	3	5	canan
3	4	4	NaN
```

[2_DataFrame](http://8.137.124.148:9270/notebooks/2_DataFrame.ipynb)

### 2.1、DataFrame的api

- 使用`nbviewer`或GitHub链接查看整个Notebook。

- 使用Jupyter Book生成交互式文档，或者通过`nbconvert`将Notebook转换为HTML并嵌入。

#### 2.1.1、df.asfreq('MS')

asfreq是一个在pd时间序列数据分析中常用的方法，这个方法用于改变时间序列的频率，可以帮我将一个时间序列从一个频率转化为另外一个频率。

```python
import pandas as pd

# 创建一个日期范围
date_range = pd.date_range('2025-01-01', periods=5, freq='2D')
df = pd.DataFrame({'value': [1, 2, 3, 4, 5]}, index=date_range)
df
```

```python
# 将频率转换为每日
df_resampled = df.asfreq('D', method='ffill')  # 向前填充 bfill
print(df_resampled)
```

### 2.2、DataFrame操作文件

[【pandas】 之 DataFrame 保存为文件 (df.to_csv、df.to_json、df.to_html、df.to_excel)](https://blog.csdn.net/tz_zs/article/details/81137998)

- `pd.to_csv()`

```python
df.to_csv("resource/" + file_name + ".csv")
```

- `pd.read_csv()`
- `pd.to_json()`
- `pd.read_json()`
- `pd.to_excel()`
- `pd.read_excel()`

## 二、索引、过滤（Indexing、Filtering）

视频教程：[3.DataFrame Indexing, Filtering【Pandas入门教程3】](https://turingplanet.org/2021/04/21/pandas-intro3/)

Jupyter Notebook 代码：[3_indexing_filtering.ipynb](http://8.137.124.148:9270/notebooks/3_indexing_filtering.ipynb)

## 三、排序、更新行列（Sorting、 Updating）

视频教程：[DataFrame的排序和数据更新 Sorting, Updating Records【Pandas入门教程4】](https://turingplanet.org/2021/05/05/pandas-intro4/)

## 四、合并和分组（Concatenation、Grouping）

视频教程：[聚合, 分组, 数据清理 Aggregating, Grouping, Data Cleaning【Pandas入门教程5】](https://turingplanet.org/2021/05/17/pandas-intro5/)

## 五、数据清理（Data Cleaning）



## 六、数据可视化（Ploting）





## 七、问题总结

### 7.1 No frequency information was provided, so inferred frequency MS will be used.

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

### 7.2、获取某个时间段内的数据

[pandas提取某段时间范围数据的五种方法，比如提取9月份数据](https://blog.csdn.net/caoxinjian423/article/details/113029894)

```python
import pandas as pd 
df = pd.read_csv('./TianQi.csv')
 
#获取九月份数据的几种方法
#使用行索引切片，['2019/9/1':'2019/9/30']，缺点是要求日期必须是连续的。
df.set_index('日期',inplace=True)
print(df['2019/9/1':'2019/9/30'].head())    # 或者print(df.loc['2019/9/1':'2019/9/30',:])
```

