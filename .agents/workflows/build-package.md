---
description: 为 Spark Store 构建DEB软件包
---

本工作流将指导你如何构建适用于 Linux 的 Spark Store 软件包。

### 1. 安装依赖

确保你已经安装了所有的项目依赖。如果你还没有安装，可以使用 `/run-project` 工作流。

// turbo
```bash
npm install
```

### 2. 构建生产版本

你可以选择构建所有支持的格式，或者仅构建特定的格式（deb 或 rpm）。

#### 构建所有格式 (deb, rpm, AppImage)

// turbo
```bash
npm run build
```

#### 仅构建 deb 包

// turbo
```bash
npm run build:deb
```

### 3. 查看构建产物

构建完成后的安装包将存放在项目根目录下的 `release` 目录中。

```bash
ls -l release/$(node -p "require('./package.json').version")
```

### 4. 常见问题排查

如果构建失败，请检查以下几点：
- 确保 Node.js 版本符合要求 (>= 20.x)。
- 确保系统已安装必要的编译工具。
- 检查 `electron-builder.yml` 中的配置是否正确。