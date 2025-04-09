---
title: Tmux 极简入门：5步解锁终端复用新姿势
createTime: 2025/04/09 21:42:29
permalink: /article/03mhcf2d/
tags:
  - tmux
---

探讨 Tmux 设计理念对效率工具选择的启示，分析会话隔离、环境持久化背后的“无状态”工作哲学。  详解 Tmux 会话持久化机制，结合 SSH 断线自动恢复、后台进程守护，保障远程服务器任务的连续性。

标签：快捷键、窗格操作、鼠标控制

<!-- more -->

[Tmux 使用教程](https://www.ruanyifeng.com/blog/2019/10/tmux.html)

直接上简单的操作。

tmux的前缀快捷键：Ctrl + b

- `Ctrl+b %`：划分左右两个窗格。
- `Ctrl+b "`：划分上下两个窗格。
- `Ctrl+b <arrow key>`：光标切换到其他窗格。`<arrow key>`是指向要切换到的窗格的方向键，比如切换到下方窗格，就按方向键`↓`。
- `Ctrl+b Ctrl+<arrow key>`：按箭头方向调整窗格大小。
