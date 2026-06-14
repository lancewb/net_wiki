import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import MarkdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import footnote from "markdown-it-footnote"
import taskLists from "markdown-it-task-lists"

const root = process.cwd()
const contentDir = path.join(root, "content")
const publicDir = path.join(root, "public")
const siteTitle = "NET 网络拓扑学习库"
const siteDescription = "从零理解互联网、公有云/私有云、路由协议、内外网流量调度和端到端流量路径。"
const homeStem = "网络拓扑知识地图"

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})
  .use(anchor, {
    permalink: anchor.permalink.headerLink(),
    slugify: slugifyAnchor,
  })
  .use(footnote)
  .use(taskLists, { enabled: true, label: true })

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    if (entry.isFile() && entry.name.endsWith(".md")) return [full]
    return []
  })
}

function normalizePath(file) {
  return path.relative(contentDir, file).split(path.sep).join("/")
}

function fileStem(file) {
  return path.basename(file, ".md")
}

function slugifySegment(segment) {
  return encodeURIComponent(segment)
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function pageUrlForRel(rel) {
  const noExt = rel.replace(/\.md$/, "")
  if (noExt === "欢迎") return "/"
  return `/${noExt.split("/").map(slugifySegment).join("/")}/`
}

function slugifyAnchor(text) {
  const clean = String(text)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{Letter}\p{Number}\s_-]+/gu, "")
    .replace(/\s+/g, "-")
  return clean || crypto.createHash("sha1").update(String(text)).digest("hex").slice(0, 8)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?]]/g, (_, target, alias) => alias || target)
    .replace(/[>#*_~|`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyAssetFiles() {
  const assetsDir = path.join(root, "assets")
  if (fs.existsSync(assetsDir)) {
    fs.cpSync(assetsDir, path.join(publicDir, "assets"), { recursive: true, force: true })
  }
}

function convertObsidianLinks(markdown, pageByStem) {
  return markdown.replace(/!\[\[([^\]]+)]]|\[\[([^\]]+)]]/g, (full, embedTarget, linkTarget) => {
    if (embedTarget) {
      return convertEmbed(embedTarget)
    }

    const raw = linkTarget
    const [targetAndHeading, alias] = raw.split("|")
    const [targetName, heading] = targetAndHeading.split("#")
    const targetStem = path.basename(targetName.trim(), ".md")
    const label = alias?.trim() || heading?.trim() || targetStem
    const page = pageByStem.get(targetStem)

    if (!page) {
      return `<span class="missing-link" title="缺失笔记">${escapeHtml(label)}</span>`
    }

    const href = heading ? `${page.url}#${slugifyAnchor(heading)}` : page.url
    return `[${label}](${href})`
  })
}

function convertEmbed(target) {
  const safe = escapeHtml(target)
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(target)) {
    return `<img src="${safe}" alt="${safe}" loading="lazy">`
  }
  return `<blockquote class="embed-placeholder">嵌入内容：${safe}</blockquote>`
}

function markMermaid(markdown) {
  return markdown.replace(/```mermaid\n([\s\S]*?)```/g, (_, diagram) => {
    return `<pre class="mermaid">${escapeHtml(diagram.trim())}</pre>`
  })
}

function buildSidebar(pages) {
  const grouped = new Map()
  for (const page of pages) {
    const group = page.rel.includes("/") ? page.rel.split("/")[0] : "根目录"
    if (!grouped.has(group)) grouped.set(group, [])
    grouped.get(group).push(page)
  }

  return [...grouped.entries()]
    .map(([group, groupPages]) => {
      const items = groupPages
        .sort((a, b) => a.rel.localeCompare(b.rel, "zh-Hans-CN"))
        .map((page) => `<li><a href="${page.url}">${escapeHtml(page.title)}</a></li>`)
        .join("")
      return `<details open><summary>${escapeHtml(group)}</summary><ul>${items}</ul></details>`
    })
    .join("")
}

function buildBacklinks(pages) {
  const byStem = new Map(pages.map((page) => [page.stem, page]))
  const backlinks = new Map(pages.map((page) => [page.stem, []]))

  for (const page of pages) {
    const matches = [...page.raw.matchAll(/\[\[([^\]]+)]]/g)]
    for (const match of matches) {
      const raw = match[1].split("|")[0].split("#")[0]
      const targetStem = path.basename(raw.trim(), ".md")
      if (!byStem.has(targetStem) || targetStem === page.stem) continue
      backlinks.get(targetStem).push(page)
    }
  }

  return backlinks
}

function pageTemplate({ page, content, sidebar, backlinks }) {
  const backlinkHtml = backlinks.length
    ? `<section class="backlinks"><h2>反向链接</h2><ul>${backlinks
        .map((item) => `<li><a href="${item.url}">${escapeHtml(item.title)}</a></li>`)
        .join("")}</ul></section>`
    : ""

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)} - ${escapeHtml(siteTitle)}</title>
  <meta name="description" content="${escapeHtml(page.description || siteDescription)}">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="module" src="/assets/site.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="topbar">
    <a class="brand" href="/">${escapeHtml(siteTitle)}</a>
    <button class="sidebar-toggle" type="button" aria-controls="sidebar" aria-expanded="false">目录</button>
    <label class="search">
      <span>搜索</span>
      <input id="search-input" type="search" placeholder="搜索拓扑、协议、云网络..." autocomplete="off">
    </label>
  </header>
  <div class="search-results" id="search-results" hidden></div>
  <div class="layout">
    <aside class="sidebar" id="sidebar">${sidebar}</aside>
    <main class="content" id="main">
      <article class="note">
        ${content}
      </article>
      ${backlinkHtml}
    </main>
  </div>
</body>
</html>`
}

function indexRedirect(homeUrl) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(siteTitle)}</title>
  <meta http-equiv="refresh" content="0; url=${homeUrl}">
  <link rel="canonical" href="${homeUrl}">
</head>
<body>
  <p><a href="${homeUrl}">进入 ${escapeHtml(siteTitle)}</a></p>
</body>
</html>`
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8")
}

fs.rmSync(publicDir, { recursive: true, force: true })
ensureDir(publicDir)
copyAssetFiles()

const files = walk(contentDir)
const pages = files.map((file) => {
  const rel = normalizePath(file)
  const raw = fs.readFileSync(file, "utf8")
  const stem = fileStem(file)
  const title = titleFromMarkdown(raw, stem)
  const url = pageUrlForRel(rel)
  return {
    file,
    rel,
    raw,
    stem,
    title,
    url,
    text: stripMarkdown(raw),
    description: stripMarkdown(raw).slice(0, 160),
  }
})

const pageByStem = new Map()
for (const page of pages) {
  if (!pageByStem.has(page.stem)) pageByStem.set(page.stem, page)
}

const sidebar = buildSidebar(pages)
const backlinks = buildBacklinks(pages)

for (const page of pages) {
  const converted = markMermaid(convertObsidianLinks(page.raw, pageByStem))
  const content = md.render(converted)
  const output = path.join(publicDir, decodeURIComponent(page.url), "index.html")
  ensureDir(path.dirname(output))
  fs.writeFileSync(
    output,
    pageTemplate({
      page,
      content,
      sidebar,
      backlinks: backlinks.get(page.stem) || [],
    }),
    "utf8",
  )
}

const home = pageByStem.get(homeStem) || pageByStem.get("欢迎") || pages[0]
fs.writeFileSync(path.join(publicDir, "index.html"), indexRedirect(home.url), "utf8")

writeJson(
  path.join(publicDir, "search-index.json"),
  pages.map((page) => ({
    title: page.title,
    url: page.url,
    rel: page.rel,
    text: page.text,
  })),
)

fs.writeFileSync(
  path.join(publicDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((page) => `  <url><loc>${escapeHtml(page.url)}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
  "utf8",
)

console.log(`built ${pages.length} pages into ${publicDir}`)

