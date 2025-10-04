export type PanelId = 'chef-table' | 'theme-lab' | 'plugin-gallery' | 'react-lab';
export type PluginPanelId = 'highlight' | 'tables' | 'accent' | 'media' | 'mermaid' | 'external';
export type ToolbarMode = 'classic' | 'minimal' | 'bare';

export interface PermalinkState {
  panel?: PanelId;
  theme?: string;
  accent?: string;
  plugin?: PluginPanelId;
  toolbar?: ToolbarMode;
}

export function readPermalink(): PermalinkState {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const panel = params.get('panel') as PanelId | null;
  const theme = params.get('theme');
  const accent = params.get('accent');
  const plugin = params.get('plugin') as PluginPanelId | null;
  const toolbar = params.get('toolbar') as ToolbarMode | null;

  return {
    panel: panel ?? undefined,
    theme: theme ?? undefined,
    accent: accent ? `#${accent.replace(/^#/, '')}` : undefined,
    plugin: plugin ?? undefined,
    toolbar: toolbar ?? undefined
  };
}

export function writePermalink(state: PermalinkState): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;

  setParam(params, 'panel', state.panel);
  setParam(params, 'theme', state.theme);
  setParam(params, 'accent', state.accent ? state.accent.replace(/^#/, '') : undefined);
  setParam(params, 'plugin', state.plugin);
  setParam(params, 'toolbar', state.toolbar);

  const nextUrl = `${url.pathname}${params.toString() ? `?${params.toString()}` : ''}${url.hash}`;
  window.history.replaceState({}, '', nextUrl);
  return window.location.href;
}

function setParam(params: URLSearchParams, key: string, value: string | undefined) {
  if (value && value.length) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}
