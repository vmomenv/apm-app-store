---
description: 运行项目 (自动安装依赖)
---

## 工作流说明

此工作流将检查运行环境，自动安装缺失的依赖，并启动开发服务器。

## 步骤

### 1. 检查 Node.js 环境

确保已安装 Node.js 和 npm。

// turbo
```bash
node -v && npm -v
```

### 2. 检查并安装依赖

检查 `node_modules` 是否存在。如果不存在，将自动运行 `npm install`。

// turbo
```bash
if [ ! -d "node_modules" ]; then
  echo "检测到缺少依赖，正在安装..."
  npm install
else
  echo "依赖已安装，准备启动..."
fi
```

### 3. 运行开发服务器

启动项目开发模式。

// turbo
```bash
npm run dev
```

## 注意事项

- 首次运行可能需要一些时间安装依赖。
- 如果安装失败，请手动运行 `npm install` 查看详细错误。
- 确保您的系统中已安装并配置好 Electron 所需的系统依赖。
