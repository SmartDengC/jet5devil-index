---
title: OpenCode使用总结
createTime: 2026/02/15 16:23:50
permalink: /article/twhdwakv/
cover: /cover/opencode-index-cn.png
tags:
  - ai
  - opencode
---

跟随时代潮流，搭建自己的AI助手。

Ai让写代码不再困难。

<!-- more -->

## Codex



简单总结 codex 的使用教程。

文件夹与 THREAD 概念，一个任务一个 THREAD



/review  选择 code review， 可以 review 没有提交的代码，或者是一个分支。

定时任务，每天下班前，清除 console.log，汇总没有做完的任务

/plan change  to plan model

agents.md

codex 宠物

/Status 展示 token 的使用量

$Image gen

@Chrome



Pets

https://petdex.crafter.run/

https://www.codefather.cn/

https://ai.codefather.cn/painting





更新 Codex

我是用 pnpm 安装的 codex，更新使用：pnpm add -g @openai/codex@latest



Codex SSD bug

[Codex 会把磁盘给烧了？完整复盘来了！](https://zhuanlan.zhihu.com/p/2053049768499324778)

[Codex SQLite feedback logs can write ~640 TB/year and rapidly consume SSD endurance #28224](Codex SQLite feedback logs can write ~640 TB/year and rapidly consume SSD endurance #28224)

持续关注一下。

```
(base) ➜ CoolStuffes (1.x) ✔ du -h ~/.codex/logs_2.sqlite*
232M	/Users/dengc4r/.codex/logs_2.sqlite
 32K	/Users/dengc4r/.codex/logs_2.sqlite-shm
5.0M	/Users/dengc4r/.codex/logs_2.sqlite-wal
(base) ➜ CoolStuffes (1.x) ✔
(base) ➜ CoolStuffes (1.x) ✔
(base) ➜ CoolStuffes (1.x) ✔ sqlite3 ~/.codex/logs_2.sqlite
SQLite version 3.43.2 2023-10-10 13:08:14
Enter ".help" for usage hints.
sqlite> select count(*), min(id), max(id) from logs;
18721|3996749|5219122
```



## OpenCode



前提：NodeJS安装

[NodeJS Download](https://nodejs.org/en/download)

在使用opencode，还是openclaw，都需要node支持，opencode 需要node >= v20+, openclaw需要node >= v22+

遇到的问题：

```shell
 ERR_PNPM_NO_GLOBAL_BIN_DIR  Unable to find the global bin directory

Run "pnpm setup" to create it automatically, or set the global-bin-dir setting, or the PNPM_HOME env variable. The global bin directory should be in the PATH.
```

运行以下命令即可解决：

pnpm setup

然后重新加载 shell 配置：

source ~/.bashrc

pnpm setup 会自动创建全局 bin 目录并配置 PNPM_HOME 环境变量。

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

`/connect`添加模型



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



问题：openai 一直用不上， Quota exceeded, check your plan and billing details.

```
opencode auth logout
opencode auth login
```

使用pnpm安装opencode `pnpm i -g opencode-ai`

卸载opencode `opencode uninstall --force`

安装oh-my-opencode `pnpm add oh-my-opencode@latest`

debug过程：` opencode debug paths` ，日志路径` /Users/dengc4r/.local/share/opencode/log`

清除缓存：`rm -rf ~/.cache/opencode`

认证信息配置文件：`~/.local/share/opencode/auth.json`

OpenCode 配置文件目录：`~/.config/opencode/opencode.json`

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

OpenCode 接入Mimo：[Mimo 文档 OpenCode 配置](https://mimo.mi.com/docs/zh-CN/tokenplan/integration/opencode)

[Mimo Platform](https://platform.xiaomimimo.com/console/balance)
