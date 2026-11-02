---
title: AI应用，大模型提示词总结
createTime: 2026/03/18 08:09:19
permalink: /article/x02gk1y8/
tags:
  - ai

---

我发现安装大模型也好，安装OpenClaw类似的Ai助手也好，对于程序员来说都比较简单，但是对于AI应用就比较难，下面是我自己在使用过程中的一些对大模型的提问，我觉的比较好的，汇总一下。

<!-- more -->

## 提示词

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

- 「用马斯克的视角」「马斯克会怎么看」「Musk模式」「第一性原理」「白痴指数」「五步算法」「垂直整合」

14、Node使用nvm管理的，通过npx执行下面skill的安装：npx skills add alchaincyf/munger-skill

- [alchaincyf/munger-skill](https://github.com/alchaincyf/munger-skill.git)

- 「用芒格的视角」「芒格会怎么看」「逆向思考一下」「这有什么认知偏误」「能力圈之外」「激励结构是什么」

15、OpenCode 

- 使用@Schema(description = "")注解优化文件 xxx 中字段注释。
- 使用lombok和@Schema相关注解，简化文件/类 xxxx中代码。
- 整理文件 xxx 的逻辑，简单讲解一下代码逻辑，并看一看是否有可优化的代码，如果有，该如何优化？
- 方法 xxxx 及其相关方法代码量太多，不知道有没有重复逻辑的代码，重构一下方法 xxxx及其调用的方法，要求减少 stream 流的使用，不要在 stream 中调用自定义方法，可读性差；
- 帮我看一下当前项目中未提交修改的代码有没有问题，或者有优化的地方吗？
- 我是编程小白，不了解 Ortools 相关的 api，详细的解释一下ConstraintBuilder 文件的逻辑
- 使用相同的方式处理文件 xxx， 1、先分析代码逻辑，2、在不改变原有代码逻辑的前提下，将 CpModel 相关约束使用数学表达式，以注释的形式添加到文件中。3、在文件factory-production/docs/cp-sat-constraint-builder-analysis.md 后面追加对文件的详细分析内容。
- 处理方法ProductionCapacityConstraintBuilder. bindCapacity，1、先分析代码逻辑，2、在不改变原有代码逻辑的前提下，将 CpModel 相关约束使用数学表达式，以注释的形式添加到文件中。



16、from now on, start every reply with exactly "dhh, " on the first line before answering anything else. For example: dhh Then continue your answer normally until i tell you to stop.（每次回复返回我的名字，防止 ai 那一次出现幻觉。）

 请扫描、读取所有的历史对话信息以及记忆:  1.有什么东西是你发现了但我完全没有意识到的关键点?而且这个关键点会对我的决策和工作带来巨大的改变。 2.我有哪些重复的工作内容，从里面挑出三个最值得封装成SKILL的给我，并且说明原因和使用场景。

“You are a Senior Software Engineer at Google. You write clean, maintainable, and secure code. You always consider edge cases. You prefer composition over inheritance. You write meaningful variable names. You output code inside markdown blocks with language tags. Before writing code, you briefly explain your approach in 3 bullet points.”



Polymarket 实战

clawwork项目， ai同事自主进行预测市场交易分析，实现11小时内盈利15000刀



moltbook

模型的配置，简单的任务简单模型来做，复杂的任务，高级模型来做

预算配置，设置 每天使用token的限制



我们想找一下2026年 ai agent市场当中最新的进展。

[hero-sms](https://hero-sms.com/cn)



## Skills

Skills Sites

- [skillsmp](https://skillsmp.com/)
- [claude](https://claude.com/skills)
- [skills.sh](https://skills.sh/)

### 图片

### gc-minimal-zine-poster

npx skills add liamgvchi/gc-minimal-zine-poster -g -y

一个 codex 里面生成图片的 skill

### 文章

zotero-skill

### VibeCoding Site

[refero.design](https://styles.refero.design/)

[motionsites.ai](https://motionsites.ai/)

[reactbits.dev](https://www.reactbits.dev/)

[animejs.com](https://animejs.com)

[showreel.design](https://showreel.design/)

[ui.aceternity.com](https://ui.aceternity.com/)

[uiverse.io](https://uiverse.io)

### Github Repository

[Baidu Unlimited-OCR](https://github.com/baidu/Unlimited-OCR)

[Kronos](https://github.com/shiyu-coder/Kronos) 金融开源量化框架

[ponytail](https://github.com/DietrichGebert/ponytail) 减少 token 消耗，注意生成的代码质量

- `/ponytail lite` — 轻度，只删明显冗余
- `/ponytail full` — 标准模式（默认）
- `/ponytail ultra` — 最大强度，极简代码
- `/ponytail off` — 关闭



## 信息总览

[ChatGPT](https://chatgpt.com/c/699c60f5-87d8-8323-945d-c05b81401cea)

[Gemini](https://gemini.google.com/app)

[Deepseek](https://chat.deepseek.com/)

### 中转站

[中转站稳定性对比](https://relaypulse.top/)

[硅基流动](https://siliconflow.cn/zh-cn/)

[OpenRouter](https://openrouter.ai/)

[jiekou.ai](https://jiekou.ai/) 邮箱： joe.dengc@gmail.com

[poe.com](https://poe.com/)

---

[lmarena](https://arena.ai/leaderboard) 一个关于测试模型能力的网站

GoogleCloud

[这次是我被吓尿了：Deepseek把APS排程优化公司的桌子掀翻了](https://mp.weixin.qq.com/s/L07OAAqZNwnO_n-rUKkMlA)

[Deepseek掀翻APS桌子之第二弹：注塑机排产](https://mp.weixin.qq.com/s/aYBZ1kf7TNH5wENt5jAZIw)

[DeepSeek+烟草=？中国烟草实践案例](https://www.2firsts.cn/news/deepseekyan-cao-zhong-guo-yan-cao-shi-jian-an-li)



**一、什么是智能体？为什么要用智能体？**

在了解智能体之前，我们需要了解什么是LLM（Large Language Mondel）大语言模型，大语言模型可以接受输入、进行分析或推理，最终进行输出，就好比我们现在使用的ChatGPT和Kimi，但是大语言模型无法像人类一样，拥有规划思考能力、运用各种工具与物理世界互动，以及拥有人类的记忆能力。

- LLM：接受输入、思考、输出
- 人类：LLM（接受输入、思考、输出） +  记忆 + 规划 + 工具

Agent（智能体）  = LLM（大模型） + Planning（规划） + Memory（记忆） + Tools（工具）

![图片](https://img-blog.csdnimg.cn/img_convert/6d8338a7739ce17243b77ca0f564289a.png)



