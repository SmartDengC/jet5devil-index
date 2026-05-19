---
title: AI应用，大模型提示词总结
createTime: 2026/03/18 08:09:19
permalink: /article/x02gk1y8/
tags:
  - ai

---

我发现安装大模型也好，安装OpenClaw类似的Ai助手也好，对于程序员来说都比较简单，但是对于AI应用就比较难，下面是我自己在使用过程中的一些对大模型的提问，我觉的比较好的，汇总一下。



我现在研究的方向不应该

1、到豆瓣 https://movie.douban.com 搜索最近热门的电影，结合热度、评分和上映时间综合筛选10部电影给我，整理成Excel表格，并根据Excel表格的信息设计一个可视化HTML，最后把Excel和HTML一并发到我的飞书上

![微信图片_20260318081811_135_127 (1)](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202603180819052.png)

**2、我现在闲着没事，看能给我推荐一些信息。**

正好趁着闲暇时间，可以看一些能带来启发或者稍微活动一下大脑的信息。以下是几个不同维度的推荐，看看哪个最合你的胃口：

- 算法与底层逻辑的“黑魔法”：可以研究一下高级的位运算（Bitwise Operations）技巧。除了基础的与、或、非、异或，像“如何不使用额外变量交换两个整数”或者“如何通过 $O(1)$ 的时间复杂度计算一个数字的汉明权重（二进制中 1 的个数）”这类技巧，在优化代码性能时非常巧妙，也是算法题中的常客。
- API 调用的稳定性优化：在集成外部服务时，遇到 Rate Limit（速率限制）或权限拒绝（Permission Denied）是常有的事。了解一下指数退避算法（Exponential Backoff）配合抖动（Jitter）的重试机制。这是处理 API 调用失败的标准最佳实践，能大幅提高客户端的健壮性。
- 实时数据流的技术选型：如果你需要获取高度实时的数据（比如现货黄金、股票行情的秒级变动），可以对比一下 HTTP 轮询（Polling）、Server-Sent Events (SSE) 和 WebSocket 的优劣。对于需要低延迟和双向通信的金融数据面板，WebSocket 通常是更好的选择。
- 前沿科技扩展：目前 AI 领域的一个热门趋势是端侧小模型（SLM）。很多开发者开始尝试在本地设备（甚至浏览器中）运行几亿参数的轻量级模型，作为云端庞大 API 模型的补充。这能很好地解决数据隐私和网络延迟的问题。

你想深入探讨上面哪一个话题？或者，需要我为你随机生成一道算法题来练练手吗？

3、使用ai能体来获取免费的token，现在有一个github项目，就是来统计这些中转站免费的token的。

[cheahjs/free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources)

4、中介， 信息差，房地产

5、ai集群

[pinchbench](https://pinchbench.com/)

https://im.page/fankaishuoai

gpt 5.4 + kimi-k2.5

6、将openclaw 接入到[Moltbook](https://www.moltbook.com/)

7、[happycapy](https://happycapy.ai/app)

- 帮我看一下这个github仓库是做什么的： url， 不用执行任何实质操作。
- 可以将这个游戏放到我的output里然后让我可以真的跑来看看吗？

8、我在OpenCode里面，让他帮我安装gnome的图形化界面。

9、OpenClaw实现市场监控：[OpenClaw skills重构量化交易逻辑](https://developer.aliyun.com/article/1712090)

10、AI量化交易

- [xauusd.team](https://xauusd.team/)

- [xaudiy.com](https://xaudiy.com/)

- [valuecell.ai](https://valuecell.ai/chat)

11、安装skill

- 给本机的openclaw开发一个实时获取股票行情的skill，不是本机的opencode

- 用同样的方法开发一个获取财经新闻的skill，同样是给本机的openclaw开发，不是本机的opencode

12、Node使用nvm管理的，通过npx执行下面skill的安装：npx skills add alchaincyf/zhangxuefeng-skill。

- [alchaincyf/zhangxuefeng-skill](https://github.com/alchaincyf/zhangxuefeng-skill)

- 「用张雪峰的视角」「张雪峰会怎么看」「张雪峰模式」「雪峰视角」「帮我用张雪峰的角度想想」「如果张雪峰会怎么说」「切换到张雪峰」

13、Node使用nvm管理的，通过npx执行下面skill的安装：npx skills add alchaincyf/elon-musk-skill

- []()

- 「用马斯克的视角」「马斯克会怎么看」「Musk模式」「第一性原理」「白痴指数」「五步算法」「垂直整合」

14、Node使用nvm管理的，通过npx执行下面skill的安装：npx skills add alchaincyf/munger-skill

- [alchaincyf/munger-skill](https://github.com/alchaincyf/munger-skill.git)

- 「用芒格的视角」「芒格会怎么看」「逆向思考一下」「这有什么认知偏误」「能力圈之外」「激励结构是什么」



Polymarket 实战

clawwork项目， ai同事自主进行预测市场交易分析，实现11小时内盈利15000刀



moltbook

模型的配置，简单的任务简单模型来做，复杂的任务，高级模型来做

预算配置，设置 每天使用token的限制



fhBPoCbtoHn8



我们想找一下2026年 ai agent市场当中最新的进展。

[hero-sms](https://hero-sms.com/cn)
