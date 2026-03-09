---
description: 性能优化流程
---

## 工作流说明

此工作流指导如何优化应用性能。

## 步骤

### 1. 识别性能问题

使用工具分析性能：

- Chrome DevTools Performance
- Vue DevTools
- Vite Build Analysis
- 内存分析工具

### 2. 分析瓶颈

确定性能瓶颈：

- 渲染性能
- 网络请求
- 内存使用
- CPU 使用
- 磁盘 I/O

### 3. 创建优化分支

```bash
git checkout -b perf/optimize-performance
```

### 4. 添加性能测试

```typescript
// src/__tests__/perf/performance.test.ts
import { describe, it, expect } from "vitest";
import { heavyFunction } from "@/modules/example";

describe("heavyFunction", () => {
  it("should complete within 100ms", () => {
    const start = performance.now();
    heavyFunction();
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

### 5. 实施优化

#### 渲染性能优化

```typescript
// 使用 computed 缓存计算结果
const filteredApps = computed(() => {
  return apps.value.filter(app => app.category === selectedCategory);
});

// 使用 v-memo 优化列表渲染
<template>
  <div v-for="app in apps" :key="app.pkgname" v-memo="[app.id]">
    {{ app.name }}
  </div>
</template>

// 防抖和节流
import { debounce } from 'lodash-es';

const debouncedSearch = debounce((query: string) => {
  searchApps(query);
}, 300);
```

#### 网络请求优化

```typescript
// 使用缓存
const appCache = new Map<string, App[]>();

async function fetchApps(category: string): Promise<App[]> {
  if (appCache.has(category)) {
    return appCache.get(category)!;
  }

  const apps = await axios.get(`/api/apps/${category}`);
  appCache.set(category, apps.data);
  return apps.data;
}

// 并发请求
const [apps1, apps2] = await Promise.all([
  fetchApps("category1"),
  fetchApps("category2"),
]);
```

#### 内存优化

```typescript
// 及时清理事件监听
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 避免内存泄漏
let timer: number;

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    // 定时任务
  }, 1000);
}

onUnmounted(() => {
  clearInterval(timer);
});
```

#### 代码分割

```typescript
// 动态导入组件
const AppDetailModal = defineAsyncComponent(
  () => import("@/components/AppDetailModal.vue"),
);

// 路由懒加载
const routes = [
  {
    path: "/app/:id",
    component: () => import("@/views/AppDetail.vue"),
  },
];
```

### 6. 测试性能

```bash
# 运行性能测试
npm run test:perf

# 使用 DevTools 分析
# 1. 打开 DevTools
# 2. 切换到 Performance 标签
# 3. 点击 Record
# 4. 执行操作
# 5. 停止录制并分析
```

### 7. 对比优化效果

记录优化前后的数据：

- 渲染时间
- 内存使用
- 网络请求数
- 应用启动时间

### 8. 验证功能

```bash
# 确保功能正常
npm run test

# 手动测试主要流程
```

### 9. 代码审查

检查优化是否：

- 提升了性能
- 没有破坏功能
- 代码可读
- 易于维护

### 10. 更新文档

- 记录优化内容
- 更新性能指标
- 添加优化说明

### 11. 提交代码

```bash
git add .
git commit -m "perf(scope): optimize performance" -s
git push origin perf/optimize-performance
```

### 12. 创建 Pull Request

- 说明优化内容
- 提供性能对比
- 展示优化效果

## 性能优化清单

### 渲染性能

- [ ] 使用 computed 缓存
- [ ] 使用 v-memo 优化
- [ ] 避免不必要的重新渲染
- [ ] 使用虚拟滚动（大数据集）
- [ ] 图片懒加载

### 网络性能

- [ ] 减少请求数量
- [ ] 使用缓存
- [ ] 压缩资源
- [ ] 使用 CDN
- [ ] 并发请求

### 内存性能

- [ ] 清理事件监听
- [ ] 避免内存泄漏
- [ ] 释放不再使用的资源
- [ ] 使用对象池（如需要）
- [ ] 优化数据结构

### 构建性能

- [ ] 代码分割
- [ ] Tree shaking
- [ ] 压缩代码
- [ ] 优化依赖
- [ ] 使用缓存

## 性能监控

### 关键指标

- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **TTI (Time to Interactive):** < 3.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **FID (First Input Delay):** < 100ms

### 监控工具

```typescript
// 使用 Performance API
const perfData = performance.getEntriesByType("navigation")[0];
console.log("Page Load Time:", perfData.loadEventEnd - perfData.fetchStart);

// 使用 Vue DevTools
// 监控组件渲染时间
```

## 常见性能问题

### 1. 大列表渲染

**问题:** 渲染大量数据导致卡顿

**解决方案:**

```vue
<template>
  <RecycleScroller :items="largeList" :item-size="50" key-field="id">
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>
```

### 2. 频繁的 DOM 更新

**问题:** 频繁更新 DOM 导致性能下降

**解决方案:**

```typescript
// 使用 requestAnimationFrame
function animate() {
  updatePosition();
  requestAnimationFrame(animate);
}
```

### 3. 内存泄漏

**问题:** 内存持续增长

**解决方案:**

```typescript
// 及时清理
onUnmounted(() => {
  clearInterval(timer);
  removeEventListener("resize", handleResize);
  clearTimeout(timeout);
});
```

### 4. 不必要的计算

**问题:** 重复计算相同结果

**解决方案:**

```typescript
// 使用 computed
const expensiveValue = computed(() => {
  return heavyCalculation(data.value);
});
```

## 注意事项

- ⚠️ 不要过早优化
- ⚠️ 先测量再优化
- ⚠️ 保持代码可读
- ⚠️ 避免过度优化
- ⚠️ 持续监控性能

## 相关文档

- [DEVELOPMENT.md](../../DEVELOPMENT.md) - 开发文档
- [TESTING.md](../../TESTING.md) - 测试文档
- [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) - 问题排查
