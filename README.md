<div align="center">
  
  <h1>🧁 Marzipan</h1>
  <img src="public/logo.png" alt="Marzipan Logo" width="275"/>
  <p><em>Framework-agnostic markdown editor with a live overlay preview, zero runtime dependencies, and batteries-included formatting actions.</em></p>
</div>

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.7-brightgreen.svg)](CHANGELOG.md)
[![Docs](https://img.shields.io/badge/docs-marzipan.pinkpixel.dev-ff6fb7.svg)](https://marzipan.pinkpixel.dev)

## ✨ Highlights

- **Pure TypeScript core** – ships typed ESM builds and declaration files.
- **First-party actions** – formatting helpers live in `src/actions` and export with the library, so you can drop `markdown-actions` entirely.
- **Plugin library** – production-ready plugins (tables, Mermaid, syntax highlighting, media helpers, accent swatches, and more) live in `src/plugins` and publish under `@pinkpixel/marzipan/plugins/*`.
- **Overlay preview** – renders markdown directly over the textarea so alignment never drifts.
- **Themeable UI** – includes Solar (light), Cave (dark), and accent swatch tooling for custom palettes.
- **Demo Bakeshop** – a Vite + React playground that exercises every option and plugin.

## 🍰 What’s in the repo?

| Package | Description |
|---------|-------------|
| **`@pinkpixel/marzipan`** | Core editor library located in `src/` (bundled to `dist/`). Ships the actions toolkit and plugin exports by default. |
| **`@pinkpixel/marzipan/plugins/*`** | Individual plugin entry points compiled from `src/plugins`. Import only the helpers you need. |
| **`bakeshop-demo/`** | React playground showcasing toolbar presets, actions, plugins, and theming workflows. |

## 🚀 Quick Start

### 1. Install
```bash
npm install @pinkpixel/marzipan
```

### 2. Create an editor
```ts
import { Marzipan } from '@pinkpixel/marzipan';

const [editor] = new Marzipan('#my-textarea', {
  toolbar: true,
  theme: 'cave',
  smartLists: true,
});
```

### 3. Use the bundled actions
```ts
import { actions } from '@pinkpixel/marzipan';

// Toggle bold formatting using our zero-dependency action suite
const textarea = document.querySelector('textarea')!;
actions.toggleBold(textarea);
```

### 4. Opt into a plugin
```ts
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';

new Marzipan('#editor', {
  plugins: [tablePlugin()],
});
```

### 5. Try the Bakeshop playground
```bash
cd bakeshop-demo
npm install
npm run dev
```
Visit `http://localhost:5173` to explore every panel, plugin, and action in a live environment.

## 🧩 Bundled Plugins

The `src/plugins` directory publishes directly to consumers. Available helpers include:
- `tablePlugin`, `tableGridPlugin`, `tableGeneratorPlugin` – interactive table authoring.
- `tinyHighlightPlugin` – lightweight syntax highlighting for fenced code blocks (ships `tinyHighlightStyles`).
- `accentSwatchPlugin` – synced accent palette picker.
- `imageManagerPlugin`, `imagePickerPlugin` – opinionated media workflows.
- `mermaidPlugin`, `mermaidExternalPlugin` – diagram rendering via ESM or CDN.

Import only what you need:
```ts
import { mermaidPlugin } from '@pinkpixel/marzipan/plugins/mermaidPlugin';
```

## 📚 Documentation

All guides live in `/docs`:
- `docs/README.md` – orientation & navigation.
- `docs/quick-start.md` – install, instantiate, and wire up actions/plugins.
- `docs/api.md` – class API, action helpers, TypeScript signatures.
- `docs/plugins.md` – plugin catalogue, configuration, and bundling tips.
- `docs/types.d.ts` – generated type definitions.

The new [CHANGELOG](CHANGELOG.md) tracks releases and major documentation updates.

## 🗺️ Project Overview

Read [OVERVIEW.md](OVERVIEW.md) for architecture, tooling, and roadmap context, including how `src/actions` and `src/plugins` integrate with the build.

## 🛠️ Scripts

Run these from the repository root:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Library build in watch mode |
| `npm run build` | Type check then bundle to `dist/` |
| `npm run typecheck` | Strict TypeScript validation |
| `npm run lint` | ESLint flat config |
| `npm run prettier` | Format source and docs |

The Bakeshop has its own scripts inside `bakeshop-demo/` (`dev`, `build`, `preview`, `lint`, `typecheck`).

## 🤝 Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, coding standards, and Node.js requirements (20+).

## 💬 Support & Feedback

- Issues: [GitHub Tracker](https://github.com/pinkpixel-dev/marzipan/issues)
- Email: [admin@pinkpixel.dev](mailto:admin@pinkpixel.dev)
- Discussions & ideas: open a thread in the repo

## 🙏 Acknowledgements

- Inspired by [markdown-actions](https://github.com/tmm/markdown-actions); Marzipan now bundles a fully typed successor.
- Built with TypeScript, Vite, and React (for the demo app).

---

**Made with ❤️ by [Pink Pixel](https://pinkpixel.dev)**
