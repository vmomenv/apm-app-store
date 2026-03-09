---
description: 安全审计流程
---

## 工作流说明

此工作流指导如何进行安全审计。

## 步骤

### 1. 确定审计范围

确定需要审计的方面：

- 代码安全
- 依赖安全
- 数据安全
- 网络安全
- 权限管理

### 2. 创建审计分支

```bash
git checkout -b security/security-audit
```

### 3. 代码安全审计

#### 检查 SQL 注入

```typescript
// ❌ 不安全
const query = `SELECT * FROM apps WHERE name = '${appName}'`;

// ✅ 安全
const query = "SELECT * FROM apps WHERE name = ?";
db.query(query, [appName]);
```

#### 检查 XSS 攻击

```typescript
// ❌ 不安全
element.innerHTML = userInput;

// ✅ 安全
element.textContent = userInput;
// 或使用 DOMPurify
import DOMPurify from "dompurify";
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### 检查命令注入

```typescript
// ❌ 不安全
const cmd = `apm install ${packageName}`;
exec(cmd);

// ✅ 安全
const args = ["apm", "install", packageName];
spawn("apm", args);
```

#### 检查路径遍历

```typescript
// ❌ 不安全
const filePath = path.join(basePath, userInput);

// ✅ 安全
const safePath = path.normalize(userInput).replace(/^(\.\.(\/|\\|$))+/, "");
const filePath = path.join(basePath, safePath);
```

### 4. 依赖安全审计

```bash
# 检查依赖漏洞
npm audit

# 自动修复
npm audit fix

# 手动修复
npm audit fix --force
```

#### 检查 package.json

```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "pino": "^10.3.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### 5. 数据安全审计

#### 检查敏感信息

```typescript
// ❌ 不安全 - 硬编码密钥
const apiKey = "sk-1234567890";

// ✅ 安全 - 使用环境变量
const apiKey = process.env.API_KEY;

// ❌ 不安全 - 记录敏感信息
logger.info({ password: user.password }, "User logged in");

// ✅ 安全 - 不记录敏感信息
logger.info({ userId: user.id }, "User logged in");
```

#### 检查数据加密

```typescript
// 加密敏感数据
import crypto from "crypto";

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}
```

### 6. 网络安全审计

#### 检查 HTTPS

```typescript
// ❌ 不安全 - HTTP
const baseURL = "http://api.example.com";

// ✅ 安全 - HTTPS
const baseURL = "https://api.example.com";
```

#### 检查证书验证

```typescript
// 配置 Axios 验证证书
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
  }),
});
```

#### 检查 CORS

```typescript
// 配置 CORS
app.use(
  cors({
    origin: "https://yourdomain.com",
    credentials: true,
  }),
);
```

### 7. 权限管理审计

#### 检查权限提升

```typescript
// 检查 pkexec 可用性
const checkSuperUserCommand = async (): Promise<string> => {
  if (process.getuid && process.getuid() !== 0) {
    const { stdout } = await execAsync("which /usr/bin/pkexec");
    return stdout.trim().length > 0 ? "/usr/bin/pkexec" : "";
  }
  return "";
};
```

#### 检查上下文隔离

```typescript
// electron/preload/index.ts
// ✅ 安全 - 启用上下文隔离
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (...args) => ipcRenderer.send(...args),
  on: (...args) => ipcRenderer.on(...args),
  invoke: (...args) => ipcRenderer.invoke(...args),
});

// ❌ 不安全 - 禁用上下文隔离
contextIsolation: false;
```

### 8. 运行安全工具

```bash
# 使用 Snyk 扫描
npx snyk test

# 使用 npm audit
npm audit

# 使用 ESLint 安全规则
npm run lint
```

### 9. 修复安全问题

根据审计结果修复发现的问题：

```typescript
// 修复示例
function validateInput(input: string): boolean {
  // 验证输入
  const regex = /^[a-zA-Z0-9-_]+$/;
  return regex.test(input);
}

function sanitizeInput(input: string): string {
  // 清理输入
  return input.trim().replace(/[<>]/g, "");
}
```

### 10. 安全测试

```typescript
// src/__tests__/security/security.test.ts
import { describe, it, expect } from "vitest";
import { validateInput, sanitizeInput } from "@/modules/security";

describe("Security", () => {
  describe("validateInput", () => {
    it("should reject malicious input", () => {
      expect(validateInput('<script>alert("xss")</script>')).toBe(false);
    });

    it("should accept valid input", () => {
      expect(validateInput("valid-app-name")).toBe(true);
    });
  });

  describe("sanitizeInput", () => {
    it("should remove dangerous characters", () => {
      expect(sanitizeInput("<script>app</script>")).toBe("scriptapp/script");
    });
  });
});
```

### 11. 更新文档

- 记录安全问题
- 说明修复方法
- 更新安全指南

### 12. 提交代码

```bash
git add .
git commit -m "security: fix security vulnerabilities" -s
git push origin security/security-audit
```

### 13. 创建 Pull Request

- 说明安全问题
- 展示修复方法
- 提供安全测试结果

## 安全检查清单

### 代码安全

- [ ] 输入验证
- [ ] 输出编码
- [ ] 参数化查询
- [ ] 错误处理
- [ ] 日志安全

### 依赖安全

- [ ] 定期更新依赖
- [ ] 使用 `npm audit`
- [ ] 检查已知漏洞
- [ ] 使用可信源

### 数据安全

- [ ] 敏感数据加密
- [ ] 不记录敏感信息
- [ ] 使用环境变量
- [ ] 安全存储

### 网络安全

- [ ] 使用 HTTPS
- [ ] 验证证书
- [ ] 配置 CORS
- [ ] 防止 CSRF

### 权限管理

- [ ] 最小权限原则
- [ ] 上下文隔离
- [ ] 权限检查
- [ ] 审计日志

## 常见安全问题

### 1. XSS 攻击

**问题:** 用户输入包含恶意脚本

**解决方案:**

```typescript
import DOMPurify from "dompurify";

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}
```

### 2. SQL 注入

**问题:** 恶意 SQL 代码注入

**解决方案:**

```typescript
// 使用参数化查询
db.query("SELECT * FROM apps WHERE name = ?", [appName]);
```

### 3. 命令注入

**问题:** 恶意命令注入

**解决方案:**

```typescript
// 使用 spawn 而非 exec
const args = ["apm", "install", packageName];
spawn("apm", args);
```

### 4. 路径遍历

**问题:** 访问未授权文件

**解决方案:**

```typescript
// 验证路径
const safePath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, "");
```

### 5. 敏感信息泄露

**问题:** 日志中包含敏感信息

**解决方案:**

```typescript
// 不记录敏感信息
logger.info({ userId: user.id }, "User logged in");
```

## 安全最佳实践

### 1. 最小权限原则

只授予必要的权限，避免过度授权。

### 2. 深度防御

多层安全防护，不依赖单一安全措施。

### 3. 输入验证

验证所有输入，包括用户输入和 API 响应。

### 4. 输出编码

对输出进行编码，防止 XSS 攻击。

### 5. 定期审计

定期进行安全审计，及时发现和修复问题。

### 6. 安全更新

及时更新依赖和系统，修复已知漏洞。

## 安全工具

### 静态分析

- ESLint
- TypeScript
- SonarQube

### 动态分析

- OWASP ZAP
- Burp Suite
- Snyk

### 依赖扫描

- npm audit
- Snyk
- Dependabot

## 注意事项

- ⚠️ 不要忽视安全问题
- ⚠️ 及时修复漏洞
- ⚠️ 定期更新依赖
- ⚠️ 保持安全意识
- ⚠️ 遵循安全最佳实践

## 相关文档

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [SECURITY.md](../../SECURITY.md) - 安全政策
