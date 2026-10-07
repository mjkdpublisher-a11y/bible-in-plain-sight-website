// Builds the text pages of the website from pages/*.md into docs/*.html, in the site's design.
// Run from the website folder:  node tools/build.js
// No dependencies. It understands only what the pages use: # and ## headings (with an optional
// {#id}), paragraphs, "> " notices, "- " lists, **bold**, [text](link), plain https:// links, email
// and www. addresses. The home page (docs/index.html) is written by hand; the text pages take their
// header, footer and "Coming soon" dialog from it, so every page shares the same menu.
// Last, every link to a style sheet, script, picture or screen in docs/ gets "?v=" and a short
// fingerprint of that file, so a phone that keeps files for a while still gets a changed one at once.
// Run it before every commit.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "docs");

// The wording around each page (eyebrow, heading, intro) comes from the redesign of 2026-10-02.
const PAGES = [
  {
    file: "privacy-policy",
    label: "Privacy policy",
    eyebrow: "Privacy, in plain sight",
    intro: "Your words stay with you.",
    description: "How the Bible in Plain Sight app and website handle your data: no account, no ads, no tracking, and everything you write stays on your phone.",
  },
  {
    file: "support",
    label: "Support",
    eyebrow: "A little help along the way",
    description: "Help and common questions about the Bible in Plain Sight app, and how to reach us.",
    support: true,
  },
  {
    file: "legal-notice",
    label: "Legal notice",
    eyebrow: "Clear and transparent",
    intro: "The people and services behind Bible in Plain Sight.",
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

// "1. Who we are" -> "1-who-we-are", as the redesign names its sections.
function slug(text) {
  return text.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Splits a page into blocks. Returns the title, the first paragraph (support uses it as the intro),
// the headings for "On this page", and the body.
function toHtml(md, { lines = false, support = false } = {}) {
  let title = "";
  let intro = "";
  const toc = [];
  const parts = [];
  let section = null; // support: the open group of questions
  const closeSection = () => {
    if (!section) return;
    parts.push(`<section class="document-section" id="${section.id}" aria-labelledby="${section.id}-title"><h2 id="${section.id}-title">${section.title}</h2><div class="support-faq">${section.faq.join("")}</div>${section.related.join("")}</section>`);
    section = null;
  };
  for (const block of md.replace(/\r/g, "").trim().split(/\n\s*\n/)) {
    const rows = block.split("\n");
    if (rows[0].startsWith("# ")) {
      title = rows[0].slice(2).trim();
      continue;
    }
    if (rows[0].startsWith("## ")) {
      const m = rows[0].slice(3).match(/^(.*?)\s*(?:\{#([a-z0-9-]+)\})?$/);
      const text = m[1];
      const id = m[2] || slug(text);
      toc.push({ id, text });
      if (support) {
        closeSection();
        section = { id, title: inline(text), faq: [], related: [] };
      } else parts.push(`<h2 id="${id}">${inline(text)}</h2>`);
      continue;
    }
    if (support && rows[0].startsWith("> ")) {
      const text = rows.map((row) => row.replace(/^> ?/, "")).join(" ");
      parts.push(`<aside id="need-help" class="support-notice" aria-labelledby="urgent-help-title"><h2 id="urgent-help-title">Need help now?</h2><p>${inline(text)}</p><a class="text-button" href="./#help">Read about immediate help</a></aside>`);
      toc.unshift({ id: "need-help", text: "Need help now?" });
      continue;
    }
    if (support && !intro && !section) {
      intro = inline(rows.join(" "));
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
    if (section && /^\*\*.+\*\*$/.test(rows[0]) && rows.length > 1) {
      section.faq.push(`<details><summary>${rows[0].slice(2, -2)}<span aria-hidden="true"></span></summary><p>${inline(rows.slice(1).join(" "))}</p></details>`);
      continue;
    }
    if (section) {
      section.related.push(`<p class="document-related">${inline(rows.join(" "))}</p>`);
      continue;
    }
    parts.push(`<p>${inline(rows.join(" "))}</p>`);
  }
  closeSection();
  if (support) toc.push({ id: "contact", text: "Contact us" });
  return { title, intro, toc, body: parts.join("\n") };
}

// The shared header, footer and dialog, taken from the home page.
const home = fs.readFileSync(path.join(out, "index.html"), "utf8").replace(/\r\n/g, "\n");
const part = (re, name) => {
  const m = home.match(re);
  if (!m) throw new Error(`docs/index.html has no ${name}`);
  return m[0].replace(/\?v=[0-9a-f]+"/g, '"');
};
const HEADER = part(/  <header class="site-header">[\s\S]*?<\/header>/, "site header");
const FOOTER = part(/  <footer class="site-footer">[\s\S]*?<\/footer>/, "site footer");
const DIALOG = part(/  <dialog [\s\S]*?<\/dialog>/, "availability dialog");

// base: "" for the pages, "/" for 404.html, which GitHub Pages also shows at deeper addresses such as
// /privacy-policy/ (relative links would point into a folder that does not exist).
function shell(html, base, current) {
  const home = base || "./";
  let s = html
    .replace(/href="#main"/g, `href="${home}"`)
    .replace(/href="#([a-z-]+)"/g, `href="${home}#$1"`)
    .replace(/(src|href)="assets\//g, `$1="${base}assets/`)
    .replace(/href="(privacy-policy|support|legal-notice)(#[a-z-]+)?"/g, `href="${base}$1$2"`);
  if (current) s = s.replace(`href="${base}${current}"`, `href="${base}${current}" aria-current="page"`);
  return s;
}

function page({ file, title, label, eyebrow, intro, description, toc, body, canonical, base = "", support = false }) {
  const tocLinks = toc.map((t) => `<a href="#${t.id}">${escapeHtml(t.text)}</a>`).join("");
  const sidebarToc = toc.length
    ? `<p class="eyebrow">On this page</p><nav class="document-toc" aria-label="Page contents">${tocLinks}</nav><details class="document-mobile-toc"><summary>On this page</summary><nav class="document-toc" aria-label="Page contents">${tocLinks}</nav></details>`
    : "";
  const docNav = PAGES.map((p) => `<a href="${base}${p.file}"${p.file === file ? ' aria-current="page"' : ""}>${p.label}</a>`).join("");
  const sections = support ? toc.filter((t) => t.id !== "need-help" && t.id !== "contact") : [];
  const supportLinks = sections.length
    ? `<nav class="support-links" aria-label="Support topics">${sections.map((t) => `<a href="#${t.id}">${escapeHtml(t.text)}</a>`).join("")}</nav>`
    : "";
  const contact = support
    ? '<section class="support-contact" id="contact" aria-labelledby="contact-title"><h2 id="contact-title">Contact us</h2><p>We are glad to help. We will reply within a few working days.</p><a class="button" href="mailto:support@bibleinplainsight.com">Email support</a><p class="document-related">support@bibleinplainsight.com</p></section>'
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#163e31">
<title>${escapeHtml(title)} · Bible in Plain Sight</title>
<meta name="description" content="${escapeHtml(description)}">
${canonical ? `<link rel="canonical" href="https://www.bibleinplainsight.com/${canonical}">\n` : ""}<link rel="icon" href="${base}assets/img/icon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="${base}assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${base}assets/img/icon-180.png">
<link rel="stylesheet" href="${base}assets/styles.css">
<link rel="stylesheet" href="${base}assets/interactions.css">
<link rel="stylesheet" href="${base}assets/ambient-background.css">
<link rel="stylesheet" href="${base}assets/navigation.css">
<link rel="stylesheet" href="${base}assets/documents.css">
<script src="${base}assets/config.js" defer></script>
<script src="${base}assets/site.js" defer></script>
</head>
<body class="document-page" data-page="${file}">
<div class="ambient-light" aria-hidden="true"><span class="ambient-orb ambient-orb-sage"></span><span class="ambient-orb ambient-orb-gold"></span></div>
<a class="skip-link" href="#main">Skip to content</a>
${shell(HEADER, base)}
<div class="document-breadcrumb wrap"><a href="${base || "./"}">Home</a><span aria-hidden="true">/</span><span>${escapeHtml(label)}</span></div>
<main class="document-layout wrap" id="main"><aside class="document-sidebar"><nav class="document-pages" aria-label="Information pages">${docNav}</nav>${sidebarToc}</aside><article class="document-content${support ? " support-content" : ""}"><header class="document-intro"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(label)}</h1><p>${intro}</p></header>${supportLinks}
${body}
${contact}</article></main>
${shell(FOOTER, base, file)}
${shell(DIALOG, base)}
</body>
</html>
`;
}

for (const p of PAGES) {
  const md = fs.readFileSync(path.join(root, "pages", `${p.file}.md`), "utf8");
  const { title, intro, toc, body } = toHtml(md, p);
  fs.writeFileSync(
    path.join(out, `${p.file}.html`),
    page({ ...p, title, intro: p.intro ? escapeHtml(p.intro) : intro, toc, body, canonical: p.file }),
  );
  console.log(`docs/${p.file}.html  (${title})`);
}

// The page GitHub Pages shows for an address that does not exist.
fs.writeFileSync(
  path.join(out, "404.html"),
  page({
    file: "",
    title: "Page not found",
    label: "Page not found",
    eyebrow: "Bible in Plain Sight",
    intro: "This page does not exist. It may have moved.",
    description: "This page does not exist.",
    toc: [],
    base: "/",
    body: '<p><a href="/">Go to the home page</a> or see <a href="/support">Support</a>.</p>',
  }),
);
console.log("docs/404.html");

// For search engines: the site's pages at their one right address (https, www), and where that list
// is. The other addresses (no www, http) only redirect here, which Search Console reports as "Page
// with redirect"; that is as it should be.
const SITE = "https://www.bibleinplainsight.com/";
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", ...PAGES.map((p) => p.file)].map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}\n</urlset>\n`,
);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log("docs/sitemap.xml, docs/robots.txt");

// File versions. Screens first, then the scripts that open them (assets/app.js), then the pages that
// show both, so every fingerprint includes the versions written into the files it points to.
function stampVersions() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js)$/.test(entry.name)) files.push(full);
    }
  };
  walk(out);
  const rank = (f) => (f.endsWith(".js") ? 1 : path.dirname(f) === out ? 2 : 0);
  files.sort((a, b) => rank(a) - rank(b));
  // Line endings are left out, so the same file gives the same fingerprint on Windows and on GitHub.
  const fingerprint = (file) =>
    crypto.createHash("sha1").update(fs.readFileSync(file).toString("latin1").replace(/\r\n/g, "\n"), "latin1").digest("hex").slice(0, 8);
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let stamped;
    if (file.endsWith(".js")) {
      // Screens a script opens by name, as 'screens/topic-card.html' (paths from the site's root).
      stamped = text.replace(/(['"])(screens\/[\w-]+\.html)(?:\?v=[0-9a-f]+)?\1/g, (m, q, ref) => {
        const target = path.join(out, ref);
        return fs.existsSync(target) ? `${q}${ref}?v=${fingerprint(target)}${q}` : m;
      });
    } else {
      stamped = text.replace(/\b(href|src)="([^"#?:]+\.(?:css|js|html|jpg|png|svg))(?:\?v=[0-9a-f]+)?"/g, (m, attr, ref) => {
        // Links between pages need no version (and pages that link to each other would never settle).
        if (attr === "href" && ref.endsWith(".html")) return `${attr}="${ref}"`;
        const target = ref.startsWith("/") ? path.join(out, ref) : path.join(path.dirname(file), ref);
        return fs.existsSync(target) ? `${attr}="${ref}?v=${fingerprint(target)}"` : m;
      });
    }
    if (stamped !== text) fs.writeFileSync(file, stamped);
  }
  console.log(`file versions: ${files.length} files`);
}
stampVersions();