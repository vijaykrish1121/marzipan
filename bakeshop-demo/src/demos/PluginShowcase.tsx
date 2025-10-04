import { useEffect, useMemo, useState } from 'react';
import {
  accentSwatchPlugin,
  accentSwatchStyles
} from '../../../src/plugins/accentSwatchPlugin';
import {
  imageManagerPlugin,
  imageManagerStyles
} from '@pinkpixel/marzipan-core/plugins/imageManagerPlugin';
import { imagePickerPlugin } from '@pinkpixel/marzipan-core/plugins/imagePickerPlugin';
import { mermaidPlugin } from '@pinkpixel/marzipan-core/plugins/mermaidPlugin';
import { mermaidExternalPlugin } from '@pinkpixel/marzipan-core/plugins/mermaidExternal';
import { tableGeneratorPlugin } from '@pinkpixel/marzipan-core/plugins/tableGenerator';
import { tableGridPlugin, tableGridStyles } from '@pinkpixel/marzipan-core/plugins/tableGridPlugin';
import { tablePlugin } from '@pinkpixel/marzipan-core/plugins/tablePlugin';
import { tinyHighlightPlugin, tinyHighlightStyles } from '@pinkpixel/marzipan-core/plugins/tinyHighlight';

import { MarzipanCanvas, type ThemeOption } from '../components/MarzipanCanvas';
import { ensureStyles } from '../utils/styleRegistry';
import type { PluginPanelId } from '../utils/permalink';

const highlightMarkdown = [
  '# Syntax Highlighting',
  '',
  '```tsx',
  'const makeGanache = (dark: boolean) => {',
  '  const chocolate = dark ? 70 : 55',
  '  return `Melt ${chocolate}% cocoa with cream`',
  '}',
  '```',
  '',
  'Powered by tinyHighlightPlugin().' 
].join('\n');

const tablesMarkdown = [
  '# Table Candy',
  '',
  'Click the ▦ button, sweep across the grid, and we drop GFM table markdown ready for plating.',
  '',
  '| Layer | Texture | Taste |',
  '|-------|---------|-------|',
  '| Crunch | Crisp | Salted caramel |',
  '| Mousse | Airy | Dark chocolate |',
  '| Ganache | Silky | Espresso |'
].join('\n');

const accentMarkdown = [
  '# Accent Swatches',
  '',
  'Tap the palette button, tweak colors, and right-click any swatch to remove it.',
  'The plugin stores recents in localStorage so sessions persist.'
].join('\n');

const mediaMarkdown = [
  '# Image Pantry',
  '',
  'Drag & drop, paste from clipboard, or paste a URL. Recent images stay stashed for reuse.',
  '',
  '![Sample image](./logo.png)'
].join('\n');

const mermaidMarkdown = [
  '# Mermaid Diagrams',
  '',
  '```mermaid',
  'graph TD',
  '  Start --> Mix',
  '  Mix -->|sweet| Bake',
  '  Mix -->|savory| Chill',
  '  Bake --> Serve',
  '  Chill --> Serve',
  '```',
  '',
  'Dynamic import ensures mermaid is loaded only when needed.'
].join('\n');

const externalMarkdown = [
  '# Mermaid (CDN)',
  '',
  'Add the CDN script snippet below and the external plugin will render diagrams using window.mermaid.',
  '',
  '```html',
  '<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>',
  '```'
].join('\n');

const pluginNav: Array<{ id: PluginPanelId; label: string; emoji: string; description: string }> = [
  { id: 'highlight', label: 'Highlight', emoji: '💡', description: 'tinyHighlight + styles' },
  { id: 'tables', label: 'Tables', emoji: '🍽️', description: 'tableGrid, tablePlugin, tableGenerator' },
  { id: 'accent', label: 'Accent', emoji: '🎨', description: 'accentSwatch palette' },
  { id: 'media', label: 'Media', emoji: '📸', description: 'imageManager + picker helpers' },
  { id: 'mermaid', label: 'Mermaid ESM', emoji: '🧜‍♀️', description: 'Dynamic import renderer' },
  { id: 'external', label: 'Mermaid CDN', emoji: '🌐', description: 'window.mermaid integration' }
];

export interface PluginShowcaseProps {
  theme: ThemeOption;
  accent: string;
  view: PluginPanelId;
  onViewChange: (id: PluginPanelId) => void;
  onAccentChange: (hex: string) => void;
}

export function PluginShowcase({ theme, accent, view, onViewChange, onAccentChange }: PluginShowcaseProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    ensureStyles('tiny-highlight', tinyHighlightStyles);
    ensureStyles('table-grid', tableGridStyles);
    ensureStyles('accent-swatch', accentSwatchStyles);
    ensureStyles('image-manager', imageManagerStyles);
  }, []);

  const highlightPlugins = useMemo(() => [tinyHighlightPlugin()], []);
  const tablePlugins = useMemo(() => [tableGridPlugin(), tableGeneratorPlugin(), tablePlugin()], []);
  const accentPlugins = useMemo(() => [accentSwatchPlugin()], []);
  const mediaPlugins = useMemo(() => [imageManagerPlugin(), imagePickerPlugin()], []);
  const mermaidPlugins = useMemo(() => [tinyHighlightPlugin(), mermaidPlugin()], []);
  const externalPlugins = useMemo(() => [tinyHighlightPlugin(), mermaidExternalPlugin()], []);

  const { markdown, plugins } = useMemo(() => {
    switch (view) {
      case 'highlight':
        return { markdown: highlightMarkdown, plugins: highlightPlugins };
      case 'tables':
        return { markdown: tablesMarkdown, plugins: tablePlugins };
      case 'accent':
        return { markdown: accentMarkdown, plugins: accentPlugins };
      case 'media':
        return { markdown: mediaMarkdown, plugins: mediaPlugins };
      case 'mermaid':
        return { markdown: mermaidMarkdown, plugins: mermaidPlugins };
      case 'external':
        return { markdown: externalMarkdown, plugins: externalPlugins };
      default:
        return { markdown: highlightMarkdown, plugins: highlightPlugins };
    }
  }, [view, highlightPlugins, tablePlugins, accentPlugins, mediaPlugins, mermaidPlugins, externalPlugins]);

  const rebuildKey = `${view}-${typeof theme === 'string' ? theme : theme?.name ?? 'custom'}`;

  const copyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(`Plugin demo: ${view} — powered by @pinkpixel/marzipan-core`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.warn('Clipboard copy failed', error);
    }
  };

  return (
    <section className="bakeshop-panel">
      <div>
        <h2>Plugin Gallery</h2>
        <p>
          Every official plugin bundled with marzipan-core, ready to taste. Swap categories to see how each hook
          tweaks the editor without reaching for extra frameworks.
        </p>
      </div>

      <div className="bakeshop-toolbar">
        {pluginNav.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bakeshop-nav-button ${view === item.id ? 'is-active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            {item.emoji} {item.label}
          </button>
        ))}
        <button type="button" className="bakeshop-action" onClick={copyInstructions}>
          {copied ? 'Copied!' : 'Copy note'}
        </button>
      </div>

      <div className="demo-preview">
        <MarzipanCanvas
          id={`plugins-${view}`}
          defaultValue={markdown}
          theme={theme}
          accent={accent}
          plugins={plugins}
          rebuildKey={rebuildKey}
          onAccentChange={view === 'accent' ? onAccentChange : undefined}
        />
      </div>

      <div className="info-banner">
        <strong>{pluginNav.find((item) => item.id === view)?.label}</strong>
        <span> — {pluginNav.find((item) => item.id === view)?.description}</span>
      </div>
    </section>
  );
}

export default PluginShowcase;
