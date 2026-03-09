---
description: Bug 修复流程
---

## 工作流说明

此工作流指导如何修复 Bug。

## 步骤

### 1. 复现 Bug

- 根据 Issue 描述复现问题
- 记录详细的复现步骤
- 收集相关日志和错误信息
- 确认环境信息

### 2. 分析问题

- 查看相关代码
- 使用调试器定位问题
- 检查日志输出
- 识别根本原因

### 3. 创建修复分支

```bash
git checkout -b fix/your-bug-fix
```

### 4. 编写回归测试

先编写测试来复现 Bug：

```typescript
// src/__tests__/unit/bugFix.test.ts
import { describe, it, expect } from "vitest";
import { buggyFunction } from "@/modules/example";

describe("buggyFunction", () => {
  it("should not crash with null input", () => {
    expect(() => buggyFunction(null)).not.toThrow();
  });
});
```

### 5. 修复代码

- 最小化修改
- 保持代码可读性
- 添加必要的注释
- 更新相关类型定义

### 6. 运行测试

```bash
# 确保新测试通过
npm run test

# 运行所有测试
npm run test:all

# 代码检查
npm run lint
npm run format
```

### 7. 本地验证

- 验证 Bug 已修复
- 测试相关功能
- 检查是否引入新问题
- 测试边界情况

### 8. 更新文档

- 更新 CHANGELOG.md（如果需要）
- 更新相关文档（如需要）

### 9. 提交代码

```bash
git add .
git commit -m "fix(scope): describe the bug fix" -s
git push origin fix/your-bug-fix
```

### 10. 创建 Pull Request

- 引用相关 Issue（`Fixes #123`）
- 描述修复方法
- 说明复现步骤
- 添加测试说明

### 11. 代码审查

- 响应审查意见
- 进行必要的修改
- 确保所有 CI 检查通过

### 12. 合并

- 等待审查批准
- Squash 合并到 main 分支
- 删除修复分支

## 注意事项

- ⚠️ 修复前先理解问题根源
- ⚠️ 最小化修改范围
- ⚠️ 添加回归测试防止复发
- ⚠️ 考虑向后兼容性
- ⚠️ 测试所有受影响的功能

## 常见 Bug 类型

### IPC 通信问题

- 检查事件名称是否匹配
- 检查数据格式是否正确
- 检查异步处理

### 状态管理问题

- 检查响应式依赖
- 检查状态更新时机
- 检查内存泄漏

### 类型错误

- 检查类型定义
- 检查类型断言
- 检查可选值处理

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [TESTING.md](../../TESTING.md) - 测试文档
- [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) - 问题排查
