---
title: Centos8离线安装Docker
createTime: 2024/10/15 23:06:46
permalink: /docker/myovnj21/
tags:
  - docker
---

离线安装终究是我必学的一个技能，今天要掌握的是离线安装docker。

<!-- more -->

今天来学习离线安装docker， 我都离线安装docker， 就表示服务器没办法连接外网，docker-compose就不装了。

## 一、下载Docker离线安装包

首先我们需要知道自己现在部署的服务器是什么架构的。

```shell
[root@1098983719ca install]# uname -a
Linux 1098983719ca 4.15.0-213-generic #224-Ubuntu SMP Mon Jun 19 13:30:12 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

我们可以看到我使用的服务器的架构是x86_64的，然后我们就可以在下面的链接里面找到相应的docker的离线包进行下载。

[Docker离线包下载地址](https://download.docker.com/linux/static/stable/)

我这里下载的是`docker-20.10.9.tgz`这个版本的docker。

## 二、解压安装

```shell
tar -zxvf docker-20.10.9.tgz  // 解压
cp docker/* /usr/bin/  // 安装
dockerd &  // 运行
```

## 三、给docker注册服务

创建文件：

```shell
touch /etc/systemd/system/docker.service
```

写入如下内容：

```
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target
[Service]
Type=notify
ExecStart=/usr/bin/dockerd --selinux-enabled=false --insecure-registry=127.0.0.1
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s
[Install]
WantedBy=multi-user.target
```

重启daemon-reload

```shell
systemctl daemon-reload
```

启动docker

```shell
systemctl start docker
systemctl enable docker // 开启开机自启
```

[centos 离线环境安装docker](https://www.cnblogs.com/hkgan/p/18160079)

[docker离线安装并配置docker.service为服务自启动](https://www.cnblogs.com/gxhh-lzh/p/13818860.html)



这样部署的docker只能使用root用户来启动操控。



## 四、补充Linux命令

### 4.1、ps

```shell
ps -aux | grep docker
```

- au 显示较详细的咨询
- aux 显示所有包含其他使用者的进程

aux输出格式：

```shell
USER  PID  %CPU %MEM   VSZ    RSS  TTY  STAT START   TIME COMMAND
root 5309  0.0  0.0  1078500 1644   ?   Sl   Oct10   0:00 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 9270 -container-ip 172.17.0.4 -container-port 8000
```

 补充：

```shell
// To see every process on the system using standard syntax:
ps aux ：最常用的 BSD 风格选项组合，其中的 a表示所有关联到终端的进程，如果同时使用 x 则代表所有进程；u 表示列出进程的用户。

// To see every process on the system using BSD syntax:
ps -elf ： unix标准风格组合，其中-e 代表列出所有进程，-l 代表长格式，-f 代表完整的格式
```

### 4.2、netstat

```shell
netstat -nplt | grep docker
```

 netstat用于列出系统所有的网络套接字连接情况，包括tcp，udp以及unix。

- netstat -a   列出所有当前连接
- netstat -at  只列出tcp协议的连接
- netstat -au 只列出udp协议的连接
- netstat -ant 
  - 默认情况下netstat会通过反向代理解析技术查找每个ip地址对应的主机名，这样会降低查找速度，但是我们可以使用-n选项禁用域名解析功能。
- netstat -nlt  使用-l选项列出正在监听的套接字
- netstat -nplt 使用-p选项查看进程信息

[Linux 常用命令之 netstat 的10个基本用法](https://blog.csdn.net/LL845876425/article/details/92801460)







补充：

需要使用非root用户来安装。

```
dockerd needs to be started with root. To see how to run dockerd in rootless mode with unprivileged user, see the documentation
```

Docker提供了**Rootless Docker**模式，允许非root用户启动和使用Docker。





https://docs.docker.com/engine/security/rootless/

1 安装shadow-utils

dnf install -y fuse-overlayfs

dnf install -y iptables



```
failed to start daemon: Error initializing network controller: error obtaining controller instance: failed to create NAT chain DOCKER: iptables failed: iptables -t nat -N DOCKER: iptables v1.8.5 (nf_tables): Could not fetch rule set generation id: Permission denied (you must be root)
```

反正都会用到root账户，那么创建一个带有root权限的用户，这样在后期就少用root，少申请工单。

使用上面的方法，必须要root 权限。



看学习如何使用rootless docker来部署？
