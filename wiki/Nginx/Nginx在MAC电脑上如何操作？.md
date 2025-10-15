---
title: 在MAC电脑上如何操作
createTime: 2025/05/24 18:36:06
permalink: /nginx/zppg26x9/
---

我们大部分使用nginx都是在服务器上面，服务器使用的操作系统大多都是linux，与mac系统有区别。



下面简单记录一下在mac上如何操作nginx。



在mac上使用brew安装软件，

- `brew search nginx` 搜索软件命令
- `brew install nginx` 安装软件命令
- `brew uninstall nginx` 卸载软件
- `sudo brew update` 升级命令
- `brew info nginx` 查看安装信息（比如查看安装目录）
- `brew list` 查看已经安装的软件



我们可以使用`brew install nginx`进行软件的安装，我们重点来看安装之后，ngxin的相关信息。

使用`brew info nginx`来查看。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1956fb5ab91b4af3b00b0e52ba340713~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Nginx的配置文件路径：`/usr/local/etc/nginx/nginx.conf`
Nginx的服务器默认路径：`/usr/local/var/www`
Nginx的安装路径：`/usr/local/Cellar/nginx/1.15.5`



接下来我们看一下服务启动停止相关的命令：

- `brew services start nginx`  启动Nginx服务
- `brew services restart nginx` 重启Nginx服务
- `brew services stop nginx`  停止Nginx服务
- 先进入bin目录：`cd /usr/local/Cellar/nginx/1.15.5/bin/`， 然后再执行：`./nginx -s reload`， 如下所示：



剩下的我们就可以参考linux的操作。

[Mac 安装Nginx详细教程](https://juejin.cn/post/6986190222241464350)
