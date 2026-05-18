---
title: Hermes使用总结
createTime: 2026/04/21 22:34:05
permalink: /article/psaelxlh/
---


还没有玩明白OpenClaw， Hermes又出来了。 



[nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

安装：

```shell
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc    # reload shell (or: source ~/.zshrc)
hermes     
```

更新的话，使用安装命令更新。





切换hermes的风格

/personality + \<name>

[Built-in personalities](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality?_highlight=person#built-in-personalities)



在飞书中可以使用的命令： /commands

## Commands List

### Session Management
| Command                                         | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `/new`                                          | Start a new session (fresh session ID + history) *(alias: /reset)* |
| `/retry`                                        | Retry the last message (resend to agent)                     |
| `/undo`                                         | Remove the last user/assistant exchange                      |
| `/title [name]`                                 | Set a title for the current session                          |
| `/branch [name]`                                | Branch the current session (explore a different path) *(alias: /fork)* |
| `/compress [focus topic]`                       | Manually compress conversation context                       |
| `/rollback [number]`                            | List or restore filesystem checkpoints                       |
| `/snapshot [create\|restore &lt;id&gt;\|prune]` | Create or restore state snapshots of Hermes config/state *(alias: /snap)* |

### Process & Command Control
| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `/stop`                      | Kill all running background processes |
| `/approve [session\|always]` | Approve a pending dangerous command   |
| `/deny`                      | Deny a pending dangerous command      |

### Background & Queued Operations
| Command                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `/background &lt;prompt&gt;` | Run a prompt in the background *(alias: /bg)*                |
| `/btw &lt;question&gt;`      | Ephemeral side question using session context (no tools, not persisted) |
| `/agents`                    | Show active agents and running tasks *(alias: /tasks)*       |
| `/queue &lt;prompt&gt;`      | Queue a prompt for the next turn (doesn't interrupt) *(alias: /q)* |
| `/steer &lt;prompt&gt;`      | Inject a message after the next tool call without interrupting |

### Status & Profile
| Command          | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `/status`        | Show session info                                      |
| `/profile`       | Show active profile name and home directory            |
| `/sethome`       | Set this chat as the home channel *(alias: /set-home)* |
| `/resume [name]` | Resume a previously-named session                      |

### Hermes 集成 Discord

MBP 2025 款上面有一些内容，没有提交。

[Hermes Document：Discord 集成](https://hermesagent.org.cn/docs/user-guide/messaging/discord)

[Discord 开发者后台](https://discord.com/developers/home)



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



### 备份与恢复

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
    hermes-agent/
    migration/openclaw/20260419T132528/archive/extensions/openclaw-lark/node_modules/
    migration/openclaw/20260419T132528/archive/extensions/openclaw-weixin/node_modules/
    migration/openclaw/20260419T132528/backups/
    skills/autonomous-ai-agents/hermes-agent/

Restore with: hermes import hermes-backup-2026-05-07-061028.zip
```



[hermes import](https://hermes-agent.nousresearch.com/docs/reference/cli-commands#hermes-import)

`Restore with: hermes import hermes-backup-2026-05-07-061028.zip`



谷歌云地址：https://cloud.google.com/

vps仓库：https://github.com/yonggekkk/sing-box-yg

免费域名：https://register.us.kg

```
ssh-keygen -t rsa -f ~/.ssh/gcp -C joe_dengc
```

conn.dio.qzz.io



/usage full
