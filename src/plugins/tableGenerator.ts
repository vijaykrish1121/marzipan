// plugins/tableGenerator.ts
// Quick GFM table inserter.

function insertAtCursor(editor: any, text: string) {
  const ta = editor.textarea as HTMLTextAreaElement;
  const s = ta.selectionStart ?? 0, e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview?.();
  ta.focus();
}

export function tableGeneratorPlugin() {
  return (editor: any) => {
    const bar = editor.container?.querySelector?.('.marzipan-toolbar') as HTMLElement
      ?? editor.container;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Insert table';
    btn.className = 'mz-btn mz-btn-table';
    btn.textContent = '▦';

    btn.onclick = () => {
      const r = Math.max(1, parseInt(prompt('Rows (excluding header)?') || '2', 10));
      const c = Math.max(1, parseInt(prompt('Columns?') || '2', 10));

      const header = Array.from({ length: c }, (_, i) => `Header ${i + 1}`).join(' | ');
      const divider = Array.from({ length: c }, () => '---').join(' | ');
      const body = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => ' ').join(' | ')
      ).map(row => `| ${row} |`).join('\n');

      const md = `| ${header} |\n| ${divider} |\n${body}\n`;
      insertAtCursor(editor, `\n${md}\n`);
    };

    bar?.appendChild(btn);
  };
}