# 星火应用商店与 APM 应用商店技术分析报告 (2026-03-10)

## 1. 项目背景
本项目包含两个主要仓库：
1. **星火应用商店 (Spark Store)**: 原始的 Qt/C++ 实现，定位于 Deepin/UOS 等操作系统的应用商店。
2. **星火 APM 应用商店 (AmberPM)**: 基于 Electron + Vue 3 的现代实现，作为 `apm-app-store` 上游的 fork。它通过 `fuse-overlayfs` 和 `AmberCE` 提供容器化的应用兼容层。




---

## 3. 服务器路径与下载安装逻辑

### 3.1 星火应用商店 (Spark Store)
- **服务器基地址**: `https://d.spark-app.store/`
- **应用列表获取**: `{SOURCE_URL}/{ARCH}/{CATEGORY}/applist.json`
    - 例如: `https://d.spark-app.store//aarch64-store/tools/applist.json`
- **架构路径**:
    - x86: `store` 或 `amd64-store`
    - arm: `aarch64-store`
- **下载服务器**: `https://d.spark-app.store/`
- **下载工具**: 自带 `aptss` (基于 `wget/aria2c`)。
- **安装逻辑**: 要脚本位于 `tool/aptss` 和 `tool/ssinstall`。

### 3.2 APM 应用商店 (AmberPM)
- **服务器基地址**: `https://d.spark-app.store/`
- **下载机制**: **Metalink + Aria2c**
    - 第一步：从 `{BASE_URL}/{ARCH}/{CATEGORY}/{PKGNAME}/{FILENAME}.metalink` 获取 Metalink 文件。
    - 第二步：使用 `aria2c` 解析 Metalink 并下载分块内容。
- **安装工具**: `apm` (Amber Package Manager)
    - 安装命令: `apm install -y <pkgname>`
    - 安装本地包: `apm ssaudit <deb_path>`
    - 查看已安装: `apm list --installed`
- **运行环境**: 使用 `host-spawn` 和 `apm-launcher` 在容器化兼容层中启动应用。



---

## 4. 程序员开发指南

## API 端点

### Spark Store

- 分类列表：`https://d.spark-app.store/store/categories.json`
- 应用列表：`https://d.spark-app.store/store/{category}/applist.json`

### APM (AmberPM)

- 分类列表：`https://d.spark-app.store/amd64-apm/categories.json`
- 应用列表：`https://d.spark-app.store/amd64-apm/{category}/applist.json`

### 接口对接规范
- 统一使用 `/{arch}/{category}/applist.json` 获取目录。
- 详情信息需解析 `/{arch}/{category}/{pkgname}/app.json`。
- 图片资源路径: `/{arch}/{category}/{pkgname}/screen_1.png` (最多支持 5 张)。

---



