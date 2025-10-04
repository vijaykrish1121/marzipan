import type { LineOperationOptions, LineOperationAdjustment, TextTransformResult } from '../types';

export function isMultipleLines(text: string): boolean {
  return text.trim().split('\n').length > 1;
}

export function wordSelectionStart(text: string, index: number): number {
  let cursor = index;
  while (text[cursor] && text[cursor - 1] != null && !/\s/.test(text[cursor - 1]!)) {
    cursor -= 1;
  }
  return cursor;
}

export function wordSelectionEnd(text: string, index: number, multiline: boolean): number {
  let cursor = index;
  const breakpoint = multiline ? /\n/ : /\s/;
  while (text[cursor] && !breakpoint.test(text[cursor]!)) {
    cursor += 1;
  }
  return cursor;
}

export function expandSelectionToLine(textarea: HTMLTextAreaElement): void {
  const lines = textarea.value.split('\n');
  let counter = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const lineLength = lines[index]!.length + 1;
    if (textarea.selectionStart >= counter && textarea.selectionStart < counter + lineLength) {
      textarea.selectionStart = counter;
    }
    if (textarea.selectionEnd >= counter && textarea.selectionEnd < counter + lineLength) {
      if (index === lines.length - 1) {
        textarea.selectionEnd = Math.min(counter + lines[index]!.length, textarea.value.length);
      } else {
        textarea.selectionEnd = counter + lineLength - 1;
      }
    }
    counter += lineLength;
  }
}

export function expandSelectedText(
  textarea: HTMLTextAreaElement,
  prefixToUse: string,
  suffixToUse: string,
  multiline = false,
): string {
  if (textarea.selectionStart === textarea.selectionEnd) {
    textarea.selectionStart = wordSelectionStart(textarea.value, textarea.selectionStart);
    textarea.selectionEnd = wordSelectionEnd(textarea.value, textarea.selectionEnd, multiline);
  } else {
    const expandedSelectionStart = textarea.selectionStart - prefixToUse.length;
    const expandedSelectionEnd = textarea.selectionEnd + suffixToUse.length;
    const beginsWithPrefix = textarea.value.slice(expandedSelectionStart, textarea.selectionStart) === prefixToUse;
    const endsWithSuffix = textarea.value.slice(textarea.selectionEnd, expandedSelectionEnd) === suffixToUse;
    if (beginsWithPrefix && endsWithSuffix) {
      textarea.selectionStart = expandedSelectionStart;
      textarea.selectionEnd = expandedSelectionEnd;
    }
  }
  return textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
}

export function newlinesToSurroundSelectedText(textarea: HTMLTextAreaElement): {
  newlinesToAppend: string;
  newlinesToPrepend: string;
} {
  const beforeSelection = textarea.value.slice(0, textarea.selectionStart);
  const afterSelection = textarea.value.slice(textarea.selectionEnd);

  const breaksBefore = beforeSelection.match(/\n*$/);
  const breaksAfter = afterSelection.match(/^\n*/);
  const newlinesBeforeSelection = breaksBefore ? breaksBefore[0]!.length : 0;
  const newlinesAfterSelection = breaksAfter ? breaksAfter[0]!.length : 0;

  let newlinesToAppend = '';
  let newlinesToPrepend = '';

  if (/\S/.test(beforeSelection) && newlinesBeforeSelection < 2) {
    newlinesToAppend = '\n'.repeat(2 - newlinesBeforeSelection);
  }

  if (/\S/.test(afterSelection) && newlinesAfterSelection < 2) {
    newlinesToPrepend = '\n'.repeat(2 - newlinesAfterSelection);
  }

  return { newlinesToAppend, newlinesToPrepend };
}

export function preserveSelection(textarea: HTMLTextAreaElement, callback: () => void): void {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const scrollTop = textarea.scrollTop;

  callback();

  textarea.selectionStart = start;
  textarea.selectionEnd = end;
  textarea.scrollTop = scrollTop;
}

export function applyLineOperation(
  textarea: HTMLTextAreaElement,
  operation: (textarea: HTMLTextAreaElement) => TextTransformResult,
  options: LineOperationOptions = {},
): TextTransformResult {
  const originalStart = textarea.selectionStart;
  const originalEnd = textarea.selectionEnd;
  const noInitialSelection = originalStart === originalEnd;

  const value = textarea.value;
  let lineStart = originalStart;

  while (lineStart > 0 && value[lineStart - 1] !== '\n') {
    lineStart -= 1;
  }

  if (noInitialSelection) {
    let lineEnd = originalStart;
    while (lineEnd < value.length && value[lineEnd] !== '\n') {
      lineEnd += 1;
    }
    textarea.selectionStart = lineStart;
    textarea.selectionEnd = lineEnd;
  } else {
    expandSelectionToLine(textarea);
  }

  const result = operation(textarea);

  if (options.adjustSelection) {
    const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    const prefix = options.prefix ?? '';
    const isRemoving = prefix.length > 0 && selectedText.startsWith(prefix);
    const adjusted: LineOperationAdjustment = options.adjustSelection(
      isRemoving,
      originalStart,
      originalEnd,
      lineStart,
    );
    result.selectionStart = adjusted.start;
    result.selectionEnd = adjusted.end;
    return result;
  }

  if (options.prefix) {
    const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    const isRemoving = selectedText.startsWith(options.prefix);

    if (noInitialSelection) {
      if (isRemoving) {
        const position = Math.max(originalStart - options.prefix.length, lineStart);
        result.selectionStart = position;
        result.selectionEnd = position;
      } else {
        const position = originalStart + options.prefix.length;
        result.selectionStart = position;
        result.selectionEnd = position;
      }
    } else if (isRemoving) {
      result.selectionStart = Math.max(originalStart - options.prefix.length, lineStart);
      result.selectionEnd = Math.max(originalEnd - options.prefix.length, lineStart);
    } else {
      result.selectionStart = originalStart + options.prefix.length;
      result.selectionEnd = originalEnd + options.prefix.length;
    }
  }

  return result;
}
