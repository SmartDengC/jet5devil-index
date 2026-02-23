---
title: OpenClaw使用总结
createTime: 2026/02/15 16:23:50
permalink: /article/twhdwakv/
tags:
  - ai
  - openclaw
  - tg
  - 企业微信
---

跟随时代潮流，搭建自己的AI助手。

<!-- more -->

## 一、[OpenClaw](https://openclaw.ai/)

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



openclaw status

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



## 二、OpenClaw模型配置

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

## 三、OpenClaw集成第三方软件

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

---

- 

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



## 三、Google Gemini 3 pro



Chat：[https://gemini.google.com/](https://gemini.google.com/app)

AiStudio：[https://aistudio.google.com/](https://aistudio.google.com/?project=gen-lang-client-0898031950)

Gemini 3 pro申请：

- [https://one.idkey.cc/](https://one.idkey.cc/)

一个Claude、Codex中转：[Code Router](https://api.code-relay.com/console)

