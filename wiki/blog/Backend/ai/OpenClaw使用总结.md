---
title: OpenClaw使用总结
createTime: 2026/02/15 16:23:50
permalink: /article/twhdwakv/
tags:
  - openclaw
  - tg
  - 企业微信
---

跟随时代潮流，搭建自己的AI助手。

<!-- more -->

## 一、[OpenClaw](https://openclaw.ai/)

介于OpenClaw的安全性问题，没有在实体电脑上面部署，使用的是方便的云服务器，这样更方便，去到别的地方不用带着实体物理机。

- [OpenClaw 文档](https://docs.openclaw.ai/zh-CN)

### 1.0、OpenClaw的安装

在接入聊天软件之前，都是需要安装OpenClaw的，参考OpenClaw官方文档进行安装。

有一些云厂商已经接入了OpenClaw，比如我现在使用的腾讯云，只需要将镜像设置成OpenClaw镜像就可以，如果没有OpenClaw的镜像，那就使用官网的安装方式，我这里使用npm来安装。

安装node也比较简单，使用nvm来管理node的版本，参考：[Download Node.js](https://nodejs.org/en/download)，==需要注意的一点是，node的版本需要>=v22+==

```shell
# 安装 OpenClaw
npm i -g openclaw@latest

# 配置 OpenClaw
openclaw onboard
```

配置的话，可以参考下面部分内容。

### 1.1、接入企业微信

::: tip

服务器：大陆服务器

操作系统：OpenClaw(Clawdot）

Node：v22.22.0

:::

#### 1.1.1、腾讯云界面配置

上面是我使用的一些基本环境，接入企业微信的话，国内的服务器就可以，配置之后在服务器的操作页面操作。

![](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202602200939874.png)

[企业微信地址](https://work.weixin.qq.com/)

先在企业微信生成token和secret，在腾讯云中配置，然后在创建bot。

服务器需要开通18789端口



上面是使用腾讯云的OpenClaw的镜像来实现的，腾讯云有相关的界面来配置，但是当我想配置OpenCode Zen模型的时候犯难了，我有重新装了一个ubuntu v22的系统，重新安装。

但是OpenClaw默认没有接入企业微信，需要下载企业微信的插件来实现，下面是一些操作流程。

#### 1.1.2、手动配置企业微信

步骤 1：先完成 OpenClaw 基础配置，首次运行配置（如果还没完成）

openclaw onboard

步骤 2：安装企业微信插件，安装企业微信插件

openclaw plugins install @sunnoy/wecom

查看是否安装成功

openclaw plugins list

步骤 3：配置企业微信参数，编辑配置文件：vim ~/.openclaw/openclaw.json

添加企业微信配置：

```shell
{
  "channels": {
    "wecom": {
      "enabled": true,
      "webhookPath": "/wecom",
      "token": "你的Token",
      "encodingAesKey": "你的EncodingAESKey"
    }
  }
}
```

步骤 4：获取企业微信参数
- 登录企业微信管理后台 (https://work.weixin.qq.com)

- 我的企业 → 获取 CorpID

- 应用管理 → 自建应用 → 获取 AgentID 和 Secret

- 接收消息 → 设置API接收 → 生成 Token 和 EncodingAESKey

步骤5：重启gateway



参考文档：

- [玩转OpenClaw｜云上OpenClaw(Clawdbot)一键秒级部署指南](https://cloud.tencent.com/developer/article/2624003)
- [玩转OpenClaw｜云上OpenClaw(Clawdbot)快速接入企业微信指南](https://cloud.tencent.com/developer/article/2625147)

### 1.2、接入TG

要使用TG，有涉及到如何注册TG，这是一门学问，使用最后的GV来实现。

#### 1.2.1、基本环境

::: tip

服务器：美区服务器

操作系统：Ubuntu 20.04.4 LTS

Node：v22.22.0

:::

#### 1.2.2、面临的问题

问题：Telegram allowFrom (username or user id)，如何获取user id

> - 首先，确保你已经下载并安装了Telegram应用。可以通过App Store、Google Play或Telegram官网进行下载安装。安装完成后，使用手机号登录进入Telegram主界面。
> - **搜索并启动@userinfobot**：在Telegram的搜索栏中输入“@userinfobot”，找到并点击进入该Bot页面。@userinfobot是一个专门用来查询UserId的Bot，启动后，它会自动引导你进行操作。
> - **发送“/start”命令获取UserId**：进入Bot聊天界面后，发送“/start”命令，Bot会自动回复你自己的Telegram UserId，通常是一个数字，代表你的唯一身份标识。通过这个方式，你可以轻松地获取到自己的UserId。

问题：我原先已配置好qq，便想改成telegram 怎么做

>命令：openclaw configure 加一个channel就行

#### 1.2.3、参考文档

- [玩转OpenClaw｜云上OpenClaw(Clawdbot)快速接入Telegram指南](https://cloud.tencent.com/developer/article/2626214)

### 1.3、应用

下一步就是使用OpenClaw做Ai应用了。

>给本机的openclaw开发一个实时获取股票行情的skill，不是本机的opencode
>
>用同样的方法开发一个获取财经新闻的skill，同样是给本机的openclaw开发，不是本机的opencode。

### 1.4、配置模型

#### 1.4.1、接入Google Gemini 

- 安装Gemini CLI：`npm install -g @google/gemini-cli`
- 在OpenClaw中配置model：`openclaw configure`

#### 1.4.2、接入Claude Code

- 安装ClaudCode CLI：`curl -fsSL https://claude.ai/install.sh | bash`
- 获取Claude的 Token：`claude setup-token`
- 在OpenClaw中配置Model：`openclaw configure`

#### 1.4.3、接入OpenAi Codex

- 安装Codex CLI：`npm install -g @openai/codex`
- 在OpenClaw中配置model：`openclaw configure`

### 1.5、OpenClaw命令间接

查看配置好的模型：`openclaw models list`

企业微信、tg里面输入：`/status`， 查看状态信息

配置模型：`openclaw configure`



### 1.6、接入飞书

openclaw channels add



## 二、Google Voice

注册地址：[Google Voice Singup](https://voice.google.com/u/2/signup)

查看ip的地区：[whoer.net](https://whoer.net/zh)

要美区的IP地址和美区的DNS

[接码平台：herosms](https://hero-sms.com/)，登录邮箱：zero.dengc@outlook.com

[接码平台简单使用教程](https://juejin.cn/post/7593311347292356635)

[零度博客](https://www.freedidi.com/)

查询电话所处地区：https://www.phonevalidator.com/



[2fa](https://2fa.cn/)

2fa是双重身份验证， 在没有验证的app的时候，就可以将验证码保存下来，用2fa来解码。

接下来要做的就是对google voice的转移，还有就是解决为什么我的google账号没有办法注册gv？

现在先用tg接入openclawn



保号，talkatone一个月一次，google voice三个月一次。
