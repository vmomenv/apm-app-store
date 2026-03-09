# 测试文档

## 📋 目录

- [测试框架](#测试框架)
- [测试规范](#测试规范)
- [编写测试](#编写测试)
- [运行测试](#运行测试)
- [测试覆盖率](#测试覆盖率)
- [Mock 数据](#mock-数据)
- [E2E 测试](#e2e-测试)

## 测试框架

### Vitest（单元测试）

Vitest 是 Vite 原生的测试框架，提供快速的开发体验。

**特点:**

- 与 Vite 配置共享
- 极快的测试执行速度
- 内置 TypeScript 支持
- Jest 兼容的 API

**配置文件:** `vitest.config.ts`

### Playwright（E2E 测试）

Playwright 用于端到端测试，模拟真实用户操作。

**特点:**

- 支持多浏览器（Chromium, Firefox, WebKit）
- 自动等待
- 网络拦截和 mock
- 可视化测试运行

**配置文件:** `playwright.config.ts`

## 测试规范

### 命名规范

**测试文件:** `*.test.ts` 或 `*.spec.ts`

**测试目录结构:**

```
src/
├── __tests__/
│   ├── unit/           # 单元测试
│   │   ├── downloadStatus.test.ts
│   │   └── storeConfig.test.ts
│   ├── integration/    # 集成测试
│   │   └── installFlow.test.ts
│   └── setup.ts        # 测试设置
└── components/
    └── AppCard.test.ts  # 组件测试

e2e/
├── install.spec.ts     # E2E 测试
└── download.spec.ts
```

### 测试分组

使用 `describe` 分组相关测试：

```typescript
describe("ComponentName", () => {
  describe("method", () => {
    it("should do something", () => {
      // ...
    });
  });
});
```

### 测试命名

使用清晰的描述性名称：

```typescript
✅ 好的:
it('should return true when app is installed')
it('should throw error when package not found')

❌ 不好的:
it('test1')
it('works')
```

## 编写测试

### 单元测试

**测试纯函数:**

```typescript
import { describe, it, expect } from "vitest";
import { parseInstalledList } from "@/modules/parse";

describe("parseInstalledList", () => {
  it("should parse installed list correctly", () => {
    const output = "code/stable,1.108.2 amd64 [installed]";
    const result = parseInstalledList(output);

    expect(result).toHaveLength(1);
    expect(result[0].pkgname).toBe("code");
    expect(result[0].version).toBe("1.108.2");
  });
});
```

**测试 Vue 组件:**

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppCard from "@/components/AppCard.vue";
import type { App } from "@/global/typedefinition";

describe("AppCard", () => {
  const mockApp: App = {
    name: "Test App",
    pkgname: "test-app",
    version: "1.0.0",
    filename: "test.deb",
    torrent_address: "",
    author: "Test",
    contributor: "Test",
    website: "https://example.com",
    update: "2024-01-01",
    size: "100M",
    more: "Test app",
    tags: "",
    img_urls: [],
    icons: "",
    category: "test",
    currentStatus: "not-installed",
  };

  it("should render app name", () => {
    const wrapper = mount(AppCard, {
      props: {
        app: mockApp,
      },
    });

    expect(wrapper.text()).toContain("Test App");
  });

  it("should emit install event", async () => {
    const wrapper = mount(AppCard, {
      props: {
        app: mockApp,
      },
    });

    await wrapper.find(".install-button").trigger("click");

    expect(wrapper.emitted("install")).toBeTruthy();
  });
});
```

### 集成测试

测试模块间的交互：

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { installPackage } from "@/modules/processInstall";
import { downloads, addDownload } from "@/global/downloadStatus";

describe("installPackage integration", () => {
  beforeEach(() => {
    downloads.value = [];
    vi.clearAllMocks();
  });

  it("should add download and send IPC message", () => {
    const pkgname = "test-app";

    installPackage(pkgname);

    expect(downloads.value).toHaveLength(1);
    expect(downloads.value[0].pkgname).toBe(pkgname);
    expect(window.ipcRenderer.send).toHaveBeenCalledWith(
      "queue-install",
      expect.any(String),
    );
  });
});
```

## 运行测试

### 单元测试

```bash
# 运行所有测试
npm run test

# 监听模式（开发时）
npm run test:watch

# 运行特定文件
npm run test src/__tests__/unit/downloadStatus.test.ts

# 运行匹配模式的测试
npm run test -- downloadStatus
```

### 覆盖率

```bash
# 生成覆盖率报告
npm run test:coverage

# 报告位置:
# - 控制台: 文本报告
# - coverage/ 目录: HTML 报告
```

### E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# UI 模式（推荐用于开发）
npm run test:e2e:ui

# 调试模式
npm run test:e2e:debug

# 运行特定测试
npm run test:e2e -- install.spec.ts
```

## 测试覆盖率

### 覆盖率目标

- **语句覆盖率:** ≥ 70%
- **分支覆盖率:** ≥ 70%
- **函数覆盖率:** ≥ 70%
- **行覆盖率:** ≥ 70%

### 查看报告

```bash
npm run test:coverage

# 在浏览器中打开
open coverage/index.html
```

### CI 中强制检查

在 `.github/workflows/test.yml` 中配置覆盖率阈值。

## Mock 数据

### Mock IPC

在 `src/__tests__/setup.ts` 中全局 mock：

```typescript
global.window = Object.create(window);
Object.defineProperty(window, "ipcRenderer", {
  value: {
    send: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    invoke: vi.fn(),
    removeListener: vi.fn(),
  },
});
```

### Mock API 响应

```typescript
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("fetchApps", () => {
  it("should fetch apps from API", async () => {
    const mockApps = [{ name: "Test", pkgname: "test" }];
    axios.get.mockResolvedValue({ data: mockApps });

    const result = await fetchApps();

    expect(result).toEqual(mockApps);
  });
});
```

### Mock 文件系统

```typescript
import { vi } from "vitest";
import fs from "node:fs";

vi.mock("node:fs");

describe("readConfig", () => {
  it("should read config file", () => {
    const mockConfig = { theme: "dark" };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

    const config = readConfig();

    expect(config).toEqual(mockConfig);
  });
});
```

## E2E 测试

### 编写 E2E 测试

```typescript
import { test, expect } from "@playwright/test";

test.describe("App Installation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:3344");
  });

  test("should install an app", async ({ page }) => {
    // 搜索应用
    await page.fill('input[placeholder="搜索应用"]', "Test App");
    await page.press('input[placeholder="搜索应用"]', "Enter");

    // 等待结果
    await expect(page.locator(".app-card")).toBeVisible();

    // 点击安装
    await page.click('.app-card:has-text("Test App") .install-button');

    // 验证下载队列
    await expect(page.locator(".download-queue")).toBeVisible();
    await expect(page.locator(".download-item")).toHaveText("Test App");
  });

  test("should show installation progress", async ({ page }) => {
    // ... 测试进度显示
  });

  test("should handle installation failure", async ({ page }) => {
    // ... 测试失败处理
  });
});
```

### E2E 测试最佳实践

1. **使用选择器**

   ```typescript
   // 推荐：语义化选择器
   await page.click('[data-testid="install-button"]');

   // 避免：脆弱的选择器
   await page.click("button.btn-primary");
   ```

2. **等待元素**

   ```typescript
   // 自动等待
   await expect(page.locator(".modal")).toBeVisible();

   // 手动等待（必要时）
   await page.waitForSelector(".modal", { state: "visible" });
   ```

3. **截图和视频**
   - 失败时自动截图
   - 失败时自动录制视频

4. **网络拦截**
   ```typescript
   await page.route("**/api/**", (route) => {
     route.fulfill({
       status: 200,
       body: JSON.stringify(mockData),
     });
   });
   ```

## 常见问题

### 测试超时

```typescript
test(
  "slow test",
  async () => {
    // 增加超时时间
  },
  { timeout: 10000 },
);
```

### 异步测试

```typescript
it("should handle async operation", async () => {
  await someAsyncOperation();
  expect(result).toBe(expected);
});
```

### 清理副作用

```typescript
import { afterEach } from "vitest";

afterEach(() => {
  // 清理 mock
  vi.restoreAllMocks();
  // 清理状态
  downloads.value = [];
});
```

---

**© 2026 APM 应用商店项目**
