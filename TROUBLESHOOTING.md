# 问题排查指南

## 📋 目录

- [常见问题](#常见问题)
- [调试方法](#调试方法)
- [日志分析](#日志分析)
- [性能问题](#性能问题)

## 常见问题

### 应用无法启动

**症状:** 双击应用图标后无反应

**可能原因:**

1. 依赖包未安装
2. 配置文件损坏
3. 权限问题

**解决方法:**

```bash
# 检查日志
journalctl -u spark-store

# 重新安装
sudo dpkg -i spark-store_*.deb

# 检查依赖
sudo apt-get install -f
```

### 安装失败

**症状:** 点击安装按钮后无响应或报错

**可能原因:**

1. APM 未安装
2. 权限不足
3. 网络问题

**解决方法:**

```bash
# 检查 APM 是否安装
which apm

# 检查权限
pkexec --version

# 查看 APM 日志
sudo journalctl -u amber-pm
```

### 下载速度慢

**症状:** 下载进度缓慢

**解决方法:**

1. 检查网络连接
2. 更换下载源
3. 使用代理

### 主题切换无效

**症状:** 切换暗色/亮色主题后无变化

**解决方法:**

```bash
# 清除本地存储
rm -rf ~/.config/spark-store/
```

## 调试方法

### 主进程调试

```bash
# 使用命令行启动并查看日志
spark-store --enable-logging
```

### 渲染进程调试

1. 打开应用
2. 按 `Ctrl+Shift+I` 打开 DevTools
3. 查看 Console 和 Network 标签

### IPC 通信调试

在 `electron/main/index.ts` 中添加日志：

```typescript
ipcMain.on("test-channel", (event, data) => {
  logger.info("IPC received:", data);
});
```

## 日志分析

### 日志位置

- **主进程日志:** `~/.config/spark-store/logs/`
- **系统日志:** `journalctl -u spark-store`

### 日志级别

- `trace`: 最详细
- `debug`: 调试信息
- `info`: 一般信息
- `warn`: 警告
- `error`: 错误
- `fatal`: 致命错误

### 查看日志

```bash
# 查看最新日志
tail -f ~/.config/spark-store/logs/main.log

# 搜索错误
grep ERROR ~/.config/spark-store/logs/*.log
```

## 性能问题

### 内存占用高

**检查方法:**

1. 打开 DevTools → Performance 标签
2. 录制并分析内存使用

**优化建议:**

- 清理不必要的组件
- 使用虚拟滚动
- 避免内存泄漏

### 启动慢

**检查方法:**

1. 查看 DevTools → Network 标签
2. 检查加载时间

**优化建议:**

- 延迟加载非关键资源
- 优化 API 请求
- 减少 HTTP 请求数量

---

**© 2026 APM 应用商店项目**
