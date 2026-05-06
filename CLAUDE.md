# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimpleMermaid.com is a multi-page web application for creating and editing Mermaid.js diagrams with instant shareable links. The site includes a landing page, diagram editor, blog (12 articles), learning resources, guides, FAQ, and legal pages. All pages are self-contained HTML with inline CSS/JS (no build step, no framework).

## Architecture

### Multi-Page Structure
- `index.html` - Landing page with marketing content, features, template grid, feedback form
- `mermaid-tool.html` - **Main editor application** (~3400 lines) with live preview, sharing, tabs, export
- `learn-mermaid.html` - Tutorial/documentation for Mermaid syntax
- `changelog.html` - Version history and development roadmap
- `about.html` - Story, mission, comparisons, values, technical philosophy
- `faq.html` - 16 Q&As in accordion UI with FAQPage schema.org
- `blog/index.html` - Blog listing page (12 article cards)
- `blog/*.html` - 12 individual blog articles
- `guides/diagram-gallery.html`, `guides/best-practices.html`, `guides/use-cases.html` - Resource guides
- `privacy.html`, `terms.html` - Legal pages
- `Ads.txt` - AdSense ownership declaration (deployed to site root)
- `old/` - Legacy files retained for reference; not deployed and not edited as part of normal work

### Editor Application (`mermaid-tool.html`)
Single-file application containing all CSS, HTML, and JS:
- CSS custom properties for theming (`:root` and `[data-theme="dark"]`)
- SVG-specific dark theme overrides for Mermaid diagrams
- Info drawer with SEO content (slide-up panel triggered by header info button)
- `SimpleMermaid` class - Main application controller (search for `class SimpleMermaid`)
- Embedded fallback examples JSON for file:// protocol support (search for `embeddedExamples`)
- Mermaid.js, LZ-String, jsPDF loaded via CDN

### Key Technical Patterns
- **URL-based sharing**: LZ-String compression stores diagrams in URL hash (`#diagram=`). Entire diagram is self-contained in the URL.
- **Dual-mode examples**: Fetch API loads from `examples/config.json` + `.mmd` files over HTTP; embedded JSON fallback for file:// protocol.
- **Theme system**: Light/dark via `data-theme` attribute on `<html>`. CSS variables cascade. Theme stored in `localStorage` key `simplemermaid-theme`.
- **Tabbed editor**: Per-tab state (zoom, cursor, scroll) persisted to localStorage.
- **All pages share**: Early theme detection script in `<head>` (prevents flash), Google Analytics (G-6FZM0EGT74), AdSense meta tag (`ca-pub-8641410034592329`), cyberpunk-styled footer, hamburger mobile nav.

### Navigation Pattern (all pages)
Desktop: Home | Learn | Blog | Editor | [BMC icon] | [theme toggle] | Start Creating CTA
Mobile: Hamburger menu with same links
- Root-level pages: `blog/index.html`, `guides/*.html` paths
- `blog/` pages: `../index.html`, `../learn-mermaid.html`, `index.html` (self), `../mermaid-tool.html`
- `guides/` pages: `../index.html`, `../blog/index.html`, `../mermaid-tool.html`

### Footer Pattern (all pages with footers)
3-column cyberpunk footer: Product, Resources (Blog, Diagram Gallery, Best Practices, Use Cases, FAQ), Company (About, FAQ, Changelog, Privacy, Terms). Link paths adjusted per directory depth.

## Development Commands

### Local Development Server
```bash
python -m http.server 8000
# or
npx serve .
# Then open http://localhost:8000
```

### Direct File Access
Open `mermaid-tool.html` directly in browser - uses embedded examples as fallback.

### Testing Changes
- Editor: Navigate to `mermaid-tool.html`, test example loading from `examples/` directory
- Sharing: Verify `#diagram=` parameter compression/decompression works
- Themes: Test light/dark theme switching on all pages and on rendered diagrams
- Responsive: Check mobile layouts in browser dev tools (nav collapses at 1030px on pages with BMC icon)
- Export: Test PNG/SVG/PDF export functionality
- Navigation: Verify all nav/footer links work across root, `blog/`, and `guides/` subdirectories

### Deployment
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflow/deploy.yml` — note singular "workflow", not "workflows")
- **Security**: Gitleaks scan runs on all pushes and PRs
- **Deployment**: Automatic FTPS deployment to production on main branch pushes
- **Branch Strategy**: Deploy only from `main` branch; `zoom` is current working branch
- **Excluded Files** (per `deploy.yml`): `.git*`, `.github/**`, `node_modules/**`, `.gitleaks.toml`, `CLAUDE.md`, `README.md`, `.claude/**`, `.vscode/**`, `.gitignore`. The deploy action also writes `.ftp-deploy-sync-state.json` for incremental sync — do not commit it.

## Key Implementation Details (mermaid-tool.html)

### SimpleMermaid Class
Core application class (search `class SimpleMermaid`) managing:
- Editor state, tab system, and diagram rendering
- Example loading from config.json with embedded fallback (search `embeddedExamples`)
- URL sharing with LZ-String compression
- Export to PNG/SVG/PDF
- Theme and layout toggling

### Key Methods
- `generateShareLink()` - Creates compressed URL with diagram content
- `updateUrlWithDiagram()` - Auto-updates URL with 2-second debounce
- `loadFromUrl()` - Decompresses and loads diagram from URL hash

### Info Drawer
SEO content lives in a slide-up drawer (`info-drawer` class) below `</main>`. Triggered by the info button (`#infoBtn`) in the header. Opens/closes via overlay + Escape key. Content is in the DOM for crawlers but doesn't affect editor layout.

## Adding New Examples

1. Create `.mmd` file in `examples/` directory
2. Add entry to `examples/config.json` under appropriate category with `id`, `title`, and `file` fields
3. Update embedded fallback examples in `mermaid-tool.html` (search for `embeddedExamples`). The structure mirrors `config.json` — same `categories` → `examples` shape — but each example has a `content` string (literal `\n` for newlines, not a `file` reference) so the editor works on the file:// protocol.
4. Test both HTTP server mode and file:// mode

`examples/config.json` defines 8 categories (`community`, `basic`, `sequence`, `project`, `architecture`, `devops`, `data`, `security`) totaling 61 examples. Use the `/add-example` slash command to automate this process — note its argument hint currently lists only 5 categories but all 8 are valid targets.

## Adding New Pages

Use `about.html` as template for new subpages (nav, CSS vars, footer, theme JS). For blog articles, use any existing `blog/*.html`. For guides, use `guides/best-practices.html`.

Checklist for new pages:
1. Set a unique `<title>` and `<meta name="description">` (every existing page has both — they drive search snippets)
2. Include `<meta name="google-adsense-account" content="ca-pub-8641410034592329">`
3. Include Google Analytics gtag.js
4. Include early theme detection script in `<head>`
5. Add Blog nav link + BMC icon in desktop/mobile nav (adjust paths for subdirectory)
6. Add page to footer on all existing pages (adjust paths)
7. Add URL to `sitemap.xml`
8. Add `Allow:` rule to `robots.txt` if in a new directory

## Claude Code Tooling (`.claude/`)

### Custom Slash Commands
- `/add-example <category> <name>` - Automates creating .mmd file, updating config.json, and updating embedded fallback in mermaid-tool.html
- `/test-share [diagram-content]` - Generates browser console script to test LZ-String compression round-trip

### Custom Agent
- `js-senior-dev` - Senior JS developer agent for code reviews, architecture decisions, and lean UX guidance

## External Dependencies
- Mermaid.js: `cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`
- LZ-String v1.5.0: `cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js`
- jsPDF v2.5.1: `cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js`
- Google Fonts: Inter and Poppins
- Google Analytics: gtag.js (G-6FZM0EGT74)
- Google AdSense: ca-pub-8641410034592329
