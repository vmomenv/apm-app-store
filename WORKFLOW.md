# 标准开发流程

本文档描述在 APM 应用商店项目中完成代码开发后的标准提交流程。

## 📋 目录

- [开发前准备](#开发前准备)
- [代码完成后](#代码完成后)
- [提交流程](#提交流程)
- [典型场景](#典型场景)
- [提交流程检查清单](#提交流程检查清单)
- [常见问题](#常见问题)

---

## 开发前准备

在开始开发之前，确保你的开发环境已正确配置：

```bash
# 1. 切换到项目目录
cd apm-app-store

# 2. 拉取最新代码
git pull origin main

# 3. 创建功能分支
git checkout -b feature/your-feature-name
# 或修复分支
git checkout -b fix/your-bug-fix

# 4. 确保依赖已安装
npm install
```

---

## 代码完成后

### 1️⃣ 运行代码检查

首先确保代码符合项目规范：

```bash
# 运行 ESLint 检查
npm run lint

# 如果有错误，尝试自动修复
npm run lint:fix

# 手动修复无法自动处理的问题
```

**ESLint 错误类型：**

- `@typescript-eslint/no-explicit-any`: 避免使用 `any` 类型
- `@typescript-eslint/no-unused-vars`: 未使用的变量
- 其他代码风格问题

### 2️⃣ 格式化代码

使用 Prettier 格式化代码：

```bash
npm run format
```

### 3️⃣ 运行测试

确保所有测试通过：

```bash
# 运行单元测试
npm run test

# 生成测试覆盖率报告
npm run test:coverage

# 运行 E2E 测试（如果需要）
npm run test:e2e

# 运行所有测试
npm run test:all
```

**测试覆盖率要求：**

- 语句覆盖率: ≥ 70%
- 分支覆盖率: ≥ 70%
- 函数覆盖率: ≥ 70%
- 行覆盖率: ≥ 70%

### 4️⃣ 构建验证

验证代码可以成功构建：

```bash
# 仅构建前端代码（快速）
npm run build:vite
```

如果构建失败，检查 TypeScript 错误并修复。

---

## 提交流程

### 5️⃣ 提交代码

#### 查看变更

```bash
# 查看所有变更文件
git status

# 查看具体变更
git diff
```

#### 添加文件

```bash
# 添加所有变更文件
git add .

# 或添加特定文件
git add path/to/file.ts
```

#### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
type(scope): subject

[可选的正文]

[可选的脚注]
```

**Type 类型：**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**Scope 范围：**

- `app`: 应用核心
- `install`: 安装/卸载
- `ui`: UI 组件
- `ipc`: IPC 通信
- `api`: API 集成
- `theme`: 主题
- `build`: 构建
- `docs`: 文档

**Subject 主题：**

- 使用现在时态（"add" 而非 "added"）
- 首字母小写
- 不以句号结尾

**示例：**

```bash
# 新功能
git commit -m "feat(install): add retry mechanism for failed installations" -s

# Bug 修复
git commit -m "fix(ui): correct dark mode toggle persistence" -s

# 文档更新
git commit -m "docs(readme): update build instructions" -s

# 重构
git commit -m "refactor(ipc): simplify install manager event handling" -s

# 测试
git commit -m "test(download): add unit tests for download queue" -s
```

**添加签名：**

```bash
# 使用 -s 添加签名
git commit -m "feat(example): add new feature" -s

# 或在 ~/.gitconfig 中配置
# [commit]
#     gpgsign = true
```

#### 执行提交

```bash
git commit -m "type(scope): description" -s
```

### 6️⃣ 推送到远程仓库

```bash
# 推送当前分支
git push origin feature/your-feature-name

# 或使用简写
git push -u origin feature/your-feature-name
```

### 7️⃣ 创建 Pull Request

#### 访问 GitHub

1. 访问仓库页面
2. 点击 "New Pull Request"
3. 选择你的分支 → main 分支

#### 填写 PR 模板

使用 PR 模板填写信息：

**变更类型：**

- [ ] `feat` - 新功能
- [ ] `fix` - Bug 修复
- [ ] `refactor` - 重构
- [ ] `docs` - 文档更新
- [ ] `test` - 测试相关
- [ ] `chore` - 构建/工具相关

**变更描述：**
清晰简洁地说明你做了什么，为什么这么做。

**相关 Issue：**
引用相关的 Issue 编号，例如 `Fixes #123` 或 `Closes #123`。

**测试说明：**
如何测试这些变更？包括：

- 测试步骤
- 预期结果
- 测试环境

**截图/录屏：**
如果涉及 UI 变更，添加截图或录屏。

**检查清单：**

- [ ] 代码通过 `npm run lint`
- [ ] 代码通过 `npm run format`
- [ ] 所有测试通过 (`npm run test`)
- [ ] 新功能包含测试
- [ ] 文档已更新（如需要）

#### 提交 PR

点击 "Create Pull Request"。

### 8️⃣ 代码审查

#### 等待审查

- 至少一位维护者会审查你的 PR
- CI 会自动运行测试和检查
- 确保所有 CI 检查通过（绿色 ✅）

#### 响应审查意见

- 阅审审查者提出的意见
- 进行必要的修改
- 提交更改到你的分支
- 在 PR 中评论说明修改内容

#### 更新 PR

```bash
# 修改代码后
git add .
git commit -m "address review feedback" -s
git push origin feature/your-feature-name
```

### 9️⃣ 合并 PR

#### 合并条件

- 至少一次审查批准
- 所有 CI 检查通过
- 无冲突
- 分支最新

#### 合并方式

- 使用 "Squash and merge" 将提交压缩为一个
- 或使用 "Merge commit" 保留提交历史

#### 删除分支

合并后删除你的功能分支：

```bash
# 删除本地分支
git branch -d feature/your-feature-name

# 删除远程分支
git push origin --delete feature/your-feature-name
```

---

## 典型场景

### 场景 1: 开发新功能

```bash
# 1. 创建功能分支
git checkout -b feature/add-search-filters

# 2. 开发代码...
# （编写代码）

# 3. 运行检查
npm run lint
npm run lint:fix
npm run format
npm run test

# 4. 构建验证
npm run build:vite

# 5. 提交代码
git add .
git commit -m "feat(search): add advanced search filters with category filtering" -s

# 6. 推送
git push -u origin feature/add-search-filters

# 7. 创建 PR
# （在 GitHub 上创建 PR）
```

### 场景 2: 修复 Bug

```bash
# 1. 创建修复分支
git checkout -b fix/fix-download-timeout

# 2. 修复代码...

# 3. 运行检查
npm run lint
npm run format
npm run test

# 4. 提交代码
git add .
git commit -m "fix(download): resolve timeout issue with retry logic" -m "Fixes #123" -s

# 5. 推送
git push -u origin fix/fix-download-timeout

# 6. 创建 PR
```

### 场景 3: 更新文档

```bash
# 1. 创建文档分支
git checkout -b docs/update-api-docs

# 2. 更新文档...

# 3. 提交代码
git add .
git commit -m "docs(api): update installation API documentation" -s

# 4. 推送
git push -u origin docs/update-api-docs

# 5. 创建 PR
```

### 场景 4: 重构代码

```bash
# 1. 创建重构分支
git checkout -b refactor/simplify-download-manager

# 2. 重构代码...

# 3. 运行检查
npm run lint
npm run format
npm run test

# 4. 提交代码
git add .
git commit -m "refactor(download): simplify download manager event handling" -s

# 5. 推送
git push -u origin refactor/simplify-download-manager

# 6. 创建 PR
```

---

## 提交流程检查清单

在创建 PR 前，确保完成以下检查：

### 代码质量

- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 代码已格式化 (`npm run format`)
- [ ] 没有 `any` 类型（除非必要并添加注释）
- [ ] 遵循代码规范（见 [AGENTS.md](./AGENTS.md)）
- [ ] TypeScript 严格模式通过

### 测试

- [ ] 单元测试通过 (`npm run test`)
- [ ] 新功能包含测试
- [ ] 测试覆盖率 ≥ 70%
- [ ] E2E 测试通过（如需要，`npm run test:e2e`）
- [ ] 没有测试回归

### 文档

- [ ] 更新了相关文档（如需要）
- [ ] 更新了 CHANGELOG.md（如需要）
- [ ] API 文档更新（如需要）
- [ ] README.md 更新（如需要）

### 功能验证

- [ ] 本地测试通过
- [ ] 没有引入新 Bug
- [ ] 边界情况已处理
- [ ] 错误处理完善
- [ ] 性能未下降

### 提交信息

- [ ] 遵循 Conventional Commits 规范
- [ ] 添加了签名（`-s`）
- [ ] 引用相关 Issue（如适用）
- [ ] 提交信息清晰明确

---

## 快速提交命令

如果你想快速提交所有检查，可以使用以下命令：

```bash
# 完整流程（一行命令）
npm run lint && npm run format && npm run test && git add . && git commit -m "type(scope): description" -s && git push -u origin $(git branch --show-current)
```

### 创建便捷脚本

在 `scripts/` 目录下创建 `commit.sh`:

```bash
#!/bin/bash

# 检查参数
if [ -z "$1" ]; then
  echo "❌ 错误: 请提供提交信息"
  echo "使用方法: ./scripts/commit.sh \"type(scope): description\""
  exit 1
fi

echo "🔍 Running lint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查失败，请修复错误后重试"
  exit 1
fi

echo "🎨 Formatting code..."
npm run format

echo "🧪 Running tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "❌ 测试失败，请修复测试后重试"
  exit 1
fi

echo "📝 Committing changes..."
git add .
git commit -m "$1" -s
if [ $? -ne 0 ]; then
  echo "❌ 提交失败"
  exit 1
fi

echo "🚀 Pushing to remote..."
BRANCH_NAME=$(git branch --show-current)
git push -u origin $BRANCH_NAME
if [ $? -ne 0 ]; then
  echo "❌ 推送失败"
  exit 1
fi

echo ""
echo "✅ 提交成功！"
echo "📌 分支: $BRANCH_NAME"
echo "📝 提交信息: $1"
echo "🔗 请创建 Pull Request: https://github.com/elysia-best/apm-app-store/compare/main...$BRANCH_NAME"
```

使用方法：

```bash
# 给脚本添加执行权限
chmod +x scripts/commit.sh

# 使用脚本提交
./scripts/commit.sh "feat(search): add advanced search filters"
```

---

## 常见问题

### Q: ESLint 检查失败怎么办？

**A:**

1. 运行 `npm run lint:fix` 自动修复
2. 手动修复无法自动处理的问题
3. 如果确实需要使用 `any`，添加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

### Q: 测试失败怎么办？

**A:**

1. 查看测试失败信息
2. 修复代码或测试
3. 确保测试覆盖所有情况
4. 运行 `npm run test` 重新验证

### Q: 构建失败怎么办？

**A:**

1. 查看 TypeScript 错误
2. 修复类型错误
3. 确保类型定义正确
4. 运行 `npm run build:vite` 重新验证

### Q: 如何修复合并冲突？

**A:**

```bash
# 1. 拉取最新代码
git fetch origin

# 2. 合并 main 分支到你的分支
git merge origin/main

# 3. 解决冲突
# （编辑冲突文件，选择正确的代码）

# 4. 标记冲突已解决
git add .

# 5. 提交合并
git commit -m "merge: resolve conflicts with main" -s

# 6. 推送
git push origin feature/your-feature-name
```

### Q: 如何修改已提交的代码？

**A:**

```bash
# 1. 修改代码...

# 2. 添加到暂存区
git add .

# 3. 提交到分支
git commit -m "address review feedback" -s

# 4. 推送
git push origin feature/your-feature-name
```

### Q: 如何撤回错误的提交？

**A:**

```bash
# 如果还未推送
git reset --soft HEAD~1
# 重新提交
git commit -m "correct message" -s

# 如果已推送（需要强制推送，谨慎使用）
git reset --soft HEAD~1
git commit -m "correct message" -s
git push origin feature/your-feature-name --force
```

**注意:** 避免在已公开的分支上使用强制推送。

---

## 📚 相关文档

- **开发指南:** [DEVELOPMENT.md](./DEVELOPMENT.md)
- **贡献指南:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **测试文档:** [TESTING.md](./TESTING.md)
- **AI 编码指南:** [AGENTS.md](./AGENTS.md)
- **部署文档:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**© 2026 APM 应用商店项目**
