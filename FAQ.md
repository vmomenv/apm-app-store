# 常见问题 (FAQ)

## 基本问题

### Q: APM 应用商店是什么？

**A:** APM 应用商店是基于 Electron + Vue 3 构建的桌面应用商店客户端，用于 APM (AmberPM) 包管理器的图形化界面。

### Q: 支持哪些操作系统？

**A:** 目前支持 Linux 系统，包括但不限于：

- Ubuntu 20.04+
- Debian 11+
- Fedora 35+
- Arch Linux
- 银河麒麟
- 统信 UOS

### Q: 如何安装 APM 应用商店？

**A:**

1. 从 GitHub Releases 下载 deb 或 rpm 包
2. 使用包管理器安装：

   ```bash
   # Debian/Ubuntu
   sudo dpkg -i spark-store_*.deb

   # Fedora/RHEL
   sudo dnf install spark-store_*.rpm
   ```

### Q: 需要 APM 包管理器吗？

**A:** 是的，APM 应用商店需要 APM 包管理器才能工作。请先安装 APM。

## 使用问题

### Q: 如何安装应用？

**A:**

1. 打开 APM 应用商店
2. 浏览或搜索应用
3. 点击应用卡片查看详情
4. 点击"安装"按钮
5. 等待安装完成

### Q: 如何卸载应用？

**A:**

1. 点击右上角"已安装"按钮
2. 在列表中找到要卸载的应用
3. 点击"卸载"按钮
4. 确认卸载

### Q: 如何更新应用？

**A:**

1. 点击右上角"更新"按钮
2. 选择要更新的应用
3. 点击"更新"按钮
4. 等待更新完成

### Q: 下载的应用在哪里？

**A:**
应用下载后存储在 APM 管理的目录中，通常位于：

```
/opt/spark-store/apps/{pkgname}/
```

## 技术问题

### Q: 应用无法启动怎么办？

**A:** 请参考 [问题排查指南](TROUBLESHOOTING.md)。

### Q: 如何查看日志？

**A:**
日志位置：

- 主进程日志：`~/.config/spark-store/logs/`
- 系统日志：`journalctl -u spark-store`

### Q: 如何切换主题？

**A:**
点击右上角主题切换按钮，或按 `Ctrl+Shift+T`。

### Q: 支持深色模式吗？

**A:** 是的，支持亮色、暗色和跟随系统主题。

## 开发问题

### Q: 如何参与开发？

**A:** 请参考 [贡献指南](CONTRIBUTING.md)。

### Q: 如何运行开发版本？

**A:**

```bash
git clone https://github.com/elysia-best/apm-app-store.git
cd apm-app-store
npm install
npm run dev
```

### Q: 技术栈是什么？

**A:**

- Electron 40.0.0
- Vue 3
- Vite 6.4.1
- TypeScript
- Tailwind CSS 4.1.18

### Q: 如何报告 Bug？

**A:**
请在 [GitHub Issues](https://github.com/elysia-best/apm-app-store/issues) 提交 Bug 报告。

## 其他问题

### Q: 可以在 Windows/Mac 上使用吗？

**A:** 目前不支持，但计划在未来添加跨平台支持。

### Q: 如何获取帮助？

**A:**

- 查看 [文档](README.md)
- 提交 [Issue](https://github.com/elysia-best/apm-app-store/issues)
- 加入 [社区论坛](https://bbs.spark-app.store/)

### Q: 许可证是什么？

**A:**
本项目采用 [GPL-3.0](LICENSE.md) 协议开源。

---

**© 2026 APM 应用商店项目**
