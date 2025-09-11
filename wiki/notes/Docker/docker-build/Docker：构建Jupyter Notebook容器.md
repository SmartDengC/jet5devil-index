---
title: 构建Jupyter Notebook容器
createTime: 2024/09/25 23:29:06
permalink: /docker/ijv8nlos/
tags: 
  - jupyter
  - python
---

为了学习Python，熬夜部署了Jupyter Notebook服务。

怎么说，今天在学习Python的时候，遇到一段代码，想要运行一下，但是我的15款mbp的风扇已经不允许我在打开任何ide了，所以想着在服务器上面启一个jupyter的服务，在网页上面运行Python的代码。

说干就干。

<!-- more -->

这里我依然使用docker来实现， 通过拉取镜像，然后运行；后面的话像一下其他的python项目也可以一起放到这个容器里面。

## 一、Docker拉取并构建容器

拉取python镜像

```shell
# 这里需要注意，如果使用的是3.7的版本，那么notebook的版本会在7以下
# 因为notebook 7+ 有许多调整，当前文章还是以 jupyter notebook 6.5.2 编写
docker pull python:3.7
```

运行容器

```shell
docker run --name python3 -p 8000:8000 -v /home/dengcong/project/jupyter:/home/dengcong/project/jupyter -itd python:3.7
```

然后进入到容器里面

```shell
docker exec -it python3 /bin/bash
```

## 二、安装部署jupyter

我们开始安装部署jupyter，后面的操作都是在容器里面。

1、安装jupyter服务所以来的包

```shell
pip3 install jupyter -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

2、生成jupyter的配置文件，生成的文件默认路径如下：

```shell
root@f8996f298763:/# jupyter notebook --generate-config --allow-root
Writing default config to: /root/.jupyter/jupyter_notebook_config.py  // 配置文件存放路径
```

3、设置jupyter的密码，不设置的话，也可以在第一次访问的时候设置

```shell
jupyter notebook password
```

4、修改jupyter的配置文件

新拉取的镜像多半是没有安装vi或者是vim的，可以根据操作系统安装，也可以用sed命令来进行替换操作,（果然服务器上面可以没有vim，但是不能没有linux 三剑客， grep、sed、awk）。

```shell
// 容器在执行下面两条语句之前的大小是265MB， 执行之后的大小为332MB
// 增加的大小还是能接受，毕竟用的是最low的服务器，需要扣一些细节
apt update
apt install vim -y
```

用vim打开jupyter的配置文件，修改如下内容：

```python
c.NotebookApp.ip='*' # 所有ip都可访问
c.NotebookApp.open_browser = False  # 不打开浏览器
c.NotebookApp.port = 8000 # 可自行指定一个端口, 我这里是8000
c.NotebookApp.notebook_dir = "/work" # 设置工作目录
```

> 如果使用sed，可以参考下面语句
>
> ```shell
> // 下面这个命令就是将配置文件中的内容替换成新的配置
> // 比如第一句就是将 # c.NotebookApp.ip = 'localhost' 替换成 c.NotebookApp.ip = '*'
> // 后面两句同理。
> 
> sed -ie "s/# c.NotebookApp.ip = 'localhost'/c.NotebookApp.ip = '*'/g" ~/.jupyter/jupyter_notebook_config.py
> sed -ie 's/# c.NotebookApp.port = 8888/c.NotebookApp.port = 8000/g' ~/.jupyter/jupyter_notebook_config.py
> sed -ie 's/# c.NotebookApp.open_browser = True/c.NotebookApp.open_browser = False/g' ~/.jupyter/jupyter_notebook_config.py
> ```

5、运行jupyter服务

```shell
// 后台运行，并将标准输出信息存到jupyter.log里面
nohup jupyter notebook --allow-root > jupyter.log 2>&1 &  
```

6、停止运行jupyter服务

```shell
ps -ef ｜ grep jupyter
kill -9 pid
```

## 三、对Jupyter使用过程问题总结

### 3.1、没有代码提示怎么办？

安装配置如下：

```shell
# 安装 jupyter 的插件管理器 jupyter_contrib_nbextensions
pip3 install jupyter_contrib_nbextensions -i https://pypi.mirrors.ustc.edu.cn/simple

# 安装关联的 JavaScript 和 CSS 文件
jupyter contrib nbextension install --user

pip3 install --user jupyter_nbextensions_configurator

# 启用  jupyter 的插件管理器 jupyter_contrib_nbextensions
jupyter nbextensions_configurator enable --user
```

如果提示： "jupyter notebook autopep8 Error loading library for python: ModuleNotFoundErrorNo module"，需要安装一下autopep8

```shell
pip3 install autopep8
```

- 参考： [jupyter没有代码提示的解决办法](https://blog.csdn.net/qq_58060770/article/details/123296865)

### 3.2、如果想切换python版本了怎么办？

```python
import sys
print(sys.version)

# 3.7.17 (default, Sep 20 2023, 11:53:41) [GCC 12.2.0]
```

venv创建指定python版本的虚拟环境时，需要本地有指定版本的解释器，但是我本地没有。

```shell
root@f8996f298763:~# python3.9 -m venv stu
bash: python3.9: command not found
```

### 3.3、想在jupyter里面使用vim怎么办？

参考github： [jupyter-vim-binding](https://github.com/lambdalisue/jupyter-vim-binding/wiki/Installation)

激活扩展配置

```shell
pip3 install jupyter_contrib_nbextensions -i https://pypi.mirrors.ustc.edu.cn/simple
jupyter contrib nbextension install --user
pip3 install --user jupyter_nbextensions_configurator
jupyter nbextensions_configurator enable --user
```

添加vim_binding到插件

```shell
# Create required directory in case (optional)
mkdir -p $(jupyter --data-dir)/nbextensions
# Clone the repository
cd $(jupyter --data-dir)/nbextensions
git clone https://github.com/lambdalisue/jupyter-vim-binding vim_binding
# Activate the extension
jupyter nbextension enable vim_binding/vim_binding
```

jupyter里面vim的快捷键有哪些呢？

基本的vim操作。

Option + enter 在创建一个

command + enter 表示运行

## 四、遇见的问题

当时搞到了早上1点过， 部署上去之后死活访问不到服务，因为telnet 不通服务器的8000端口，大概率是猜到了服务器的安全组的策略问题，但是当时很不理解，明明我在服务器上面是放行了8000端口的， 还是不行，后面就休息了，搞不动了。

结果第二天，我用公司的m2的电脑重新登陆阿里云的控制台，发现mbp打开的安全组信息和我早上m2电脑打开的安全组信息不一样，我真的栓Q了，重新开了就好了。

有可能是晚上太迷糊，登陆到了别人号上面？

### 4.1、将容器迁移到其他服务器

最早使用部署的服务器资源不够了，尝试迁移到另外的服务器上面。通过将容器构建成镜像，然后启动容器。

```shell
# 将容器构建成镜像
docker commit -a 'hahadeng' -m 'jupyterbook image' 0fc7a4932f59 python3.9_jupyterbook:0.0.1
# 压缩镜像导出文件
docker save python3.9_jupyterbook:0.0.1 | gzip > python3.9_jupyterbook.tar.gz
```

发现镜像有点大，还是直接构建吧，这回通过Dockerfile来实现。

## 五、参考文章

参考文章

- [配置jupyter在远端服务器运行](https://blog.csdn.net/Castlehe/article/details/108711383)
- [Linux服务器上配置Jupyter并在后台运行](https://blog.csdn.net/qq_41699621/article/details/103064684)
- [服务器端配置jupyter notebook以及本地打不开的解决办](https://blog.csdn.net/pitaya_huatu/article/details/124771038)

待阅读文章：

- [python类变量与__init__声明变量的区别](https://www.cnblogs.com/Xy--1/p/12398718.html)
- [深入理解Python协程：从基础到实战](https://www.cnblogs.com/Amd794/p/18162269)
