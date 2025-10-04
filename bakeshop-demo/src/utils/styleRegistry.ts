const injected = new Set<string>();

export function ensureStyles(id: string, css: string) {
  if (typeof document === 'undefined') return;
  if (!css || !css.trim()) return;
  if (injected.has(id)) return;

  const style = document.createElement('style');
  style.dataset.bakeshopStyle = id;
  style.textContent = css;
  document.head.appendChild(style);
  injected.add(id);
}

export function isStyleInjected(id: string) {
  return injected.has(id);
}
