import * as markdownActions from './actions';
import type { Toolbar } from './toolbar';

interface ShortcutHost {
  textarea: HTMLTextAreaElement | null;
  toolbar?: Toolbar;
}

const keyActionMap: Record<string, string> = {
  b: 'toggleBold',
  i: 'toggleItalic',
  k: 'insertLink',
  '7': 'toggleNumberedList',
  '8': 'toggleBulletList',
};

export class ShortcutsManager {
  private readonly editor: ShortcutHost;
  private readonly textarea: HTMLTextAreaElement | null;

  constructor(editor: ShortcutHost) {
    this.editor = editor;
    this.textarea = editor.textarea;
  }

  handleKeydown(event: KeyboardEvent): boolean {
    const platform = navigator.platform.toLowerCase();
    const isMac = platform.includes('mac');
    const modKey = isMac ? event.metaKey : event.ctrlKey;

    if (!modKey) return false;

    const key = event.key.toLowerCase();
    const action = keyActionMap[key];

    if (!action) return false;

    if ((key === '7' || key === '8') && !event.shiftKey) {
      return false;
    }

    if ((key === 'b' || key === 'i' || key === 'k') && event.shiftKey) {
      return false;
    }

    event.preventDefault();

    if (this.editor.toolbar) {
      this.editor.toolbar.handleAction(action);
    } else {
      this.handleAction(action);
    }

    return true;
  }

  handleAction(action: string): void {
    const textarea = this.textarea;
    if (!textarea) return;

    textarea.focus();

    switch (action) {
      case 'toggleBold':
        markdownActions.toggleBold(textarea);
        break;
      case 'toggleItalic':
        markdownActions.toggleItalic(textarea);
        break;
      case 'insertLink':
        markdownActions.insertLink(textarea);
        break;
      case 'toggleBulletList':
        markdownActions.toggleBulletList(textarea);
        break;
      case 'toggleNumberedList':
        markdownActions.toggleNumberedList(textarea);
        break;
      case 'toggleQuote':
        markdownActions.toggleQuote(textarea);
        break;
      case 'toggleTaskList':
        markdownActions.toggleTaskList(textarea);
        break;
      default:
        break;
    }

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  destroy(): void {
    // No resources to clean up; method included for API compatibility.
  }
}
