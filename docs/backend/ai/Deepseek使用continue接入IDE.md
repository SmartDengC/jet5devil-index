---
title: Deepseek使用continue接入IDE
createTime: 2025/02/10 00:24:46
permalink: /article/77l6knvz/
tags:
  - deepseek
---

本文介绍如何通过Deepseek的continue功能，将代码实时提交至后端，实现跨平台开发。通过安装continue插件，配置API设置，即可实现IDE与后端实时交互，提升开发效率。continue支持多种后端平台，可无缝衔接开发流程。



<!-- more -->

1 插件市场里面搜索continue，然后安装

2 然后配置continue里面的model，使用deepseek + api key的形式实现



具体操作：

Shift + Command + L 将选中的内容发送到chat



问题：

如果通过ollama添加model？

选择ollama之后，选择Autodetect，然后在选择你本地下载的模型，就可以使用了。
