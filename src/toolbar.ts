import * as icons from './icons';
import * as markdownActions from './actions';
import type { MarkdownActions } from './actions';

interface ToolbarHost {
  element: HTMLElement;
  textarea: HTMLTextAreaElement | null;
  container: HTMLElement;
  showPlainTextarea: (enabled: boolean) => void;
  showPreviewMode?: (enabled: boolean) => void;
}

type ToolbarButtonPreset =
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'quote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'view'
  | 'plain';

type ToolbarButtonEntry = ToolbarButtonConfig | ToolbarButtonPreset | '|' | 'separator' | 'divider';

interface ToolbarButtonConfig {
  name?: keyof typeof icons | string;
  icon?: string;
  title?: string;
  action?: string;
  separator?: boolean;
  hasDropdown?: boolean;
}

const BUTTON_PRESETS: Record<ToolbarButtonPreset, ToolbarButtonConfig> = {
  bold: { name: 'bold', icon: icons.boldIcon, title: 'Bold (Ctrl+B)', action: 'toggleBold' },
  italic: { name: 'italic', icon: icons.italicIcon, title: 'Italic (Ctrl+I)', action: 'toggleItalic' },
  code: { name: 'code', icon: icons.codeIcon, title: 'Code (Ctrl+`)', action: 'toggleCode' },
  link: { name: 'link', icon: icons.linkIcon, title: 'Insert Link (Ctrl+K)', action: 'insertLink' },
  quote: { name: 'quote', icon: icons.quoteIcon, title: 'Quote', action: 'toggleQuote' },
  bulletList: { name: 'bulletList', icon: icons.bulletListIcon, title: 'Bullet List', action: 'toggleBulletList' },
  orderedList: { name: 'orderedList', icon: icons.orderedListIcon, title: 'Numbered List', action: 'toggleNumberedList' },
  taskList: { name: 'taskList', icon: icons.taskListIcon, title: 'Task List', action: 'toggleTaskList' },
  h1: { name: 'h1', icon: icons.h1Icon, title: 'Heading 1', action: 'insertH1' },
  h2: { name: 'h2', icon: icons.h2Icon, title: 'Heading 2', action: 'insertH2' },
  h3: { name: 'h3', icon: icons.h3Icon, title: 'Heading 3', action: 'insertH3' },
  view: { name: 'viewMode', icon: icons.eyeIcon, title: 'View mode', action: 'toggle-view-menu', hasDropdown: true },
  plain: { name: 'togglePlain', icon: icons.eyeOffIcon, title: 'Toggle plain textarea', action: 'toggle-plain' }
};

const DEFAULT_BUTTONS: ToolbarButtonEntry[] = [
  'bold',
  'italic',
  '|',
  'h1',
  'h2',
  'h3',
  '|',
  'link',
  'code',
  '|',
  'quote',
  '|',
  'bulletList',
  'orderedList',
  'taskList',
  '|',
  'view'
];

const SEPARATOR_TOKENS = new Set(['|', 'separator', 'divider']);

export class Toolbar {
  private readonly editor: ToolbarHost;
  private readonly buttonConfig: ToolbarButtonEntry[] | null;
  private container: HTMLDivElement | null = null;
  private buttons: Record<string, HTMLButtonElement> = {};
  private viewModeButton?: HTMLButtonElement;
  private handleDocumentClick?: (event: MouseEvent) => void;
  private readonly actions: MarkdownActions = markdownActions;

  constructor(editor: ToolbarHost, buttonConfig: ToolbarButtonEntry[] | null = null) {
    this.editor = editor;
    this.buttonConfig = buttonConfig;
  }

  create(): HTMLDivElement | null {
    this.container = document.createElement('div');
    this.container.className = 'marzipan-toolbar';
    this.container.setAttribute('role', 'toolbar');
    this.container.setAttribute('aria-label', 'Text formatting');

    const normalizedButtons = this.resolveButtons(this.buttonConfig ?? DEFAULT_BUTTONS);

    normalizedButtons.forEach((config) => {
      if (config.separator) {
        const separator = document.createElement('div');
        separator.className = 'marzipan-toolbar-separator';
        separator.setAttribute('role', 'separator');
        this.container!.appendChild(separator);
      } else if (config.action && config.icon) {
        const button = this.createButton(config);
        if (config.name) {
          this.buttons[config.name] = button;
        }
        this.container!.appendChild(button);
      }
    });

    const container = this.editor.element.querySelector('.marzipan-container');
    const wrapper = this.editor.element.querySelector('.marzipan-wrapper');
    if (container instanceof HTMLElement && wrapper instanceof HTMLElement) {
      container.insertBefore(this.container, wrapper);
    }

    return this.container;
  }

  private resolveButtons(entries: ToolbarButtonEntry[]): ToolbarButtonConfig[] {
    const resolved: ToolbarButtonConfig[] = [];

    entries.forEach((entry) => {
      if (!entry) return;

      if (typeof entry === 'string') {
        if (SEPARATOR_TOKENS.has(entry)) {
          resolved.push({ separator: true });
          return;
        }

        const preset = BUTTON_PRESETS[entry as ToolbarButtonPreset];
        if (preset) {
          resolved.push({ ...preset });
        } else {
          console.warn(`[Marzipan] Unknown toolbar button preset: ${entry}`);
        }
        return;
      }

      resolved.push({ ...entry });
    });

    return resolved;
  }

  private createButton(config: ToolbarButtonConfig): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'marzipan-toolbar-button';
    button.type = 'button';
    button.title = config.title ?? '';
    button.setAttribute('aria-label', config.title ?? '');
    if (config.action) {
      button.dataset.action = config.action;
    }
    button.innerHTML = config.icon ?? '';

    if (config.hasDropdown) {
      button.classList.add('has-dropdown');
      if (config.name === 'viewMode') {
        this.viewModeButton = button;
      }
    }

    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (config.action) {
        this.handleAction(config.action, button);
      }
    });

    return button;
  }

  handleAction(action: string, button?: HTMLButtonElement): void {
    const textarea = this.editor.textarea;
    if (!textarea) return;

    if (action === 'toggle-view-menu') {
      if (button) {
        this.toggleViewDropdown(button);
      }
      return;
    }

    textarea.focus();

    switch (action) {
      case 'toggleBold':
        this.actions.toggleBold(textarea);
        break;
      case 'toggleItalic':
        this.actions.toggleItalic(textarea);
        break;
      case 'insertH1':
        this.actions.toggleH1(textarea);
        break;
      case 'insertH2':
        this.actions.toggleH2(textarea);
        break;
      case 'insertH3':
        this.actions.toggleH3(textarea);
        break;
      case 'insertLink':
        this.actions.insertLink(textarea);
        break;
      case 'toggleCode':
        this.actions.toggleCode(textarea);
        break;
      case 'toggleBulletList':
        this.actions.toggleBulletList(textarea);
        break;
      case 'toggleNumberedList':
        this.actions.toggleNumberedList(textarea);
        break;
      case 'toggleQuote':
        this.actions.toggleQuote(textarea);
        break;
      case 'toggleTaskList':
        this.actions.toggleTaskList(textarea);
        break;
      case 'toggle-plain':
        this.togglePlainMode();
        break;
      default:
        console.warn(`[Marzipan] Unknown toolbar action: ${action}`);
        break;
    }

    if (action !== 'toggle-view-menu') {
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private togglePlainMode(): void {
    const isPlain = this.editor.container.classList.contains('plain-mode');
    this.editor.showPlainTextarea(!isPlain);
  }

  updateButtonStates(): void {
    const textarea = this.editor.textarea;
    if (!textarea) return;

    const activeFormats = this.actions.getActiveFormats(textarea);

    Object.entries(this.buttons).forEach(([name, button]) => {
      let isActive = false;

      switch (name) {
        case 'bold':
          isActive = activeFormats.includes('bold');
          break;
        case 'italic':
          isActive = activeFormats.includes('italic');
          break;
        case 'code':
          isActive = false;
          break;
        case 'bulletList':
          isActive = activeFormats.includes('bullet-list');
          break;
        case 'orderedList':
          isActive = activeFormats.includes('numbered-list');
          break;
        case 'quote':
          isActive = activeFormats.includes('quote');
          break;
        case 'taskList':
          isActive = activeFormats.includes('task-list');
          break;
        case 'h1':
          isActive = activeFormats.includes('header');
          break;
        case 'h2':
          isActive = activeFormats.includes('header-2');
          break;
        case 'h3':
          isActive = activeFormats.includes('header-3');
          break;
        case 'togglePlain':
          isActive = !this.editor.container.classList.contains('plain-mode');
          break;
        default:
          break;
      }

      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  private toggleViewDropdown(button: HTMLButtonElement): void {
    const existingDropdown = document.querySelector('.marzipan-dropdown-menu');
    if (existingDropdown instanceof HTMLElement) {
      existingDropdown.remove();
      button.classList.remove('dropdown-active');
      document.removeEventListener('click', this.handleDocumentClick!);
      return;
    }

    const dropdown = this.createViewDropdown();

    const rect = button.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;

    document.body.appendChild(dropdown);
    button.classList.add('dropdown-active');

    this.handleDocumentClick = (event: MouseEvent) => {
      if (!button.contains(event.target as Node) && !dropdown.contains(event.target as Node)) {
        dropdown.remove();
        button.classList.remove('dropdown-active');
        document.removeEventListener('click', this.handleDocumentClick!);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', this.handleDocumentClick!);
    }, 0);
  }

  private createViewDropdown(): HTMLDivElement {
    const dropdown = document.createElement('div');
    dropdown.className = 'marzipan-dropdown-menu';

    const isPlain = this.editor.container.classList.contains('plain-mode');
    const isPreview = this.editor.container.classList.contains('preview-mode');
    const currentMode = isPreview ? 'preview' : isPlain ? 'plain' : 'normal';

    const modes: Array<{ id: 'normal' | 'plain' | 'preview'; label: string; icon: string }> = [
      { id: 'normal', label: 'Normal Edit', icon: '✓' },
      { id: 'plain', label: 'Plain Textarea', icon: '✓' },
      { id: 'preview', label: 'Preview Mode', icon: '✓' },
    ];

    modes.forEach((mode) => {
      const item = document.createElement('button');
      item.className = 'marzipan-dropdown-item';
      item.type = 'button';

      const check = document.createElement('span');
      check.className = 'marzipan-dropdown-check';
      check.textContent = currentMode === mode.id ? mode.icon : '';

      const label = document.createElement('span');
      label.textContent = mode.label;

      item.appendChild(check);
      item.appendChild(label);

      if (currentMode === mode.id) {
        item.classList.add('active');
      }

      item.addEventListener('click', (event) => {
        event.stopPropagation();
        this.setViewMode(mode.id);
        dropdown.remove();
        this.viewModeButton?.classList.remove('dropdown-active');
        if (this.handleDocumentClick) {
          document.removeEventListener('click', this.handleDocumentClick);
        }
      });

      dropdown.appendChild(item);
    });

    return dropdown;
  }

  private setViewMode(mode: 'normal' | 'plain' | 'preview'): void {
    this.editor.container.classList.remove('plain-mode', 'preview-mode');

    switch (mode) {
      case 'plain':
        this.editor.showPlainTextarea(true);
        break;
      case 'preview':
        this.editor.showPreviewMode?.(true);
        break;
      case 'normal':
      default:
        this.editor.showPlainTextarea(false);
        if (typeof this.editor.showPreviewMode === 'function') {
          this.editor.showPreviewMode(false);
        }
        break;
    }
  }

  destroy(): void {
    if (this.container) {
      if (this.handleDocumentClick) {
        document.removeEventListener('click', this.handleDocumentClick);
      }
      this.container.remove();
      this.container = null;
      this.buttons = {};
      this.viewModeButton = undefined;
      this.handleDocumentClick = undefined;
    }
  }
}
