---
title: 版本管理工具 Git 提交规则
author: 阿聪小破站
createTime: 2024/02/02 18:15:30
permalink: /article/xvq6j4t0/
tags: 
  - git
---

规范的Git提交是代码可追溯性与团队协作的基石。本文详解提交的正确姿势：

1. **原子化拆分**：单次提交仅完成一件事
2. **语义化消息**：采用`<type>(<scope>): <subject>`格式（如feat(user): 登录验证）
3. **交互式操作**：`git commit -v`校验改动，`git rebase -i`合并碎片提交
4. **自动化管控**：Commitlint校验规则 + Git钩子拦截不规范提交 通过标准化流程规避脏历史，提升代码审查与问题定位效率。

<!-- more -->

## 一、Commit Message 的作用

格式化的 commit message 有几个好处

### 1、提供更多的历史信息，方便快速浏览

比如，下面的命令显示上次发布后的变动，每个 commit 占据一行。你只看首行，就知道每次 commit 的目的。

```
git log <last tag> HEAD --pretty=format:%s
```

### 2、可以过滤某些 commit（比如文档改动），便于快速查找信息

比如下面的命令仅仅展示本次发布新增的功能

```
git log <last release> HEAD --grep feature
```

### 3、可以直接从 commit 生成 change log

change log 是发布新版本的时候，用来说明与上一个版本差异的文档。

## 二、Commit Message 的格式

每次提交，commit message 都包含三个部分： header body 和 footer

```
<type>(<scope>): <subject>// 空一行<body>// 空一行<footer>
```

### 1、Header

header 部分只有一行，包括三个字段， type 必需、scope 可选和 subject 必需

#### type

type 用于说明 commit 的类别，只允许使用下面 7 个标识

- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style：格式（不影响代码运行的变动）
- refactor：重构（既不新增功能，也不修改 bug 的代码改动）
- test：增加测试
- chore：构建过程和辅助工具的变动
  如果 type 为 feat 和 fix，则该 commit 将可定出现在 change log 之中。其他情况自己决定要不要放到 change log，建议不要。

#### scope

scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等

#### subject

subject 是 commit 目的的简短描述，不超过 50 个字符。

- 以动词开头，使用第一人称现在是，比如 change， 而不是 changed 或者 changes
- 第一个字母小写
- 结尾不加句号

### 2、body

body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例

```
More detailed explanatory text, if necessary.  Wrap it to
about 72 characters or so. Further paragraphs come after blank lines.- Bullet points are okay, too- Use a hanging indent
```

有两点注意：

- 使用第一人称现在是，比如使用 change，而不是 changed 或 changes
- 应该说明代码的变更动机，以及与前行为的对比。

### 3、footer

footer 部分只用于两种情况

- 不兼容变动，如果当前代码与上一个版本不兼容，则 footer 部分以 BREAKING CHANGE 开头，后面是对变动的描述。
- 关闭 issue，如果当前 commit 针对某一个 issue，那么可以在 footer 部分关闭这个 issue `Closes #234, #245`

## 三、Commitizen

commitizen 是一个撰写合格 commit message 的工具。
安装命令：`npm install -g commitizen`
然后在项目目录里面，运行下面的命令，使其支持 Angular 的 commit message 格式。`commitizen init cz-conventional-changelog --save --save-exact`
以后，范式用到 git commit 命令，一律改为使用 git cz，这样就会出现相应的选项用来生成符合条件的 commit message 信息。

## 四、参考文章

[Git 提交的正确姿势：Commit message 编写指南](https://developer.aliyun.com/article/441408)
