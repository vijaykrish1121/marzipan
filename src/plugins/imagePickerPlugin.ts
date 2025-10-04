export function imagePickerPlugin(opts?: {
  uploader?: (file: File) => Promise<string> // return a URL
}) {
  return (editor: any) => {
    // Add custom buttons right into the toolbar (works today)
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement;
    if (!bar) return;

    function insertAtCursor(instance: any, text: string) {
      const ta = instance.textarea as HTMLTextAreaElement;
      const s = ta.selectionStart ?? 0;
      const e = ta.selectionEnd ?? s;
      ta.setRangeText(text, s, e, 'end');
      instance.updatePreview();
      ta.focus();
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Insert image';
    btn.textContent = '🖼️';
    btn.onclick = async () => {
      const choice = window.prompt('Paste image URL, or type "upload" to pick a file:');
      if (!choice) return;

      if (choice.toLowerCase() !== 'upload') {
        insertAtCursor(editor, `![alt text](${choice})`);
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        let url: string;

        if (opts?.uploader) {
          url = await opts.uploader(file); // e.g., copy to workspace, S3, etc.
        } else {
          url = URL.createObjectURL(file); // preview now; persist later in your app
        }

        insertAtCursor(editor, `![${file.name}](${url})`);
      };
      input.click();
    };

    bar.appendChild(btn);
  };
}
