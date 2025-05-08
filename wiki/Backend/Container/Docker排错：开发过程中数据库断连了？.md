---
title: Docker排错：开发过程中数据库断连了？
createTime: 2025/05/08 12:12:38
permalink: /article/h51l6bot/
tags:
  - docker
---

今天在开发项目中，突然数据库连接不上了，就到服务器上面看到底是什么问题，服务器上输入docker的什么命令都没有返回，像是一直卡住了似的。

通过`systemctl status docker`确实发现docker是activating的，但是通过`journalctl -u docker.service`发现docker没有启动成功。

报错如下：

```shell
May 08 11:45:48 YS-QD-0033 dockerd[29185]: failed to start daemon: failed to dial "/run/containerd/containerd.sock": failed to dial "/run/containerd/containerd.sock": context deadline exceeded
May 08 11:45:48 YS-QD-0033 systemd[1]: docker.service: Main process exited, code=exited, status=1/FAILURE
May 08 11:45:48 YS-QD-0033 systemd[1]: docker.service: Failed with result 'exit-code'.
May 08 11:45:48 YS-QD-0033 systemd[1]: Failed to start Docker Application Container Engine.
May 08 11:45:50 YS-QD-0033 systemd[1]: docker.service: Service hold-off time over, scheduling restart.
May 08 11:45:50 YS-QD-0033 systemd[1]: docker.service: Scheduled restart job, restart counter is at 50.
May 08 11:45:50 YS-QD-0033 systemd[1]: Stopped Docker Application Container Engine.
May 08 11:45:51 YS-QD-0033 systemd[1]: Starting Docker Application Container Engine...
```

大概了解是因为containerd没有启动，但是`systemctl status containerd.service` 发现报错，大概意思就是说没有`/usr/bin/containerd`的文件夹

`journalctl -u containerd.service`

```shell
May 08 11:46:49 YS-QD-0033 systemd[31045]: containerd.service: Failed to execute command: No such file or directory
May 08 11:46:49 YS-QD-0033 systemd[31045]: containerd.service: Failed at step EXEC spawning /usr/bin/containerd: No such file or directory
May 08 11:46:49 YS-QD-0033 systemd[1]: containerd.service: Main process exited, code=exited, status=203/EXEC
May 08 11:46:49 YS-QD-0033 systemd[1]: containerd.service: Failed with result 'exit-code'.
May 08 11:46:49 YS-QD-0033 systemd[1]: Failed to start containerd container runtime.
May 08 11:46:54 YS-QD-0033 systemd[1]: containerd.service: Service hold-off time over, scheduling restart.
May 08 11:46:54 YS-QD-0033 systemd[1]: containerd.service: Scheduled restart job, restart counter is at 842.
May 08 11:46:54 YS-QD-0033 systemd[1]: Stopped containerd container runtime.
```

后面重新安装了一下containerd， apt install containerd.io，发现启动docker出现了另外的错误。

**Failed to start docker.service: Unit docker.service is masked.**

[Docker安装完启动时提示Failed to start docker.service: Unit docker.service is masked.](https://blog.csdn.net/u011403655/article/details/50524071)

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

12月 07 16:29:00 xiechen-Ubuntu systemd[1]: Starting LSB: Create lightweight, portable, self-sufficient containers....
12月 07 16:29:00 xiechen-Ubuntu docker[3212]:  * /usr/bin/dockerd not present or not executable
12月 07 16:29:00 xiechen-Ubuntu systemd[1]: docker.service: Control process exited, code=exited status=1
12月 07 16:29:00 xiechen-Ubuntu systemd[1]: docker.service: Failed with result 'exit-code'.
12月 07 16:29:00 xiechen-Ubuntu systemd[1]: Failed to start LSB: Create lightweight, portable, self-sufficient containers..
```

直接重新安装一下；

```shell
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
docker container ls --all
```

参考:

[[docker] 一、入门](https://blog.csdn.net/JeromeCoco/article/details/110874602)

待完成任务：

- containerd相关内容学习，[再见 Docker ！5分钟转型 containerd !](https://zhuanlan.zhihu.com/p/356037350)
- sealos相关内容学习， [一文读懂 Sealos 到底是个啥](https://zhuanlan.zhihu.com/p/655620657)

面临的问题：

- 1、在重新安装docker的时候，会删除现有的容器吗？
