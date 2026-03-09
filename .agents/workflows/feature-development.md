---
description: 新功能开发流程
---

## 工作流说明

此工作流指导如何开发新功能。

## 步骤

### 1. 理解需求

- 阅读 Issue 描述
- 确认功能范围
- 识别依赖关系
- 设计 API 和数据结构

### 2. 设计方案

- 设计 UI/UX（如需要）
- 设计数据流
- 确定 IPC 通信（如需要）
- 编写技术方案文档（可选）

### 3. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 4. 更新类型定义

在 `src/global/typedefinition.ts` 中添加新的类型定义：

```typescript
export interface NewFeatureData {
  id: string;
  name: string;
  // ...其他字段
}
```

### 5. 编写测试

先编写测试，遵循 TDD 原则：

```typescript
// src/__tests__/unit/newFeature.test.ts
import { describe, it, expect } from "vitest";
import { newFunction } from "@/modules/newFeature";

describe("newFunction", () => {
  it("should work correctly", () => {
    const result = newFunction(input);
    expect(result).toBe(expected);
  });
});
```

### 6. 实现功能

按照以下顺序实现：

- 后端逻辑（Electron 主进程）
- 前端逻辑（Vue 组件）
- IPC 通信（如需要）
- 样式和布局

### 7. 运行测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 代码检查
npm run lint
npm run format
```

### 8. 本地测试

- 测试所有功能场景
- 测试边界情况
- 测试错误处理
- 检查性能影响

### 9. 更新文档

- 更新 API 文档（如需要）
- 更新用户文档（如需要）
- 更新 CHANGELOG.md

### 10. 提交代码

```bash
git add .
git commit -m "feat(scope): add new feature" -s
git push origin feature/your-feature-name
```

### 11. 创建 Pull Request

- 使用 PR 模板
- 引用相关 Issue
- 添加测试说明
- 添加截图/录屏（UI 变更）

### 12. 代码审查

- 响应审查意见
- 进行必要的修改
- 确保所有 CI 检查通过

### 13. 合并

- 等待审查批准
- Squash 合并到 main 分支
- 删除功能分支

## 注意事项

- ⚠️ 保持 PR 小而聚焦（建议 < 500 行）
- ⚠️ 确保 TypeScript 严格模式通过
- ⚠️ 不引入 `any` 类型（必要时使用 `eslint-disable`）
- ⚠️ 所有新功能必须有测试
- ⚠️ 遵循代码规范

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [TESTING.md](../../TESTING.md) - 测试文档
