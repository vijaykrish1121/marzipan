import { FORMATS } from './formats';

function hasFormatApplied(text: string, formatKey: keyof typeof FORMATS): boolean {
  const format = FORMATS[formatKey];
  if (!format) return false;
  const prefix = format.prefix ?? '';
  const suffix = format.suffix ?? '';

  if (!prefix) return false;
  if (suffix) {
    return text.startsWith(prefix) && text.endsWith(suffix);
  }
  return text.startsWith(prefix);
}

export function getActiveFormats(textarea: HTMLTextAreaElement | null): string[] {
  if (!textarea) return [];

  const formats: string[] = [];
  const { selectionStart, selectionEnd, value } = textarea;

  const lines = value.split('\n');
  let lineStart = 0;
  let currentLine = '';

  for (const line of lines) {
    if (selectionStart >= lineStart && selectionStart <= lineStart + line.length) {
      currentLine = line;
      break;
    }
    lineStart += line.length + 1;
  }

  if (currentLine.startsWith('- ')) {
    if (currentLine.startsWith('- [ ] ') || currentLine.startsWith('- [x] ')) {
      formats.push('task-list');
    } else {
      formats.push('bullet-list');
    }
  }

  if (/^\d+\.\s/.test(currentLine)) {
    formats.push('numbered-list');
  }

  if (currentLine.startsWith('> ')) {
    formats.push('quote');
  }

  if (currentLine.startsWith('# ')) formats.push('header');
  if (currentLine.startsWith('## ')) formats.push('header-2');
  if (currentLine.startsWith('### ')) formats.push('header-3');

  const lookBehind = Math.max(0, selectionStart - 10);
  const lookAhead = Math.min(value.length, selectionEnd + 10);
  const surrounding = value.slice(lookBehind, lookAhead);

  if (surrounding.includes('**')) {
    const beforeCursor = value.slice(Math.max(0, selectionStart - 100), selectionStart);
    const afterCursor = value.slice(selectionEnd, Math.min(value.length, selectionEnd + 100));
    const lastOpenBold = beforeCursor.lastIndexOf('**');
    const nextCloseBold = afterCursor.indexOf('**');
    if (lastOpenBold !== -1 && nextCloseBold !== -1) {
      formats.push('bold');
    }
  }

  if (surrounding.includes('_')) {
    const beforeCursor = value.slice(Math.max(0, selectionStart - 100), selectionStart);
    const afterCursor = value.slice(selectionEnd, Math.min(value.length, selectionEnd + 100));
    const lastOpenItalic = beforeCursor.lastIndexOf('_');
    const nextCloseItalic = afterCursor.indexOf('_');
    if (lastOpenItalic !== -1 && nextCloseItalic !== -1) {
      formats.push('italic');
    }
  }

  if (surrounding.includes('`')) {
    const beforeCursor = value.slice(Math.max(0, selectionStart - 100), selectionStart);
    const afterCursor = value.slice(selectionEnd, Math.min(value.length, selectionEnd + 100));
    if (beforeCursor.includes('`') && afterCursor.includes('`')) {
      formats.push('code');
    }
  }

  if (surrounding.includes('[') && surrounding.includes(']')) {
    const beforeCursor = value.slice(Math.max(0, selectionStart - 100), selectionStart);
    const afterCursor = value.slice(selectionEnd, Math.min(value.length, selectionEnd + 100));
    const lastOpenBracket = beforeCursor.lastIndexOf('[');
    const nextCloseBracket = afterCursor.indexOf(']');
    if (lastOpenBracket !== -1 && nextCloseBracket !== -1) {
      const afterBracket = value.slice(selectionEnd + nextCloseBracket + 1, selectionEnd + nextCloseBracket + 10);
      if (afterBracket.startsWith('(')) {
        formats.push('link');
      }
    }
  }

  return formats;
}

export function hasFormat(textarea: HTMLTextAreaElement, format: string): boolean {
  const activeFormats = getActiveFormats(textarea);
  return activeFormats.includes(format);
}

interface ExpandSelectionOptions {
  toWord?: boolean;
  toLine?: boolean;
  toFormat?: keyof typeof FORMATS;
}

export function expandSelection(textarea: HTMLTextAreaElement | null, options: ExpandSelectionOptions = {}): void {
  if (!textarea) return;

  const { toWord, toLine, toFormat } = options;
  const { selectionStart, selectionEnd, value } = textarea;

  if (toLine) {
    const lines = value.split('\n');
    let lineStart = 0;
    let lineEnd = 0;
    let currentPos = 0;

    for (const line of lines) {
      if (selectionStart >= currentPos && selectionStart <= currentPos + line.length) {
        lineStart = currentPos;
        lineEnd = currentPos + line.length;
        break;
      }
      currentPos += line.length + 1;
    }

    textarea.selectionStart = lineStart;
    textarea.selectionEnd = lineEnd;
    return;
  }

  if (toFormat && hasFormatApplied(value.slice(selectionStart, selectionEnd), toFormat)) {
    const format = FORMATS[toFormat];
    const prefixLength = (format.prefix ?? '').length;
    const suffixLength = (format.suffix ?? '').length;
    textarea.selectionStart = Math.max(0, selectionStart - prefixLength);
    textarea.selectionEnd = Math.min(value.length, selectionEnd + suffixLength);
    return;
  }

  if (toWord && selectionStart === selectionEnd) {
    let start = selectionStart;
    let end = selectionEnd;

    while (start > 0 && !/\s/.test(value[start - 1]!)) {
      start -= 1;
    }

    while (end < value.length && !/\s/.test(value[end]!)) {
      end += 1;
    }

    textarea.selectionStart = start;
    textarea.selectionEnd = end;
  }
}
