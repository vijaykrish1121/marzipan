// plugins/imagePicker.ts
// Adds a toolbar button to insert images. Supports URL or file -> blob URL.
// Optional uploader(file) => Promise<string> to persist and return a real URL.

export type ImagePickerOptions = {
  uploader?: (file: File) => Promise<string>;
  label?: string; // button label or emoji
  title?: string; // tooltip
};

function insertAtCursor(editor: any, text: string) {
  const ta = editor.textarea as HTMLTextAreaElement;
  const s = ta.selectionStart ?? 0, e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview?.();
  ta.focus();
}

export function imagePickerPlugin(opts: ImagePickerOptions = {}) {
  const label = opts.label ?? '🖼️';
  const title = opts.title ?? 'Insert image';

  return (editor: any) => {
    // Find or create a toolbar container
    const bar = editor.container?.querySelector?.('.marzipan-toolbar') as HTMLElement
      ?? editor.container;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.className = 'mz-btn mz-btn-image';
    btn.textContent = label;

    btn.onclick = async () => {
      const mode = prompt('Paste an image URL, or type "upload" to pick a file:');
      if (!mode) return;

      if (mode.toLowerCase() !== 'upload') {
        insertAtCursor(editor, `![alt text](${mode})`);
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const url = opts.uploader ? await opts.uploader(file) : URL.createObjectURL(file);
          insertAtCursor(editor, `![${file.name}](${url})`);
        } catch (e) {
          console.error('Image upload failed:', e);
          alert('Image upload failed.');
        }
      };
      input.click();
    };

    bar?.appendChild(btn);
  };
}