---
description: 测试编写流程
---

## 工作流说明

此工作流指导如何为新功能或 Bug 修复编写测试。

## 步骤

### 1. 确定测试范围

分析需要测试的功能点：

- 单元测试：测试独立函数/组件
- 集成测试：测试模块间交互
- E2E 测试：测试完整用户流程

### 2. 编写单元测试（Vitest）

在 `src/__tests__/unit/` 目录下创建测试文件：

```typescript
import { describe, it, expect } from "vitest";
import { someFunction } from "@/modules/example";

describe("someFunction", () => {
  it("should return expected result", () => {
    const result = someFunction(input);
    expect(result).toBe(expected);
  });
});
```

### 3. 编写组件测试

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppCard from "@/components/AppCard.vue";

describe("AppCard", () => {
  it("should render app name", () => {
    const wrapper = mount(AppCard, {
      props: {
        app: {
          name: "Test App",
          pkgname: "test-app",
        },
      },
    });
    expect(wrapper.text()).toContain("Test App");
  });
});
```

### 4. 编写 E2E 测试（Playwright）

在 `e2e/` 目录下创建测试文件：

```typescript
import { test, expect } from "@playwright/test";

test("install app from store", async ({ page }) => {
  await page.goto("http://localhost:3344");
  await page.click("text=Test App");
  await page.click('button:has-text("安装")');
  await expect(page.locator(".install-progress")).toBeVisible();
});
```

### 5. 运行测试

```bash
# 运行单元测试
npm run test

# 运行测试并监听
npm run test:watch

# 运行 E2E 测试
npm run test:e2e

# 生成覆盖率报告
npm run test:coverage
```

### 6. 确保测试通过

- 所有单元测试必须通过
- E2E 测试覆盖主要用户流程
- 测试覆盖率不低于 70%

### 7. 提交代码

测试通过后，提交代码并创建 PR。

## 注意事项

- ⚠️ 不要测试第三方库的功能
- ⚠️ 保持测试独立性和可重复性
- ⚠️ 使用有意义的测试名称
- ⚠️ Mock 外部依赖（APM 命令、API 调用）

## 相关文档

- [TESTING.md](../../TESTING.md) - 测试框架和规范
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
