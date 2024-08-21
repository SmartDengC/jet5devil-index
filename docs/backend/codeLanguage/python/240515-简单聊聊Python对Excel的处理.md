---
title: 简单聊聊Python对Excel的处理
author: 邓聪的小破站
createTime: 2024/05/15 23:20:55
permalink: /article/uk1c2oe3/
tags:
  - python
  - excel
  - openpyxl
  - xlcd
---

每次在python里面处理excel的时候，都是一头雾水，而且做了很多次，每次都是百见如新，希望记录下来能够记住。

参考：[9个处理Excel的Python库，优劣比较](https://blog.csdn.net/qq_35120460/article/details/115373013)

<!-- more -->

![](https://i-blog.csdnimg.cn/blog_migrate/a6bfaa92df3725dfc1c307ce6b6d9483.jpeg#pic_center)

从上面可以看出来excel的后缀有很多种，但是不是每一个包都能够处理所有后缀的文件，像是用的对的openpyxl就只能读xlsx的文件，不能读xls的文件；xlrd两者都可以读，但是不能够写文件和修改文件。

下面对这两个函数读进行初步的了解与学习。

## openpyxl

[Openpyxl 教程](https://geek-docs.com/python/python-tutorial/python-openpyxl.html)

```python
class DynamicScript():
    def learn_openpyxl(self):
        """
        日期	        时间	    系统	    机台	    操作员工号	操作员姓名
        2024-08-21	7:30	一厂18台	01号	0001	李晓
        2024-08-21	8:30	一厂18台	01号	0001	李晓
        2024-08-21	9:30	一厂18台	01号	0001	李晓
        """
        # 读文件
        import openpyxl
        workbook = openpyxl.load_workbook('tmp.xlsx')  # 打开工作薄
        sheet = workbook.active  # 选择工作表, 获取活动工作表
        sheet = workbook['Sheet1']  # 或者通过名称选择工作表
        value_a1 = sheet['A1'].value  # 日期
        value_a2 = sheet['A2'].value  # 2024-08-21
        rows = sheet.iter_rows()  # sheet.iter_rows是一个rows的对象，里面包括了所有行的内容
        for i, x in enumerate(rows):  # 所以我们可以用python的enumerate来进行遍历
            # 这里的x相当于行集合里面的具体的一样，很显然是包含了很对列的内容
            title = [y.value for y in x]
            continue

        # 写文件
        from openpyxl import Workbook
        book = Workbook()  # 创建一个WorkBook的对象
        sheet = book.active  # 激活一个sheet
        sheet['A1'] = 56  # 写内容的方式， 可以根据列表来，
        sheet['A2'] = 43

        for i in range(3, 10):
            for j in range(3, 10):
                sheet.cell(i, j, '{}-{}'.format(i, j))  # 也可以根据坐标来， 注意写的时候下标是从1开始的
        book.save('tmp2.xlsx')  # 生成实际的文件
```



## xlrd

[Python3 xlrd集成教程](https://www.w3cschool.cn/python3/python3-xlrd.html)

```python
class DynamicScript():
    def learn_wlrd(self):
        """
        日期	        时间	    系统	    机台	    操作员工号	操作员姓名
        2024-08-21	7:30	一厂18台	01号	0001	李晓
        2024-08-21	8:30	一厂18台	01号	0001	李晓
        2024-08-21	9:30	一厂18台	01号	0001	李晓
        2024-08-21	10:30	一厂18台	01号	0001	李晓
        """
        import xlrd
        data = xlrd.open_workbook('tmp.xls')  # 打开存在的工作薄
        tables: list = data.sheet_names()  # 获取到所有工作表的名称
        if not tables:
            raise Exception("文件内容为空！")
        table_name = tables[0]
        table = data.sheet_by_name(table_name)  # 通过名称指定操作的工作表
        # 行数
        rows = table.nrows  # 获取到工作表的总行数
        for i in range(rows):
            x = table.row_values(i)  # 获取到每一行的内容
            title = [y for y in x]  # 这里值得一提的是，如果表格是时间类型，那么读取进来的数据就会有错误
        # 列数
        cols = table.ncols
        for j in range(cols):
            y = table.col_values(j)  # 每一列的内容
            value = [z for z in y]

        # 获取值 真确的值应该是7:30， 但是实际获取到的是0.135...
        value_a1 = table.cell(1, 1).value  # .value 才是获取到具体的值， 需要注意的是，下标是从1开始的

```

