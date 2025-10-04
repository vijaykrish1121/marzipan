// mermaidPlugin.ts
export function mermaidPlugin(config?: any) {
  let mermaid: any;
  let id = 0;

  return (editor: any) => {
    const render = async (root: HTMLElement) => {
      const nodes = root.querySelectorAll('pre code.language-mermaid');
      if (!nodes.length) return;

      const mod = await import('mermaid');
      mermaid ??= mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        ...config
      });

      await Promise.all(Array.from(nodes).map(async (codeEl) => {
        const parentPre = codeEl.closest('pre') as HTMLElement;
        const { svg } = await mermaid.render(`m-${id++}`, codeEl.textContent || '');
        const wrapper = document.createElement('div');
        wrapper.className = 'marzipan-mermaid';
        wrapper.innerHTML = svg; // SVG from mermaid is safe-by-design
        parentPre.replaceWith(wrapper);
      }));
    };

    const prev = editor.options.hooks?.afterPreviewRender;
    editor.options.hooks = editor.options.hooks || {};
    editor.options.hooks.afterPreviewRender = (root: HTMLElement, e: any) => {
      prev?.(root, e);
      render(root);
    };
  };
}

// Write Markdown:

// ````md
// ```mermaid
// graph TD
//  A[Start] --> B{Choice}
//  B -->|Yes| C[Path 1]
//  B -->|No|  D[Path 2]
//````
//````