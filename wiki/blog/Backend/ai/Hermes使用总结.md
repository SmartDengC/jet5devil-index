---
title: Hermes使用总结
createTime: 2026/04/21 22:34:05
permalink: /article/psaelxlh/
---

还没有玩明白OpenClaw， Hermes又出来了。 

<!-- more -->

[nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

昨天找了一个 1 核 1G 的 VPS，今天来尝试在上面部署一下 hermes，因为我发现国内和国外使用相同版本的 hermes，相同的 Token API，相同的问题，给出的回答都不一样，国外的服务器回答的偏好（自我感觉）。

## Install

```shell
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc    # reload shell (or: source ~/.zshrc)
hermes     
```

需要git的依赖，没有安装的使用服务器对应的包管理工具安装一下git，比如我的新服务器是Rocky Linux 8.10 ，使用`dnf install -y git`

安装的最后会有问题：

```
How would you like to set up Hermes?
  ↑↓ navigate  ENTER/SPACE select  ESC cancel
 → (●) Quick Setup (Nous Portal) — free OAuth login, no API keys, model + tools (recommended)
   (○) Full setup — configure every provider, tool & option yourself (bring your own keys)
   (○) Blank Slate — everything off except the bare minimum; opt in to each capability
```

- Quick Setup 快速配置
- Full Setup 自定义配置
- Blank Slate  最小配置

```
Select terminal backend:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel
   (○) Local - run directly on this machine (default)
   (○) Docker - isolated container with configurable resources
   (○) Modal - serverless cloud sandbox
   (○) SSH - run on a remote machine
   (○) Daytona - persistent cloud development environment
   (○) Singularity/Apptainer - HPC-friendly container
 → (●) Keep current (local)
 
```

运行方式

 ```
 Connect a messaging platform? (Telegram, Discord, etc.)
   ↑↓ navigate  ENTER/SPACE select  ESC cancel
 
    (●) Set up messaging now (recommended)
  → (○) Skip — set up later with 'hermes setup gateway'
 ```

更新的话，使用安装命令更新，`hermes update`

切换hermes的风格：`/personality + \<name>`，如果不知道有什么对话风格，可以参考链接：[Built-in personalities](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality?_highlight=person#built-in-personalities)

在飞书中可以使用的命令： `/commands`

## Commands List

```shell
hermes              # Interactive CLI — start a conversation
hermes model        # Choose your LLM provider and model
hermes tools        # Configure which tools are enabled
hermes config set   # Set individual config values
hermes gateway      # Start the messaging gateway (Telegram, Discord, etc.)
hermes setup        # Run the full setup wizard (configures everything at once)
hermes claw migrate # Migrate from OpenClaw (if coming from OpenClaw)
hermes update       # Update to the latest version
hermes doctor       # Diagnose any issues
```

`hermes gateway setup` 配置Message Gateway

设置root自启动

```shell
 sudo hermes gateway start --system              # Start the service
 sudo hermes gateway status --system             # Check status
 journalctl -u hermes-gateway -f  # View logs
```

### Session Management

| Command        | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| /new           | Start a new session (fresh session ID + history) *(alias: /reset)* |
| /retry         | Retry the last message (resend to agent)                     |
| /und           | Remove the last user/assistant exchange                      |
| /title [name]  | Set a title for the current session                          |
| /branch [name] | Branch the current session (explore a different path)        |

### Process & Command Control
| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| /stop                      | Kill all running background processes |
| /approve [session\|always] | Approve a pending dangerous command   |
| /deny                      | Deny a pending dangerous command      |

### Status & Profile
| Command        | Description                                            |
| -------------- | ------------------------------------------------------ |
| /status        | Show session info                                      |
| /profile       | Show active profile name and home directory            |
| /sethome       | Set this chat as the home channel *(alias: /set-home)* |
| /resume [name] | Resume a previously-named session                      |

### Backup & Import

今天租赁服务器的公司不在运行了，开始清算了，需要备份服务器的数据。

[hermes backup](https://hermes-agent.nousresearch.com/docs/reference/cli-commands#hermes-backup)

```
hermes backup                           # Full backup to ~/hermes-backup-*.zip
hermes backup -o /tmp/hermes.zip        # Full backup to specific path
hermes backup --quick                   # Quick state-only snapshot
hermes backup --quick --label "pre-upgrade"  # Quick snapshot with label
```

具体操作：

```shell
root@hk6613497194:~# hermes backup  
Scanning ~/.hermes ...
Backing up 1159 files ...
  500/1159 files ...
  1000/1159 files ...
Backup complete: /root/hermes-backup-2026-05-07-061028.zip
  Files:       1159
  Original:    46.5 MB
  Compressed:  16.9 MB
  Time:        8.8s
  Excluded directories:
    hermes-agent/ migration/openclaw/20260419T132528/archive/extensions/openclaw-lark/node_modules/
migration/openclaw/20260419T132528/archive/extensions/openclaw-weixin/node_modules/
    migration/openclaw/20260419T132528/backups/
    skills/autonomous-ai-agents/hermes-agent/
Restore with: hermes import hermes-backup-2026-05-07-061028.zip
```

[hermes import](https://hermes-agent.nousresearch.com/docs/reference/cli-commands#hermes-import)

`Restore with: hermes import hermes-backup-2026-05-07-061028.zip`

## Hermes集成聊天工具

hermes gateway setup

现在 hermes 接入了高驰的 MCP，微信读书的 skill

参考：

- [Gateway](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/messaging)

### Hermes 集成 Discord



Hermes接入 Discord 的方法如下：

Discord 开发者后台操作：

1、进入到 Discord 的开发者后台，登录之后，点击右上角的 New Application

2、填入 Application 的名称，然后点击右侧的 Bot

3、开启 Public Bot ，关闭 Requires OAuth2 Code Grant， 开启 Presence Intent， 开启Server Members Intent， 开启 Message Content Intent

4、然后点击左侧的 Installaiion， 在 Guild Install 中加入 bot，然后复制 Install Link 下面的链接，在浏览器中打开，添加刚才我们链接的服务，这样的话，我们就把 Bot 链接到我们的 Server 里面了。

下面是在 Hermes 中的配置

1、使用命令 hermes gateway setup， 选择 discord ， 输入 user id，channel id

- User Id： 点击设置，打开 Developer Model ， 然后就可以点击头像，然后点击 Copy User Id
- Channel Id： 邮件 channel ，点击 Copy Channel Id

参考：

- [Hermes Document：Discord 集成](https://hermesagent.org.cn/docs/user-guide/messaging/discord)
- [Discord 开发者后台](https://discord.com/developers/home)

## Hermes 删除供应商API

第一步：编辑 Hermes 配置文件，并删除相应的供应商，

hermes config edit

找到并删除 `custom_providers` 下对应的条目。以你的情况，删除这三段：

```yaml
custom_providers:
  - name: bailian          # ← 删掉整个块
    base_url: ...
```

第二步：删除凭据池中的 API keys

```bash
# 删除 opencode-go 的 API key（已失效）
hermes auth remove opencode-go 1
```

第三步：清理 .env 文件（环境变量）

hermes config env-path    # 查看 .env 路径

然后编辑 `.env`，删除这行：

```
BAILIAN_API_KEY=***
KIMI_CODE_API_KEY=***
OPENCODE_GO_API_KEY=***
```

## Cloud Google

谷歌云地址：https://cloud.google.com/

vps仓库：https://github.com/yonggekkk/sing-box-yg

## Free Domain

免费域名：https://register.us.kg

```
ssh-keygen -t rsa -f ~/.ssh/gcp -C joe_dengc
```

申请的免费域名：dio.qzz.io 

/usage full



