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

**What already exists** (found on 2026-09-27): Mark owns `bibleinplainsight.com`, bought at
Hostinger for one year (renewal needed around September 2027). The mailbox
`support@bibleinplainsight.com` runs on Hostinger. `www.bibleinplainsight.com` shows a one-page site
on free **Google Sites** (a description, an About block with the legal details, the privacy policy).
The address without `www` still shows a Hostinger "parked domain" page. Mark would like to stay on
Google Sites, to keep things free and simple.

**Published on 2026-09-27** (Google Sites, owned by the Google account "Mark J",
bibleinplainsight@…; in Mark's Chrome that is `authuser=2`): Home, `/privacy-policy`, `/support`,
`/legal-notice`. The approved texts are in `pages/*.md` (the source of truth; change them there
first, then in Google Sites). `notes/privacy-facts.md` says where each privacy claim comes from and
what the app must do before release. Google Sites shows Google's own cookie banner, which cannot be
changed; the privacy policy says so honestly.

## The app, in facts

- A Christian app that takes a person from a life problem to Bible passages with context, then
  follows up and builds a personal history of how things changed. English, **Android first**,
  iOS later. Not published yet: Mark's Google Play Console account is being verified.
- **90 topics in 10 categories** (Heart & Mind, Money & Work, Relationships & Family, Loss & Grief,
  Health & Body, Guilt & Temptation, Faith & Doubt, Decisions & Future, Joy & Gratitude, and
  I Need Help Now).
- A topic **card**: an honest opening, a lament (or "Remember" on joyful topics), "What God says"
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
- It is not a medical app. In the app: "Bible in Plain Sight offers Scripture, prayer and a place to
  write. It does not replace a doctor, a therapist or emergency services. If you are in danger,
  call your local emergency number."
- Scripture: the **Berean Standard Bible (BSB)**, public domain. Wherever Scripture appears, show:
  "Scripture quotations are from the Berean Standard Bible (BSB), public domain." Never type,
  shorten or paraphrase a verse: copy it word for word from the app project's `data/bsb.txt`.

## Privacy facts (the privacy policy must match these exactly)

- No accounts, no analytics, no ads, no tracking. Everything the person writes stays on the phone.
- Journal, check-ins and stones are in a database on the phone. Deleted text is overwritten at once
  (SQLite secure delete). Android backup to Google Drive is switched off.
- Settings has "Export all data" (a file the person shares where they choose) and "Delete all data".
- Reminders are local notifications, private by default ("You have a new check-in", no topic).
- The app makes no network calls, with one planned exception: the one-time purchase, which goes
  only to Google Play. Google, not the app, handles payment details.
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
- Wherever the site talks about hard things, say where help is: "If you are in danger, call your
  local emergency number."
- Other useful documents in the app project: `docs/bible-help-app-developer-spec-EN.md` (the full
  specification), `docs/aplikacja-biblijna-koncepcja-PL.md` (Mark's original concept, in Polish),
  `docs/helpline-verification.md`.

## Start

Read this file, then the design system files above. Then, in Polish, propose a plan for the website
(pages, what each says, hosting, the domain question, how the privacy policy will be written) and
wait for Mark's decision before writing any code.
