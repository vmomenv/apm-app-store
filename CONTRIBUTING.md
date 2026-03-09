# 贡献指南

感谢您对 APM 应用商店项目的关注！我们欢迎任何形式的贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)
- [问题报告](#问题报告)

## 行为准则

- 尊重所有贡献者
- 接受建设性批评
- 专注于对项目最有利的事情
- 对社区表现出同理心

## 如何贡献

### 报告 Bug

1. 使用 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.md)
2. 搜索现有 Issue，避免重复
3. 提供清晰的重现步骤
4. 包含相关日志和截图

### 建议新功能

1. 使用 [功能请求模板](.github/ISSUE_TEMPLATE/help_wanted.md)
2. 解释使用场景和需求
3. 考虑是否值得投入开发资源
4. 愿意帮助实现吗？

### 提交代码

1. Fork 项目并创建分支
2. 编写代码和测试
3. 确保所有测试通过
4. 提交 Pull Request

### 改进文档

- 修正错误或不清晰之处
- 添加示例和教程
- 翻译文档
- 提出文档改进建议

## 开发流程

### 环境搭建

```bash
# 克隆仓库
git clone https://github.com/elysia-best/apm-app-store.git
cd apm-app-store

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 创建分支

```bash
# 功能分支
git checkout -b feature/your-feature-name

# Bug 修复分支
git checkout -b fix/your-bug-fix
```

### 本地开发

1. 遵循 [代码规范](#代码规范)
2. 编写 [单元测试](TESTING.md)
3. 运行 `npm run lint` 和 `npm run format`
4. 运行 `npm run test` 确保测试通过

### 代码审查

- 保持 PR 小而聚焦
- 添加清晰的描述
- 引用相关的 Issue
- 回应审查意见

## 代码规范

### TypeScript

- 使用严格模式 (`strict: true`)
- 避免使用 `any` 类型（必要时使用 `eslint-disable` 注释）
- 使用显式类型注解
- 优先使用 `interface` 而非 `type`

### Vue 3

- 使用 Composition API 和 `<script setup>`
- 使用 `ref` 和 `computed` 管理状态
- 遵循 Props 和 Events 模式
- 组件名使用 PascalCase

### 样式（Tailwind CSS）

- 优先使用 Tailwind 工具类
- 支持暗色模式（`dark:` 前缀）
- 响应式设计（`md:`, `lg:` 前缀）

### 命名约定

- **组件:** PascalCase (`AppCard.vue`)
- **函数:** camelCase (`handleInstall`)
- **常量:** UPPER_SNAKE_CASE (`SHELL_CALLER_PATH`)
- **文件:** kebab-case (`install-manager.ts`)

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
type(scope): subject

[可选的正文]

[可选的脚注]
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### Scope 范围

- `app`: 应用核心
- `install`: 安装/卸载
- `ui`: UI 组件
- `ipc`: IPC 通信
- `api`: API 集成
- `theme`: 主题
- `build`: 构建
- `docs`: 文档

### Subject 主题

- 使用现在时态（"add" 而非 "added"）
- 首字母小写
- 不以句号结尾

### 示例

```bash
feat(install): add retry mechanism for failed installations
fix(ui): correct dark mode toggle persistence
refactor(ipc): simplify install manager event handling
docs(readme): update build instructions
test(download): add unit tests for download queue
```

### 签名（可选）

添加签名以遵守 DCO（Developer Certificate of Origin）：

```bash
git commit -m "feat(example): add new feature" -s
```

或在 `~/.gitconfig` 中配置：

```ini
[commit]
    gpgsign = true
```

## Pull Request 流程

### PR 前检查

- [ ] 代码通过 `npm run lint`
- [ ] 代码通过 `npm run format`
- [ ] 所有测试通过 (`npm run test`)
- [ ] 新功能包含测试
- [ ] 文档已更新（如需要）

### PR 描述

使用 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)，包括：

1. **变更类型:** feat / fix / refactor 等
2. **变更描述:** 清晰说明做了什么
3. **相关 Issue:** 引用 `#123`
4. **测试说明:** 如何测试这些变更
5. **截图/录屏:** UI 变更需要
6. **检查清单:** 完成上述 PR 前检查

### 审查流程

1. 至少一位维护者审查通过
2. 解决所有审查意见
3. 确保所有 CI 检查通过
4. Squash 并合并到 main 分支

### 合并要求

- CI 检查全部通过
- 至少一次审查批准
- 无冲突
- 分支最新

## 问题报告

### Bug 报告

使用 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.md)，包含：

- 描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息
- 截图/日志

### 功能请求

使用 [功能请求模板](.github/ISSUE_TEMPLATE/help_wanted.md)，包含：

- 问题描述
- 期望的解决方案
- 替代方案
- 额外上下文

---

**© 2026 APM 应用商店项目**
