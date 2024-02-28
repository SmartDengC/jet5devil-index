---
title: 辛苦搭建的数据库被盗了？
author: 邓聪的小破站
createTime: 2024/02/23 10:39:28
permalink: /article/0k0hekm7/
tags: 
  - linux
  - mysql
  - docker
---

我在前一段时间不是用docker创建了一个mysql5.7的容器吗，里面运行这mysql的服务，不知道为什么这个mysql的服务老是挂掉，第一次是在20小时之前，我看也没啥问题，昨天我又给起起来了，今天早上我就说去检查一下，看能不能连的上，结果呢，又在4个小时之前挂掉了。

```shell
root@iZ2vc34h4mxsxearc36g2yZ:~# docker ps -a
CONTAINER ID   IMAGE              COMMAND                  CREATED      STATUS                   PORTS     NAMES
81a924418695   cityhub/mysql5.7   "docker-entrypoint.s…"   2 days ago   Exited (0) 4 hours ago             mysql5.7
```

没关系，我又给起起来，想着晚点再看下为什么会掉，起起来之后我连上数据库，我发现我之前建的表不见了， 多个一个新的数据库，我丢，不见了。

好好好，我看新的数据库是啥，打开一看，感觉我的数据库应该是被盗了，好好好，他给我留了两句话。

```
All your data is backed up. You must pay 0.015 BTC to 16w2xEN9pcjFgECWH1LDVpxxxx In 48 hours, your data will be publicly disclosed and deleted. (more information: go to http://iplis.ru/data2)

After paying send mail to us: rambler+2cjzw@onionmail.org and we will provide a link for you to download your data. Your DBCODE is: xxxx
```

大概得意思就是：“我的数据库数据已经备份了，我必须向某某某账户支付0.015个比特币，不然的话，在48小时之后我的数据会被公开或者删除，更多信息访问这个http://iplis.ru/data2 网站。付款后给rambler+2cjzw@onionmail.org这个邮箱发邮件，给我提供下载的数据的连接。”

![image-20240223115813845](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202402231158878.png)

好好好，恢复数据要我5K多，可以，还是很有意思的，让我得空研究一下这玩意。

打开上面的网站还挺礼貌地，害怕我没有比特币，一点点给我说怎么弄，一点都不提盗我数据库里面数据的行为。:sweat_smile:

```
You can contact us if you are having problems paying with crypto, discuss other crypto payment methods, etc. we will answer promptly. 
If you already sent the payment then contact us with the transaction ID or payment screenshot. We will check as soon as possible 
send you a link for you to download the entire database and delete our copy.  
 
The only payment method is using crypto. Bitcoin is the easiest but we can accept any other crypto. 
ONLY CRYPTO, no Paypal, no Alipay, etc.
If you don't have Bitcoin, you can purchase it using a credit card from the following websites:
MoonPay: https://www.moonpay.com/buy
Paybis: https://paybis.com/
Changelly: https://changelly.com/buy

You can buy BTC with a credit card, bank transfer, Google Pay or Apple pay easily in:
https://guardarian.com
https://simpleswap.io or https://www.moonpay.com/buy
https://buy.simplex.com
https://https://global.transak.com/

Alternatively, you can buy Bitcoin using other payment methods from the following platforms (some of them work in China):
Paxful: https://paxful.com/
Binance: https://www.binance.com/
Crypto.com: https://www.crypto.com/
Huobi: https://www.huobi.com/
OKCoin: https://www.okcoin.com/
BTCC: https://www.btcc.com/
Paybis: https://paybis.com/
Coinmama: https://coinmama.com/
Bitfinex: https://www.bitfinex.com/

For users in China, Bitcoin can be purchased with Alipay from:
CoinCola: https://www.coincola.com/?lang=zh-HK
BitValve: https://www.bitvalve.com/buy-bitcoin/alipay

Please take note of the following:

We are aware that you have accessed this guide.
THE ONLY WAY TO RECOVER YOUR DATA IS BY MAKING THE PAYMENT. WE WILL NOT PROVIDE THE DATA FOR FREE OR AT A DISCOUNT.
If you decide not to retrieve the data, we may sell your database in online markets, disclose it to your users 
and request payment from them, disclose it in online breach forums, or delete it.
We will contact the GDPR authorities in your country if applicable.

If you cannot contact us, please visit https://getsession.org/ and download the Session Messenger. 
Add us using the following ID for a fluid conversation and better negotiation, 
*** Don't forget to mention the DBCODE that was assigned to you***:

05a5ba6491a15908207cce6e257b3316cd11cb2575f75194d3c59c37de68eaf55a
```

