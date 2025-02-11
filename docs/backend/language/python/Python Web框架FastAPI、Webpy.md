---
title: Python Web框架FastAPI、Webpy
createTime: 2025/02/11 21:27:50
permalink: /article/0wpr60n6/
tags:	
  - python3
  - FastAPI
  - Webpy
---

简单讲讲我为什么会接触到这两个框架，以及快速使用。

<!-- more -->

今天接受到一个任务，就是要在SpringBoot项目里面，调用一个Python的算法，当时想了三种方式，可以参考下面连接：

[Java调用Python程序方法总结(最全最详细)](https://blog.csdn.net/qq_26591517/article/details/80441540)

文章里面说的三种方式，一种是通过jython的jar来实现，如果是需要引入第三方库的话，就不太好用了；第二种方式通过PythonInterpreter的方式来执行python文件，这个需要本地有python的环境；第三种方式Runtime.getRuntime()的方式运行，也需要python环境。

所以，如果说要python环境的话， 还不如通过docker部署一个python环境，然后通过api的方式来实现的好。

大家肯定都听过django、flask这些web框架，但是这两个框架感觉有点大才小用了，就找到下面两个能够快速构建web api的框架。

## 一、FastAPI

[官方文档](https://fastapi.tiangolo.com/)

### 1.1 创建虚拟环境

创建一个python的虚拟环境，可以参考以前的文章，简单了解。

```shell
(base) ➜ todo-app cd todo-app  // 进入到项目目录
(base) ➜ todo-app python3 -m venv venv  // 创建一个python虚拟环境，目录名称叫做venv
(base) ➜ todo-app ls
venv
```

### 1.2 安装FastAPI依赖包

下面就让我们来看一下如何使用：

```shell
(base) ➜ todo-app source venv/bin/activate  // 激活到当前项目虚拟环境
(venv) (base) ➜ todo-app pip3 install "fastapi[standard]"  // 安装fastapi需要的依赖
(venv) (base) ➜ todo-app pip3 list ｜ grep fastapi  // 可以看出来，我们已经成功安装
fastapi           0.115.8
fastapi-cli       0.0.7
```

### 1.3 运行FastAPI项目

然后我们创建一个main.py文件， 文件的内容如下：

```python
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

然后使用 `fastapi dev main.py`就可以启动服务。

```shell
(venv) (base) ➜ todo-app fastapi dev main.py
   FastAPI   Starting development server 🚀
             Searching for package file structure from directories with __init__.py files
             Importing from /Users/dengc4r/c4r_code/working/zj/todo-app
    module   🐍 main.py
      code   Importing the FastAPI app object from the module with the following code:
             from main import app
       app   Using import string: main:app
    server   Server started at http://127.0.0.1:8000
```

我们可以通过在浏览器访问http://127.0.0.1:8000调用接口。

## 二、Webpy

[官方文档](https://webpy.org/)

前面创建项目的流程都是类似的，这里不在赘述。

直接下载webpy需要的依赖库： `pip3 install web.py`

然后创建一个app.py的文件，文件内容如下：

```python
# app.py
import web

urls = (
    '/(.*)', 'hello'
)
app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        return 'Hello, ' + name + '!'

if __name__ == "__main__":
    app.run()
```

然后通过python3 app.py启动服务

```shell
python3 app.py
```

然后通过http://localhost:8080来访问。
