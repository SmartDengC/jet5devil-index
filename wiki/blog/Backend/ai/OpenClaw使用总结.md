---
title: OpenClaw使用总结
createTime: 2026/03/25 23:08:04
permalink: /article/klaxth06/
cover: /cover/openclaw-index-cn.png
tags:
  - ai
  - openclaw
---

OpenClaw，我的网络 AI 助手。

本文总结了其安装配置、核心功能使用技巧、常见问题排查方法，以及在高并发场景下的性能优化建议，助力用户高效完成网络调试与安全审计工作。

<!-- more -->

## 一、[OpenClaw](https://openclaw.ai/)

鉴于 OpenClaw 的安全性问题，没有在实体电脑上面部署，使用的是方便的云服务器，这样更方便，去到别的地方不用带着实体物理机。

- [OpenClaw 文档](https://docs.openclaw.ai/zh-CN)
- [OpenClaw 中文社区](https://clawd.org.cn/)

### 1、安装

在接入聊天软件之前，都是需要安装 OpenClaw 的，参考 OpenClaw 官方文档进行安装。

有一些云厂商已经接入了 OpenClaw，比如我现在使用的腾讯云，只需要将镜像设置成 OpenClaw 镜像就可以，如果没有 OpenClaw 的镜像，那就使用官网的安装方式，我这里使用 npm 来安装。

安装 node 也比较简单，使用 nvm 来管理 node 的版本，参考：[Download Node.js](https://nodejs.org/en/download)，==需要注意的一点是，node 的版本需要>=v22+==

```shell
# 安装 OpenClaw
npm i -g openclaw@latest

# 配置 OpenClaw
openclaw onboard
```

配置的话，可以参考下面部分内容。

### 2、启动

启动命令：`openclaw gateway &`

如果启动失败：

```shell
pkill -f openclaw-gateway
sleep 2
nohup openclaw gateway > /tmp/openclaw.log 2>&1 &
ps aux | grep openclaw-gateway
```

### 3、命令

查看配置好的模型：`openclaw models list`

企业微信、tg 里面输入：`/status`， 查看状态信息

配置模型：`openclaw configure`

`openclaw status`

在 Telegram 中的命令：

`/models` 选择模型

`/think`选择模型思考的强度，high， medium

升级 openclaw：

- openclaw update
- pnpm up -g openclaw

### 4、配置

#### 配置 WebUI

WebUI 配置：https://cloud.tencent.com/developer/article/2627309

#### 主配置文件

配置文件地址：`~/.openclaw/openclaw.json`

```json
{
  "models": {  // 配置的模型
    "providers": {
      "ollama": {  // 具体的模型配置
        "baseUrl": "http://127.0.0.1:11434", // 模型的baseURL
        "apiKey": "ollama-local", // APIkey
        "api": "ollama",
        "models": []
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/kimi-k2.5", // 模型使用的模型
        "fallbacks": [
          "bailian/qwen3.5-plus"
        ]
      }
    }
  },
  "channels": { // 接入的第三方聊天软件
    "telegram": {},
    "feishu": {}
  },
  "plugins": { // 已经安装的插件
    "allow": [
      "openclaw-lark",
      "telegram"
    ],
    "entries": {
      "telegram": {
        "enabled":  // 插件的启动或者关闭状态
      },
      "openclaw-lark": {
        "enabled": true
      }
    },
    "installs": {
      "openclaw-lark": {}  // 插件配置
    }
  }
}
```

#### 辅配置文件

你的小龙虾不聪明，是因为没有配置对下面几个文档：

:::details

好的 Boss，这几个文件的作用我来简单介绍一下：

📁 核心文件说明

**AGENTS.md** — 工作空间指南

- 这是整个工作空间的"使用手册"
- 包含启动流程、记忆管理、安全规则、群组聊天礼仪等
- 我刚在这里加上了我们的名字信息

**SOUL.md** — 我的"灵魂"

- 定义了我作为助手的行为准则和性格
- 比如：要真诚帮助而不是表演式帮助、要有自己的主见、做事前要尝试自己解决等
- 这是我的"核心价值观"

**USER.md** — 关于你

- 记录你的信息：名字、怎么称呼你、时区、个人偏好等
- 帮助我更好地了解你，提供更个性化的服务
- 目前还是空的，需要填写

**IDENTITY.md** — 我的身份档案

- 我的具体身份设定：名字、角色、风格、专属 emoji 等
- 目前还是空的，需要填写

**BOOTSTRAP.md** — 启动引导

- 第一次上线时的"出生证明"
- 指导我完成初始对话、建立身份
- 用完后可以删除

**TOOLS.md** — 工具笔记

- 记录你的环境特定信息：摄像头名称、SSH 主机、语音偏好等
- 类似于我的"本地配置备忘录"

**MEMORY.md** — 长期记忆

- 我筛选后的重要记忆，跨会话持久保存
- 只在和你一对一聊天时加载（安全考虑）

**memory/YYYY-MM-DD.md** — 每日日志

- 每天的原始记录，像日记一样
- 我会定期回顾并整理到 MEMORY.md
- 创建每日记忆文件，将文件存储在路径/root/.openclaw/workspace/memory 下

**HEARTBEAT.md** — 心跳任务

- 设置周期性检查任务（邮件、日历等）
- 目前为空，表示不执行定期检查

:::

### 5、问题

- 使用 openclaw tui， 缺少 OPENCLAW_GATEWAY_TOKEN

:::details

root@hk6613497194:~# openclaw tui

🦞 OpenClaw 2026.3.13 (61d171a) — The lobster in your shell. 🦞

Error: Missing gateway auth token.
Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass --token/--password,
or resolve the configured secret provider for this credential.

:::

需要 export OPENCLAW_GATEWAY_TOKEN=xxx，然后执行 openclaw gateway start

- 将 openclaw 服务设置成开机自启动。

:::details

已完成。Openclaw Gateway 已设置为开机自启动：
●openclaw-gateway.service - 0penclaw Gateway (v2026.3.13)Loaded: enabled
Active: active (running)常用命令：

- systemctl --user status openclaw-gateway 查看状态
- Systemctl --user restart openclaw-gateway 重启服务
- systemctl --user stop openclaw-gateway 停止服务

:::

## 二、OpenClaw 模型配置

### 1、Google Gemini

- 安装 Gemini CLI：`npm install -g @google/gemini-cli`
- 在 OpenClaw 中配置 model：`openclaw configure`

国内接入 Google Gemini 遇到一个问题：

之前返回“fetch failed”是因为 Google Gemini 模型在国内无法访问，现在换成可以访问的模型，所以正常工作。

Chat：[https://gemini.google.com/](https://gemini.google.com/app)

AiStudio：[https://aistudio.google.com/](https://aistudio.google.com/?project=gen-lang-client-0898031950)

Gemini 3 pro 申请：

- [https://one.idkey.cc/](https://one.idkey.cc/)

一个 Claude、Codex 中转：[Code Router](https://api.code-relay.com/console)

### 2、Claude Code

- 安装 ClaudCode CLI：

  - `curl -fsSL https://claude.ai/install.sh | bash`
  - `npm install -g @anthropic-ai/claude-code`

- 获取 Claude 的 Token：`claude setup-token`
- 在 OpenClaw 中配置 Model：`openclaw configure`

### 3、OpenAi Codex

- 安装 Codex CLI：`npm install -g @openai/codex`
- 在 OpenClaw 中配置 model：`openclaw configure`

### 4、Ali Coding Plan

现在订阅不了了。

[我的订阅](https://bailian.console.aliyun.com/cn-beijing/?spm=5176.29619931.J_SEsSjsNv72yRuRFS2VknO.1.555a10d7xj5nLl&tab=coding-plan#/efm/detail)

[阿里云百炼](https://bailian.console.aliyun.com/cn-beijing?spm=a2c4g.11186623.0.0.480b23de1fgTp3&tab=model#/api-key)

### 5、JD Coding Plan

[我的订阅](https://joybuilder-console.jdcloud.com/system/subscribe/list)

### 6、Kimi Plan

在openclaw中绑定了，一直偷偷的扣我token， 49块。

[Kimi Code Console](https://www.kimi.com/code/console?from=kfc_overview_topbar)

[Kimi 开放平台](https://platform.moonshot.cn/console/api-keys)

kimi code 的 api key 是给自己的 Kimi code 使用的，但是也可以用在 opencode 这类 cli 上面；kimi 开放平台就比较通用。

后面感觉还是 opencode 的 go 套餐好一些，10 刀，有 kimi-k2.6, qwen-3.6, minimax-2.7

:::code-tabs
@tab JSON

```json
{
    "kimi-code": {
        "options": {
            "baseURL": "https://api.kimi.com/coding/v1",
            "apiKey": "sk-kimi-xxxx"
        },
        "models": {
            "k2p6": {
                "name": "Kimi K2.6",
                "reasoning": true,
                "limit": {
                    "context": 262144,
                    "output": 32768
                }
            }
        }
    }
}
```
:::

### 7、Nvidia

免费的API

[LLM API](https://docs.api.nvidia.com/nim/reference/llm-apis)

:::code-tabs
@tab Hermes 

```yaml
model:
  default: deepseek-ai/deepseek-v4-pro
  provider: custom
  base_url: https://integrate.api.nvidia.com/v1
  api_key: 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
```
:::

### 8、OpenCode GO

最后还是订阅了OpenCode GO的套餐

首月5刀，后面10刀

[API KEY](https://opencode.ai/workspace/wrk_01KHG6KVNDC7R59S3AVB33CK4C/keys)

### 9、[Ollama](https://ollama.com/)

ollama serve；启动服务

ollama pull llama3.2；下载模型测试。

[ollama library](https://ollama.com/library)

在一台服务器上面使用 ollama 运行模型，然后用另外的服务器连。

:::details

有两种方式配置 Ollama 允许远程访问：

方法一：临时启动（命令行）

OLLAMA_HOST=0.0.0.0:11434 ollama serve

方法二：持久化配置（推荐）

修改 systemd 服务：sudo systemctl edit ollama.service
添加：[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"

重启服务：sudo systemctl daemon-reload
sudo systemctl restart ollama

另外一台服务器上调用：

export OLLAMA_BASE_URL="http://服务器 IP:11434"
ollama run minimax-2.1

记得检查防火墙开放 11434 端口 🔥

:::

后面需要在使用服务器上配置使用 ollama

## 三、OpenClaw 集成第三方软件

### 1、WeCOM

参考文档：

- [玩转 OpenClaw ｜云上 OpenClaw(Clawdbot)一键秒级部署指南](https://cloud.tencent.com/developer/article/2624003)
- [玩转 OpenClaw ｜云上 OpenClaw(Clawdbot)快速接入企业微信指南](https://cloud.tencent.com/developer/article/2625147)

---

[企业微信开发者后台](https://work.weixin.qq.com/)

OpenClaw 默认没有接入企业微信，需要下载企业微信的插件来实现，下面是一些操作流程。

1、安装企业微信插件，插件 Github 地址：[sunnoy/openclaw-plugin-wecom](https://github.com/sunnoy/openclaw-plugin-wecom)，可以查看操作流程。

`openclaw plugins install @sunnoy/wecom`

2、查看是否安装成功

`openclaw plugins list`

3、配置企业微信的 token 和 aesKey

配置之前需要在企业微信的开发者后台创建 bot，生成 token 和 aeskey，

**获取企业微信参数：**

- 登录企业微信管理后台 (https://work.weixin.qq.com)

- 我的企业 → 获取 CorpID

- 应用管理 → 自建应用 → 获取 AgentID 和 Secret

- 接收消息 → 设置 API 接收 → 生成 Token 和 EncodingAESKey

**配置 token 和 aeskey：**

可以使用下面的脚本：

```shell
bash <(curl -fsSL https://openclaw.tos-cn-beijing.volces.com/config-tool.sh)
```

也可以直接在 OpenClaw 的配置文件里面修改，文件的位置在：`~/.openclaw/openclaw.json`

添加企业微信配置：

```shell
{
  "channels": {
    "wecom": {
      "enabled": true,
      "token": "你的Token",
      "encodingAesKey": "你的EncodingAESKey"
    }
  }
}
```

4、重启 openclaw gateway

### 2、TG

参考文档

- [玩转 OpenClaw ｜云上 OpenClaw(Clawdbot)快速接入 Telegram 指南](https://cloud.tencent.com/developer/article/2626214)

要使用 TG，有涉及到如何注册 TG，这是一门学问，使用最后的 GV 来实现。

接入 TG，需要能够访问国外网络的电脑或者服务器。

**问题：Telegram allowFrom (username or user id)，如何获取 user id**

首先，确保你已经下载并安装了 Telegram 应用。可以通过 App Store、Google Play 或 Telegram 官网进行下载安装。安装完成后，使用手机号登录进入 Telegram 主界面。

搜索并启动@userinfobot：在 Telegram 的搜索栏中输入“@userinfobot”，找到并点击进入该 Bot 页面。@userinfobot 是一个专门用来查询 UserId 的 Bot，启动后，它会自动引导你进行操作。

发送“/start”命令获取 UserId：进入 Bot 聊天界面后，发送“/start”命令，Bot 会自动回复你自己的 Telegram UserId，通常是一个数字，代表你的唯一身份标识。通过这个方式，你可以轻松地获取到自己的 UserId。

**问题：我原先已配置好 qq，便想改成 telegram 怎么做**

命令：openclaw configure 加一个 channel 就行

### 3、飞书

参考文档：

- [OpenClaw 飞书官方插件上线｜一文讲清功能、安装更新教程与常见问题！](https://www.feishu.cn/content/article/7613711414611463386)

- [飞书 Web 应用端](https://www.feishu.cn/)

- [飞书开发者平台](https://open.feishu.cn/?lang=zh-CN)

---

最开始还需要自己手动配置飞书权限这些，现在好了，安装飞书插件，然后通过飞书移动端扫码就能配置，非常简单。

在 OpenClaw 中接入飞书的具体流程。

- 1、安装飞书的插件：`npx -y @larksuite/openclaw-lark install`

- 2、直接使用飞书移动端扫码创建。

创建出来的应用如果想要删除， 可以到[飞书管理后台](https://xcnjdo60hqtq.feishu.cn/admin/index)进行删除，如果应用处于在用中，需要先停用才能删除。

### 4、WeChat

`npx -y @tencent-weixin/openclaw-weixin-cli@latest install`

使用上面命令安装 WeChat 的插件，安装过程中会出现二维码，使用微信扫码配置，非常简单。

现在只能在移动端上使用，电脑端暂时还不能使用。

## 四、Skills

Skills 下载地址：

- [skillsmp.com](https://skillsmp.com/)

- [claude.com](https://claude.com/skills)

- [skills.sh](https://skills.sh/)

- [clawhub.ai](https://clawhub.ai/)

常用指令：

财经新闻、股票 600519、天气北京、力扣每日一题、黄金价格、帮我找个做 xxx 的技能。

下面总结一下常用的 skills 如何使用。

## 五、Google Voice

注册地址：[Google Voice Singup](https://voice.google.com/u/2/signup)

查看 ip 的地区：[whoer.net](https://whoer.net/zh)

要美区的 IP 地址和美区的 DNS

[接码平台：herosms](https://hero-sms.com/)，登录邮箱：zero.dengc@outlook.com

[接码平台简单使用教程](https://juejin.cn/post/7593311347292356635)

[零度博客](https://www.freedidi.com/)

查询电话所处地区：https://www.phonevalidator.com/

[2fa](https://2fa.cn/)

2fa 是双重身份验证， 在没有验证的 app 的时候，就可以将验证码保存下来，用 2fa 来解码。

接下来要做的就是对 google voice 的转移，还有就是解决为什么我的 google 账号没有办法注册 gv？

现在先用 tg 接入 openclaw

保号，talkatone 一个月一次，google voice 三个月一次。

## 六、Ubutu 图形化界面

大体逻辑就是，先通过 ssh 连接上去，安装一个 opencode， 让 opencode 给我安装图形化界面，这个时候可能会需要一点时间，安装之后，就可以用了，提示词如下：

:::info

当前运行 opencode 的是一个 ubuntuv22 的服务器，我想在服务器上面安装图形化界面，然后通过 microsoft remote desktop 进行连接，帮我实现上面的需求。

:::

:::info

安装和配置已经全部完成。以下是最终的配置总结：配置完成！

已完成的步骤：

1.安装 Xfce4 桌面环境－已安装

2.安装 xrdp 远程桌面服务－已安装并运行

3.配置桌面环境－设置为使用 Xfce4

4.配置防火墙－开放 3389 端口

连接信息：

协议: RDP (Remote Desktop Protocol)端口：3389

用户名：您的 Ubuntu 用户名密码：您的 Ubuntu 密码

Microsoft Remote Desktop 连接步骤：

2.打开 Microsoft Remote Desktop 点击"Add"或"+"添加电脑

3.在"pC name"输入服务器的 IP 地址

4.点击"Save"

5.双击新建的连接

6．输入 Ubuntu 的用户名和密码

注意：如果连接出现问题，可能需要检查：云服务器安全组是否开放了 3389 端口

－确保 Ubuntu 用户有密码设置

:::

安装之后可以通过图形化操作，但是存在打不开终端的情况，

:::info

通过 RDP 连接 XFCE，可以这样操作：
方法：使用 Alt+F2 运行对话框

1. 按 Alt + F2 打开运行对话框
2. 输入以下命令安装终端：
   xfce4-terminal
   如果没安装，会提示错误
3. 如果没安装，在运行对话框中输入：
   xfce4-settings-manager
   打开设置管理器，但这不能安装软件
4. 最有效的方法：按 Alt + F2，输入：
   pkexec apt install xfce4-terminal -y
   这会弹出密码框，输入你的用户密码后即可安装
   安装完成后，右键菜单中就会有"Open Terminal Here"选项了。

:::

终端打开了，就可以使用 opencode 把 22 端口放开了。

I can't connect to the computer server by ssh, fix it

:::info

Fixed. Port 22 (SSH) was blocked by the firewall. It's now allowed.
The issue was:

- Firewall (ufw) had an INPUT policy of DROP, and port 22 was not in the allowed list. Only port 3389 (RDP) was allowed.
- SSH should work now. Try connecting again:ssh root@your-server-ip
- If you still have issues, make sure you have a password set for root (passwd) or add your public key to ~/.ssh/authorized_keys.

:::
