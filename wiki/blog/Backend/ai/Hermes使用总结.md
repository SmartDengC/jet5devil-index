---
title: Hermes使用总结
createTime: 2026/04/21 22:34:05
permalink: /article/psaelxlh/
---


还没有玩明白OpenClaw， Hermes又出来了。 



[nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

安装：

```
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

---

*next → /commands 2*
