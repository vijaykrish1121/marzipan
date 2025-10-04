# ✨ Marzipan Bakeshop

The **Marzipan Bakeshop** is our official tasting room for `@pinkpixel/marzipan`. It runs on Vite + React + TypeScript and showcases every core feature, bundled action, and plugin so you can try before you wire it into your own app.

![Marzipan Bakeshop UI](../image.png)

## 🚀 Quick Start
```bash
cd bakeshop-demo
npm install
npm run dev
```
Visit `http://localhost:5173` to explore the playground. Production bundles land in `bakeshop-demo/dist` via `npm run build`.

## 🧁 Panels & Highlights
| Panel | What you’ll find |
|-------|------------------|
| 👩‍🍳 **Chef’s Table** | Core editor demo with toolbar presets, view modes, stats HUD, and direct access to bundled actions. |
| 🎨 **Theme Lab** | Accent swatch plugin, theme merges, and CSS variable inspectors for Solar, Cave, and custom palettes. |
| 🧰 **Plugin Gallery** | Every plugin published under `@pinkpixel/marzipan/plugins/*` (tables, Mermaid, image helpers, tinyHighlight, accent swatches). |
| ⚛️ **React Kitchen** | Reference integration demonstrating controlled state, value mirroring, and logging hooked into the action suite. |

## 🔌 Plugin Coverage
The gallery mounts all first-party plugins:
- `tinyHighlight`
- `tablePlugin`, `tableGridPlugin`, `tableGenerator`
- `accentSwatchPlugin`
- `imageManagerPlugin`, `imagePickerPlugin`, `imagePicker`
- `mermaidPlugin` (ESM) & `mermaidExternal` (CDN)

Use the panel toggles to inspect options and copy starter code.

## 🔄 Permalinks & State
- URL params persist panel selection, theme, accent, toolbar preset, and plugin focus (e.g. `?panel=plugin-gallery&theme=cave&accent=f6ae2d`).
- Click **Copy URL** in the footer to share reproducible setups with teammates.

## 🛠️ Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Launch the Vite dev server. |
| `npm run build` | Type-check (`tsc -b`) then build the production bundle. |
| `npm run preview` | Preview the production build locally. |
| `npm run typecheck` | Strict TypeScript validation. |
| `npm run lint` | ESLint flat config for the playground. |
| `npm run format` | Prettier formatting. |

## 🧭 Legacy Examples
Earlier single-file demos (`basic.ts`, `with-plugins.ts`, `theming.ts`, `react-integration.tsx`) now live in `bakeshop-demo/legacy/` for reference. The playground replaces them with a cohesive experience.

## ❤️ Credits
Made with ❤️ by Pink Pixel. Share feedback via issues or discussions in the main repository.
