# 🧁 Marzipan Project Overview

## ✨ Project Snapshot

- **Package:** `@pinkpixel/marzipan`
- **Version:** 1.0.7 (Production Ready)
- **Runtime dependencies:** **Zero** – Pure TypeScript with all markdown actions bundled internally
- **Plugins:** First-party plugins published from `src/plugins` as tree-shakeable modules (`@pinkpixel/marzipan/plugins/*`)
- **Demo:** `bakeshop-demo/` - Full-featured React playground demonstrating all capabilities
- **License:** Apache 2.0 • **Homepage:** https://marzipan.pinkpixel.dev
- **Repository:** https://github.com/pinkpixel-dev/marzipan
- **Node.js:** 20+ required

## 🏗️ Repository Structure

```
marzipan/
├── src/                      # Core editor source (TypeScript)
│   ├── actions/              # 15+ formatting helpers (toggleBold, insertLink, etc.)
│   │   ├── core/             # Core utilities (formats, insertion, selection, detection)
│   │   ├── operations/       # Block and list style operations
│   │   ├── debug.ts          # Debug logging utilities
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── index.ts          # Main actions export
│   ├── plugins/              # First-party plugin implementations
│   │   ├── tablePlugin.ts
│   │   ├── tableGridPlugin.ts
│   │   ├── mermaidPlugin.ts
│   │   ├── tinyHighlight.ts
│   │   ├── imageManagerPlugin.ts
│   │   ├── accentSwatchPlugin.ts
│   │   └── [more plugins]
│   ├── marzipan.ts           # Main Marzipan class
│   ├── parser.ts             # Markdown parser
│   ├── shortcuts.ts          # Keyboard shortcuts manager
│   ├── toolbar.ts            # Toolbar component
│   ├── themes.ts             # Theme system (Solar, Cave)
│   ├── styles.ts             # Style generation
│   ├── link-tooltip.ts       # Link preview tooltips
│   └── index.ts              # Package entry point
├── dist/                     # Build output (ESM + .d.ts files, gitignored)
├── docs/                     # Comprehensive documentation
│   ├── README.md             # Documentation orientation
│   ├── quick-start.md        # Installation and setup guide
│   ├── api.md                # Full API reference
│   ├── plugins.md            # Plugin catalogue
│   └── types.d.ts            # Generated TypeScript definitions
├── bakeshop-demo/            # Vite + React demonstration app
│   ├── src/                  # Demo source code
│   ├── README.md             # Demo guide
│   └── [config files]
├── public/                   # Static assets (logo, favicon)
├── CHANGELOG.md              # Release notes and version history
├── CONTRIBUTING.md           # Development workflow and standards
├── OVERVIEW.md               # This document - project architecture
├── README.md                 # Project introduction and quick start
├── LICENSE                   # Apache 2.0 license
└── [config files]            # package.json, tsconfig.json, vite.config.ts, etc.
```

## 🎯 Vision & Value

Marzipan delivers a markdown editing experience that keeps the simplicity of a textarea while overlaying a perfectly aligned live preview. The core library is framework-agnostic, tree-shakeable, and now completely self-contained thanks to the TypeScript rewrite of the action utilities.

Key pillars:
- **Live overlay preview** with pixel-perfect alignment.
- **Typed action toolkit** available to consumers without any extra installs.
- **Plugin architecture** for tables, syntax highlighting, media helpers, Mermaid diagrams, and more.
- **Theming system** with built-in Solar (light) and Cave (dark) palettes plus accent swatches.

## ⚙️ Architecture Highlights

### Core Library (`src/`)
- ES module output targeting modern browsers (ES2020).
- Strict TypeScript configuration with declaration + source maps in `dist/`.
- `actions/` folder contains all formatting helpers used by the toolbar and shortcuts; exported via the package entry so apps can call them directly.
- `plugins/` folder provides tree-shakeable factories published to `@pinkpixel/marzipan/plugins/<name>`.

### Bakeshop Demo (`bakeshop-demo/`)
- Vite + React + TypeScript showcase.
- Panels for toolbar presets, theming, plugin gallery, and React integration patterns.
- Mirrors plugin behaviour so consumers can copy configuration snippets.

## 📚 Documentation Overview

Updated October 4, 2025 to reflect the action rewrite and plugin exports:
- `README.md` – top-level orientation, quick start, plugin summary.
- `docs/` – quick start, API reference, plugin catalogue, and type definitions.
- `bakeshop-demo/README.md` – demo setup and panel walkthrough.
- `CHANGELOG.md` – release notes including the dependency-free actions update.

## 🔌 Actions & Plugins

### Actions System (`src/actions`) - Zero Dependencies! 🎉

**Major Feature:** All markdown formatting logic is now bundled internally, eliminating the need for external dependencies like `markdown-actions`.

**Available Actions:**
- **Text Formatting:** `toggleBold`, `toggleItalic`, `toggleCode`
- **Headers:** `insertHeader(level)`, `toggleH1`, `toggleH2`, `toggleH3` (supports H1-H6)
- **Lists:** `toggleBulletList`, `toggleNumberedList`, `toggleTaskList`
- **Blocks:** `toggleQuote`
- **Links:** `insertLink(options)` with smart URL detection
- **Utilities:** `getActiveFormats`, `hasFormat`, `expandSelection`, `preserveSelection`
- **Debug Tools:** `setDebugMode`, `getDebugMode` for development
- **Custom Formats:** `applyCustomFormat` for creating custom formatting rules

**Usage:**
```ts
import { actions } from '@pinkpixel/marzipan';
const textarea = document.querySelector('textarea');
actions.toggleBold(textarea);
actions.insertHeader(textarea, 2); // H2
actions.insertLink(textarea, { url: 'https://example.com', text: 'Click here' });
```

**Architecture:**
- `core/` - Selection handling, format detection, text insertion
- `operations/` - Block and multiline style operations
- `debug.ts` - Optional debug logging for development
- `types.ts` - Comprehensive TypeScript definitions

### Plugin System (`src/plugins`)

**Tree-Shakeable Design:** Each plugin is a factory function published as a separate import for optimal bundle size.

**Available Plugins:**
- **Tables:**
  - `tablePlugin` - Basic table support
  - `tableGridPlugin` - Interactive table grid
  - `tableGeneratorPlugin` - Table creation wizard
- **Diagrams:**
  - `mermaidPlugin` - ESM import of Mermaid
  - `mermaidExternalPlugin` - CDN-based Mermaid loading
- **Syntax Highlighting:**
  - `tinyHighlightPlugin` - Lightweight code highlighting
  - `tinyHighlightStyles` - Accompanying styles
- **Media:**
  - `imageManagerPlugin` - Image upload and management
  - `imagePickerPlugin` - Image selection interface
- **Theming:**
  - `accentSwatchPlugin` - Color accent picker synchronized across instances

**Usage:**
```ts
import { Marzipan } from '@pinkpixel/marzipan';
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';
import { mermaidPlugin } from '@pinkpixel/marzipan/plugins/mermaidPlugin';

new Marzipan('#editor', {
  plugins: [tablePlugin(), mermaidPlugin()]
});
```

## 🛠️ Tooling & Scripts

- **Build:** `npm run build` (TypeScript + Vite library mode)
- **Watch:** `npm run dev`
- **Quality:** `npm run lint`, `npm run typecheck`, `npm run prettier`
- **Demo:** run the same commands inside `bakeshop-demo/`

The project targets **Node.js 20+** as defined in `package.json` and mirrored in the contributing guide.

## 🤝 Contributing

1. Clone the repository and install dependencies: `npm install`
2. Run `npm run dev` for watch mode or `npm run build` before testing the demo.
3. Launch the Bakeshop from `bakeshop-demo/` (`npm run dev`) to exercise plugins and actions.
4. Follow [CONTRIBUTING.md](CONTRIBUTING.md) for coding standards and pull request expectations.

## 🔮 Roadmap & Future Enhancements

### Near-term Goals
- Expand plugin configuration hooks (custom toolbar buttons, plugin APIs)
- Enhanced table editing capabilities with more grid features
- Additional syntax highlighting themes

### Mid-term Goals  
- Evaluate collaborative editing capabilities
- Persistence layer options (localStorage, IndexedDB adapters)
- Real-time preview synchronization improvements

### Long-term Vision
- Framework-specific wrappers:
  - React: `useMarzipan` hook
  - Vue: `<MarzipanEditor>` component
  - Svelte: Marzipan action
- Plugin marketplace ecosystem
- Advanced formatting plugins (footnotes, abbreviations, etc.)
- Mobile-first editing experience enhancements

## 📊 Project Status

- ✅ **Production Ready** - v1.0.6 stable release
- ✅ **Zero Dependencies** - Complete self-contained solution
- ✅ **Comprehensive Documentation** - Full guides and API reference
- ✅ **Active Development** - Regular updates and improvements
- ✅ **Open Source** - Apache 2.0 license, community contributions welcome

---

_Last updated: October 4, 2025 – Complete project analysis and enhanced documentation._
