import { useEffect, useMemo } from 'react';
import { accentSwatchPlugin, accentSwatchStyles } from '../../../src/plugins/accentSwatchPlugin';
import { tinyHighlightPlugin, tinyHighlightStyles } from '../../../src/plugins/tinyHighlight';

import { MarzipanCanvas, type ThemeOption } from '../components/MarzipanCanvas';
import { ensureStyles } from '../utils/styleRegistry';
import { buildThemeRecipes } from './themeRecipes';

export interface ThemeRecipe {
  id: string;
  label: string;
  tagline: string;
  description: string;
  theme: ThemeOption;
  palette: string[];
  accent: string;
}

export interface ThemeLabProps {
  recipes: ThemeRecipe[];
  activeId: string;
  accent: string;
  onSelect: (id: string) => void;
  onAccentChange: (hex: string) => void;
  theme: ThemeOption;
}

const samplerMarkdown = [
  '# Theme Flight',
  '',
  'Rotate through presets or roll your own palette using mergeTheme. The accent plugin keeps CSS variables in sync.',
  '',
  '~~~ts',
  "import { mergeTheme, solar } from '@pinkpixel/marzipan-core'",
  '',
  'const forest = mergeTheme(solar, {',
  "  colors: {",
  "    bgSecondary: '#0d1f1b',",
  "    link: '#68f5b4'",
  '  }',
  '})',
  '~~~'
].join('\n');

export function ThemeLab({ recipes, activeId, accent, onSelect, onAccentChange, theme }: ThemeLabProps) {
  useEffect(() => {
    ensureStyles('accent-swatch', accentSwatchStyles);
    ensureStyles('tiny-highlight', tinyHighlightStyles);
  }, []);

  const plugins = useMemo(
    () => [accentSwatchPlugin({ defaults: recipes.map((recipe) => recipe.accent) }), tinyHighlightPlugin()],
    [recipes]
  );

  const rebuildKey = `${activeId}-${typeof theme === 'string' ? theme : theme?.name ?? 'custom'}`;

  return (
    <section className="bakeshop-panel">
      <div>
        <h2>Theme Lab</h2>
        <p>
          Sample the baked-in themes, taste a few custom blends, and tweak the accent hue live. Everything writes
          back to CSS variables so your app shell can match the editor mood instantly.
        </p>
      </div>

      <div className="theme-palette">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            type="button"
            className={recipe.id === activeId ? 'is-active' : ''}
            onClick={() => onSelect(recipe.id)}
          >
            <div className="theme-token-strip">
              {recipe.palette.map((swatch, index) => (
                <span key={`${recipe.id}-${index}`} className="theme-token" style={{ background: swatch }} />
              ))}
            </div>
            <strong>{recipe.label}</strong>
            <span>{recipe.tagline}</span>
          </button>
        ))}
      </div>

      <div className="bakeshop-toolbar">
        <span className="bakeshop-chip">Accent {accent}</span>
        <button
          type="button"
          className="bakeshop-action"
          onClick={() => {
            const fallback = recipes.find((recipe) => recipe.id === activeId)?.accent ?? accent;
            onAccentChange(fallback);
          }}
        >
          Reset Accent
        </button>
        <button
          type="button"
          className="bakeshop-action"
          onClick={() => onAccentChange('#ff8c69')}
        >
          Sunset Boost
        </button>
      </div>

      <div className="demo-preview">
        <MarzipanCanvas
          id="theme-lab"
          defaultValue={samplerMarkdown}
          theme={theme}
          accent={accent}
          plugins={plugins}
          rebuildKey={rebuildKey}
          onAccentChange={onAccentChange}
        />
      </div>
    </section>
  );
}
