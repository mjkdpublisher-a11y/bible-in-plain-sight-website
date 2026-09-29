// Builds the text pages of the website from pages/*.md into docs/*.html, in the site's design.
// Run from the website folder:  node tools/build.js
// No dependencies. It understands only what the pages use: # and ## headings, paragraphs,
// "- " lists, **bold**, [text](link), plain https:// links, email and www. addresses.
// The home page (docs/index.html) is written by hand; only its file versions are updated here.
// Last, every link to a style sheet, script, picture or screen in docs/ gets "?v=" and a short
// fingerprint of that file, so a phone that keeps files for a while still gets a changed one at once.
// Run it before every commit.

const crypto = require("crypto");
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

// base: "" for the pages, "/" for 404.html, which GitHub Pages also shows at deeper addresses such as
// /privacy-policy/ (relative links would point into a folder that does not exist).
function page({ title, description, nav, bodyClass, body, canonical, base = "" }) {
  const current = (name) => (nav === name ? ' aria-current="page"' : "");
  const home = base || "./";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Bible in Plain Sight</title>
<meta name="description" content="${escapeHtml(description)}">
${canonical ? `<link rel="canonical" href="https://www.bibleinplainsight.com/${canonical}">\n` : ""}<meta name="theme-color" content="#F3EEE4">
<link rel="icon" href="${base}assets/img/icon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="${base}assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${base}assets/img/icon-180.png">
<link rel="stylesheet" href="${base}assets/tokens.css">
<link rel="stylesheet" href="${base}assets/base.css">
<link rel="stylesheet" href="${base}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="wrap top">
  <a class="wordmark brand" href="${home}"><span class="mini-icon" aria-hidden="true"></span><span class="brand-name">Bible in Plain Sight</span></a>
  <nav aria-label="Main">
    <a class="wide" href="${home}#how">How it works</a>
    <a href="${base}privacy-policy"${current("privacy")}>Privacy</a>
    <a href="${base}support"${current("support")}>Support</a>
    <a class="help-now" href="${home}#help"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 7.5h2.6l1.3 3.3-1.7 1.1a8.4 8.4 0 0 0 4.4 4.4l1.1-1.7 3.3 1.3v2.6a1.6 1.6 0 0 1-1.8 1.6A12.8 12.8 0 0 1 3.9 9.3a1.6 1.6 0 0 1 1.6-1.8z"/><path d="M17.8 10.2s-3.3-2-3.3-4.4a1.7 1.7 0 0 1 3.3-.8 1.7 1.7 0 0 1 3.3.8c0 2.4-3.3 4.4-3.3 4.4z"/></svg>Help now</a>
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
      <a class="wordmark brand" href="${home}"><span class="mini-icon" aria-hidden="true"></span><span class="brand-name">Bible in Plain Sight</span></a>
      <nav aria-label="Footer">
        <a href="${base}privacy-policy">Privacy Policy</a>
        <a href="${base}support">Support</a>
        <a href="${base}legal-notice">Legal notice</a>
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
    base: "/",
    body: '<p>This page does not exist. It may have moved.</p>\n<p><a href="/">Go to the home page</a> or see <a href="/support">Support</a>.</p>',
  }),
);
console.log("docs/404.html");

// File versions: deeper pages first, so a page's fingerprint includes the versions written into the
// screens it shows.
function stampVersions() {
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) pages.push(full);
    }
  };
  walk(out);
  pages.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);
  // Line endings are left out, so the same file gives the same fingerprint on Windows and on GitHub.
  const fingerprint = (file) =>
    crypto.createHash("sha1").update(fs.readFileSync(file).toString("latin1").replace(/\r\n/g, "\n"), "latin1").digest("hex").slice(0, 8);
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const stamped = html.replace(/\b(href|src)="([^"#?:]+\.(?:css|js|html|jpg|png|svg))(?:\?v=[0-9a-f]+)?"/g, (m, attr, ref) => {
      // Links between pages need no version (and pages that link to each other would never settle).
      if (attr === "href" && ref.endsWith(".html")) return `${attr}="${ref}"`;
      const target = ref.startsWith("/") ? path.join(out, ref) : path.join(path.dirname(file), ref);
      return fs.existsSync(target) ? `${attr}="${ref}?v=${fingerprint(target)}"` : m;
    });
    if (stamped !== html) fs.writeFileSync(file, stamped);
  }
  console.log(`file versions: ${pages.length} pages`);
}
stampVersions();
