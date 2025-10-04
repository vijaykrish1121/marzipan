import { useEffect, useMemo, useState } from 'react';

import ChefTable from './demos/ChefTable';
import PluginShowcase from './demos/PluginShowcase';
import ReactKitchen from './demos/ReactKitchen';
import { ThemeLab, type ThemeRecipe } from './demos/ThemeLab';
import { buildThemeRecipes } from './demos/themeRecipes';
import {
  readPermalink,
  writePermalink,
  type PanelId,
  type PluginPanelId,
  type ToolbarMode
} from './utils/permalink';

const PANELS: Array<{ id: PanelId; label: string; emoji: string; blurb: string }> = [
  { id: 'chef-table', label: 'Chef’s Table', emoji: '👩‍🍳', blurb: 'Core editor controls' },
  { id: 'theme-lab', label: 'Theme Lab', emoji: '🎨', blurb: 'Palettes & accents' },
  { id: 'plugin-gallery', label: 'Plugin Gallery', emoji: '🧰', blurb: 'Every extension' },
  { id: 'react-lab', label: 'React Kitchen', emoji: '⚛️', blurb: 'Framework wiring' }
];

export default function App() {
  const recipes = useMemo<ThemeRecipe[]>(() => buildThemeRecipes(), []);
  const initial = useMemo(() => readPermalink(), []);

  const [panel, setPanel] = useState<PanelId>(initial.panel ?? 'chef-table');
  const [activeThemeId, setActiveThemeId] = useState<string>(initial.theme ?? recipes[0].id);
  const [accent, setAccent] = useState<string>(() => {
    if (initial.accent) return initial.accent;
    return recipes.find((recipe) => recipe.id === (initial.theme ?? recipes[0].id))?.accent ?? '#ff8c69';
  });
  const [toolbarMode, setToolbarMode] = useState<ToolbarMode>(initial.toolbar ?? 'classic');
  const [pluginView, setPluginView] = useState<PluginPanelId>(initial.plugin ?? 'highlight');
  const [permalink, setPermalink] = useState('');
  const [copyHint, setCopyHint] = useState<'idle' | 'copied'>('idle');

  const activeRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === activeThemeId) ?? recipes[0],
    [recipes, activeThemeId]
  );
  const liveAccent = accent || activeRecipe.accent;
  const themeOption = activeRecipe.theme;
  const usingDefaultAccent = liveAccent === activeRecipe.accent;

  useEffect(() => {
    const url = writePermalink({
      panel,
      theme: activeThemeId,
      accent: liveAccent,
      plugin: pluginView,
      toolbar: toolbarMode
    });
    setPermalink(url);
  }, [panel, activeThemeId, liveAccent, pluginView, toolbarMode]);

  useEffect(() => {
    if (copyHint === 'copied') {
      const timeout = setTimeout(() => setCopyHint('idle'), 1800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [copyHint]);

  const handleCopyPermalink = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      setCopyHint('copied');
    } catch (error) {
      console.warn('Clipboard copy unavailable', error);
    }
  };

  return (
    <div className="bakeshop-shell">
      <aside className="bakeshop-sidebar">
        <div className="bakeshop-brand">
          <h1>Marzipan Bakeshop</h1>
          <span className="bakeshop-tagline">Dream it, Pixel it</span>
          <p className="bakeshop-chip">Playground for @pinkpixel/marzipan-core ✨</p>
        </div>

        <nav className="bakeshop-nav">
          {PANELS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`bakeshop-nav-button ${panel === item.id ? 'is-active' : ''}`}
              onClick={() => setPanel(item.id)}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="bakeshop-footer">
          Made with ❤️ by Pink Pixel
        </div>
      </aside>

      <main className="bakeshop-content">
        {panel === 'chef-table' && (
          <ChefTable
            theme={themeOption}
            accent={liveAccent}
            toolbarMode={toolbarMode}
            onToolbarModeChange={setToolbarMode}
          />
        )}

        {panel === 'theme-lab' && (
          <ThemeLab
            recipes={recipes}
            activeId={activeThemeId}
            accent={liveAccent}
            onSelect={(id: string) => {
              setActiveThemeId(id);
              const fallback = recipes.find((recipe) => recipe.id === id)?.accent;
              if (fallback && usingDefaultAccent) {
                setAccent(fallback);
              }
            }}
            onAccentChange={setAccent}
            theme={themeOption}
          />
        )}

        {panel === 'plugin-gallery' && (
          <PluginShowcase
            theme={themeOption}
            accent={liveAccent}
            view={pluginView}
            onViewChange={setPluginView}
            onAccentChange={setAccent}
          />
        )}

        {panel === 'react-lab' && <ReactKitchen theme={themeOption} accent={liveAccent} />}

        <section className="bakeshop-panel">
          <h3>Share this tasting flight</h3>
          <p>
            Permalinks capture panel, theme, accent, toolbar, and plugin selections. Pop this link to teammates and
            they&apos;ll land on the same setup.
          </p>
          <div className="permalink-input">
            <input value={permalink} readOnly aria-label="Marzipan Bakeshop permalink" />
            <button type="button" onClick={handleCopyPermalink}>
              {copyHint === 'copied' ? 'Copied! 🎉' : 'Copy URL'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
