---
title: Deepseek接入Siri保姆级教程
createTime: 2025/02/08 22:01:33
permalink: /article/fi1eocwk/
tags:
  - deepseek
---

《Deepseek接入Siri保姆级教程》教您如何快速集成与Siri无缝协作的DeepSeek功能，提升智能设备的搜索与交互体验。

<!-- more -->

添加“听写文本”，将语言设置成中文

选者url，将下面内容填写进去 “https://api.deepseek.com/v1/chat/completions”

选者获取url内容，方法选post，在头部添加两个值，分别是：

- 键：Content-Type，文本：application/json
- 键：Authorization，文本：Bearer+刚才复制的api key

请求体选择json，添加一个文本：

- model: deer-seek-resoner(如果是v3版本，就填入deepseek-chat)

添加一个数组：

- messages:  数组的值添加两个文本
  - role：user
  - content：听写的文本

获取词典值，从url的内容中获取“choices.1.message.content”

选者显示词典值



[ChatGPT慌了？Deepseek接入Siri保姆级教程](https://www.bilibili.com/video/BV1ctNWe6EbM/?spm_id_from=333.337.search-card.all.click&vd_source=35e7dde81183ac464990a0a0ab794bce)

简单来说就是调用deepseek的api，将说的内容传到deepseek，然后返回查询的结果。
