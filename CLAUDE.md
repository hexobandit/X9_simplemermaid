# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimpleMermaid.com is a single-page web application for creating and editing Mermaid.js diagrams with instant shareable links. It provides a distraction-free online editor with live preview, theme switching, and collaborative sharing features.

## Architecture

### Single-File Application
The entire application is contained in `index.html` with:
- Embedded CSS with modern custom properties for theming
- Vanilla JavaScript using ES6 modules
- Mermaid.js v10 loaded via CDN
- LZ-String compression library for URL sharing

### Key Technical Features
- **URL-based diagram sharing**: Diagrams are compressed with LZ-String and stored in URL hash
- **Dual-mode example loading**: External JSON/files with embedded fallback for file:// protocol
- **Real-time rendering**: Live preview updates on every keystroke
- **Theme system**: CSS custom properties with `data-theme` attribute switching
- **Layout modes**: Vertical (stacked) and horizontal (side-by-side) editor layouts

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
The application can run directly from `file://` protocol using embedded examples as fallback.

## File Structure
```
/
├── index.html          # Complete application (17KB of HTML/CSS/JS)
├── examples/
│   ├── config.json    # Category configuration for dropdown menus
│   └── *.mmd          # Individual Mermaid diagram examples
├── simplemermaid.png  # Logo/favicon
├── README.md          # User-facing documentation
└── CLAUDE.md          # This file
```

## Key Implementation Details

### Sharing System (index.html:2201-2331)
- Uses LZ-String compression to create compact URLs
- Stores entire diagram in URL hash parameter `#diagram=`
- Automatically updates URL as user types (2-second debounce)
- Decompresses and loads diagrams from URL on page load

### Example Loading System (index.html:1954-2065)
- Primary: Loads from `examples/` directory via fetch API
- Fallback: Uses embedded examples object for file:// protocol
- Dynamic dropdown creation from `config.json`
- Supports both external files and inline content

### Theme System (index.html:113-151)
- Three themes: light (default), dark, colorful
- Controlled via `data-theme` attribute on document root
- Special SVG styling overrides for Mermaid diagrams in dark/colorful themes
- Theme toggle cycles through all three states

### Mermaid Integration (index.html:2124-2136)
- Renders using `mermaid.mermaidAPI.render()`
- Error handling displays user-friendly messages
- SVG output injected directly into preview container

## Important Patterns

### Adding New Examples
1. Create `.mmd` file in `examples/` directory
2. Update `examples/config.json` with category and metadata
3. Embedded fallback examples must be updated in `index.html` (lines 1905-1952)

### Modifying Themes
- CSS variables defined in `:root` (lines 53-112)
- Theme variations in `[data-theme="dark"]` and `[data-theme="colorful"]`
- SVG-specific overrides for Mermaid diagrams (lines 673-825)

### URL Sharing Modifications
- Compression logic: `generateShareLink()` function (line 2203)
- Decompression logic: DOMContentLoaded listener (line 2276)
- Auto-update URL: Input event listener with debounce (line 2308)

## External Dependencies
- Mermaid.js v10: `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs`
- LZ-String v1.5.0: `https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js`
- Google Fonts: Inter and Poppins families
- Google Analytics: gtag.js with ID G-6FZM0EGT74