---
description: 文档更新流程
---

## 工作流说明

此工作流指导如何更新项目文档。

## 步骤

### 1. 确定需要更新的文档

根据变更内容确定需要更新的文档：

- README.md - 主要说明
- DEVELOPMENT.md - 开发指南
- CONTRIBUTING.md - 贡献指南
- TESTING.md - 测试文档
- DEPLOYMENT.md - 部署文档
- TROUBLESHOOTING.md - 问题排查
- FAQ.md - 常见问题
- AGENTS.md - AI 编码指南
- CHANGELOG.md - 变更日志

### 2. 创建文档分支

```bash
git checkout -b docs/update-documentation
```

### 3. 更新文档

#### README.md

添加新功能说明：

```markdown
## 新功能

### 应用更新

现在支持一键更新所有可更新的应用。

### 下载管理

改进了下载队列管理，支持暂停和继续。
```

#### DEVELOPMENT.md

添加开发指南：

```markdown
## 新功能开发

### 添加新功能步骤

1. 理解需求
2. 设计方案
3. 实现功能
4. 编写测试
5. 提交 PR
```

#### CONTRIBUTING.md

更新贡献指南：

```markdown
### 新功能贡献

- 遵循现有代码风格
- 编写充分的测试
- 更新相关文档
```

#### TESTING.md

添加测试示例：

```typescript
describe("New Feature", () => {
  it("should work correctly", () => {
    // 测试代码
  });
});
```

#### CHANGELOG.md

添加变更记录：

```markdown
## [4.10.0](https://github.com/elysia-best/apm-app-store/compare/v4.9.9...v4.10.0) (2026-03-10)

### Features

- feat(download): add pause and resume for downloads
- feat(update): add batch update for apps

### Bug Fixes

- fix(ui): correct dark mode toggle persistence
```

### 4. 检查文档质量

- [ ] 语法正确
- [ ] 格式统一
- [ ] 链接有效
- [ ] 内容准确
- [ ] 示例可运行

### 5. 运行文档测试

```bash
# 如果有文档测试
npm run test:docs

# 检查链接
npm run check-links
```

### 6. 本地预览

使用 Markdown 预览工具查看效果。

### 7. 提交文档

```bash
git add .
git commit -m "docs: update documentation for new features" -s
git push origin docs/update-documentation
```

### 8. 创建 Pull Request

- 说明更新的内容
- 提供预览截图（如需要）
- 引用相关 Issue

### 9. 代码审查

- 响应审查意见
- 确保文档质量
- 合并到 main 分支

## 文档编写规范

### 格式规范

- 使用 Markdown
- 保持一致的标题层级
- 使用代码块展示示例
- 使用表格对比选项

### 语言规范

- 使用简洁清晰的语言
- 避免技术术语（或解释）
- 保持中英文术语一致
- 使用被动语态

### 示例规范

```typescript
// 好的示例
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
```

### 链接规范

```markdown
- 内部链接: [文档名](./document.md)
- 外部链接: [Vue 文档](https://vuejs.org/)
- 锚点链接: [章节](#section-name)
```

## 文档模板

### 新功能文档

````markdown
## 功能名称

### 描述

简要描述功能

### 使用方法

```typescript
// 示例代码
```
````

### 配置选项

| 选项   | 类型   | 默认值    | 说明     |
| ------ | ------ | --------- | -------- |
| option | string | 'default' | 选项说明 |

### 注意事项

- 注意事项 1
- 注意事项 2

````

### API 文档

```markdown
## API 函数名

### 签名
```typescript
function functionName(param1: Type1, param2: Type2): ReturnType
````

### 参数

| 参数   | 类型  | 必填 | 说明     |
| ------ | ----- | ---- | -------- |
| param1 | Type1 | 是   | 参数说明 |
| param2 | Type2 | 否   | 参数说明 |

### 返回值

| 类型       | 说明       |
| ---------- | ---------- |
| ReturnType | 返回值说明 |

### 示例

```typescript
const result = functionName(arg1, arg2);
```

### 错误

抛出 `Error` 异常的情况说明。

```

## 注意事项

- ⚠️ 保持文档与代码同步
- ⚠️ 更新示例代码
- ⚠️ 检查链接有效性
- ⚠️ 使用统一的格式
- ⚠️ 提供清晰的说明

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [AGENTS.md](../../AGENTS.md) - AI 编码指南
```
