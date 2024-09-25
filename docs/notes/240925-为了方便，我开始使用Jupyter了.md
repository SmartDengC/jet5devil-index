---
title: 240925-为了方便，我开始使用Jupyter了
createTime: 2024/09/25 23:29:06
permalink: /article/ijv8nlos/
---

怎么说，今天在学习python的时候，遇到一段代码，想要运行一下，但是我的15款mbp的风扇已经不允许我在打开任何ide了，所以想着在服务器上面启一个jupyter的服务，在网页上面运行python的代码。

说干就干。



这里我依然使用docker来实现， 通过拉取镜像，然后运行；后面的话像一下其他的python项目也可以一起放到这个容器里面。

## Docker拉取并构建容器

拉取python镜像

```shell
docker pull python:3.7
```

运行容器

```shell
docker run --name python3 -p 8000:8000 -v /home/dengcong/project/jupyter:/home/dengcong/project/jupyter -itd python:3.7
```

然后进入到容器里面

```
```



## 安装

```
pip3 install jupyter -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```



```
root@f8996f298763:/# jupyter notebook --generate-config --allow-root
Writing default config to: /root/.jupyter/jupyter_notebook_config.py
```



可能容器里面没有vim，没有办法编辑，可以安装vim来编辑。

（容器在执行下面两条语句之前的大小是265MB， 执行之后的大小为332MB）

```
apt update
apt install vim -y
```

jupyter默认的端口是8888， 我这里修改到8000端口。



```
sed -ie "s/# c.NotebookApp.ip = 'localhost'/c.NotebookApp.ip = '0.0.0.0'/g" ~/.jupyter/jupyter_notebook_config.py
// 下面这个命令就是将#c.NotebookApp.port = 8888 替换成 c.NotebookApp.port = 8000
sed -ie 's/# c.NotebookApp.port = 8888/c.NotebookApp.port = 8000/g' ~/.jupyter/jupyter_notebook_config.py
sed -ie 's/# c.NotebookApp.open_browser = True/c.NotebookApp.open_browser = False/g' ~/.jupyter/jupyter_notebook_config.py

```



运行

`jupyter notebook --allow-root &`

nohup jupyter notebook --allow-root > jupyter.log 2>&1 &

参考文章：

- [配置jupyter在远端服务器运行](https://blog.csdn.net/Castlehe/article/details/108711383)
- [Linux服务器上配置Jupyter并在后台运行](https://blog.csdn.net/qq_41699621/article/details/103064684)
