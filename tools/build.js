// Builds the text pages of the website from pages/*.md into docs/*.html, in the site's design.
// Run from the website folder:  node tools/build.js
// No dependencies. It understands only what the pages use: # and ## headings, paragraphs,
// "- " lists, **bold**, [text](link), plain https:// links, email and www. addresses.
// The home page (docs/index.html) is written by hand and is not touched here.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "docs");

const PAGES = [
  {
    file: "privacy-policy",
    nav: "privacy",
    description: "How the Bible in Plain Sight app and website handle your data: no account, no ads, no tracking, and everything you write stays on your phone.",
  },
  {
    file: "support",
    nav: "support",
    description: "Help and common questions about the Bible in Plain Sight app, and how to reach us.",
    faq: true,
  },
  {
    file: "legal-notice",
    nav: "",
    description: "Legal notice (mentions légales) for Bible in Plain Sight.",
    lines: true,
  },
];

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Links are kept as placeholders while the other rules run, so they are never changed twice.
function inline(text) {
  const links = [];
  const keep = (href, label) => `\u0001${links.push({ href, label }) - 1}\u0002`;
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => keep(href.replace(/^\//, ""), label));
  s = s.replace(/(^|[\s(])(https:\/\/[^\s)]+[^\s).,;])/g, (m, pre, url) => pre + keep(url, url));
  s = s.replace(/(^|[\s(])(www\.[a-z0-9.-]+\.[a-z]{2,})(?![a-z0-9/-])/g, (m, pre, host) => pre + keep(`https://${host}`, host));
  s = s.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,})/g, (m, email) => keep(`mailto:${email}`, email));
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return s.replace(/\u0001(\d+)\u0002/g, (m, i) => `<a href="${links[i].href}">${links[i].label}</a>`);
}

function toHtml(md, { faq = false, lines = false } = {}) {
  let title = "";
  const parts = [];
  for (const block of md.replace(/\r/g, "").trim().split(/\n\s*\n/)) {
    const rows = block.split("\n");
    if (rows[0].startsWith("# ")) {
      title = rows[0].slice(2).trim();
      continue;
    }
    if (rows[0].startsWith("## ")) {
      parts.push(`<h2>${inline(rows[0].slice(3))}</h2>`);
      continue;
    }
    if (rows[0].startsWith("- ")) {
      const items = [];
      for (const row of rows) {
        if (row.startsWith("- ")) items.push(row.slice(2));
        else items[items.length - 1] += " " + row.trim();
      }
      parts.push("<ul>" + items.map((item) => `<li>${inline(item)}</li>`).join("") + "</ul>");
      continue;
    }
    if (/^Last updated:/.test(rows[0])) {
      parts.push(`<p class="meta">${inline(rows.join(" "))}</p>`);
      continue;
    }
    if (lines) {
      parts.push(rows.map((row) => `<p>${inline(row)}</p>`).join(""));
      continue;
    }
    if (faq && /^\*\*.+\*\*$/.test(rows[0]) && rows.length > 1) {
      parts.push(`<p class="q">${rows[0].slice(2, -2)}</p><p>${inline(rows.slice(1).join(" "))}</p>`);
      continue;
    }
    parts.push(`<p>${inline(rows.join(" "))}</p>`);
  }
  return { title, body: parts.join("\n") };
}

function page({ title, description, nav, bodyClass, body, canonical }) {
  const current = (name) => (nav === name ? ' aria-current="page"' : "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Bible in Plain Sight</title>
<meta name="description" content="${escapeHtml(description)}">
${canonical ? `<link rel="canonical" href="https://www.bibleinplainsight.com/${canonical}">\n` : ""}<meta name="theme-color" content="#F3EEE4">
<link rel="icon" href="assets/img/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/base.css">
<link rel="stylesheet" href="assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="wrap top">
  <a class="wordmark" href="./">Bible in Plain Sight</a>
  <nav aria-label="Main">
    <a class="wide" href="./#how">How it works</a>
    <a href="privacy-policy"${current("privacy")}>Privacy</a>
    <a href="support"${current("support")}>Support</a>
  </nav>
</header>

<main id="main" class="wrap">
<article class="doc${bodyClass ? " " + bodyClass : ""}">
<h1>${escapeHtml(title)}</h1>
${body}
</article>
</main>

<footer>
  <div class="wrap">
    <div class="row">
      <a class="wordmark" href="./">Bible in Plain Sight</a>
      <nav aria-label="Footer">
        <a href="privacy-policy">Privacy Policy</a>
        <a href="support">Support</a>
        <a href="legal-notice">Legal notice</a>
      </nav>
    </div>
    <p class="small">Scripture quotations are from the Berean Standard Bible (BSB), public domain. © 2026 Bible in Plain Sight.</p>
  </div>
</footer>
</body>
</html>
`;
}

for (const p of PAGES) {
  const md = fs.readFileSync(path.join(root, "pages", `${p.file}.md`), "utf8");
  const { title, body } = toHtml(md, p);
  const bodyClass = p.faq ? "faq" : p.lines ? "lines" : "";
  fs.writeFileSync(path.join(out, `${p.file}.html`), page({ title, description: p.description, nav: p.nav, bodyClass, body, canonical: p.file }));
  console.log(`docs/${p.file}.html  (${title})`);
}

// The page GitHub Pages shows for an address that does not exist.
fs.writeFileSync(
  path.join(out, "404.html"),
  page({
    title: "Page not found",
    description: "This page does not exist.",
    nav: "",
    body: '<p>This page does not exist. It may have moved.</p>\n<p><a href="./">Go to the home page</a> or see <a href="support">Support</a>.</p>',
  }),
);
console.log("docs/404.html");
