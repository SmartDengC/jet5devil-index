---
title: ClashX代理局域网热点
author: 邓聪的小破站
createTime: 2024/07/08 00:28:05
permalink: /article/6yjs0u1x/
tags:
  - ClashX
---

参考链接： [如何使用 ClashX 成为局域网热点,代理，及简易原理](https://orcas1202.github.io/posts/clash/)， 需要注意的是端口的设置，设置成混合端口的值。

<!-- more -->

ClashX代理局域网热点；

今天又涉及到了使用ClashX来做局域网热点代理，忘记了，这里在重新操作一次。

![image-20241209223718901](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202412092237999.png)

1、打开ClashX的控制台，开启 **允许来自局域网的连接**， 这里我们记住下面的代理端口号，这里是63110

2、找到电脑的IP，我这里是MAC，直接使用ifconfig就能获取到本机的一个局域网的IP。

```shell
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	inet 192.168.1.5 netmask 0xffffff00 broadcast 192.168.1.255
```

3、将另外的设备连接到与电脑相同的WIFI，然后点击 **配置代理**， 填入刚才我们获取到的IP和端口号，然后保存

操作完之后，我们发现其他设备就可以科学上网了。

比如上面我的电脑IP是192.168.1.5，就在服务器栏填入电脑的IP（例如：192.168.1.5），在端口出填入设定的端口（例如：63110）。

