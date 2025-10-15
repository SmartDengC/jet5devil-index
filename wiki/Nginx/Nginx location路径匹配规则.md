---
title: location路径匹配规则
createTime: 2025/05/23 23:37:10
permalink: /nginx/vzit6afz/
---

[Nginx的location路径匹配规则](https://blog.csdn.net/beichengliulixue/article/details/121971227)



## 一、语法说明

- =：完全匹配

- / ：普通匹配
- ^~： 无正则普通匹配（匹配前缀）， 表示不会往后匹配正则

- ~：表示正则匹配，区分大小写
- ~*：表示正则匹配，不区分大小写

## 二、匹配规则（优先级）

- = 优先级最高，一旦匹配成功，则停止搜索其他location的匹配项。
- 所有剩下的常规字符串（^~和普通匹配），‘最长命中’规则，优先使用匹配最长的结果。
- 正则表达式，在配置文件中定义的顺序
  - 注：如果得到的最长location为^~类型，则表示阻断正则表达式，不在匹配正则表达式。
  - 如果得到的最长location不是^~类型，继续匹配正则表达式，只要有一个正则成功，则使用这个正则location，立即返回结果，并结束解析过程


### 2.1 /、^~和 ~的关系

```nginx
				// 不阻止正则
				location /test_1 {
            return 400;
        }
				// 当^~匹配上后会阻止正则
        location ^~ /test {
            return 401;
        }
        location ~ /test {
            return 402;
        }
```

- 请求path=/test_1，返回402，此时^~和普通匹配只记住了一个最长的一个location /test_1， 不会阻止正则。
- 请求path=/test，返回401，此时^~和普通匹配只记住了一个最长一个location ^~ /test ,会阻止正则

### 2.2、~ 规则匹配

路径中只要包含就可以匹配，同时正则匹配时，放在前面的优先匹配，如果不区分大小写时，使用 ~*, 因此在书写代理时尽量将精确匹配放在前面。

```nginx
        location ~ /hello {
            return 602;
        }
        location ~ /helloworld {
            return 601;
        }
```

- 请求 world/helloworld 返回602
- 请求 helloworld 返回602

## 三、路径替换

- 配置proxy_pass时，可以实现URL路径的部分替换
- proxy_pass的目标地址，默认不带/， 表示只代理域名（IP+端口），path和query部分不会变。
- 如果在目标地址端口后面有/，或者/x x/yy等目录，则表示把path中location匹配成功的部分剪掉在拼接到proxy_pass目标地址后面。

例如：/a/b.html

```nginx
location /a {
  proxy_pass http:server;
}
```

实际代理的目标url是：http://server/a/b.html，（把/a/b.html直接拼接到http://server之后）

```nginx
location /a/ {
  proxy_pass http://server/;
}
```

实际代理的目标url是：http://server/b.html， （把/a/b.html的/a/去掉之后，拼接到http://server/之后）



总结代理地址如下：

1、如果proxy_pass代理地址端口后无任何字符，则转发后地址为：代理地址+访问的path

2、如果proxy_pass代理地址端口后有目录（包括/，或者/xx），则转发后地址为：代理地址+访问的path去掉location匹配的路径。
