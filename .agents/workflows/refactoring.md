---
description: 代码重构流程
---

## 工作流说明

此工作流指导如何安全地重构代码。

## 步骤

### 1. 识别重构需求

分析代码中的问题：

- 代码重复
- 复杂度过高
- 性能问题
- 可读性差
- 难以维护

### 2. 制定重构计划

- 确定重构范围
- 列出具体改进点
- 评估影响范围
- 制定测试策略

### 3. 创建重构分支

```bash
git checkout -b refactor/your-refactor
```

### 4. 编写测试

如果代码缺少测试，先添加测试：

```typescript
// src/__tests__/unit/refactorTarget.test.ts
import { describe, it, expect } from "vitest";
import { functionToRefactor } from "@/modules/example";

describe("functionToRefactor", () => {
  it("should maintain existing behavior", () => {
    const result = functionToRefactor(input);
    expect(result).toBe(expected);
  });
});
```

### 5. 逐步重构

**原则:**

- 小步迭代
- 保持测试通过
- 不改变外部行为

**示例:**

```typescript
// 重构前
function processApp(app: any) {
  if (app) {
    return {
      name: app.name,
      pkgname: app.pkgname,
      version: app.version,
    };
  }
  return null;
}

// 重构后 - 添加类型
interface App {
  name: string;
  pkgname: string;
  version: string;
}

function processApp(app: App | null): App | null {
  if (!app) return null;

  return {
    name: app.name,
    pkgname: app.pkgname,
    version: app.version,
  };
}
```

### 6. 运行测试

```bash
# 每次重构后运行测试
npm run test

# 确保所有测试通过
npm run test:all
```

### 7. 性能验证

如果重构涉及性能：

```bash
# 运行性能测试
npm run test:perf

# 对比重构前后性能
```

### 8. 代码审查

自我检查：

- 代码更清晰
- 性能未下降
- 测试全部通过
- 没有引入新问题

### 9. 更新文档

- 更新相关文档
- 添加注释说明
- 更新 CHANGELOG.md

### 10. 提交代码

```bash
git add .
git commit -m "refactor(scope): describe the refactoring" -s
git push origin refactor/your-refactor
```

### 11. 创建 Pull Request

- 说明重构原因
- 展示改进效果
- 提供性能对比（如需要）

### 12. 代码审查

- 响应审查意见
- 确保所有测试通过
- 合并到 main 分支

## 重构原则

### 不改变外部行为

- 保持 API 兼容
- 保持输出一致
- 保持错误处理

### 小步迭代

- 每次只改一处
- 频繁运行测试
- 及时提交代码

### 测试驱动

- 先写测试
- 重构代码
- 确保通过

### 保持简单

- 减少复杂度
- 提高可读性
- 增强可维护性

## 常见重构模式

### 提取函数

```typescript
// 重构前
function processApps(apps: App[]) {
  for (const app of apps) {
    if (app.installed) {
      console.log(app.name + " is installed");
    }
  }
}

// 重构后
function logInstalledApp(app: App) {
  if (app.installed) {
    console.log(`${app.name} is installed`);
  }
}

function processApps(apps: App[]) {
  apps.forEach(logInstalledApp);
}
```

### 提取类型

```typescript
// 重构前
function createDownload(data: any) {
  return {
    id: data.id,
    name: data.name,
    pkgname: data.pkgname,
  };
}

// 重构后
interface DownloadData {
  id: number;
  name: string;
  pkgname: string;
}

function createDownload(data: DownloadData): DownloadItem {
  return {
    id: data.id,
    name: data.name,
    pkgname: data.pkgname,
    status: "queued",
    progress: 0,
    downloadedSize: 0,
    totalSize: 0,
    speed: 0,
    timeRemaining: 0,
    startTime: Date.now(),
    logs: [],
    source: "APM Store",
    retry: false,
  };
}
```

### 简化条件

```typescript
// 重构前
function getStatus(status: string): string {
  if (status === "queued") {
    return "Queued";
  } else if (status === "downloading") {
    return "Downloading";
  } else if (status === "installing") {
    return "Installing";
  } else if (status === "completed") {
    return "Completed";
  } else if (status === "failed") {
    return "Failed";
  } else {
    return "Unknown";
  }
}

// 重构后
const statusMap: Record<string, string> = {
  queued: "Queued",
  downloading: "Downloading",
  installing: "Installing",
  completed: "Completed",
  failed: "Failed",
};

function getStatus(status: string): string {
  return statusMap[status] || "Unknown";
}
```

## 注意事项

- ⚠️ 不要在重构中引入新功能
- ⚠️ 不要同时重构多处
- ⚠️ 确保测试覆盖充分
- ⚠️ 保持提交历史清晰
- ⚠️ 及时回退有问题的重构

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [TESTING.md](../../TESTING.md) - 测试文档
