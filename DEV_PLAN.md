# SimpleMermaid — Development Plan

**Goal:** Deliver a first-class editor experience to grow the user base, then monetize (AdSense first, possible pro tier later).

**How to use this file:** Every task is scoped to be delegated to a dev (or dev model) independently. Each includes the files involved and a definition of done. Work top-down within each phase — tasks are ordered by impact. Check items off as they land.

> ⚠️ **Before deploying this file:** add `DEV_PLAN.md` to the FTP deploy `exclude:` list (see Task 1.1) or it will be published to the live site.

---

## Phase 1 — Quick Wins (< ~2h each)

### 1.1 Reconcile the GitHub Actions workflow files 🔧
The **active** workflow on GitHub is `.github/workflows/deploy2.yml` (plural dir, on `main`) — runs are green. This branch carries a dead duplicate at `.github/workflow/deploy.yml` (singular dir, never executed by GitHub).
- Delete the dead `.github/workflow/` directory on this branch, or align it with the active `workflows/deploy2.yml` so a merge to main doesn't leave two copies.
- Add `DEV_PLAN.md` and `adsense-problem.md` to the deploy `exclude:` list.
- Update the stale note in `CLAUDE.md` (it documents the singular dir as the real one).
- **Done when:** one workflow file exists under `.github/workflows/`, a push to main deploys, and internal docs aren't published.

### 1.2 Pin the Mermaid.js CDN version 🔧
`mermaid-tool.html:39` loads `npm/mermaid/dist/mermaid.min.js` with **no version** — any breaking Mermaid release silently breaks the whole product for every user. (lz-string, jspdf, prism are already pinned.)
- Pin to the current known-good version (check what jsdelivr serves today, e.g. `mermaid@10.x`), test all 8 example categories render.
- **Done when:** version is pinned and all examples render in light + dark themes.

### 1.3 Cut ~1 MB from the landing page image 🚀
`index.html:1941` ships `geek-girl.png` (1.2 MB) while an identical `geek-girl.jpg` (289 KB) sits **unused on disk**.
- Swap the `src` to the JPG, add `loading="lazy"` (it's below the fold) and explicit `width`/`height`.
- **Done when:** landing page no longer requests the PNG; delete the PNG.

### 1.4 Shrink the 2.3 MB hero background 🚀
`simplemermaid-back.png` (2.3 MB) is a CSS `background-image` on **16 pages** (index + 15 blog heroes). This is the single biggest performance drag on the site.
- Convert to WebP (target ≤ 300 KB; `sips`/`cwebp`/Squoosh), update the CSS `url()` on all pages, keep the PNG as fallback via `image-set()` or just replace outright.
- **Done when:** no page downloads > 400 KB for the hero background.

### 1.5 Delete orphaned assets and examples 🧹
- `main-printscreen.png` (860 KB) is referenced by **no** HTML file — delete (it deploys to production today).
- Three `.mmd` files exist on disk but aren't in `examples/config.json`: `access-lifecycle.mmd`, `security-breach.mmd`, `system-secure.mmd`. Either wire them into config.json + the embedded fallback (use `/add-example` flow), or delete them.
- **Done when:** every deployed asset is referenced; examples on disk == examples in config.

### 1.6 Fix the missing autosave indicator 🐛
`mermaid-tool.html` (~line 2586–2603) calls `document.getElementById('autoSaveIndicator')` but **the element doesn't exist in the HTML** — the CSS for it does (~line 1174). Users get zero feedback that their work is saved.
- Add the `<div id="autoSaveIndicator">` element, verify it flashes "Saved" on the debounced save.
- **Done when:** typing then pausing shows a visible save confirmation.

### 1.7 Handle localStorage quota errors visibly 🐛
Save failures (~lines 2586–2603, 3099–3160) are caught and only logged to console — a user with a full quota **silently loses work**.
- Catch `QuotaExceededError`, show a visible warning in the status area, offer to clear old history entries (history keeps 20).
- **Done when:** filling the quota produces a user-visible warning, not silence.

### 1.8 Fix modal/copy-button event leaks 🐛
- Modal overlay `click` handlers are added on open but never removed on close (`mermaid-tool.html` ~2760–2950, share/save/saved-diagrams modals) — they stack up over a session.
- `copyCode()` (~2131–2145) sets a reset timeout without clearing the previous one — rapid clicks leave the button stuck.
- **Done when:** opening/closing a modal 10× adds no duplicate listeners; copy button always recovers.

### 1.9 Baseline accessibility pass ♿
- Add `aria-label` to the hamburger button, theme toggle, and the editor toolbar buttons that only have `title` (`mermaid-tool.html` ~1218–1230; `index.html` ~1670–1671).
- Add `role="status" aria-live="polite"` to the render status element (`mermaid-tool.html` ~1334) so screen readers hear "Rendered"/"Error".
- Add a "Skip to content" link on content pages.
- **Done when:** keyboard/screen-reader users can operate nav, theme, and hear render status.

### 1.10 Refresh sitemap + minor SEO gaps 🔍
- All `<lastmod>` values in `sitemap.xml` are ≤ 2026-03-25; files were modified 2026-05-06. Update them.
- `changelog.html` is the only content page without schema.org JSON-LD — add `WebPage` structured data.
- **Done when:** sitemap dates match reality; every content page has structured data.

### 1.11 Add social/community links 🔍
Footer "Connect" column links only to partner projects and BMC — no GitHub, no X/Twitter. Users have nowhere to follow updates or report issues.
- Add GitHub + X links to the footer across all pages (respecting per-directory path depth).
- **Done when:** every footer has working social links.

### 1.12 Clean console output 🧹
Verbose `console.log` calls (with emojis) throughout `mermaid-tool.html` (~1564, 1651, 1704, 2037…) look unprofessional to the exact dev audience this tool targets.
- Gate behind a `DEBUG` flag; keep `console.error` for real failures.
- **Done when:** normal usage produces a clean console.

---

## Phase 2 — Medium Enhancements (0.5–2 days each)

### 2.1 Cookie consent banner (compliance prerequisite) ⚖️
GA (`gtag`, sets `_ga` cookies) fires on every page with **no consent banner** — a GDPR problem today, and a hard blocker for AdSense in the EU. `privacy.html` even claims "no cookies beyond theme preference", which is currently untrue.
- Add a lightweight consent banner (Consent Mode v2 compatible) that defers gtag/AdSense until opt-in; update `privacy.html` to match reality.
- **Done when:** no tracking cookies before consent; privacy page is accurate.
- **Must ship before 2.2.**

### 2.2 First AdSense placements 💰
AdSense account is declared on every page (`ca-pub-8641410034592329`, Ads.txt in place) but there are **zero `adsbygoogle` units anywhere** — revenue is structurally $0.
- Add the AdSense loader + 1–2 tasteful ad units to *content* pages only (blog articles, guides, FAQ, `for/` pages). Keep the editor ad-free — it's the product.
- **Done when:** ads render on content pages after consent, editor stays clean.

### 2.3 Undo/redo in the editor ✍️
The Prism-highlighted contenteditable repaints `innerHTML` on input, which destroys native browser undo. This is the most-expected missing editor feature.
- Implement an undo/redo stack (~50 entries, coalesce keystrokes), bind Ctrl/Cmd+Z / Shift+Z, add toolbar buttons.
- **Done when:** undo works reliably through typing, paste, and example loads.

### 2.4 Fix cursor jump while typing ✍️
Same root cause as 2.3: innerHTML repaint + fragile TreeWalker cursor restoration (`mermaid-tool.html` ~1426–1461) makes the cursor jump on complex diagrams — the single worst papercut in the core loop.
- Harden cursor save/restore, or move to textarea + syntax-highlight overlay (evaluate with 2.3 since they touch the same code).
- **Done when:** cursor never jumps during fast typing on a 200-line diagram.

### 2.5 Line numbers + error line highlighting ✍️
Mermaid errors report line numbers but `formatErrorMessage` (~2058–2083) strips them, and the editor has no gutter — users manually count lines.
- Add a line-number gutter synced to editor scroll; parse line/col out of Mermaid errors and highlight the offending line.
- **Done when:** a syntax error visibly points at its line.

### 2.6 Preview pan + drag 🖱️
Zoom exists (~2329–2331) but there's no way to pan a zoomed diagram with the mouse.
- Add drag-to-pan on the preview pane when zoomed; cursor feedback (`grab`/`grabbing`).
- **Done when:** large diagrams are navigable at 200% zoom.

### 2.7 Mobile editor mode 📱
Below ~600px the 50/50 split leaves both panes unusable — mobile visitors effectively can't use the product.
- Single-pane mode on small screens with an Editor ⇄ Preview toggle (tab bar or swipe).
- **Done when:** a diagram can be comfortably written and previewed on a 375px viewport.

### 2.8 Render pipeline hardening 🐛
- Race condition: `renderDiagram` (~1976–2057) has no in-flight lock — fast typing can produce stale/glitched output. Add a render token/lock, drop stale results.
- Share-link length: warn when the compressed URL (~2722–2742) exceeds ~2,000 chars (breaks in some chats/browsers).
- Validate before share: block sharing a diagram that currently fails to render.
- **Done when:** hammering the keyboard never shows a stale diagram; oversized/broken shares warn the user.

### 2.9 Harden SVG sanitization 🔒
Current sanitizer (~1858–1869) only strips `<script>`, `javascript:`, and `on*=` — misses vectors like `<use href>` payloads. Matters for shared-link trust ("click this diagram link" must be safe).
- Add DOMPurify (pinned CDN + SRI) over rendered SVG output.
- **Done when:** known SVG XSS vectors in diagram source do not execute from a shared URL.

### 2.10 Blog → editor deep links 🔍
Zero blog articles link to `mermaid-tool.html?example=…` (the landing page uses this pattern 5+ times). Readers finish a tutorial with no path into the product.
- Add 1–2 "Open this in the editor" links per article, using `?example=` for existing examples or LZ-String `#diagram=` links for article-specific code.
- **Done when:** all 12 articles funnel into the editor.

### 2.11 Feature usage analytics 📊
Only page views are tracked — no data on what users actually do, which makes every future prioritization a guess.
- `gtag` events for: example loaded (which), export (format), share created, save, tab created, theme toggled.
- **Done when:** GA shows feature-level usage within a day of deploy.

### 2.12 Expand `/for/` programmatic SEO pages 🔍
`for/security-threat-modeling.html` is a working proof-of-concept; it's the only one. Each page targets a high-intent keyword cluster.
- Build 3–5 more using the same structure: `for/api-documentation.html`, `for/database-schemas.html`, `for/devops-pipelines.html`, `for/microservices-architecture.html`. Reuse existing example diagrams per topic. Add to sitemap, robots.txt, footers.
- **Done when:** each page renders ~5 diagrams with "Open in editor" deep links and is in the sitemap.

### 2.13 Export upgrades 📤
PNG/PDF export is hardcoded at 2× (~2169–2319); no markdown embed helper.
- Add export scale option (1×–4×) and a "Copy as Markdown" button (wraps source in ` ```mermaid ` fences).
- **Done when:** users can export print-quality PNGs and paste diagrams straight into READMEs.

### 2.14 CI quality gates 🔧
Pipeline is gitleaks + FTPS only — nothing prevents deploying broken HTML or a performance regression.
- Add to the active workflow: `html-validate`, a link checker (e.g. lychee), and Lighthouse CI with budgets (perf ≥ 85, LCP < 2.5s, CLS < 0.1).
- **Done when:** a PR with a broken link or a 2 MB image fails CI.

### 2.15 Modal focus traps + keyboard help ♿
- Trap Tab focus inside open modals; restore focus on close (all modals, ~2750+).
- Surface the existing shortcuts (Ctrl+T/W/Tab/Enter/K…) in a `?`-triggered shortcuts modal — they're currently buried in the info drawer.
- **Done when:** modals are keyboard-clean and shortcuts are discoverable.

---

## Phase 3 — Large Enhancements (multi-day / strategic)

### 3.1 Shared assets extraction 🏗️
~500–600 lines of nav/footer/theme CSS+JS are copy-pasted into each of ~20 pages (~200 KB duplication, and every nav change is a 20-file edit — the biggest tax on all other work in this plan).
- Extract shared CSS to one stylesheet and shared JS (theme, nav, consent) to one script; either accept the extra HTTP request (it caches) or add a tiny build step that inlines partials. Keep the no-framework philosophy.
- **Done when:** a footer link change is a one-file edit.

### 3.2 PWA + offline 📶
No manifest, no service worker, no apple-touch-icon — yet the editor is fully client-side and *could* be a first-class offline/installable tool. Strong differentiator for the dev audience.
- Add `manifest.json`, icons, and a service worker caching the editor shell + pinned CDN libs. Show an "offline-ready" badge.
- **Done when:** the editor loads and renders with network disabled; installable on mobile/desktop.

### 3.3 Editor settings panel ⚙️
Font size, render debounce, default export format, line-number toggle, and Mermaid config (theme, flowchart spacing/direction — currently hardcoded ~1590–1618) in one persisted settings modal.
- **Done when:** settings persist in localStorage and apply live.

### 3.4 Diagram management: history UI + Save As 🗂️
A 20-entry history is already being saved (~3114–3122) but has **no UI**; there's no way to duplicate a saved diagram.
- Add a "Recent" view alongside Saved Diagrams, plus Save As (duplicate under new name). Consider export/import of all saved diagrams as JSON (backup story).
- **Done when:** users can browse history, restore, and duplicate diagrams.

### 3.5 Crash recovery & error telemetry 🛡️
A JS error currently leaves the app stuck; render errors are only in the console.
- Global error boundary with "Reload / Restore last backup" UI; report render errors (diagram type, length, browser) via GA events or Sentry.
- **Done when:** an induced JS error offers recovery instead of a dead page, and error patterns are measurable.

### 3.6 Import integrations 🔗
"Load from GitHub Gist / URL / file" — meets docs-as-code users where their diagrams already live (mermaid.live parity).
- **Done when:** a gist ID or raw URL loads into a new tab.

### 3.7 Pro-tier groundwork (monetization beyond ads) 💰
Once 2.11 (analytics) shows what power users do, evaluate a paid tier. Candidate gates: cloud sync of saved diagrams, real-time collaboration, 4× exports without watermark, team/shared workspaces, private gallery. Requires the first backend component — decide deliberately (this abandons the "no backend" story, so it must earn it).
- **Done when:** a written decision doc exists with usage data backing the chosen gate(s).

---

## Suggested sequencing

1. **Week 1:** All of Phase 1 (each task is independent — highly parallelizable across dev models).
2. **Week 2–3:** 2.1 → 2.2 (compliance then revenue), 2.3 + 2.4 together (same code), 2.7 (mobile), 2.10–2.11 (funnel + measurement).
3. **Week 4+:** Remaining Phase 2 by taste, then 3.1 (pay down duplication before adding more pages), then the rest of Phase 3 guided by analytics from 2.11.

## Verified facts behind this plan (2026-07-07 audit)

- Deploys are **working** — active workflow is `.github/workflows/deploy2.yml` on main (last green run 2026-05-06); the singular `workflow/` dir on this branch is dead.
- AdSense: account meta + Ads.txt present on all pages; **0** ad units exist.
- Mermaid CDN is unpinned; lz-string/jspdf/prism are pinned; no SRI anywhere.
- `geek-girl.jpg` (289 KB) exists unused next to the shipped 1.2 MB PNG; `main-printscreen.png` (860 KB) is unreferenced.
- `simplemermaid-back.png` (2.3 MB) loads on 16 pages.
- No cookie consent mechanism exists; GA fires unconditionally.
- 3 `.mmd` files on disk are absent from `examples/config.json`.
