---
description: 发布流程
---

## 工作流说明

此工作流指导如何发布新版本。

## 步骤

### 1. 更新版本号

```bash
# 更新版本
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 或手动编辑 package.json
```

### 2. 更新 CHANGELOG.md

```bash
# 生成变更日志
npm run changelog
```

或手动更新：

```markdown
## [1.0.1](https://github.com/elysia-best/apm-app-store/compare/v1.0.0...v1.0.1) (2026-03-10)

### Bug Fixes

- fix(ui): correct dark mode toggle persistence (#123)

### Features

- feat(install): add retry mechanism for failed installations (#124)
```

### 3. 运行完整测试

```bash
# 运行所有测试
npm run test:all

# 运行代码检查
npm run lint
npm run format

# 构建项目
npm run build:vite
```

### 4. 提交变更

```bash
git add .
git commit -m "chore(release): bump version to x.x.x" -s
git push origin main
```

### 5. 创建 Git 标签

```bash
# 创建标签
git tag v{version}

# 推送标签
git push origin v{version}
```

### 6. 触发 CI 构建

推送标签后会自动触发 GitHub Actions 构建。

### 7. 验证构建

在 GitHub Actions 页面查看：

- 所有测试通过
- 构建成功
- 构建产物生成

### 8. 检查 Release

GitHub Actions 会自动创建 Release：

- 访问 Releases 页面
- 检查版本信息
- 确认构建产物

### 9. 发布说明

如果需要，更新 Release 说明：

- 添加主要变更
- 添加已知问题
- 添加升级说明

### 10. 通知用户

- 更新 README
- 发布公告
- 通知用户

## 发布检查清单

### 代码质量

- [ ] 所有测试通过
- [ ] 代码检查通过
- [ ] 没有已知严重 Bug
- [ ] 性能测试通过

### 文档

- [ ] CHANGELOG.md 更新
- [ ] README.md 更新（如需要）
- [ ] API 文档更新（如需要）

### 构建

- [ ] 本地构建成功
- [ ] CI 构建成功
- [ ] 构建产物正确

### 发布

- [ ] 版本号正确
- [ ] 标签已推送
- [ ] Release 已创建
- [ ] 构建产物已上传

## 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR:** 不兼容的 API 变更
- **MINOR:** 向后兼容的功能新增
- **PATCH:** 向后兼容的 Bug 修复

### 示例

```
4.9.9 → 4.9.10 (PATCH: Bug 修复)
4.9.9 → 4.10.0 (MINOR: 新功能)
4.9.9 → 5.0.0 (MAJOR: 重大变更)
```

## 发布后

### 更新开发分支

```bash
git checkout develop
git merge main
git push origin develop
```

### 监控反馈

- 收集用户反馈
- 监控 Bug 报告
- 记录性能数据

### 准备下一个版本

- 创建新的 Issue
- 规划新功能
- 评估技术债务

## 回滚流程

如果发现严重问题：

### 1. 立即停止推广

- 通知用户暂停升级
- 更新下载页面

### 2. 修复问题

```bash
git checkout main
git checkout -b fix/critical-issue
# 修复问题
git push origin fix/critical-issue
```

### 3. 紧急发布

```bash
npm version patch
git tag -a v{x.x.x} -m "Hotfix: description"
git push origin v{x.x.x}
```

### 4. 通知用户

- 发布新版本
- 说明问题和修复
- 提供升级说明

## 相关文档

- [DEPLOYMENT.md](../../DEPLOYMENT.md) - 部署文档
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [CHANGELOG.md](../../CHANGELOG.md) - 变更日志
