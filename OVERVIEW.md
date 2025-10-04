# 🧁 Marzipan Project Overview

## ✨ Project Snapshot

- **Package:** `@pinkpixel/marzipan`
- **Version:** 1.0.0
- **Runtime dependencies:** _None_ – markdown actions are bundled in `src/actions`.
- **Plugins:** Published from `src/plugins` as first-party helpers (`@pinkpixel/marzipan/plugins/*`).
- **Demo:** `bakeshop-demo/` React playground showcasing every feature.
- **License:** Apache 2.0 • **Homepage:** https://marzipan.pinkpixel.dev

## 🏗️ Repository Structure

```
marzipan/
├── src/                # Core editor source (TypeScript)
│   ├── actions/        # Bundled formatting helpers
│   └── plugins/        # First-party plugin implementations
├── dist/               # Build output (gitignored)
├── docs/               # Documentation portal
├── bakeshop-demo/      # Vite + React playground
├── CHANGELOG.md        # Release notes
├── CONTRIBUTING.md     # Contribution workflow
├── OVERVIEW.md         # This document
└── README.md           # Project introduction
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

### Actions (`src/actions`)
- Toggle helpers for bold, italic, code, headers, quotes, lists, links, and task lists.
- Utilities for selection expansion, format detection, undo integration, and debug logging.
- Exported via `import { actions } from '@pinkpixel/marzipan'` (and re-exported types) so custom toolbars or shortcut systems can share the same logic as Marzipan’s UI.

### Plugins (`src/plugins`)
- Each plugin is a small factory that returns an object consumed by the editor.
- Published individually for optimal tree shaking: e.g. `@pinkpixel/marzipan/plugins/tablePlugin`.
- Coverage includes tables, Mermaid (ESM + CDN flavours), syntax highlighting, accent swatches, image pickers/managers, and helper utilities.

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

## 🔮 Roadmap Notes

- Continue expanding plugin configuration hooks (e.g., custom toolbar buttons for tables).
- Evaluate collaborative editing and persistence layers.
- Ship framework-specific wrappers (React hook, Vue component, Svelte action) built on the shared core.

---

_Last updated: October 4, 2025 – documentation & dependency-free actions refresh._
