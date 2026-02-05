---
title: Claude Code使用总结
createTime: 2026/02/04 09:52:45
permalink: /article/xolj8twb/
---


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



[DeepSeek Api文档](https://api-docs.deepseek.com/zh-cn/)

[DeepSeek Chat](https://chat.deepseek.com/)



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