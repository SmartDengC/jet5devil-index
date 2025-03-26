---
title: 240926-步入Jupyter Notebook 7+版本
createTime: 2024/09/26 12:55:51
permalink: /article/ou01gj3t/
tags:
  - jupyter
  - python
---

在安装Jupyter Notebook的时候，发现了Jupyter做了升级，7.x的版本和6.x的版本有一定的差距，简单掌握一下。

基于Docker Python3.9镜像构建的容器。

[基于JupyterLab，Jupyter Notebook 7大版本更新!](https://zhuanlan.zhihu.com/p/646851349)



基础的安装就不赘述，可以在我的以前的文章里面查看。



安装LSP

```
pip3 install jupyter-lsp
```

vim支持 [jwkvam/jupyterlab-vim](https://github.com/jwkvam/jupyterlab-vim)

```
 pip3 install jupyterlab-vim
```



自动补全可以直接在setting里面设置。

我觉得新版的好处就是， 操作方便了，老版本的代码提示了之后要多按一个回车才能取消，新版就不这样，而且新版的补全更加智能，提示的是我想的。

