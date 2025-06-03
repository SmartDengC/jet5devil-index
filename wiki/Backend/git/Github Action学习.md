---
title: Github Action学习
createTime: 2025/06/01 16:20:37
permalink: /article/76ri5o80/
---

什么是Github Action？ 

我对Github Action的理解就是简化版的CI/CD。Github 通过将流程的脚本放到项目仓库里面，配置适当的触发点，自动进行发布。

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

### actions/checkout

actions/checkout 是一个常用的 GitHub Action，用于检出仓库代码。

```yaml
- uses: actions/checkout@v2
```

### actions/setup-node
actions/setup-node 用于设置 Node.js 环境。

```yaml
- uses: actions/setup-node@v2
  with:
    node-version: '14'
```

### actions/upload-artifact
actions/upload-artifact 用于上传构建产物。

```yaml
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: path/to/artifact
```



## 四、实际案例

```yaml
name: Node.js CI

on:
  push:
    branches: ["ci_preview"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          # version: 10  # 这里不配只pnpm的版本，因为package.json里面有配置pnpm的版本
          run_install: false

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm wiki:build

```

#### 注意点：

- 1、需要将package.json的lock文件上传上去，pnpm的话就是pnpm-lock.yaml文件

#### 参考：

- [使用pnpm构建项目：Setup pnpm](https://github.com/marketplace/actions/setup-pnpm)

- [使用GitHub Page：Build Vue and deploy it to Github Pages](https://github.com/marketplace/actions/vue-to-github-pages)
