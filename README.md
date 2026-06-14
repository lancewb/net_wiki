# NET 网络拓扑学习库发布项目

这是从 Obsidian 笔记生成公网静态站的发布项目。

## 本地预览

```bash
npm install
npm run build
npm run preview
```

默认输出目录是 `public/`。

## 同步笔记

如果你在原 Obsidian Vault `/mnt/e/Documents/NET` 里继续修改笔记，可以在本目录执行：

```bash
npm run sync
npm run build
```

同步脚本只复制公开目录：

- `欢迎.md`
- `00-入口`
- `01-基础模型`
- `02-拓扑类型`
- `03-局域网与园区网`
- `04-互联网与运营商`
- `05-公有云与私有云`
- `06-流量调度与安全`
- `07-路由协议`
- `08-协议速查`
- `09-端到端实例`
- `99-参考资料`

## Cloudflare Pages 部署

1. 把本目录推送到 GitHub 仓库，例如 `net-notes-publish`。
2. 在 Cloudflare Pages 选择连接该仓库。
3. 构建设置：
   - Framework preset: `None`
   - Build command: `npm ci && npm run build`
   - Build output directory: `public`
   - Node.js version: `24`
4. 部署完成后，在 Custom domains 绑定你的域名，例如 `net.example.com`。

## GitHub Pages 部署

可以用 GitHub Actions 构建并发布 `public/`。本项目已包含 `.github/workflows/pages.yml`。

在 GitHub 仓库设置里：

1. Settings -> Pages
2. Source 选择 `GitHub Actions`
3. 推送到 `main` 后自动部署

