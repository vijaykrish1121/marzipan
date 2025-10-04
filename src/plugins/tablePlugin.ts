// tablePlugin.ts

import { buildTableMarkdown, resolvePositiveInteger } from './utils/table';

function insertAtCursor(editor: any, text: string) {
  const ta = editor.textarea as HTMLTextAreaElement;
  const s = ta.selectionStart ?? 0;
  const e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview();
  ta.focus();
}

export function tablePlugin() {
  return (editor: any) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement;
    if (!bar) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Insert table';
    btn.textContent = '▦'; // or an icon
    btn.onclick = () => {
      const rows = resolvePositiveInteger(prompt('Rows (excluding header)?'), 2);
      if (rows === null) return;

      const cols = resolvePositiveInteger(prompt('Columns?'), 2);
      if (cols === null) return;

      const md = buildTableMarkdown(rows, cols);
      insertAtCursor(editor, `\n${md}\n`);
    };

    bar.appendChild(btn);
  };
}
