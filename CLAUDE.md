# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimpleMermaid.com is a single-page web application for creating and editing Mermaid.js diagrams. It's a distraction-free online editor with live preview capabilities, theme switching, and preloaded examples for various diagram types.

## Architecture

This is a client-side only web application with the following structure:

- **index.html** - Single HTML file containing the entire application
- **simplemermaid.png** - Logo/favicon image
- **README.md** - Basic project description

The application is built as a single HTML file containing:
- Embedded CSS styles with CSS custom properties for theming
- Vanilla JavaScript using ES6 modules
- Mermaid.js library loaded via CDN (https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs)

## Key Components

### Theming System
- Three themes: light (default), dark, and colorful modes
- CSS custom properties defined in `:root` for easy theme switching
- Theme state managed via JavaScript body class manipulation

### Mermaid Integration
- Real-time diagram rendering using Mermaid.js v10
- Input textarea with syntax highlighting via monospace font
- Live preview updates on input change
- Error handling for invalid Mermaid syntax

### Example Library
- 20+ predefined diagram examples accessible via buttons
- Covers flowcharts, sequence diagrams, Gantt charts, state diagrams, class diagrams, ERD, journey maps, network diagrams, threat models, and more
- Examples include cybersecurity-focused diagrams (RBAC, Kubernetes threat models, OAuth flows)

## Development Commands

### Local Development Server
```bash
# Using Python (recommended)
python -m http.server 8000

# Using Node.js (if available)
npx serve .

# Then open http://localhost:8000
```

### File Serving
Since this is a static web application, any HTTP server can serve the files. The application requires an HTTP server (not file:// protocol) due to ES6 module imports.

## File Structure
```
/
├── index.html          # Complete application (HTML, CSS, JS)
├── simplemermaid.png   # Logo image
├── README.md           # Basic project info
└── CLAUDE.md          # This file
```

## Key Features to Understand

- **No Build Process**: Everything is contained in a single HTML file
- **CDN Dependencies**: Mermaid.js and Google Fonts loaded externally
- **Theme Persistence**: Themes are switched via CSS classes, no localStorage
- **Live Rendering**: Diagrams update immediately on text input
- **Error Handling**: Invalid Mermaid syntax shows error messages in preview area

## SEO and Meta Tags

The application includes comprehensive SEO optimization:
- Open Graph tags for social media sharing
- Twitter Card metadata
- JSON-LD structured data for search engines
- Google Analytics integration (gtag.js)