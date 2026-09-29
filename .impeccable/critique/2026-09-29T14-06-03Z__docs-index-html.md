---
target: the whole website (home page first)
total_score: 27
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 2
target_identity: "file:L:\\Bible in Plain Sight\\Projects\\bible-in-plain-sight-website\\docs\\index.html"
target_fingerprint: "sha256:3519dce2896edb8f05696a7306d74e4a03a2003a36c0cc87b3d5d548cd8f5e74"
target_path: "L:\\Bible in Plain Sight\\Projects\\bible-in-plain-sight-website\\docs\\index.html"
timestamp: 2026-09-29T14-06-03Z
slug: docs-index-html
closed: true
---
Method: dual-agent (A: design review, B: detector + browser). Audit run in the parent the same day (12/20).

## Design Health Score (27/36, 75%, Good; #7 n/a: single-purpose landing page)
| # | Heuristic | Score | Key issue |
|1| Visibility of system status | 3 | "Coming soon" drawn as a live primary button; hero actions fade in last |
|2| Match with real world | 4 | Plain, warm copy in the app's own words |
|3| User control and freedom | 3 | "Need help now?" = ~6,000 px smooth scroll; 404 home link loops on nested URLs |
|4| Consistency and standards | 3 | Inert element styled as primary; help block decorated despite "plain on purpose"; 3 names for help; mixed quotes |
|5| Error prevention | 3 | Dead "Coming soon" tap; sideways overflow at 360 px |
|6| Recognition rather than recall | 3 | No help entry in the mobile header; carousel has no position cue |
|7| Flexibility and efficiency | n/a | Landing page |
|8| Aesthetic and minimalist design | 3 | Cohesive; long; gallery and feature pair repeat; 5+ ambient motions at once |
|9| Error recovery | 2 | 404 unstyled on /privacy-policy/ (live) and its home link loops |
|10| Help and documentation | 3 | Good FAQ; questions not headings/anchors; price never stated |

## Design specificity
Specific skin (dawn arch, linen and sage, Literata/Atkinson, clay overlines, BSB treatment, app phrases, drawn app screens), template skeleton (overline + centered H2 on every section, 4 step cards, device gallery, feature pair, dark promise band, stat row, hover-lift tiles, drifting blobs, CTA sheen). Detector: kicker-above-heading x5 on index (browser), icon-tile-stack x2, thin-border-wide-shadow x2 (.free, .verse-card), radial-spotlight on .promise, dark-glow on .wordmark-hero (true); dark-glow on text pages, cramped-padding, flat-type-hierarchy, aphoristic-cadence, clipped-overflow (false positives). Screens replicas: kicker/cream matches are intended (app tokens).

## Priority issues
- [P1] Help is not on the first screen and appears last: hero actions at y=912 (375x812) / y=957 (1366x800); no help in the mobile header; .hero .actions delay 0.75 s; #help is a .tile that fades in. Fix: persistent Help link in header.top nav on every page and width; no delay on .actions; .help without .tile, no heartbeat. (layout)
- [P1] Page wider than the phone: .hero::before (220vw) widens the layout viewport to ~580 px at 375 (body overflow-x:clip propagates to the viewport); header needs 392 px, so at 360 "Support" is clipped on home and text pages scroll sideways (WCAG 1.4.10 at 320). Fix: html{overflow-x:clip} or clip inside .hero; compact header at <=420 px. (adapt)
- [P2] "Coming soon to Google Play" looks like the main action but does nothing (solid primary, hover lift, sheen). Fix: quiet status style until the real link exists. (quieter)
- [P2] Focus ring #2D5A43 on #0e3325 (footer, .promise) = 1.75:1 (WCAG 1.4.11 needs 3:1). Fix: mint outline there. (polish)
- [P2] 404.html relative links: /privacy-policy/ renders unstyled on the live site, "Go to the home page" loops. Fix: root-absolute links in 404. (harden)

## Persona red flags
Jordan: name twice + picture on first screen; "Android" not visible; dead "Coming soon"; price never stated; three names for help. Riley: overflow at 360/320/200%; layout viewport 580-621 px; unstyled 404 on trailing slash; invisible focus on dark green; accessible name "Need helpnow?"; nine iframes expose a mock app to screen readers. Casey: ~870 KB TTF fonts (no WOFF2/subset), screens/fonts.css without font-display; help below the fold and fades in; 38 px header targets; carousel without position cue. Ana (grieving, 1 a.m., dark mode): brightest hero element is the inert Play button; help chip faint; grief free only learned at y~6000; heartbeat and sheen not calm; page ends on disclaimers.

## Minor observations
index.html:65 "Need help<br>now?" name; index.html:80 lone closing quote for screen readers; index.html:74 inline style; iframes should be aria-hidden with role=img on .phone; home.css:593 heartbeat on help icon; site.css:284 dark grain 0.08 too strong; no prefers-reduced-transparency for .verse-card; support FAQ questions are <p>; straight/curly quote mix on Support; Timeline/Stones/For someone shown twice; Matthew 11:28 twice; hard-coded #b8f2c9/#0e3325/#0f2a20 instead of tokens; LCP arch image is a CSS background without preload; fixed full-screen multiply grain overlay on every scroll frame; grain.png 1024 px wide for a 256 px tile.

## Questions
Does the hero need a primary button before a real Play link exists? Would one real lament line earn more trust than nine phones? Should a grieving reader's last words be the disclaimer?
