---
title: 如何将Detached HEAD提交到master分支
author:
createTime: 2024/01/24 21:40:19
permalink: /article/4kejw8dd/
tags:
  - git
---

记录场景后面完善。

现在在 master 上面，把刚才的修改的代码都已经 push 到 github 上面了，这个时候发现有点问题，就从某个 master 的某个 commit 拉出来一个分支修改，但是这个分支只是临时的。

现在我需要将我在临时分支修改的代码合并到 master 上面。
然后 merge 之后重新提交到 github。

我在到网页上看的时候，这里出现了一个问题，就是 github 上面提示，让我创建一个 pr，这里创建失败了，提示如下：

> Pull request creation failed. Validation failed: No commits between master and merge0

**参考：**
[如何将我的”Detached HEAD”提交合并到主分支(master)](https://deepinout.com/git/git-questions/1051_git_how_do_i_get_my_detached_head_commits_back_into_master.html)
[git 用 A 分支的某个文件覆盖 B 分支某个文件](https://blog.csdn.net/Vector97/article/details/114281790)
