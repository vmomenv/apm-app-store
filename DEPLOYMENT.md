# 部署文档

## 📋 目录

- [构建配置](#构建配置)
- [打包流程](#打包流程)
- [发布流程](#发布流程)
- [CI/CD 工作流](#cicd-工作流)
- [版本管理](#版本管理)

## 构建配置

### electron-builder.yml

主要配置项：

- **appId:** `store.spark-app.apm`
- **productName:** `spark-store`
- **打包格式:** deb, rpm, AppImage
- **输出目录:** `release/${version}`

### 环境变量

| 变量                  | 说明                     |
| --------------------- | ------------------------ |
| `GITHUB_TOKEN`        | GitHub Token（用于发布） |
| `VITE_DEV_SERVER_URL` | 开发服务器地址           |

## 打包流程

### 本地构建

```bash
# 构建所有格式
npm run build

# 仅构建 deb
npm run build:deb

# 仅构建 rpm
npm run build:rpm

# 仅构建前端（不打包）
npm run build:vite
```

### 构建产物

构建完成后，产物位于：

```
release/
└── {version}/
    ├── spark-store_{version}_linux_amd64.deb
    ├── spark-store_{version}_linux_amd64.rpm
    ├── spark-store_{version}_linux_arm64.deb
    └── spark-store_{version}_linux_arm64.rpm
```

## 发布流程

### 1. 更新版本号

```bash
# 更新 package.json 中的版本
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### 2. 更新 CHANGELOG.md

```bash
# 生成变更日志
npm run changelog
```

### 3. 提交并推送

```bash
git add .
git commit -m "chore(release): bump version to x.x.x" -s
git push origin main
```

### 4. 创建 Git 标签

```bash
git tag v{version}
git push origin v{version}
```

### 5. 触发 CI 构建

推送标签后会自动触发 GitHub Actions 构建。

### 6. 检查构建结果

在 GitHub Actions 页面查看构建状态。

### 7. 发布到 GitHub Release

构建成功后，GitHub Actions 会自动创建 Release 并上传构建产物。

## CI/CD 工作流

### test.yml

每次推送或 PR 时运行：

- 单元测试
- E2E 测试
- Lint 检查

### build.yml

推送到 main 分支或标签时运行：

- 运行测试（前置依赖）
- 构建 deb 和 rpm 包
- 支持 x64 和 arm64 架构
- 标签推送时自动创建 Release

## 版本管理

### 语义化版本

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR:** 不兼容的 API 变更
- **MINOR:** 向后兼容的功能新增
- **PATCH:** 向后兼容的 Bug 修复

### 版本号示例

```
4.9.9
 │ └─ PATCH (Bug 修复)
 │   └─ MINOR (新功能)
 └───── MAJOR (重大变更)
```

### 发布流程检查清单

- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] 所有测试通过
- [ ] 代码已审查
- [ ] Lint 检查通过
- [ ] 构建成功
- [ ] Release 已创建
- [ ] 构建产物已上传

---

**© 2026 APM 应用商店项目**
