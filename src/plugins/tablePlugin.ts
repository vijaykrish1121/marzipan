// tablePlugin.ts

function insertAtCursor(editor: any, text: string) {
    const ta = editor.textarea as HTMLTextAreaElement;
    const s = ta.selectionStart, e = ta.selectionEnd;
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
      const rows = parseInt(prompt('Rows (excluding header)?') || '2', 10);
      const cols = parseInt(prompt('Columns?') || '2', 10);

      const header = Array.from({ length: cols }, (_, i) => `Header ${i+1}`).join(' | ');
      const divider = Array.from({ length: cols }, () => '---').join(' | ');
      const body = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ' ').join(' | ')
      ).join('\n');

      const md = `| ${header} |\n| ${divider} |\n${body.split('\n').map(r => `| ${r} |`).join('\n')}\n`;
      insertAtCursor(editor, `\n${md}\n`);
    };

    bar.appendChild(btn);
  };
}