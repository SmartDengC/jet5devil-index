---
title: Cloudflare域名注册并做DNS代理
author: 邓聪的小破站
createTime: 2024/09/06 21:28:02
permalink: /article/k7pxr45f/
tags: 
  - cloudflare
  - domain
---

在国内，对于域名的管理是相对比较严格的，还有另外一个方面，就是有一些特定后缀的域名在国内是没有办法购买的，比如像是.org、.io这些域名，所以就会在国外供应商购买。

记录在CloudFlare上面购买org后缀的域名，并实现DNS代理。

<!-- more -->

[CloudFlare官方地址](https://www.cloudflare.com/)

## CloudFlare域名注册

自己想注册一个好一点的域名，促使自己对知识的总结与学习，但是经过几周的蹲守，还是没有合适的com或者是cn结尾的后缀域名，又因为国内各种原因，你会发现国内知名的几大厂商都没有注册org后缀域名的功能，所以就把思路调转到了国外的域名注册商，像是`NameCheap`，还有GoDaddy都是具备org后缀域名注册的功能，因为使用的少，就转战到了CloudFlare，这个也是我部署前端页面用的服务，刚好就放到一起了。

这里就简单说一下我是怎么注册域名使用的。

我们注册CloudFlare的用户登陆之后，会在左侧看到一个`Domain Registrtion`的选项，里面有`Register Domains`（域名注册）。

选择自己心仪的域名进行购买，像是选择都比较的简单，主要复杂的是付款，因为这是国外的网站，支持的支付方式就只有信用卡或者是PayPal， 但是很多时候我们都没有信用卡， 这里假设你有银行的借记卡，使用国内[PayPal](https://www.paypal.com/c2/webapps/mpp/account-selection)。

[【保姆级教程】大陆用户怎么使用PayPal](https://zhuanlan.zhihu.com/p/671534537)

这里先借鉴别人的博客，注册PayPal。

---

后面就是配置DNS，可以在cloudflare里面创建pages，然后在创建的pages里面设置custom domains。

（对于后面的图片，看是在服务器上面配置分布式数据存储服务来存， minio？）

---

##  CloudFlare代理国内域名

昨天在阿里云上面搞了一个.cn结尾的域名，使用CloudFlare来解析。

重要的一步就是在域名管理中，将默认的DNS服务器修改成CloudFlare提供的DNS服务器既可。

例如：

| 当前DNS服务器            |
| :----------------------- |
| karina.ns.cloudflare.com |
| woz.ns.cloudflare.com    |

然后在配置解析规则。

比如：

| Type  | Name |         Content         | Proxy status | TTL  |
| :---: | :--: | :---------------------: | ------------ | :--: |
| CNAME |  i   | xxx-index-new.pages.dev | Proxied      | Auto |

结果访问不了，然后百度了一下，说解析的时候，国内不能开代理。

![](https://linux.do/uploads/default/optimized/4X/e/f/3/ef37541ed2264b3d92a733caf8f6114c9014ce63_2_1380x436.png)

参考链接：[CloudFlare 的 DNS 解析选择代理的话，大陆访问不了](https://linux.do/t/topic/771279)
