---
description: 代码审查流程
---

## 工作流说明

此工作流指导如何进行代码审查。

## 审查清单

### 代码质量

- [ ] 代码遵循项目规范
- [ ] TypeScript 类型正确
- [ ] 没有 `any` 类型（除非必要）
- [ ] ESLint 和 Prettier 通过
- [ ] 代码可读性良好

### 功能实现

- [ ] 实现符合需求
- [ ] 边界情况处理
- [ ] 错误处理完善
- [ ] 没有引入新 Bug

### 测试

- [ ] 包含足够的测试
- [ ] 测试覆盖率合理
- [ ] 所有测试通过
- [ ] E2E 测试（如需要）

### 文档

- [ ] 更新了相关文档
- [ ] 代码注释充分
- [ ] API 文档（如需要）
- [ ] CHANGELOG.md（如需要）

### 安全性

- [ ] 没有安全漏洞
- [ ] 输入验证完善
- [ ] 权限检查正确
- [ ] 敏感信息保护

### 性能

- [ ] 没有明显的性能问题
- [ ] 内存使用合理
- [ ] 没有不必要的渲染
- [ ] 资源加载优化

## 审查流程

### 1. 理解变更

- 阅读 PR 描述
- 查看 Issue 链接
- 理解变更目的
- 检查变更范围

### 2. 代码审查

**主进程代码:**

```bash
# 检查类型安全
npx tsc --noEmit

# 检查代码质量
npm run lint
```

**渲染进程代码:**

- 组件结构
- 状态管理
- 事件处理
- 样式实现

### 3. 测试验证

```bash
# 运行单元测试
npm run test

# 运行 E2E 测试
npm run test:e2e

# 检查覆盖率
npm run test:coverage
```

### 4. 提供反馈

**正面反馈:**

- 好的实现
- 优秀的代码
- 有价值的贡献

**建设性反馈:**

- 指出问题
- 提出建议
- 解释原因

**反馈格式:**

````markdown
### 问题

**位置:** `src/components/AppCard.vue:45`

**描述:** 这里缺少错误处理，可能导致应用崩溃。

**建议:**

```typescript
try {
  await installPackage();
} catch (error) {
  console.error("Install failed:", error);
  showError(error.message);
}
```
````

````

### 5. 批准或要求修改

**批准条件:**
- 所有审查项目通过
- 所有测试通过
- CI 检查通过
- 没有阻塞问题

**要求修改:**
- 指出必须修复的问题
- 给出明确的修改建议
- 等待作者响应

## 审查原则

### 及时性

- 尽快响应 PR
- 设定响应时间预期
- 优先处理紧急 PR

### 建设性

- 提供具体的反馈
- 给出改进建议
- 解释审查理由

### 尊重

- 尊重作者的贡献
- 使用礼貌的语言
- 认可好的实现

### 一致性

- 遵循项目规范
- 保持审查标准一致
- 参考之前类似 PR

## 常见问题

### 类型安全问题

**问题:** 使用了 `any` 类型

**建议:**
```typescript
// ❌ 避免
const data: any = response;

// ✅ 推荐
interface ResponseData {
  id: string;
  name: string;
}
const data: ResponseData = response;
````

### 代码重复

**问题:** 代码重复

**建议:**

```typescript
// 提取公共函数
function formatSize(size: number): string {
  return size > 1024 ? `${size / 1024} MB` : `${size} KB`;
}
```

### 错误处理

**问题:** 缺少错误处理

**建议:**

```typescript
async function loadApps() {
  try {
    const response = await axios.get("/api/apps");
    return response.data;
  } catch (error) {
    logger.error({ err: error }, "Failed to load apps");
    throw error;
  }
}
```

## 审查后操作

### 批准

- 点击 "Approve review"
- 添加评论（可选）
- 等待合并

### 要求修改

- 选择 "Request changes"
- 提供详细反馈
- 等待作者更新

### 评论

- 选择 "Comment"
- 提供建议或问题
- 不阻止合并

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [AGENTS.md](../../AGENTS.md) - AI 编码指南
