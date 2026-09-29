# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

(The website www.bibleinplainsight.com. The product it presents is an Android app, built in a
separate project; the website never changes it.)

## Users

Primary visitor (confirmed by the owner, 2026-09-29): **a person going through something hard**,
looking for help for themselves: anxiety, grief, money worries, guilt, doubt, conflict. They arrive
from Google Play or a search, often on a phone, sometimes on a bad day. They want to know quickly
whether this app can help them, whether it is safe and private, and whether it costs anything.

The privacy policy, support and legal pages are also read by people checking privacy before they
install, and by Google when the app is published. These are secondary.

## Product Purpose

The website exists to:

1. Show what the app is and how it helps, and link to Google Play once the app is published
   (until then the button reads "Coming soon to Google Play").
2. Host the privacy policy at a public address, as Google Play requires. It must match what the
   app really does, nothing more and nothing less.
3. Give support and contact details (support@bibleinplainsight.com) and the French legal notice.

Success: a person in a hard moment understands within seconds what the app offers, trusts it, can
find help right away if they are in danger, and knows where to get the app.

## Positioning

- It takes a person from a real-life problem to Bible passages **with their context**, and every
  passage opens the whole chapter, so no verse is read out of context.
- It follows up: a journal, check-ins a few days later ("How is it now?"), a Timeline, and Stones of
  Remembrance, so a person builds a record of how God met them.
- **Nobody in pain should meet a price:** all crisis and sensitive topics are free forever.
- Nothing leaves the phone: no account, no ads, no analytics, no tracking; what you write is
  encrypted on the phone.

## Operating Context

- Visitors mostly read on phones (Android first). The owner checks the site in a desktop browser
  and on his Android phone.
- Hard topics appear on the site, so help must always be easy to find: "If you or someone else is
  in immediate danger, call the local emergency number."
- Hosting: GitHub Pages from the `docs/` folder, custom domain, static files only.

## Capabilities and Constraints

- The app: 90 topics in 10 categories; topic cards (honest opening, lament or "Remember", What God
  says, a story from Scripture, one practical step, a prayer, a verse to keep); "For someone I
  love"; verse images to share; Journal with "How heavy does it feel?"; check-ins; Timeline; Stones
  of Remembrance; crisis help with helplines for 7 countries and Find A Helpline elsewhere; Quick
  exit on abuse topics.
- Free and paid: free to download; 18 topics free forever; one purchase (about 5 USD, no
  subscription) unlocks the other 72; every feature is free.
- Not a medical app. The approved About text (expert review G03) is in `CLAUDE.md`.
- Scripture: Berean Standard Bible (BSB), public domain, copied word for word from the app's
  `data/bsb.txt`; the attribution line appears wherever Scripture appears.
- The website keeps the app's promise: no cookies, no analytics, no third-party scripts or
  requests; fonts are hosted with the site.
- Stack: static HTML and CSS with one small script of our own; `node tools/build.js` builds the
  text pages from `pages/*.md` and versions every asset link. No framework, few dependencies.
- The app is not on Google Play yet (the developer account is being verified).
- Undecided: a topics page, a "How it works" page, a page for pastors and churches.

## Brand Commitments

- Name: "Bible in Plain Sight" everywhere. The owner's personal name stays out of the branding; it
  appears only on the legal notice and in the privacy policy's "who we are".
- Voice: US English, simple and warm. No em dashes. No medical claims, no promises that everything
  will be fine, nothing that suggests praying instead of getting help.
- For **all Christians** (confirmed 2026-09-29): Scripture and prayer only, nothing that belongs to
  one church or divides churches.
- The app's design system, "Linen & Sage" with the dawn cross illustration, is binding for the site
  (details in `CLAUDE.md` and the app project's design handoff).
- The gallery never shows the crisis screen, and never shows "Listen" or "Save" (the app has no
  such buttons).

## Evidence on Hand

- The app's final icon (`docs/assets/img/icon-*.png`, from the app's `docs/store/play-icon-512.png`)
  and the dawn cross illustration (`docs/assets/img/welcome-cross.jpg`).
- Nine app screens drawn from the app's code with approved content (`docs/screens/`); real phone
  screenshots may replace them.
- Approved texts: `pages/privacy-policy.md`, `pages/support.md`, `pages/legal-notice.md`; the
  sources of each privacy claim in `notes/privacy-facts.md`.
- **No reviews, testimonials, download counts, ratings, press or endorsements exist.** The app is
  unpublished. Never invent any.

## Product Principles

1. Nobody in pain should meet a price, a rating request or a sales pitch.
2. Help comes first: the way to real help is never more than one step away.
3. Scripture in context, word for word, never shortened or paraphrased.
4. The site keeps the app's privacy promise: nothing about a visitor leaves their device for us or
   for anyone else.
5. Calm, honest and printed-looking, never flashy, never manipulative.

## Accessibility & Inclusion

Standard WCAG 2.2 AA (confirmed 2026-09-29). "Reduce motion" turns off all movement.
