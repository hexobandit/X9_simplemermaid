# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimpleMermaid.com is a multi-page web application for creating and editing Mermaid.js diagrams with instant shareable links. The site includes a landing page, diagram editor tool, learning resources, and legal pages.

## Architecture

### Multi-Page Structure
- `index.html` - Landing page with marketing content, features, and feedback form
- `mermaid-tool.html` - **Main editor application** with live preview, sharing, and export
- `learn-mermaid.html` - Tutorial/documentation for Mermaid syntax
- `changelog.html` - Changelog page
- `about.html`, `privacy.html`, `terms.html` - Supporting pages

### Editor Application (`mermaid-tool.html`)
The editor is a single-file application (~2900 lines) containing all CSS, HTML, and JS:
- CSS custom properties for theming (`:root` at line 46, `[data-theme="dark"]` at line 68)
- SVG-specific dark theme overrides for Mermaid diagrams (line 641+)
- `SimpleMermaid` class (line 1109) - Main application controller
- Mermaid.js loaded via CDN
- LZ-String compression for URL sharing
- jsPDF for PDF export

### Key Technical Features
- **URL-based diagram sharing**: LZ-String compression stores diagrams in URL hash (`#diagram=`)
- **Dual-mode example loading**: Fetch API for external files, embedded fallback for file:// protocol
- **Real-time rendering**: Live preview with debounced updates
- **Theme system**: Light/dark themes via `data-theme` attribute
- **Layout modes**: Vertical/horizontal editor layouts with resizable separator
- **Export**: PNG, SVG, and PDF export

## Development Commands

### Local Development Server
```bash
# Using Python (recommended for external example files)
python -m http.server 8000

# Using Node.js
npx serve .

# Then open http://localhost:8000
```

### Direct File Access
Open `index.html` or `mermaid-tool.html` directly in browser - uses embedded examples as fallback.

### Testing Changes
- Editor: Navigate to `mermaid-tool.html`, test example loading from `examples/` directory
- Sharing: Verify `#diagram=` parameter compression/decompression works
- Themes: Test light/dark theme switching on diagrams
- Responsive: Check mobile layouts in browser dev tools
- Export: Test PNG/SVG/PDF export functionality

### Deployment
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflow/deploy.yml`)
- **Security**: Gitleaks scan runs on all pushes and PRs
- **Deployment**: Automatic FTPS deployment to production on main branch pushes
- **Branch Strategy**: Deploy only from `main` branch; `zoom` is current working branch
- **Excluded Files**: .git*, .github/, node_modules/, CLAUDE.md, README.md, .claude/, .vscode/

## Key Implementation Details (mermaid-tool.html)

### SimpleMermaid Class (line 1109)
Core application class managing:
- Editor state and diagram rendering
- Example loading from config.json with embedded fallback (`embeddedExamples` at line 1149)
- URL sharing with LZ-String compression
- Export to PNG/SVG/PDF
- Theme and layout toggling

### Sharing System
- `generateShareLink()` (line 2355) - Creates compressed URL with diagram content
- `updateUrlWithDiagram()` (line 2827) - Auto-updates URL with 2-second debounce
- `loadFromUrl()` (line 2763) - Decompresses and loads diagram from URL hash

### Example Loading
- Config loaded from `examples/config.json`
- Files fetched from `examples/*.mmd` (45 example files)
- Embedded fallback examples in class for offline/file:// use

### Theme System
- CSS variables in `:root` (line 46)
- Dark theme overrides at `[data-theme="dark"]` (line 68)
- SVG-specific styling for Mermaid diagrams (line 641+)

## Adding New Examples

1. Create `.mmd` file in `examples/` directory
2. Add entry to `examples/config.json` under appropriate category with `id`, `title`, and `file` fields
3. Update embedded fallback examples in `mermaid-tool.html` (search for `embeddedExamples`)
4. Test both HTTP server mode and file:// mode

**Available Categories** (in `config.json`):
- `community`: Community-submitted diagrams
- `basic`: Empty, Simple, Flowchart, Shapes, Subgraphs
- `sequence`: Basic Sequence, OAuth Flow, JWT Auth, Payment, WebSocket, Microservices
- `project`: Gantt Chart, User Journey, Sprint Planning, Release Schedule, Product Roadmap, Onboarding
- `architecture`: Class, State, ERD, Network, Org Chart, Microservices, Event-Driven, Three-Tier, Serverless
- `security`: RBAC, Kubernetes threats, Web app threats, CubeSat, DevSecOps, Zero Trust, API Threats, Data Breach, Supply Chain, Incident Response

## External Dependencies
- Mermaid.js: `cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`
- LZ-String v1.5.0: `cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js`
- jsPDF v2.5.1: `cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js`
- Google Fonts: Inter and Poppins
- Google Analytics: gtag.js (G-6FZM0EGT74)
