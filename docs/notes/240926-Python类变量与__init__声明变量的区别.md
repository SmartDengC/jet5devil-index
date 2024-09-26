---
title: Python类变量与__init__声明变量的区别
createTime: 2024/09/26 13:11:33
permalink: /article/8hpmdzao/
tags:
  - python
---



```python
class MyObject(object):
    # x 是类变量
    x = 1
    cnt = 100  # 先执行这个
    def __init__(self):
        # objectNum 是局部变量
        objectNum = 99
        # self.cnt 是示例变量
        self.cnt = 101  # 后面执行这个将前面的覆盖
    def changeNum(self, x):
        self.objectNum = x
    def showNum(self):
        print("self.num = ", self.objectNum)
```

