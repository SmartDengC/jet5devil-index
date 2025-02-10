---
title: 推理大模型DeepSeek迅速觉醒
createTime: 2025/02/06 16:21:12
permalink: /article/z9merc8n/
sticky: 10
tags:
  - ai
  - deepseek
---

随着人工智能技术的快速发展，DeepSeek作为一种创新的技术工具，正在重塑行业格局。本文将深入分析如何把握这一波由DeepSeek带来的流量红利，揭示其在市场洞察、技术创新和用户需求中的潜在机会，并提供实用策略帮助个人或企业快速融入智能时代
的竞争浪潮。

- DeepSeek
- 人工智能
- 流量红利

<!-- more -->

收藏几个快捷网站：

[DeepSeek官网](https://www.deepseek.com/)|[DeepSeek Chat地址](https://chat.deepseek.com/)|[魔搭社区](https://www.modelscope.cn/home)|[huggingface](https://huggingface.co/)|

[硅基流动](https://account.siliconflow.cn/login?redirect=https%3A%2F%2Fcloud.siliconflow.cn&invitation=t5UXnFXX)｜[Cherry Studio 支持多服务商集成的AI对话客户端](https://cherry-ai.com/)｜

## 一、Deepseek简单概述

春节期间，我还沉醉在春节的喜悦当中，但是推理大模型deepseek开启了觉醒。简单使用还是很方便的，一个是直接访问deepseek的聊天界面[DeepSeek Chat地址](https://chat.deepseek.com/)，还有一种就是下载app。deepseek现在有两种模型，一种是deepseek v3，一种是deepseek r1，就是常说的深度思考。

由于deepseek的迅速崛起，使用r1模型的时候老是会出现 **无法连接情况**（[Deepseek服务器繁忙？解决方法来了！](https://articles.zsxq.com/id_z6w3liuf7hqx.html)、[多种DeepSeek的使用方式](https://bdg1mjbal1.feishu.cn/docx/CkSNdX0pVoJkraxZIE7cuRIinrb)），这个就为我们后面本地构建deepseek做了铺垫。

Deepseek的模型的训练时间是2024年7月，就是说7月之后的信息他是不能了解的，除非你开启联网搜索。

## 二、使用Deepseek的技巧

我发现虽然使用deepseek有一点难度，但是只要稍微百度学习一下，就能找到能够睥睨原始deepseek的模型，像是纳米ai、[国家超算平台](https://chat.scnet.cn/#/home)、钉钉所以说能用好才是重要的事情。

如果Deepseek给出的答案不是我们想要的，大概率是因为我们没有正确输入关键词。

小白入门DeepSeek必备的50个高阶提示词。

[DeepSeek提问技巧：如何让你的问题更有价值？](https://blog.csdn.net/weixin_41288824/article/details/145544432?spm=1001.2014.3001.5502)

### 2.1 初阶提问

顾名思义，就是向deepseek直接提问简单单一的问题，比如：

1、 1+1等于多少？

2、deepseek的官网地址是什么？

### 2.2 中阶提问

1 核心目标：需要解决的问题

2 期望输出：具体成果形式（方案/代码/步骤）

3 关键需求：必须满足的硬性要求

精准提问举例：

- 我需要一篇论文（核心目标），论文主题是《网页设计与制作》，字数要求1000字，知识范围涉及HTML、CSS、网页设计（关键需求），请你给我生成一篇我能够看懂的论文（期望输出）。
- 我需要一篇知乎文章（核心目标），文章的标题是《DeepSeek提问技巧》，写的通俗易懂一点（关键需求），给我生成一篇能够成为爆款的文章（期望输出）。

## 三、本地部署

 这里你可能就会问了，现在市场上很多deepseek的ai工具，为什么我们还需要本地部署。

其中最大的一个原因就是，deepseek官网老是访问不到；第二个我是用deepseek大多数都是在电脑上面，像是使用移动端的，纳米ai就是一个很不错的选择，我也是用过通过api和silicomflow的方式来使用deepseek，但是有时会出现访问不了的情况；第三点就是大多数数据隐私的问题。

### 3.1 ollama

[ollama](https://ollama.com/) 是一个专为本地环境中运行和定制大型语言模型而设计的工具，因为deepseek是开源的，简单来说就是将模型下载下来，然后在ollama上面跑，ollama本身就提供了下载模型的功能。

安装的话，我们直接到官网下载一个对应的安装包，安装完之后输入 `ollama -v`查看是否成功和对应版本。

```
ollama -v  // 查看版本
ollama pull deepseek-r1:7b  // 下载模型
ollama run deepseek-r1:7b  // 运行模型
```

### 3.2、Deepseek的api +Cherry Studio

在2月5号晚上的时候，Deepseek官方开放了api。

[DeepSeek API](https://platform.deepseek.com/usage)

[DeepSeek API官方文档](https://api-docs.deepseek.com/zh-cn/)

登陆到deepseek的网站，默认送了10块钱，然后创建一个api keys，然后在关联到cherry studio里面。

### 3.3、硅基流动 + Cherry Studio

[最近Deepseek-R1模型总是繁忙、崩溃怎么办？](https://zhuanlan.zhihu.com/p/21017391203)

[silicomflow](https://siliconflow.cn/)

登陆进去默认送了14块钱来体验，创建一个api密钥，然后在cherry studio里面配置，就可以快速使用了。

## 四、如何使用大模型增加自己的收入？

记录一些主流的搜索内容和主流思想：

siri接入deepseek

硅基流动 + Cherry Studio实现本地部署deepseek

文章标题取名，要求是能提高访问量？

### 4.1 使用deepseek，发布爆款小红书作品

该怎么问deepseek？

### 4.2 股市结合deepseek

deepseek的创始人梁文锋，在浙江大学求学期间，便开始进入投资领域，为后续的成功奠定了基础，蛰伏于量化投资领域的梁文锋，抓住先机，凭借高效的算法和对市场的敏锐洞察，在短时间内积累了相当可观的自营资本，同时，幻方量化也成为业界首个突破千亿规模的私募机构。

所以说，使用deepseek来做量化是行的通的。

### 4.3 楼市结合deepseek

这个我还没有想好。

### 4.4 将爱好和deepseek结合

现在deepseek在风浪口，前两天使用deepseek给我制定破三的计划，发了一个视频，明显感觉播放量增加了很多。

后面突发奇想：“我就按照deepseek计划训练能够成功实现全马破三吗？”，所以想做一个系列视频，主线就是结合deepseek给出来的计划，实现全马破三。





