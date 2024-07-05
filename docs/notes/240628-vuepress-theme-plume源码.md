---
title: vuepress-theme-plume源码
author: 邓聪的小破站
createTime: 2024/06/28 00:36:57
permalink: /article/xfyjihyq/
tags: 
  - vuepress
---

这块代码已经是下载下来了。

下面是项目的目录。

```shell
├── CHANGELOG.BETA.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── commitlint.config.js
├── docs
│   ├── 1.示例
│   ├── 2.preview
│   ├── README.md
│   ├── changelog.md
│   ├── contributing.md
│   ├── demos.md
│   ├── en
│   ├── friends.md
│   ├── notes
│   ├── package.json
│   └── sponsor.md
├── eslint.config.js
├── netlify.toml
├── package.json
├── plugins  // plugins 是项目所引用的插件，直接放到了项目里面
│   ├── plugin-auto-frontmatter
│   ├── plugin-baidu-tongji
│   ├── plugin-blog-data
│   ├── plugin-caniuse
│   ├── plugin-content-update
│   ├── plugin-copy-code
│   ├── plugin-fonts
│   ├── plugin-iconify
│   ├── plugin-md-power
│   ├── plugin-netlify-functions
│   ├── plugin-notes-data
│   ├── plugin-page-collection
│   ├── plugin-search
│   ├── plugin-shikiji
│   └── tsconfig.build.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── preview
│   ├── plume.svg
│   ├── preview-blog.jpeg
│   ├── preview-home.jpeg
│   ├── preview-note.jpeg
│   └── preview-post.jpeg
├── readme.md
├── stylelint.config.js
├── theme
│   ├── LICENSE
│   ├── README.md
│   ├── package.json
│   ├── src
│   ├── templates
│   └── tsconfig.build.json
├── tsconfig.base.json
├── tsconfig.build.json
└── tsconfig.json
```

## 1 package.json

首先要看的就是项目的 package.json， 里面包含了项目所用到的依赖和 scripts 命令。定义了 node、pnpm 的版本。

当前使用的 pnpm 是 8.14 的版本，项目需要升级到 9.+。

```shell
(base) ➜ vuepress-theme-plume (main) ✔ npm install -g pnpm@latest

changed 1 package in 12s

1 package is looking for funding
  run `npm fund` for details
```

```shell
(base) ➜ vuepress-theme-plume (main) ✔ pnpm setup
Appended new lines to /Users/dengc4r/.zshrc

Next configuration changes were made:
export PNPM_HOME="/Users/dengc4r/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

To start using pnpm, run:
source /Users/dengc4r/.zshrc
(base) ➜ vuepress-theme-plume (main) ✔ source /Users/dengc4r/.zshrc
(base) ➜ vuepress-theme-plume (main) ✔ pnpm -v
8.14.3
(base) ➜ vuepress-theme-plume (main) ✔ pnpm i -g pnpm
Nothing to stop. No server is running for the store at /Users/dengc4r/Library/pnpm/store/v3
The location of the currently running pnpm differs from the location where pnpm will be installed
 Current pnpm location: /usr/local/bin
 Target location: /Users/dengc4r/Library/pnpm

Packages: +1
+
Progress: resolved 1, reused 0, downloaded 1, added 1, done

/Users/dengc4r/Library/pnpm/global/5:
+ pnpm 9.4.0

Done in 9.4s
```

## 2、plugins

plugins 是项目所引用的插件，直接放到了项目里面

```shell
├── plugins  // plugins 是项目所引用的插件，直接放到了项目里面
│   ├── plugin-auto-frontmatter
│   ├── plugin-baidu-tongji
│   ├── plugin-blog-data
│   ├── plugin-caniuse
│   ├── plugin-content-update
│   ├── plugin-copy-code
│   ├── plugin-fonts
│   ├── plugin-iconify
│   ├── plugin-md-power
│   ├── plugin-netlify-functions
│   ├── plugin-notes-data
│   ├── plugin-page-collection
│   ├── plugin-search
│   ├── plugin-shikiji
│   └── tsconfig.build.json
```

Auto-frontmatter 自动格式化？
