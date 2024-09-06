---
title: Cloudflare域名注册并做DNS代理
author: 邓聪的小破站
createTime: 2024/09/06 21:28:02
permalink: /article/k7pxr45f/
tags:
  - cloudflare
  - domain
---

记录在CloudFlare上面购买org后缀的域名，并实现DNS代理。

<!-- more -->

自己想注册一个好一点的域名，促使自己对知识的总结与学习，但是经过几周的蹲守，还是没有合适的com或者是cn结尾的后缀域名，又因为国内各种原因，你会发现国内知名的几大厂商都没有注册org后缀域名的功能，所以就把思路调转到了国外的域名注册商，像是NameCheap，还有GoDaddy都是具备org后缀域名注册的功能，因为使用的少，就转战到了CloudFlare，这个也是我部署前端页面用的服务，刚好就放到一起了。

这里就简单说一下我是怎么注册域名使用的。

我们注册CloudFlare的用户登陆之后，会在左侧看到一个Domain Registrtion的选项，里面有Register Domains（域名注册）。

选择自己心仪的域名进行购买，像是选择都比较的简单，主要复杂的是付款，因为这是国外的网站，支持的支付方式就只有信用卡或者是PayPal， 但是很多时候我们都没有信用卡， 这里假设你有银行的借记卡，使用国内[PayPal](https://www.paypal.com/c2/webapps/mpp/account-selection)。

[【保姆级教程】大陆用户怎么使用PayPal](https://zhuanlan.zhihu.com/p/671534537)

这里先借鉴别人的博客，注册PayPal。

---

后面就是配置DNS，可以在cloudflare里面创建pages，然后在创建的pages里面设置custom domains。

（对于后面的图片，看是在服务器上面配置分布式数据存储服务来存， minio？）
