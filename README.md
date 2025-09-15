# SmartDengc Index

> **jet5devil-index** 记录个人技术成长与知识索引，系统性整理后端开发、系统架构、数据库、算法、面试等领域的高频内容与实战经验。  
> 主页：[wiki.hahadeng.cn](https://wiki.hahadeng.cn/)
>
> 网站使用 [vuepress](https://vuepress.vuejs.org/) 和 [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume)构建生成。

---

## 📚 内容板块

- **后端面试**：主流技术栈、分布式与高并发场景题解与经验。
- **算法与数据结构**：常用算法、数据结构原理与题解。
- **数据库原理与优化**：MySQL、Redis、PostgreSQL 等主流数据库架构和调优。
- **设计模式与代码规范**：面向对象编程设计经验与模式总结。
- **系统架构与分布式**：微服务、服务网格、CAP、负载均衡、消息队列、缓存等架构拆解。
- **个人网站建设记录**：服务器部署、域名接入、评论系统、搜索服务等实操笔记。
- **云原生与容器实战**：Docker、MinIO、Nacos 等组件应用案例。

---

## 🚀 技术栈与特色

- **主力语言**：TypeScript & Markdown
- **内容结构**：知识笔记和索引，便于查找与复习
- **自动化与工具**：脚本、效率工具、自动化部署方案
- **架构经验丰富**：一线项目实战与经验总结
- **持续更新**：涵盖面试、开发、架构、工具等多领域知识

---

## 🌟 部署方案

本项目支持多种自动化部署方式，便于快速发布和维护：

### 1. GitHub Actions 自动化部署

通过 GitHub Actions 实现内容的自动构建和部署，无需手动操作：

- 在 `.github/workflows/` 目录下配置 CI/CD 工作流（如 `wiki-preview.yml`、`sci-preview.yml`、`iron-preview.yml`）
- 每次推送或合并自动执行构建脚本、生成静态文件并上传到目标环境
- 可用于自动发布到 GitHub Pages、云服务器或其他平台

示例 workflow（伪代码）：

```yaml
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

      - run: pnpm install --no-lockfile
      - run: pnpm wiki:build
      
      - name: Deploy wiki to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ALIYUN_SSH_PRIVATE_KEY }} 
          ARGS: "-rltgoDzvO --delete" 
          SOURCE: "wiki/.vuepress/dist/" 
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }} 
          TARGET: ${{ secrets.REMOTE_TARGET_FOR_WIKI }} 
```

### 2. Cloudflare Pages 云端部署

支持将静态内容部署到 Cloudflare Pages，实现全球加速与高可用：

- 在 Cloudflare Pages 项目中绑定本仓库
- 可指定分支，每次推送自动触发构建与发布
- 支持自定义域名、HTTPS、缓存优化

部署步骤简要：

1. 登录 Cloudflare，进入 Pages 控制台
2. 新建项目并关联 GitHub 仓库
3. 配置构建命令和输出目录（如 `npm run build`，`dist`）
4. 每次仓库更新自动完成全流程发布

更多详细部署说明和实战案例见仓库内相关笔记。

---

## 📂 目录索引

- `/wiki/`：全部知识笔记
- `/notes/Interview/`：面试相关
- `/notes/Algorithm/`：算法与数据结构
- `/notes/架构/`：系统架构与分布式
- `/notes/About/`：个人建站与工具经验
- `/daily/Software/`：效率工具推荐

---

## 🤝 参与贡献

欢迎提出 Issue 或 PR，分享经验、建议与想法。  
有问题或内容建议，也可在主页留言或讨论区交流。

---

> 本仓库持续维护，建议 star 收藏，欢迎查阅与交流！
