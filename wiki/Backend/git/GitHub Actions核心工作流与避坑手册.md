---
title: GitHub Actions核心工作流与避坑手册
createTime: 2025/06/01 16:20:37
permalink: /article/76ri5o80/
tags:
  - git
  - gitHub
  - actions
---

GitHub Actions作为事件驱动的自动化平台，可无缝集成代码开发到部署的全流程。本文详解：

- **核心概念**：Workflow文件结构、Job/Step依赖关系、Runner运行机制
- **高阶实战**：多环境矩阵构建（matrix）、密钥安全管理（Secrets）、自定义Docker容器
- **工程化落地**：自动化测试→容器镜像构建→多云部署流水线设计
- **效能提升**：缓存优化加速CI、审批工作流、问题自动跟踪 通过YAML配置替代Jenkins等工具，实现轻量化、可追溯的云原生CI/CD。

<!-- more -->

## 一、对Action的yml配置文件有一个简单的理解


下面是一个从官网markplace里面找的一个action的配置文件，是一个对vue项目进行CI的配置文件，我们以这个来学习action中的各个变量的含义。

```yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI  ## 定义工作流的名称

on:  ## 设置触发条件
  push:
    branches: [ "main" ]  ## 当代码推送到main分支时触发
  pull_request:
    branches: [ "main" ]  ## 当创建或者拉去main分支时触发

jobs:  ## 定义工作单元
  build:  # 自定义工作单元的名称，《build》这里可以随便起

    runs-on: ubuntu-latest  ## 工作单元运行的环境，这里指定使用最新的ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:  ## 工作单元步骤
    - uses: actions/checkout@v4  ## 使用github官方的checkout动作，检查出仓库代码
    
    - name: Use Node.js ${{ matrix.node-version }}  # name表示这个步骤的名称
      uses: actions/setup-node@v4  ## 使用setup-node这个action
      with:  ## ？
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
```

具体变量含义，可以参考：

- [GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

## 二、配置隐私内容变量

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-github-profile-3d-contrib
    steps:
      - uses: actions/checkout@v4 # 访问当前仓库，v4表示版本
      - uses: yoshi389111/github-profile-3d-contrib@latest
        env:
          GITHUB_TOKEN: ${{ secrets.ACTION_GITHUB_TOKEN }}
          USERNAME: ${{ github.repository_owner }}
      - name: Commit & Push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add -A .
          if git commit -m "generated"; then
            git push
          fi
```

我们会用到github token（如：secrets.ACTION_GITHUB_TOKEN ），但是如果直接硬编码到文件里面，感觉有点不安全，这里就可以设置secrets

在项目的setting里面，找到Actions添加。

![image-20250601180051546](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202506011800597.png)

## 三、典型生态项目

### 3.1、actions/checkout

actions/checkout 是一个常用的 GitHub Action，用于检出仓库代码。

```yaml
- uses: actions/checkout@v2
```

### 3.2、actions/setup-node
actions/setup-node 用于设置 Node.js 环境。

```yaml
- uses: actions/setup-node@v2
  with:
    node-version: '14'
```

### 3.3、actions/upload-artifact
actions/upload-artifact 用于上传构建产物。

```yaml
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: path/to/artifact
```

### 3.4、easingthemes/ssh-deploy

ssh-deploy是一个ssh工具，通过ssh协议连接服务器，然后可以通过scp等命令实现文件上传。

例如：

```yaml
      - name: Deploy wiki to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
        	# 在GitHub仓库的Settings -> Secrets中设置你的SSH密钥
          SSH_PRIVATE_KEY: ${{ secrets.ALIYUN_SSH_PRIVATE_KEY }} 
          ARGS: "-rltgoDzvO --delete" # rsync参数，用于同步文件并删除目标服务器上不存在的文件
          SOURCE: "wiki/.vuepress/dist/" # 要上传的目录，这里是构建后的dist目录
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }} # 你的服务器IP或域名
          REMOTE_USER: ${{ secrets.REMOTE_USER }} # 服务器上的用户名，通常是ubuntu或root等
          # 在服务器上的目标目录路径，例如 /var/www/html/myproject/dist/
          TARGET: ${{ secrets.REMOTE_TARGET_FOR_WIKI }} 
```

配置里面有对每个参数的含义，这里就不过多说明，简单说一下如何配置：

参考：[ssh deployments](https://github.com/marketplace/actions/ssh-deploy)

- 1、使用`ssh-keygen -m PEM -t rsa -b 4096` 在服务器上面生成公钥和私钥
- 2、将公钥内容复制到文件  `~/.ssh/authorized_keys`文件下面，如果没有可以创建一个
- 3、在Github代码仓库的setting下，找到Secrets and Variables，Actions下面配置变量
  - 定义：ALIYUN_SSH_PRIVATE_KEY（名称随意取，在使用的时候对应上既可以），内容是刚才生成的SSH私钥内容
  - 定义：REMOTE_HOST （域名或者IP）
  - 定义：REMOTE_USER（用户名，应该是要和生成密钥的用户一致）
  - 定义：REMOTE_TARGET_FOR_WIKI（文件上传的目录地址）

![image-20250912113802613](https://gitee.com/jet5devil/typora-picture/raw/master/mac_img/202509121138733.png)

## 四、实际案例

### 4.1、Vue项目使用Actions打包并推送到指定服务目录

```yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Deploy Project for Wiki

on:
  push:
    branches: ["w_preview"]

jobs:
  wiki-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          run_install: false

      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"

      - name: Debug env vars
        run: |
          echo "REMOTE_HOST: ${{ secrets.REMOTE_HOST }}"
          echo "REMOTE_USER: ${{ secrets.REMOTE_USER }}"
          echo "TARGET: ${{ secrets.REMOTE_TARGET_FOR_WIKI }}"
      - name: Debug env vars2
        env:
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET_FOR_WIKI }}
        run: |
          echo "REMOTE_HOST: $REMOTE_HOST"
          echo "REMOTE_USER: $REMOTE_USER"
          echo "TARGET: $TARGET"

      - run: pnpm install --no-lockfile
      - run: pnpm wiki:build

      - name: Deploy wiki to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ALIYUN_SSH_PRIVATE_KEY }} 
          # 在GitHub仓库的Settings -> Secrets中设置你的SSH密钥
          ARGS: "-rltgoDzvO --delete" # rsync参数，用于同步文件并删除目标服务器上不存在的文件
          SOURCE: "wiki/.vuepress/dist/" # 要上传的目录，这里是构建后的dist目录
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }} # 你的服务器IP或域名
          REMOTE_USER: ${{ secrets.REMOTE_USER }} # 服务器上的用户名，通常是ubuntu或root等
          TARGET: ${{ secrets.REMOTE_TARGET_FOR_WIKI }} 
          # 在服务器上的目标目录路径，例如 /var/www/html/myproject/dist/


      # - uses: webfactory/ssh-agent@v0.8.0
      #   with:
      #     ssh-private-key: ${{ secrets.ALIYUN_SSH_PRIVATE_KEY }}

      # - name: push files to Aliyun Server
      #   run: |
      #     scp -o StrictHostKeyChecking=no -r wiki/.vuepress/dist/* ${{ secrets.REMOTE_USER }}@${{ secrets.REMOTE_HOST }}:${{ secrets.REMOTE_TARGET_FOR_WIKI }}

```

### 4.2、Github Person Page

**profile-3d.yml**

```yaml
name: GitHub-Profile-3D-Contrib

on:
  schedule: # 03:00 JST == 18:00 UTC
    - cron: "0 18 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-github-profile-3d-contrib
    steps:
      - uses: actions/checkout@v4 # 访问当前仓库，v4表示版本
      - uses: yoshi389111/github-profile-3d-contrib@latest
        env:
          GITHUB_TOKEN: ${{ secrets.ACTION_GITHUB_TOKEN }}
          USERNAME: ${{ github.repository_owner }}
      - name: Commit & Push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add -A .
          if git commit -m "generated"; then
            git push
          fi
```

**snake.yml**

```yaml
name: Generate Animation

on:
  # run automatically every 24 hours
  schedule:
    - cron: "0 */24 * * *"

  # allows to manually run the job at any time
  workflow_dispatch:

  # run on every push on the main branch
  push:
    branches:
      - main

jobs:
  generate:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      # generates a snake game from a github user (<github_user_name>) contributions graph, output a svg animation at <svg_out_path>
      - name: generate github-contribution-grid-snake.svg
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark

      # push the content of <build_dir> to a branch
      # the content will be available at https://raw.githubusercontent.com/<github_user>/<repository>/<target_branch>/<file> , or as github page
      - name: push github-contribution-grid-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.ACTION_GITHUB_TOKEN }}
```



#### 注意点：

- 1、需要将package.json的lock文件上传上去，pnpm的话就是pnpm-lock.yaml文件

#### 参考：

- [使用pnpm构建项目：Setup pnpm](https://github.com/marketplace/actions/setup-pnpm)

- [使用GitHub Page：Build Vue and deploy it to Github Pages](https://github.com/marketplace/actions/vue-to-github-pages)
