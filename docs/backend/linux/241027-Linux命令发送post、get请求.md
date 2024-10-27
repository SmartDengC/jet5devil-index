---
title: Linux命令发送post、get请求
createTime: 2024/10/27 23:33:43
permalink: /article/rhtk9tu4/
tags:
  - linux
  - wget
  - curl
---

在代码开发过程中，难免会遇到在服务器上面请求接口的时候，掌握使用post、get的请求方式就很重要。

<!-- more -->

## 一、curl

[Linux curl命令最全详解](https://blog.csdn.net/wuhuagu_wuhuaguo/article/details/90764856#t0)

### get请求

curl https://www.baidu.com/  如果这里的url指向一个文件或者一副图可以直接下载到本地

 curl -i https://www.baidu.com/  显示全部信息

 curl -I https://www.baidu.com/  只显示头部信息

curl -v https://www.baidu.com/ 显示get请求全过程解析

### post请求

curl -H "Content-type: application/json" -X POST -d '{"srcRef":"1002"}' http://fsc-inner.99bill.com/acs/deposit/1002

```
-H 请求头

-X post 请求方式

-d 参数
```

## 二、wget

### get请求

wget会将url的内容存入文件

wget https://www.baidu.com/  默认文件名

wget https://www.baidu.com/ -P aimPath -O fileName   指定存放的路径和文件名

### post请求

wget --post-data ‘user=foo&password=bar’ http://www.baidu.com
