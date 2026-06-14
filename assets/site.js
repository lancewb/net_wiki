import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"

mermaid.initialize({
  startOnLoad: true,
  securityLevel: "loose",
  theme: "base",
  themeVariables: {
    fontFamily: "Inter, Noto Sans SC, Microsoft YaHei, sans-serif",
    primaryColor: "#eef2f4",
    primaryTextColor: "#182026",
    primaryBorderColor: "#8ca0aa",
    lineColor: "#61707c",
    secondaryColor: "#e7f2ef",
    tertiaryColor: "#fff7ed",
  },
})

const toggle = document.querySelector(".sidebar-toggle")
toggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("sidebar-open")
  toggle.setAttribute("aria-expanded", String(open))
})

const input = document.querySelector("#search-input")
const results = document.querySelector("#search-results")
let index = []

async function loadIndex() {
  if (index.length) return index
  const response = await fetch("/search-index.json")
  index = await response.json()
  return index
}

function scorePage(page, terms) {
  const haystack = `${page.title} ${page.rel} ${page.text}`.toLowerCase()
  let score = 0
  for (const term of terms) {
    if (!haystack.includes(term)) return 0
    if (page.title.toLowerCase().includes(term)) score += 8
    if (page.rel.toLowerCase().includes(term)) score += 4
    score += 1
  }
  return score
}

function snippet(text, terms) {
  const lower = text.toLowerCase()
  const first = terms.map((term) => lower.indexOf(term)).filter((pos) => pos >= 0).sort((a, b) => a - b)[0] ?? 0
  const start = Math.max(0, first - 45)
  const end = Math.min(text.length, first + 110)
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`
}

input?.addEventListener("input", async () => {
  const query = input.value.trim().toLowerCase()
  if (!query) {
    results.hidden = true
    results.innerHTML = ""
    return
  }

  const terms = query.split(/\s+/).filter(Boolean)
  const pages = await loadIndex()
  const matches = pages
    .map((page) => ({ page, score: scorePage(page, terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title, "zh-Hans-CN"))
    .slice(0, 12)

  results.hidden = false
  results.innerHTML = matches.length
    ? matches
        .map(
          ({ page }) =>
            `<a href="${page.url}"><strong>${escapeHtml(page.title)}</strong><span>${escapeHtml(snippet(page.text, terms))}</span></a>`,
        )
        .join("")
    : `<a><strong>没有找到结果</strong><span>换一个关键词试试</span></a>`
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    results.hidden = true
    input?.blur()
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault()
    input?.focus()
  }
})

document.addEventListener("click", (event) => {
  if (!results || !input) return
  if (!results.contains(event.target) && event.target !== input) {
    results.hidden = true
  }
})

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

