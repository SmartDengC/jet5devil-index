---
title: Python：Pandas快速入门
createTime: 2025/02/12 18:40:37
permalink: /article/qcwe48kg/
tags:
  - python
  - pandas
---



80%原则。



## 一、Series、DataFrame

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

什么是DataFrame？由各种数据类型的列组成的。

```python
dit = {
    'one': [1,2,3,4, 5,6,7], 
    'two': [7,6,5,4,3,2,1], 
    'country': ['China', 'jpan', ' canan', 'amer', np.nan, np.nan, np.nan]
}
df = pd.DataFrame(dit)
df

	one	two	country
0	1	7	China
1	2	6	jpan
2	3	5	canan
3	4	4	amer
4	5	3	NaN
5	6	2	NaN
6	7	1	NaN
```



[2_DataFrame](http://8.137.124.148:9270/notebooks/2_DataFrame.ipynb)



## 二、索引、过滤（Indexing、Filtering）

视频教程：[3.DataFrame Indexing, Filtering【Pandas入门教程3】](https://turingplanet.org/2021/04/21/pandas-intro3/)

Jupyter Notebook 代码：[3_indexing_filtering.ipynb](http://8.137.124.148:9270/notebooks/3_indexing_filtering.ipynb)

## 三、排序、更新行列（Sorting、 Updating）

视频教程：[DataFrame的排序和数据更新 Sorting, Updating Records【Pandas入门教程4】](https://turingplanet.org/2021/05/05/pandas-intro4/)



## 四、合并和分组（Concatenation、Grouping）

视频教程：[聚合, 分组, 数据清理 Aggregating, Grouping, Data Cleaning【Pandas入门教程5】](https://turingplanet.org/2021/05/17/pandas-intro5/)

## 五、数据清理（Data Cleaning）



## 六、数据可视化（Ploting）

