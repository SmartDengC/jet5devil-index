---
title: wget、curl
createTime: 2025/05/19 09:28:48
permalink: /linux/edu3ea6f/
tags:
  - linuxCommand
---

`wget`和`curl`是linux下常用的命令行工具。`wget`用于从网络上下载文件，支持断点续传；而`curl`是一个用于数据传输的工具，支持多种协议，功能更为灵活，适合用于API调用和复杂的HTTP请求操作。

其次在代码开发过程中，难免会遇到在服务器上面请求接口的时候，掌握使用post、get的请求方式就很重要。

<!-- more -->

## 一、curl

[Linux curl命令最全详解](https://blog.csdn.net/wuhuagu_wuhuaguo/article/details/90764856#t0)

### 1.1、curl操作get、post

#### 1.1.1、get请求

```shell
curl https://www.baidu.com/  # 如果这里的url指向一个文件或者一副图可以直接下载到本地
curl -i https://www.baidu.com/  # 显示全部信息
curl -I https://www.baidu.com/  # 只显示头部信息
curl -v https://www.baidu.com/ # 显示get请求全过程解析
```

#### 1.1.2、post请求

```shell
curl -X POST https://your-api-endpoint.com \
-H "Content-Type: application/json" \
-d '{
    "start_month": "2024-01",
    "end_month": "2024-05",
    "body": [
        {
            "dept": "HZ",
            "time": "2024年01月",
            "value": 18420.9,
            "energy": "水"
        }
    ]
}'
```

- -X post 请求方式
- -H 请求头
- -d 参数

## 二、wget

### 2.1、wget命令的基础用法

```
wget [选项] [URL]

# URL是要下载的文件地址
```

常用的选项说明：

- -c：继续下载中断的文件，支持断点续传
- -O 文件名：将下载的文件保存为指定的文件名
- -P 目录：将下载的文件保存到指定的目录
- -b：后台下载，将下载任务放到后台执行
- -q：静默模式，减少输出信息
- -v：详细模式，增加输出信息
- -h：显示帮助信息
- -y：在执行操作时自动回答yes

### 2.2、wget实现get、post调用

#### 2.2.1、get请求

wget会将url的内容存入文件

```shell
wget https://www.baidu.com/  默认文件名
wget https://www.baidu.com/ -P aimPath -O fileName   指定存放的路径和文件名
```

#### 2.2.2、post请求

```shell
wget --post-data 'user=foo&password=bar' http://www.baidu.com
```

### 2.3、相关例子

#### 2.3.1、密码和认证

wget只能处理利用用户名/密码方式限制访问的网站，可以利用下面两个参数：

- --http-user=USERNAME // 设置HTTP用户
- --http-passwd=PASSWD  // 设置HTTP密码

对于需要证书做认证的网站，只能利用其他下载工具，例如curl。
