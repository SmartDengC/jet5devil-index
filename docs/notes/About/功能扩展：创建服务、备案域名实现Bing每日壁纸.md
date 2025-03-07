---
title: 创建服务、备案域名实现Bing每日壁纸
createTime: 2025/03/07 08:10:07
permalink: /self/qm72qnmw/
---

大概的需求是这样的，我希望通过一个固定的 url，然后返回必应的每日壁纸，用必应的每日壁纸来做我主页的壁纸。最后的效果就是你点击这里，每次都会返回不一样的图片，[Click On It](https://dengcong.org/bingWallpaper_hud). （这个是随机返回的图片）

~~开始我以为是必应官方提供的，结果不是，这里面使用到了其他小伙伴开发的 api 接口，就相当于我们直接使用 api 就能随机的获取到必应的壁纸，[开放 Api 接口](https://bing.img.run/api.html)。也可以直接到 github 仓库，自己搞一个。[mike126126/bing](https://github.com/mike126126/bing)~~

20250121 更新

~~原网站SSL证书过期了，找到另外一个 Github 仓库 [flow2000/bing-wallpaper-api](https://github.com/flow2000/bing-wallpaper-api)，但是访问速度有点慢，放弃了。~~

开始自己搭建。

## 1.1、后端服务代码

[SmartDengC/bing](https://github.com/SmartDengC/bing)

项目将php代码转化成python代码，并结合fastapi web框架实现服务调用，服务使用docker部署。

详细参考：

## 1.2、申请 SSL 并配置 Nginx

**注意：需要开通服务器443端口安全组。开通443端口！开通443端口！开通443端口！**

阿里云提供了免费的 SSL 证书，这里我就以阿里云为例简单说一下。

首先我们登陆上阿里云的网站，然后在搜索框里面输入 SSL，会弹出来一些选项，我们点击**数字证书管理服务（原 SSL 证书）**，然后在点击 **选购 SSL 证书**， 点击 **个人测试证书（原免费证书）**，点击立即购买，然后勾选相应的，就可以免费购买了。

后面点击创建证书，选择已有的证书，点击证书后面的更多，我们就可以下载 nginx 对应的 pem 和 key 文件了。

下载之后然后上传到服务器，使用 nginx 做代理，下面是我 nginx 对应位置的配置内容：

```nginx

http {
    server {
        listen 80;
        # server_name distinct for localhost and ip
        server_name hahadeng.cn;
        # 将请求转成https
        rewrite ^(.*)$ https: //$host$1 permanent;
    }
    server {
        # 监听443端口
        listen 443;
        server_name 192.168.0.1;
        ssl on;
        #ssl证书的pem, key文件路径
        ssl_certificate /home/xxx/ssl/www.tmp.cn.pem;
        ssl_certificate_key /home/xxx/ssl/www.tmp.cn.key;

        location / {
            root html;
            index index.html index.htm;
        }
    }
}
```

后面我们就可以使用 https://ip 进行访问了。

## 1.2、过程中遇到的几个问题

### 1.2.1、Https 调用 Http 地址

原来我是直接用服务器 nginx 代理到上面所说的开放 api 上面，但是我没有绑定域名，使用的是 Http 协议，但是博客是我用 Cloudflare 进行代理的，可以使用 Https，这样就导致了博客提供的服务调用 Http 的 url， 导致了下面问题：

```shell
bingWallpaper_hub:8 Mixed Content: The page at 'https://www.xxx.org/bingWallpaper_hub' was loaded over HTTPS, but requested an insecure frame 'http://batit.aliyun.com/alww.html?id=00000000004290688701'.
This request has been blocked; the content must be served over HTTPS.
```

解决的方式就是将 Http 协议想办法通过加 SSL 转化成 Https。

### 1.2.2、使用国内的服务器绑定域名需要备案？

我使用.org 的域名解析阿里云的服务不行，要备案；使用国内的.cn 的域名解析到阿里云的服务器不行，要备案；使用.cn 的域名解析到腾讯云的服务器不行，要备案。

现在是将.org 的域名解析到腾讯云服务器上，看能坚持多久。刚才想到了不用域名，直接使用 https + ip 的形式来。

现在做了调整，直接访问图片地址是访问不了的了。

### 1.2.3、到头来还是需要备案？

今天在访问的时候，出现了一个问题，`curl: (51) SSL: no alternative certificate subject name matches target host name '132.232.xx.xx'`， 大概的意思就是 ssl 证书和 host name 不匹配，因为我签发的证书是关联到 hahadeng.cn 上面的，直接使用服务器外网 ip 就没办法匹配证书了， 这下要想其他办法了。

到最后，直接用[Click It](https://bing.img.run/rand_uhd.php)了。
