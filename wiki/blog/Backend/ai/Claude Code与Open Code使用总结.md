---
title: Claude Code与Open Code使用总结
createTime: 2026/02/04 09:52:45
permalink: /article/xolj8twb/
---

## 一、Claude Code

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

[DeepSeek 官网](https://www.deepseek.com/)

[DeepSeek Api文档](https://api-docs.deepseek.com/zh-cn/)

poe 连接claude code

[Poe 官网](https://poe.com/)

[Poe Doc](https://creator.poe.com/docs)



使用Ctrl+Alt+S快捷键打开idea全局配置，在快捷键映射配置Settings -> keymap中，找到 Plug-ins -> Terminal -> Switch Focus To Editor，删除其快捷键绑定即可。

```
# Set these in your shell (e.g., ~/.bashrc, ~/.zshrc)
export POE_API_KEY="api key"
export ANTHROPIC_BASE_URL="https://api.poe.com"
export ANTHROPIC_AUTH_TOKEN="$POE_API_KEY"
export ANTHROPIC_API_KEY="" # Important: Must be explicitly empty
```

[anyrouter url](https://anyrouter.top/login)



## 二、[Open Code](https://opencode.ai/)

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

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```



```
# 安装 Bun（若未安装）
curl -fsSL https://bun.sh/install | bash
# 安装 Oh My OpenCode（示例：启用 Claude 与 ChatGPT）
bunx oh-my-opencode install --no-tui --claude=no --chatgpt=no --gemini=no
```



问题：当opencode 添加插件之后，就打不开opencode了，例如：

```
{
  "plugin": ["oh-my-opencode@3.4.0"]
}
```

