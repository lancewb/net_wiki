import fs from "node:fs"
import path from "node:path"

const sourceRoot = path.resolve("../NET")
const targetRoot = path.resolve("content")
const entries = [
  "欢迎.md",
  "00-入口",
  "01-基础模型",
  "02-拓扑类型",
  "03-局域网与园区网",
  "04-互联网与运营商",
  "05-公有云与私有云",
  "06-流量调度与安全",
  "07-路由协议",
  "08-协议速查",
  "09-端到端实例",
  "99-参考资料",
]

fs.rmSync(targetRoot, { recursive: true, force: true })
fs.mkdirSync(targetRoot, { recursive: true })

for (const entry of entries) {
  const source = path.join(sourceRoot, entry)
  const target = path.join(targetRoot, entry)
  if (!fs.existsSync(source)) {
    console.warn(`skip missing: ${source}`)
    continue
  }
  fs.cpSync(source, target, {
    recursive: true,
    force: true,
    filter: (item) => !item.includes(`${path.sep}.obsidian${path.sep}`),
  })
}

console.log(`synced ${entries.length} entries from ${sourceRoot} to ${targetRoot}`)

