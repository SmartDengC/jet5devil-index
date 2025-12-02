---
title: Docker排错：开发过程中数据库断连了？
createTime: 2025/05/08 12:12:38
permalink: /article/h51l6bot/
tags:
  - docker
---

containerd.io没有安装导致的容器问题。

但是为什么会突然出现问题？

<!-- more -->

今天在开发项目中，突然数据库连接不上了，就到服务器上面看到底是什么问题，服务器上输入docker的什么命令都没有返回，像是一直卡住了似的。

通过`systemctl status docker`确实发现docker是activating的（现在才发现activating应该是激活中，active (running) 才表示运行中，笑哭），但是通过`journalctl -u docker.service`发现docker没有启动成功。

报错如下：

```shell
failed to start daemon: failed to dial "/run/containerd/containerd.sock": failed to dial "/run/containerd/containerd.sock": context deadline exceeded
docker.service: Main process exited, code=exited, status=1/FAILURE
docker.service: Failed with result 'exit-code'.
Failed to start Docker Application Container Engine.
docker.service: Service hold-off time over, scheduling restart.
docker.service: Scheduled restart job, restart counter is at 50.
```

大概是因为containerd有问题。

`systemctl status containerd.service` 查看containerd的状态，发现没有运行。

`journalctl -u containerd.service`查看containerd服务的报错日志，大概意思就是说没有`/usr/bin/containerd`的文件夹

```shell
containerd.service: Failed to execute command: No such file or directory
containerd.service: Failed at step EXEC spawning /usr/bin/containerd: No such file or directory
containerd.service: Main process exited, code=exited, status=203/EXEC
containerd.service: Failed with result 'exit-code'.
Failed to start containerd container runtime.
containerd.service: Service hold-off time over, scheduling restart.
containerd.service: Scheduled restart job, restart counter is at 842.
Stopped containerd container runtime.
```

检查containerd是否安装：

```shell
which containerd
```

如果返回空，表示containerd没有安装，可以通过下面命令安装：

```shell
sudo apt-get update
sudo apt-get install containerd
```

检查containerd可执行文件路径。如果containerd已经安装，但仍然找不到可执行文件，检查它实际安装路径：

```shell
ls -l /usr/bin/containerd
```

后面发现是`containerd.io`没有安装，后面重新安装了一下， `apt install containerd.io`，发现启动docker出现了另外的错误。

**Failed to start docker.service: Unit docker.service is masked.**

[Docker安装完启动时提示Failed to start docker.service: Unit docker.service is masked.](https://blog.csdn.net/u011403655/article/details/50524071)

[[docker] 一、入门](https://blog.csdn.net/JeromeCoco/article/details/110874602)

```shell
systemctl unmask docker.service
systemctl unmask docker.socket
systemctl start docker.service
```

出现如下报错：

```shell
xiechen@xiechen-Ubuntu:~$ systemctl status docker.service
● docker.service - LSB: Create lightweight, portable, self-sufficient containers.
   Loaded: loaded (/etc/init.d/docker; generated)
   Active: failed (Result: exit-code) since Mon 2020-12-07 16:29:00 CST; 9s ago
     Docs: man:systemd-sysv-generator(8)
  Process: 3212 ExecStart=/etc/init.d/docker start (code=exited, status=1/FAILURE)

Starting LSB: Create lightweight, portable, self-sufficient containers....
* /usr/bin/dockerd not present or not executable
docker.service: Control process exited, code=exited status=1
docker.service: Failed with result 'exit-code'.
Failed to start LSB: Create lightweight, portable, self-sufficient containers..
```

直接重新安装一下：

```shell
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
docker container ls --all
```

但是重装docker的时候，出现如下问题：



```shell
The following packages have unmet dependencies:
 docker.io : Depends: containerd (>= 1.2.6-0ubuntu1~)
E: Unable to correct problems, you have held broken packages.
```

[【问题解决】docker.io : 依赖: containerd (＞= 1.2.6-0ubuntu1~)](https://blog.csdn.net/p1279030826/article/details/126185482)

```shell
root@YS-QD-0033:/home/baoleiji# dpkg -l containerd*
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                                            Version                      Architecture                 Description
+++-===============================================-============================-============================-===================================================================================================
rc  containerd                                      1.6.12-0ubuntu1~18.04.1      amd64                        daemon to control runC
ii  containerd.io                                   1.6.21-1                     amd64                        An open and reliable container runtime
```

解决：

```shell
# 查看是否安装了 containerd
$ dpkg -l containerd*
期望状态=未知(u)/安装(i)/删除(r)/清除(p)/保持(h)
状态=未安装(n)/已安装(i)/仅存配置(c)/仅解压缩(U)/配置失败(F)/不完全安装(H)/触发器等待(W)/触发器未决(T)
错误?=(无)/须重装(R) (状态，错误：大写=故障)

root@YS-QD-0033:/home/baoleiji# dpkg -l containerd*
||/ Name                                            Version                      Architecture                 Description
+++-===============================================-============================-============================-===================================================================================================
ii  containerd                                      1.6.12-0ubuntu1~18.04.1      amd64                        daemon to control runC
rc  containerd.io                                   1.6.21-1                     amd64                        An open and reliable container runtime

# 如果containerd不存在，则安装
sudo apt install containerd
# 如果containerd.io不存在，则安装
sudo apt-get install containerd.io

# 安装成功后再安装 docker.io
sudo apt-get install docker.io
# 查询版本
docker version
```

待完成任务：

- containerd相关内容学习，[再见 Docker ！5分钟转型 containerd !](https://zhuanlan.zhihu.com/p/356037350)
- sealos相关内容学习， [一文读懂 Sealos 到底是个啥](https://zhuanlan.zhihu.com/p/655620657)

面临的问题：

- 1、在重新安装docker的时候，会删除现有的容器吗？ 

不用pure删除是不会删除容器的

