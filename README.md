# SimpleMermaid.com

The easiest way to create and share Mermaid.js diagrams. A fast, distraction-free online editor with real-time preview, instant URL sharing, and export to PNG/SVG/PDF.

**Live Site**: [simplemermaid.com](https://simplemermaid.com)

## Features

- **No Setup Required** - Open and start diagramming. No account, no login, no backend
- **Live Preview** - Diagrams update as you type with real-time syntax validation
- **Instant Sharing** - Generate a shareable URL containing the full diagram (LZ-String compressed)
- **Export** - PNG, SVG, and PDF export for presentations and documentation
- **61 Example Templates** - Organized across 8 categories
- **Tabbed Editor** - Work on multiple diagrams simultaneously with per-tab state
- **Dark Mode** - Light and dark themes for comfortable extended use
- **Responsive** - Works on desktop, tablet, and mobile
- **Privacy First** - Diagrams never leave your browser. No server-side processing

## Supported Diagram Types

- **Flowcharts** - Decision trees, process flows, system workflows
- **Sequence Diagrams** - API flows, OAuth, JWT, WebSocket, GraphQL, gRPC
- **Gantt Charts** - Sprint planning, release schedules, product roadmaps
- **Class Diagrams** - UML, object relationships
- **State Diagrams** - State machines and transitions
- **Entity Relationship** - Database schemas and data models
- **User Journey** - Experience mapping and onboarding flows
- **Pie Charts** - Data distribution visualization

## Example Categories

| Category | Examples | Highlights |
|----------|----------|------------|
| Community Showcase | 8 | Humorous developer life diagrams, Git branching strategies |
| Basic Diagrams | 5 | Flowcharts, shapes, subgraphs |
| Sequence Diagrams | 8 | OAuth, JWT, payments, GraphQL subscriptions, gRPC streaming |
| Project Management | 8 | Gantt charts, user journeys, RACI matrix, risk assessment |
| System Architecture | 12 | Microservices, event-driven, serverless, cloud migration, service mesh |
| DevOps & CI/CD | 4 | Docker orchestration, Terraform, GitOps, monitoring & alerting |
| Data Engineering | 3 | ETL pipelines, streaming architecture, data lineage |
| Security & Threat Models | 13 | RBAC, zero trust, OAuth 2.0 PKCE, mTLS, SOC2 compliance |

## Site Structure

```
simplemermaid.com/
├── index.html              # Landing page
├── mermaid-tool.html       # Main editor application
├── learn-mermaid.html      # Mermaid.js tutorials and syntax guide
├── about.html              # About page with mission, comparisons, values
├── changelog.html          # Version history and development roadmap
├── faq.html                # FAQ with accordion UI (16 Q&As)
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── blog/                   # Blog section (12 articles)
│   ├── index.html          # Blog listing page
│   ├── how-to-create-architecture-diagrams.html
│   ├── flowchart-best-practices.html
│   ├── sequence-diagram-tutorial-microservices.html
│   ├── mermaid-vs-drawio.html
│   ├── 5-diagram-types-every-developer-should-know.html
│   ├── using-diagrams-for-documentation.html
│   ├── entity-relationship-diagrams-explained.html
│   ├── gantt-charts-project-management.html
│   ├── state-diagrams-ui-design.html
│   ├── how-to-document-apis-with-diagrams.html
│   ├── mermaid-js-beginners-guide.html
│   └── diagrams-as-code-workflow.html
├── guides/                 # Resource guides
│   ├── diagram-gallery.html
│   ├── best-practices.html
│   └── use-cases.html
├── examples/               # Diagram templates (61 .mmd files)
│   ├── config.json         # Category configuration
│   └── *.mmd              # Individual diagram files
├── sitemap.xml
├── robots.txt
└── favicon.png
```

## Local Development

**HTTP Server** (recommended for external example files):
```bash
python -m http.server 8000
# or
npx serve .
```

**Direct File Access**: Open `mermaid-tool.html` directly in a browser. Uses embedded fallback examples automatically.

## Tech Stack

- **Mermaid.js** - Diagram rendering engine (CDN)
- **LZ-String** - URL compression for sharing (CDN)
- **jsPDF** - PDF export (CDN)
- **Vanilla JS** - No frameworks, no build step
- **CSS Custom Properties** - Theming via `data-theme` attribute
- **Google Analytics** - Usage tracking
- **GitHub Actions** - CI/CD with FTPS deployment

## Architecture

- **No Backend** - Everything runs client-side in the browser
- **URL Sharing** - Diagram content compressed into URL hash with LZ-String
- **Theme System** - CSS custom properties with `data-theme="light|dark"`
- **Dual-Mode Examples** - Fetch API for HTTP, embedded JSON fallback for file:// protocol
- **Tabbed Editor** - Per-tab state (zoom, cursor, scroll) persisted to localStorage

## Deployment

- **CI/CD**: GitHub Actions (`.github/workflow/deploy.yml`)
- **Security**: Gitleaks scan on all pushes and PRs
- **Deploy**: Automatic FTPS to production on `main` branch push
- **Branch**: `zoom` is the working branch, `main` is production

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## License

All rights reserved. SimpleMermaid.com 2025.

## Support

If SimpleMermaid has been useful to you, consider supporting the project:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/hexobandit)
