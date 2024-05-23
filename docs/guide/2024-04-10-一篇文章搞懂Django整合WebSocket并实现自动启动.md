---
title: 2024-04-10-一篇文章搞懂Django整合WebSocket并实现自动启动
author: 邓聪的小破站
createTime: 2024/04/10 13:45:08
permalink: /article/0ai99uz1/
tags: 
  - python
  - xlwt
---

 

使用Python写项目，避免不了的就是用Python做导入导出的功能，这里简单记录一下。



## 简单记忆导出

这里说一个大体的思路， 现在使用的库是xlwt

```python
import xlwt
work_book = xlwt.WorkBook()
work_sheet = work_book.add_sheet('file')

work_sheet.write(1, 1, 'hello work')
work_book.save('hello.txt')
```



做excel样式。

