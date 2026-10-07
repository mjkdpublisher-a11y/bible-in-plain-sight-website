# Bible in Plain Sight: website

The website for the Android app **Bible in Plain Sight**. The app itself is a separate project at
`L:\Bible in Plain Sight\Projects\bible-in-plain-sight` (Expo / React Native, private GitHub repo).
This folder is only for the website. **Read the app project, never change it from here.** Copy any
file the website needs (fonts, pictures, icons) into this folder.

Written on 2026-09-27 from the app project, when the website work started.

## About the owner

Mark, a beginner programmer. He works on **Windows** and checks things in his browser and on his
**Android** phone.

- **Talk to Mark in Polish. Everything that goes into the website (text, code, file names, commits) is in English.**
- Explain what you do and why, briefly and in plain language.
- **Plan first:** propose, wait for his approval, then build. Show him the result (he checks it), and
  save (commit) only after he says it works ("działa, zapisz").
- Ask before large changes: new tools or libraries, paid services, publishing anything online,
  deleting files.
- Terminal commands for Windows PowerShell. Use `npx.cmd` and `npm.cmd`, because plain `npx` and
  `npm` are blocked on his PC. The L: drive is slow for `npm install` (exFAT); keep dependencies few.
- He judges as a reader would. Do not present his own ideas back to him as yours.

## What the website is for

1. **A landing page** for the app: what it is, who it is for, how it helps, a link to Google Play
   once the app is published.
2. **The privacy policy.** Google Play requires one at a public web address before the app can be
   published. It must describe exactly what the app does (see "Privacy facts" below), nothing more
   and nothing less.
3. **Support and contact**: how to reach the developer (Google Play also asks for a support email).
4. Maybe later: the list of topics, "How it works", a page for pastors and churches.

**Domain and mail:** Mark owns `bibleinplainsight.com` at Hostinger (paid until 2027-09-25,
auto-renew on, WHOIS privacy on). The mailbox `support@bibleinplainsight.com` runs on Hostinger
(MX, SPF, DKIM and DMARC records in Hostinger's DNS: never touch them when changing the website).

**Where the site lives:**
- **GitHub Pages** since 2026-09-27, from the public repository
  `mjkdpublisher-a11y/bible-in-plain-sight-website` (free GitHub Pages needs a public repository),
  branch `main`, folder `docs/`. Publishing a change = commit and `git push`; GitHub rebuilds the
  site in a minute or two. Commits use this repo's settings: author "Bible in Plain Sight" and
  GitHub's hidden noreply address, never Mark's Gmail.
- Custom domain `www.bibleinplainsight.com` (`docs/CNAME`), verified in Mark's GitHub account (TXT
  record `_github-pages-challenge-mjkdpublisher-a11y`, keep it). In Hostinger's DNS: `www` is a
  CNAME to `mjkdpublisher-a11y.github.io`, and the bare domain has A records for GitHub's four
  addresses (185.199.108.153, .109.153, .110.153, .111.153); GitHub redirects it to `www`.
- Before that, a four-page site on free **Google Sites** (Google account "Mark J",
  bibleinplainsight@…; in Mark's Chrome that is `authuser=2`), published 2026-09-27. Mark
  unpublished it the same day, after the switch; the draft stays in his Google account.

**How the website is built** (since 2026-10-02: the redesign Mark approved, made outside this repo
and handed over as a package in `M:\GPT Roboczy\Projekty\Bible in Plain Sight - WWW\przekazanie\`; it is the
reference for look and behavior, do not redesign it; the earlier design "Dawn" is in git history):
- `docs/index.html`: the home page, written by hand. Styles in `docs/assets/`: `styles.css` (fonts, colors,
  layout, mobile), `phone.css` (graphite phones, glass, screen masking), `interactions.css` (cards, icons,
  links, buttons, FAQ), `ambient-background.css` (slow sage and gold light), `closing-motion.css` (light in
  the last card; the three decorative lines above it stay removed), `navigation.css` (quiet menu tiles),
  `documents.css` (text pages). Scripts: `site.js` (menu, Google Play buttons, "Coming soon" dialog, on every
  page), `app.js` (the three steps and screen choices, phone scrolling), `config.js` (`googlePlayUrl`: the
  app's page on Google Play since 2026-10-07, every download button opens it; with an empty address
  the buttons open the "Coming soon" dialog; never invent an app id). The page's own words (button
  labels, the FAQ answer "Can I download the app now?", the description) are in the published state
  too, the same words `site.js` writes. No trackers, nothing from other services.
- `pages/privacy-policy.md`, `support.md`, `legal-notice.md`: the approved texts, the source of truth.
  `node tools/build.js` turns them into `docs/*.html` (and `docs/404.html`) in the new layout, taking the
  header, footer and dialog from `docs/index.html`, so change those there and build. Addresses stay
  `/privacy-policy`, `/support`, `/legal-notice` (the app's Settings and Google Play link to them).
  `support.md`: `## Group {#id}` starts a group of questions (`**Question?**` then the answer), a `> `
  paragraph is the "Need help now?" notice, other paragraphs in a group are its small related links.
  `404.html` uses links from the root (`/assets/...`, `/support`), because GitHub Pages also shows it at
  deeper addresses such as `/privacy-policy/`.
- For search engines (2026-10-07): `tools/build.js` also writes `docs/sitemap.xml` (the home page and the
  three text pages at their https www addresses) and `docs/robots.txt` (points to the sitemap). The
  screens in `docs/screens/` carry `noindex`. Search Console's "Page with redirect" for the addresses
  without www or https is expected: they redirect to the www address.
- **Run `node tools/build.js` before every commit**, also after changing only CSS, JS or a screen: it
  writes `?v=` and a fingerprint of the file into every link to a style sheet, script, picture or screen,
  also into `'screens/....html'` names in `assets/app.js`. GitHub Pages lets browsers keep files for 10
  minutes, so without it phones show the old look after a change (Mark hit this on 2026-09-27).
- `docs/screens/*.html`: the nine app screens shown in the phones, drawn from the app's code with its
  approved content and verses word for word from `data/bsb.txt`. Real screenshots from Mark's phone can
  replace any of them. Never show "Listen" or "Save" (the app has no such buttons) and never show the
  crisis screen (Mark: too strong for someone just looking). Each screen is 390 x 867 with the phone's
  status bar (`screens/status.css`: 7:42, Wi-Fi, signal, battery, the front camera). No line of text may be
  cut by the phone's edge: screens with a tab bar hide the rest under it; reading screens end with the
  `.fade` from `screens/app.css`. A screen scrolls its `.scroller` by `--scroll` over `--dur`
  (`screens/motion.css`), on hover, tap, Enter/Space or "Scroll screen"; each `--scroll` was measured so
  that at the end no line is cut at the top bar, the tab bar or the fade; re-measure it when a screen's
  content changes. "Reduce motion" switches the movement off (a tap still shows the rest at once).
- Content to keep (Mark, 2026-10-02): "Nobody in pain should meet a price.", "90 topics. More on the way.",
  18 free topics and 72 more for one optional purchase (never "90 free topics"); the help line in the
  app's wording, "If you or someone else is in immediate danger, call the local emergency number."
- The files of the earlier design (`tokens.css`, `base.css`, `site.css`, `home.css`, `backgrounds.css`,
  `home.js`, the paper grain and the hills) were removed on 2026-10-02, with Mark's OK; they are in git
  history.
- Fonts: WOFF2 files cut to the Latin letters the site uses (fontTools, installed with pip on
  2026-09-29), with the TTF behind them as a fallback. When a page needs a new kind of character, make
  the WOFF2 again from the TTF (`python -m fontTools.subset`).
- `PRODUCT.md` (who the site is for, its principles) and `.impeccable/` belong to the impeccable
  design skill (Mark ran critique, audit, polish and init on 2026-09-29).
- Preview: `python tools/serve.py` (or the "site" entry in `.claude/launch.json`), then
  http://localhost:8766. It serves `/privacy-policy` from `privacy-policy.html`, as GitHub Pages does,
  and tells the browser to keep nothing, so a change shows at once. After a change, reload any preview
  tab that was open before (it still holds the old page).
- `notes/privacy-facts.md`: where each privacy claim comes from.
- `notes/app-todo.md`: things for the app project (review request, privacy link in the app, what the
  privacy policy depends on). Remind Mark of it when the app work comes up.

## The app, in facts

- A Christian app that takes a person from a life problem to Bible passages with context, then
  follows up and builds a personal history of how things changed. English, **Android first**,
  iOS later. **Published on Google Play** (Mark, 2026-10-07):
  https://play.google.com/store/apps/details?id=com.bibleinplainsight.app
- **90 topics in 10 categories** (Heart & Mind, Money & Work, Relationships & Family, Loss & Grief,
  Health & Body, Guilt & Temptation, Faith & Doubt, Decisions & Future, Joy & Gratitude, and
  I Need Help Now).
- A topic **card**: an honest opening, a lament (or "Remember" on joyful topics), "Scripture and context"
  (passages with a note on their context), a story from Scripture, one practical step, a prayer,
  a verse to keep. Every passage can open **the whole chapter**, so no verse is read out of context.
- **For someone I love**: the prayer becomes a prayer for a person by name, with tips on how to be
  there for them. A verse can be shared as an image.
- **Journal** with a simple "How heavy does it feel?" scale, **check-ins** a few days later
  ("How is it now?"), a **Timeline**, and **Stones of Remembrance** (short notes of how God helped,
  from 1 Samuel 7:12).
- **Crisis help:** "I need help now" is always one tap away. Crisis topics show helplines for the
  person's country first (United States, Canada, United Kingdom, Ireland, Australia, France,
  Poland; Find A Helpline elsewhere). Topics about abuse at home have a Quick exit button and leave
  no trace on the phone.
- **Free and paid:** free to download. **18 topics are free forever**: all 5 crisis topics, all 11
  sensitive ones (grief, depression, addiction and the like), plus Anxiety and worry, and Thankful.
  **One purchase (about 5 USD, no subscription) unlocks the other 72.** All features are free.
  Principle: nobody in pain should meet a price.
- It is not a medical app. Settings > About in the app (wording from the expert review G03,
  2026-09-28): "Bible in Plain Sight offers Christian Scripture, prayer and optional reflection. It
  does not provide diagnosis, therapy or emergency response. No one monitors your journal or check-in
  answers. If you or someone else is in immediate danger, call the local emergency number. Use Help
  now to find listed support services." The site uses it on the Support page and in the privacy
  policy (with "Help now" in quotation marks, since it names the app's button), and its first three
  sentences in the home page's help block.
- Scripture: the **Berean Standard Bible (BSB)**, public domain. Wherever Scripture appears, show:
  "Scripture quotations are from the Berean Standard Bible (BSB), public domain." Never type,
  shorten or paraphrase a verse: copy it word for word from the app project's `data/bsb.txt`.

## Privacy facts (the privacy policy must match these exactly)

- No accounts, no analytics, no ads, no tracking. Everything the person writes stays on the phone.
- Journal, check-ins and stones are in a database on the phone, **encrypted with SQLCipher** since
  2026-09-28 (key made on the phone, kept in Android Keystore). The small settings store is not
  encrypted, so say "what you write is encrypted", not "everything". Deleted text is overwritten at
  once (SQLite secure delete). Android backup to Google Drive is switched off.
- Settings has "Export all data" (a file the person shares where they choose) and "Delete all data".
- Reminders are local notifications, private by default ("You have a new check-in", no topic). On
  the reviewed crisis topics a reminder comes only if the person asks for one, and only says "You
  have a reminder." They never alert anyone else.
- Play Console (2026-09-30): target age groups 13-15, 16-17 and 18 and over; Data safety "No data
  collected", "No data shared".
- The app makes no network calls except through Google Play: the one-time purchase (price, buy,
  and a check at start whether it is owned) and, once at most, Google's own review card (never on
  crisis or sensitive topics; the app remembers on how many days it was opened and whether it asked).
  Google, not the app, handles payment details.
- Helpline calls and texts go through the phone's own apps; the app does not see them.
- Source of truth for these facts: the app project's `CLAUDE.md` and `src/storage/`,
  `src/purchases/fullVersion.ts`, `app.json`. If in doubt, read the code; do not guess.

**The website must keep the same promise:** no analytics, no cookies, no third-party scripts or
trackers. Host the fonts with the site instead of loading them from Google Fonts (loading from
Google sends visitors' IP addresses to Google, which EU courts have treated as a privacy problem).

## Identity and name

- Mark publishes as a sole proprietor, so his legal business name is his own name. **Keep his name
  out of the branding**: the app name, the developer name on Google Play and the website are
  "Bible in Plain Sight". Package name: `com.bibleinplainsight.app`.
- **The business is registered in France** (confirmed by Mark on 2026-09-27; he speaks Polish, but
  the business is not Polish). So French and EU rules apply: the GDPR (supervisory authority: the
  CNIL) and the French rules for a business website ("mentions légales": publisher, address,
  SIRET, contact, and the web host's details). His name and address therefore appear once, on the
  legal page and in the "who is responsible" part of the privacy policy, never in the branding.

## Design (read from the app project)

Design system: Variant C "Linen & Sage", with the dawn illustration from Variant B. Warm linen
paper, sage green, clay red accents, calm and printed-looking, never flashy. Light and dark mode.

- `design/design-handoff-v1/README.md` and `design-system.md`: the design system.
- `design/design-handoff-v1/tokens/tokens.css` and `tokens.json`: colors, type, spacing, radii.
  Use these on the website so it matches the app.
- `design/design-handoff-v1/screens/png/`: every app screen (useful for screenshots and mockups).
- `design/design-handoff-v1/assets/`: icons, emotion shapes, illustrations
  (`illustrations/welcome-cross-source.png` is the 2048 px dawn cross).
- `assets/images/welcome-cross.jpg`: the welcome illustration as the app uses it (cut to an arch).
- `src/theme/theme.ts`: the tokens as the app uses them.
- Fonts: **Literata** (headings, Scripture) and **Atkinson Hyperlegible** (body). Both are open
  font licenses; the app has the files under `node_modules/@expo-google-fonts/`.
- The solid green buttons carry a very faint paper texture (`assets/images/grain.png`, opacity
  0.03). Keep it faint; stronger reads as dirt.

## Words

- US English, simple and warm. **No em dashes.** No medical claims, no promises that things will be
  fine, nothing that suggests praying instead of getting help.
- Wherever the site talks about hard things, say where help is: "If you or someone else is in
  immediate danger, call the local emergency number." (the app's wording since the expert review,
  2026-09-28; before that "If you are in danger, call your local emergency number.")
- Other useful documents in the app project: `docs/bible-help-app-developer-spec-EN.md` (the full
  specification), `docs/aplikacja-biblijna-koncepcja-PL.md` (Mark's original concept, in Polish),
  `docs/helpline-verification.md`.

## Start

Read this file, then the design system files above. Then, in Polish, propose a plan for the website
(pages, what each says, hosting, the domain question, how the privacy policy will be written) and
wait for Mark's decision before writing any code.
