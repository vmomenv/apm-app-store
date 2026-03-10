# 星火应用商店

<div align="center">

<img src="icons/spark-store.svg" alt="APM Logo" width="200" height="200" />

**星火应用商店**

## 简介

欢迎来到**星火应用商店**！这是一个为 Linux 平台用户设计的应用商店，旨在解决 Linux 生态下应用分散、难以获取的问题。无论您使用什么类型的 Linux 发行版，在这里都有可能找到适合您的软件包。

Linux 应用的数量相对有限，Wine 软件的可获取性也颇为困难。优秀的开发套件和工具资源散布在各大社区和论坛之间，这种分散化让整个生态系统难以得到全面的提升。

生态系统的构建并非依赖个体的孤立努力，而需要全社区共同参与。只有当大家的“星火”聚集一处，方可引发“燎原之势”。

为了改善这一现状，我们推出了星火应用商店。星火社区广泛地收录了各种用户需求的软件包，汇集了高质量的小工具，并主动对 Wine 应用进行了适配，一切都储存在我们的软件库中，使得用户可以方便地获取这些应用。

**当前支持的 Linux 发行版包括（但不限于）：**

- **amd64 架构：** deepin 20 / deepin 23 / Ubuntu 20.04 / Ubuntu 22.04 / UOS 家庭版 20 / Debian 11＋
- **arm64 架构：** UOS 专业版 1060 / Ubuntu 22.04 / deepin 23
- **loong64 架构：** deepin 23

> 特别说明：星火应用商店还支持所有版本高于 Ubuntu 22.04 的 Ubuntu 操作系统，例如 Ubuntu 22.10、23.04、23.10 等。此外星火应用商店也可能适配除上述平台的其他 Linux 发行版，您可自行进行安装测试。

**重要须知：** 本软件无法保证持续可用、无中断运行或满足特定性能要求。星火社区对其功能完整性、稳定性及无错误运行不作任何承诺。例如，若您计划在 UOS 专业版（或其他类似特定平台）上使用，请务必了解并启用“开发者模式”相关功能。请确保您具备基础的故障排查能力。需要明确的是，星火社区无法在部分特殊平台上进行广泛测试。因此，在这些平台上使用星火应用商店客户端可能会导致一系列问题，如系统更新失败、数据丢失等；使用该软件，即代表您理解并同意所有风险需由用户自行承担。

[![GitHub Build](https://github.com/elysia-best/apm-app-store/actions/workflows/build.yml/badge.svg)](https://github.com/elysia-best/apm-app-store/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/license-MulanPSL%202.0-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux-orange)](https://github.com/elysia-best/apm-app-store)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/elysia-best/apm-app-store)

</div>

---
<div align="center">
<img src="./galleries/image.png" alt="APM Screenshot" width="90%"  />
</div>
##
## 📦 关于 APM

**APM (AmberPM)** 是基于 `fuse-overlayfs` + `dpkg` + `AmberCE` 的容器化兼容层，为多发行版提供轻量级的应用运行方案。

### 核心特性

✅ **多发行版支持** - 在 Arch Linux、Fedora、银河麒麟、统信 UOS 等主流发行版上运行星火商店应用  
⚡ **轻量兼容层** - 利用 overlayfs 技术实现极速启动，无需完整容器  
🎮 **NVIDIA 加速** - 自动获取主机 GPU 驱动，支持硬件加速  
🔧 **开发者友好** - 兼容 dpkg，提供完整的打包工具链  
🌐 **现代化界面** - 基于 Electron + Vue 3 的流畅用户体验

---

## 🚀 快速开始

### 安装应用商店

**⚠️提示：目前客户端处于开发阶段，可能会出现一些问题，请谨慎使用并及时反馈。**

1. 从 Release 下载最新版本的应用商店客户端。
2. 下载 apm 包管理器
3. 首先安装包管理器，然后安装应用商店

---

## 💻 开发指南

### 环境要求

- Node.js >= 20

### 本地开发

```bash
# 克隆项目
git clone https://github.com/elysia-best/apm-app-store.git

# 进入项目目录
cd apm-app-store

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建打包

```bash
# 构建生产版本
npm run build

# 仅打包deb
npm run build:deb

# 仅打包rpm
npm run build:rpm
```

---

## 📂 项目结构

```
apm-app-store/
├── electron/                 # Electron 主进程
│   ├── main/
│   │   ├── backend/          # 后端逻辑 (安装管理器)
│   │   ├── deeplink.ts       # Deep Link 协议支持
│   │   ├── handle-url-scheme.ts # URL Scheme 处理器
│   │   └── index.ts          # 主进程入口
│   └── preload/
│       └── index.ts          # 预加载脚本
├── src/                      # Vue 渲染进程
│   ├── 3rdparty/             # 第三方依赖
│   ├── assets/               # 静态资源 (CSS/Images)
│   ├── components/           # Vue 组件
│   │   ├── AppCard.vue       # 应用卡片
│   │   ├── AppDetailModal.vue # 应用详情/安装弹窗
│   │   ├── AppGrid.vue       # 应用列表网格
│   │   ├── AppHeader.vue     # 顶部导航与搜索
│   │   ├── AppSidebar.vue    # 侧边栏分类导航
│   │   ├── DownloadDetail.vue # 下载任务详情
│   │   ├── DownloadQueue.vue # 下载队列浮窗
│   │   ├── InstalledAppsModal.vue # 已安装应用管理
│   │   ├── ScreenPreview.vue # 截图预览
│   │   ├── ThemeToggle.vue   # 主题切换
│   │   ├── TopActions.vue    # 顶部操作栏
│   │   ├── UninstallConfirmModal.vue # 卸载确认及进度弹窗
│   │   └── UpdateAppsModal.vue # 应用更新弹窗
│   ├── global/               # 全局配置与状态
│   │   ├── downloadStatus.ts # 下载状态管理
│   │   ├── storeConfig.ts    # 商店配置 API
│   │   └── typedefinition.ts # 类型定义
│   ├── modeuls/              # 业务逻辑模块
│   │   └── processInstall.ts # 安装/卸载/更新逻辑
│   ├── App.vue               # 根组件 (含 Deep Link 监听)
│   └── main.ts               # 入口文件
├── extras/                   # 额外资源 (Shell脚本/策略文件)
├── public/                   # 公共资源
├── scripts/                  # 维护脚本
├── electron-builder.yml      # 打包配置
├── vite.config.ts            # Vite 配置
└── package.json              # 项目依赖
```

---

## 🎨 主要功能

### 应用浏览与搜索
- 分类浏览应用
- 实时搜索过滤
- 应用详情查看
- 截图预览

### 下载管理
- 下载队列管理
- 实时进度显示
- 暂停/继续/取消
- 下载日志查看

### 主题切换
- 明暗主题自动切换
- 本地偏好保存

### 协议支持
- `apmstore://` 自定义协议
- 一键安装/启动应用

---

## 🔗 相关链接

- 📖 [APM 项目文档](https://gitee.com/spark-store-project/AmberPM)
- 💾 [Gitee 仓库](https://gitee.com/spark-store-project/apm-app-store)
- 🐛 [问题反馈](https://gitee.com/spark-store-project/apm-app-store/issues)
- 📦 [打包示例](https://gitee.com/spark-store-project/AmberPM/tree/main/Packaging-demo)

---

## 🛠️ 技术栈

- **Electron** - 跨平台桌面应用框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript 的超集
- **Axios** - HTTP 客户端

---

## 📄 开源协议

本项目采用 [MulanPSL-2.0](LICENSE.md) 协议开源。

---

## 🙏 致谢

- [Electron](https://www.electronjs.org/)
- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [星火应用商店](https://www.spark-app.store/)

---

<div align="center">

**© 2026 APM / AmberPM | The Spark Project**

Made with ❤️ by the Spark Store Team

</div>
