---
title: ClaudeCode、OpenCode和OpenClaw使用总结
createTime: 2026/02/15 16:23:50
permalink: /article/twhdwakv/
tags:
  - ai
  - openclaw
  - tg
  - 企业微信
  - claudecode
  - opencode
---

跟随时代潮流，搭建自己的AI助手。

Ai让写代码不再困难。

<!-- more -->

## 一、ClaudeCode

1、安装方式有三种，一种是下载脚本执行，一种是homebrew， 一种是通过npm

[Claude Code 下载安装教程（Mac 版），图文指南](https://apifox.com/apiskills/claude-code-mac-install-guide/)

如果地区不支持，挂梯子，并设置

```
HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 claude
```

7890是你的梯子的代理端口。

```
git config --global --get http.proxy
git config --global --get https.proxy
```

查看git的代理信息。

[Claude Code Doc](https://code.claude.com/docs/zh-CN/overview)

[快捷导航](https://kjdaohang.com/)

[免费白嫖 Claude Code，国内也能免费使用（保姆级教程）](https://zhuanlan.zhihu.com/p/1926926420204066066)

[DeepSeek 官网](https://www.deepseek.com/)|[DeepSeek Api文档](https://api-docs.deepseek.com/zh-cn/)

[Poe 官网](https://poe.com/)|[Poe Doc](https://creator.poe.com/docs)

使用Ctrl+Alt+S快捷键打开idea全局配置，在快捷键映射配置Settings -> keymap中，找到 Plug-ins -> Terminal -> Switch Focus To Editor，删除其快捷键绑定即可。

```
# Set these in your shell (e.g., ~/.bashrc, ~/.zshrc)
export POE_API_KEY="api key"
export ANTHROPIC_BASE_URL="https://api.poe.com"
export ANTHROPIC_AUTH_TOKEN="$POE_API_KEY"
export ANTHROPIC_API_KEY="" # Important: Must be explicitly empty
```

[anyrouter url](https://anyrouter.top/login)

## 二、[OpenCode](https://opencode.ai/)

OpenCode Zen是opencode团队提供的模型中间商

需要node v20+

Oh My Open Code 插件

通过4种方式安装opencode， 在命令行中使用npm安装：`npm i -g opencode-ai`，删除`npm uninstall -g opencode-ai`

需要安装这个插件，才能使用gemini

[NoeFabris/opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)

然后让LLM帮我安装上面的插件：

```
Install the opencode-antigravity-auth plugin and add the Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

安装之后，会在opencode.json里面的plugin里面添加一行"opencode-antigravity-auth@beta"， 但是我后面注释掉了，不注释调启动不了opencode。

[code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)

npx oh-my-opencode install（我没有安装成功，找到安装使用LLM帮忙安装）

都选择no

`npm install -g oh-my-opencode@latest`

还是使用LLM帮忙安装

```shell
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```



```shell
# 安装 Bun（若未安装）
curl -fsSL https://bun.sh/install | bash
# 安装 Oh My OpenCode（示例：启用 Claude 与 ChatGPT）
bunx oh-my-opencode install --no-tui --claude=no --chatgpt=no --gemini=no
```



问题：当opencode 添加插件之后，就打不开opencode了，例如：

```json
{
  "plugin": ["oh-my-opencode@3.4.0"]
}
```

[ziho7/opencode-config](https://github.com/ziho7/opencode-config)

cursor集成opencode

打开命令模式快捷键： F1或者是Cmd + Shift + P， 搜索opencode in new tab

进入之后然后/init，会生成一个项目的agent价格文件，是md的文件

`/themes` 主题

`/models` 切换模型

`/init` 初始化生成agent文件

`/sessions`



```shell
# Install oh-my-opencode with no subscriptions
$ bunx oh-my-opencode install --no-tui --claude=no --gemini=no --copilot=no
zsh:1: command not found: bunx

Thinking: The command bunx is not found. Let me try using npx as an alternative mentioned in the guide.
Let me try with npx instead:
# Install oh-my-opencode using npx
$ npx oh-my-opencode install --no-tui --claude=no --gemini=no --copilot=no
npm warn Unknown user config "home". This will stop working in the next major version of npm.
```



使用pnpm安装opencode `pnpm i -g opencode-ai`

卸载opencode `opencode uninstall --force`

安装oh-my-opencode `pnpm add oh-my-opencode@latest`



debug过程：` opencode debug paths` ，日志路径` /Users/dengc4r/.local/share/opencode/log`

### Problem Summary

**问题：终端输入opencode没有反应：**

```
Thinking: 太好了！现在 opencode 可以正常运行了！错误已经修复。问题总结：
1. 原始问题：输入 opencode 没有返回，没有任何反应
2. 日志位置：/Users/dengc4r/.local/share/opencode/log/
3. 问题原因：
   - oh-my-opencode 插件默认配置使用了 anthropic/claude-opus-4-6 模型，但用户没有 anthropic 订阅
   - 安装程序自动配置了 opencode/glm-4.7-free 作为回退模型，但这个模型在 opencode provider 中不存在
   - 缺少 sisyphus 代理的显式配置
4. 解决方案：
   - 在 oh-my-opencode.json 中添加了 sisyphus 代理配置
   - 将所有 opencode/glm-4.7-free 替换为 opencode/kimi-k2.5-free（这是实际存在的免费模型）
```

尽量不要在根目录上使用opencode，在项目目录里面使用。

多尝试一些安装方式，npm pnpm curl等等

## 三、[OpenClaw](https://openclaw.ai/)

介于OpenClaw的安全性问题，没有在实体电脑上面部署，使用的是方便的云服务器，这样更方便，去到别的地方不用带着实体物理机。

- [OpenClaw 文档](https://docs.openclaw.ai/zh-CN)
- [OpenClaw 中文社区](https://clawd.org.cn/)

### 1、OpenClaw的安装

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

### 2、WebUI配置

WebUI配置：https://cloud.tencent.com/developer/article/2627309

### 3、启动OpenClaw

启动命令：`openclaw gateway &`

如果启动失败：

```shell
pkill -f openclaw-gateway
sleep 2
nohup openclaw gateway > /tmp/openclaw.log 2>&1 &
ps aux | grep openclaw-gateway
```

下一步就是使用OpenClaw做Ai应用了。

>给本机的openclaw开发一个实时获取股票行情的skill，不是本机的opencode
>
>用同样的方法开发一个获取财经新闻的skill，同样是给本机的openclaw开发，不是本机的opencode。

### 4、OpenClaw命令

查看配置好的模型：`openclaw models list`

企业微信、tg里面输入：`/status`， 查看状态信息

配置模型：`openclaw configure`

`openclaw status`

### 5、配置文件内容

配置文件地址：`~/.openclaw/openclaw.json`

国内服务器：

```json
{
  "meta": {
    "lastTouchedVersion": "2026.2.21-2",
    "lastTouchedAt": "2026-02-23T05:16:54.740Z"
  },
  "wizard": {
    "lastRunAt": "2026-02-23T04:04:23.520Z",
    "lastRunVersion": "2026.2.21-2",
    "lastRunCommand": "configure",
    "lastRunMode": "local"
  },
  "auth": {
    "profiles": {
      "opencode:default": {
        "provider": "opencode",
        "mode": "api_key"
      },
      "google:default": {
        "provider": "google",
        "mode": "api_key"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "opencode/minimax-m2.5-free",
        "fallbacks": [
          "opencode/minimax-m2.5-free"
        ]
      },
      "models": {
        "opencode/claude-opus-4-6": {
          "alias": "Opus"
        },
        "opencode/minimax-m2.5-free": {}
      },
      "workspace": "/home/ubuntu/.openclaw/workspace",
      "compaction": {
        "mode": "safeguard"
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    },
    "list": [
      {
        "id": "main"
      },
      {
        "id": "wecom-dm-dengcong"
      }
    ]
  },
  "messages": {
    "ackReactionScope": "group-mentions"
  },
  "commands": {
    "native": "auto",
    "nativeSkills": "auto",
    "restart": true
  },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "session-memory": {
          "enabled": true
        }
      }
    }
  },
  "channels": {
    "wecom": {
      "enabled": true,
      "token": "t9..DZavv",
      "encodingAesKey": "vOXU8H...CofKdHP26dvegRkJ"
    },
    "feishu": {
      "enabled": true,
      "appId": "cli_a...2b1b89bca",
      "appSecret": "rc2Wp...C2rNeJ0zeQqC6KC",
      "encryptKey": "z3w...lB7f63cUNCXsdu",
      "verificationToken": "lr6gRTM...q38ng6lwpj4viVR",
      "connectionMode": "websocket"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "lan",
    "controlUi": {
      "enabled": true,
      "basePath": "hahadeng",
      "allowInsecureAuth": true
    },
    "auth": {
      "mode": "token",
      "token": "f2f16080ed...da3fad262d857"
    },
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    },
    "http": {
      "endpoints": {
        "chatCompletions": {
          "enabled": true
        }
      }
    },
    "nodes": {
      "denyCommands": [
        "camera.snap",
        "camera.clip",
        "screen.record",
        "calendar.add",
        "contacts.add",
        "reminders.add"
      ]
    }
  },
  "plugins": {
    "allow": [
      "wecom",
      "feishu"
    ],
    "entries": {
      "wecom": {
        "enabled": true
      },
      "feishu": {
        "enabled": true
      }
    },
    "installs": {
      "wecom": {
   				...
      }
    }
  }
}
```

美区服务器：

```json
{
  "wizard": {
    "lastRunAt": "2026-02-20T01:00:49.737Z",
    "lastRunVersion": "2026.2.19-2",
    "lastRunCommand": "onboard",
    "lastRunMode": "local"
  },
  "auth": {
    "profiles": {
      "opencode:default": {
        "provider": "opencode",
        "mode": "api_key"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "opencode/minimax-m2.5-free"
      },
      "models": {
        "opencode/claude-opus-4-6": {
          "alias": "Opus"
        },
        "opencode/minimax-m2.5-free": {}
      },
      "workspace": "/root/.openclaw/workspace",
      "compaction": {
        "mode": "safeguard"
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  },
  "messages": {
    "ackReactionScope": "group-mentions"
  },
  "commands": {
    "native": "auto",
    "nativeSkills": "auto",
    "restart": true
  },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "session-memory": {
          "enabled": true
        }
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "botToken": "838712xxxHUG57C9EqlM2hXi8wD3ARc",
      "groupPolicy": "allowlist",
      "streamMode": "partial"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "44528d3dxxx77e09e4cd9d5f93ee8e56033"
    },
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    },
    "nodes": {
      "denyCommands": [
        "camera.snap",
        "camera.clip",
        "screen.record",
        "calendar.add",
        "contacts.add",
        "reminders.add"
      ]
    }
  },
  "plugins": {
    "entries": {
      "telegram": {
        "enabled": true
      }
    }
  },
  "meta": {
    "lastTouchedVersion": "2026.2.19-2",
    "lastTouchedAt": "2026-02-20T01:00:49.773Z"
  }
}
```

## 四、OpenClaw模型配置

### 1、接入Google Gemini 

- 安装Gemini CLI：`npm install -g @google/gemini-cli`
- 在OpenClaw中配置model：`openclaw configure`

国内接入Google Gemini遇到一个问题：

>  之前返回“fetch failed”是因为Google Gemini模型在国内无法访问，现在换成可以访问的模型，所以正常工作。

### 2、接入Claude Code

- 安装ClaudCode CLI：`curl -fsSL https://claude.ai/install.sh | bash`
- 获取Claude的 Token：`claude setup-token`
- 在OpenClaw中配置Model：`openclaw configure`

### 3、接入OpenAi Codex

- 安装Codex CLI：`npm install -g @openai/codex`
- 在OpenClaw中配置model：`openclaw configure`

## 五、OpenClaw集成第三方软件

### 1、OpenClaw接入企业微信

参考文档：

- [玩转OpenClaw｜云上OpenClaw(Clawdbot)一键秒级部署指南](https://cloud.tencent.com/developer/article/2624003)
- [玩转OpenClaw｜云上OpenClaw(Clawdbot)快速接入企业微信指南](https://cloud.tencent.com/developer/article/2625147)

---

[企业微信开发者后台](https://work.weixin.qq.com/)

OpenClaw默认没有接入企业微信，需要下载企业微信的插件来实现，下面是一些操作流程。

1、安装企业微信插件，插件Github地址：[sunnoy/openclaw-plugin-wecom](https://github.com/sunnoy/openclaw-plugin-wecom)，可以查看操作流程。

`openclaw plugins install @sunnoy/wecom`

2、查看是否安装成功

`openclaw plugins list`

3、配置企业微信的token和aesKey

配置之前需要在企业微信的开发者后台创建bot，生成token和aeskey，

**获取企业微信参数：**

- 登录企业微信管理后台 (https://work.weixin.qq.com)

- 我的企业 → 获取 CorpID

- 应用管理 → 自建应用 → 获取 AgentID 和 Secret

- 接收消息 → 设置API接收 → 生成 Token 和 EncodingAESKey

**配置token和aeskey：**

可以使用下面的脚本：

```shell
bash <(curl -fsSL https://openclaw.tos-cn-beijing.volces.com/config-tool.sh) 
```

也可以直接在OpenClaw的配置文件里面修改，文件的位置在：`~/.openclaw/openclaw.json`

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

4、重启openclaw gateway

### 2、OpenClaw接入TG

参考文档

- [玩转OpenClaw｜云上OpenClaw(Clawdbot)快速接入Telegram指南](https://cloud.tencent.com/developer/article/2626214)

要使用TG，有涉及到如何注册TG，这是一门学问，使用最后的GV来实现。

接入TG，需要能够访问国外网络的电脑或者服务器。

**问题：Telegram allowFrom (username or user id)，如何获取user id**

首先，确保你已经下载并安装了Telegram应用。可以通过App Store、Google Play或Telegram官网进行下载安装。安装完成后，使用手机号登录进入Telegram主界面。

搜索并启动@userinfobot：在Telegram的搜索栏中输入“@userinfobot”，找到并点击进入该Bot页面。@userinfobot是一个专门用来查询UserId的Bot，启动后，它会自动引导你进行操作。

发送“/start”命令获取UserId：进入Bot聊天界面后，发送“/start”命令，Bot会自动回复你自己的Telegram UserId，通常是一个数字，代表你的唯一身份标识。通过这个方式，你可以轻松地获取到自己的UserId。

**问题：我原先已配置好qq，便想改成telegram 怎么做**

命令：openclaw configure 加一个channel就行

### 3、OpenClaw接入飞书

参考文档：

- [快速部署OpenClaw（原Moltbot），集成飞书AI助手](https://www.volcengine.com/docs/6369/2189942?lang=zh)

---

[飞书Web应用端](https://www.feishu.cn/)

[飞书开发者平台](https://open.feishu.cn/?lang=zh-CN)



1、安装飞书插件，插件Github地址：[m1heng/clawdbot-feishu](https://github.com/m1heng/clawdbot-feishu)

`openclaw plugins install @m1heng-clawd/feishu`

2、配置飞书信息

配置我们需要appId、appSecret、encryptKey和verificationToken这些信息，这些都可以在飞书的开发者后台获取到，可以参考上面的参考文档。

```shell
{
    "channels": {
        "feishu": {
            "enabled": true,
            "appId": "cli_a...2b1b89bca",
            "appSecret": "rc2Wp...C2rNeJ0zeQqC6KC",
            "encryptKey": "z3w...lB7f63cUNCXsdu",
            "verificationToken": "lr6gRTM...q38ng6lwpj4viVR",
            "connectionMode": "websocket"
        }
    }
}
```

3、启动网关： `openclaw gateway`

4、在bot里面发消息，bot会返回一个配对码，然后执行：`openclaw pairing approve feishu X27...4MQ`

**补充：**

1、开发配置-权限管理-批量导入/到处权限：

```json
{
  "scopes": {
    "tenant": [
      "im:chat:read",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message.pins:read",
      "im:message.pins:write_only",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users",
      "im:message:send_sys_msg",
      "im:message:update",
      "im:resource",
      "contact:contact.base:readonly"
    ],
    "user": [
      "contact:user.employee_id:readonly"
    ]
  }
}
```

## 六、Skills

Skills下载地址：

- [skillsmp](https://skillsmp.com/)

- [claude](https://claude.com/skills)

- [skills.sh](https://skills.sh/)

常用指令：

财经新闻、股票600519、天气北京、力扣每日一题、黄金价格、帮我找个做xxx的技能。

## 七、Google Voice

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

现在先用tg接入openclaw

保号，talkatone一个月一次，google voice三个月一次。

## 8、Google Gemini 3 pro

Chat：[https://gemini.google.com/](https://gemini.google.com/app)

AiStudio：[https://aistudio.google.com/](https://aistudio.google.com/?project=gen-lang-client-0898031950)

Gemini 3 pro申请：

- [https://one.idkey.cc/](https://one.idkey.cc/)

一个Claude、Codex中转：[Code Router](https://api.code-relay.com/console)

