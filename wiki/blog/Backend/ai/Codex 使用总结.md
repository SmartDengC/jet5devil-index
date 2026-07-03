---
title: Codex 使用总结
createTime: 2026/05/14 12:52:06
permalink: /article/rjpx4o4y/
---

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

