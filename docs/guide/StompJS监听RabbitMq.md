---
title: StompJS监听RabbitMq
---


昨天在开发的过程中遇到一个问题，就是用stompjs写的vue代码出来的页面，不能开多个客户端来监听同一个队列的问题。

这里有衍生出来另外一个问题，就是mq这里定义的是一个交换机，stompjs实际是写的交换机的名称。
就是mq在向交换机里面发消息的时候，如果没有绑定队列的话，在消费消息的时候会生成一个临时的队列，问题就出在这里，再用stompjs连接的时候，默认给这个队列起了一个名称，导致另外客户端在请求的时候，生成不了相同名称的队列，导致的问题。
下面我们来看一下具体的代码。


```vue
<html>
<head>
    <title>RabbitMQ Web STOMP Examples : Echo Server</title>
    <meta charset="UTF‐8">
    <script src="js/stomp.min.js"></script>
</head>
<script>
    var client = Stomp.client('ws://116.147.36.xxx:15674/ws');
    var on_connect = function(x) {
        id = client.subscribe("/exchange/test_exchange", function(d) {
            alert(d.body);
        });
    };
    var on_error =  function() {
        console.log('error');
    };
    client.connect('guest', 'guest', on_connect, on_error, '/');
</script>
</body>
</html>
```

然后是项目上的代码 在回调函数里面写的。

```vue
{"x-queue-name":“${url}777，durable: true}
```

**队列的排他性的研究**
开始以为是要个交换机设置排他性为false，但是找了一圈发现只能在队列上面设置，但是队列又是自动生成的，所以这里方向不对。

这里简单描述一下给队列设置排他性，简单学习一下交换机的定义参数和队列的定义参数

排他性的简单描述

https://blog.csdn.net/Lvlht/article/details/105603254

---

**为什么要用exclusive(true)**
如果你想创建一个只有自己可见的队列，即不允许其他用户访问，rabbitmq允许你讲queue声明成为排他性的

**排他性队列的特性**
- 声明exclusive属性的队列只对首次声明他的连接可见，并且在连接断开时自动删除
- 针对连接可见，只要是当前connection下的信道可以访问
- 一旦该队列被声明，其他链接无法声明相同名称的排他队列，其他链接的通道也无法绑定此队列
- 队列即使显示的声明为durable，连接断开时也会被自动删掉

**使用场景**
系统内部进程调用，生产者和消费者在同一个系统内。
