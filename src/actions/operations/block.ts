import { insertText } from '../core/insertion';
import {
  expandSelectedText,
  isMultipleLines,
  newlinesToSurroundSelectedText,
} from '../core/selection';
import type { ResolvedFormatStyle, TextTransformResult } from '../types';

export function blockStyle(textarea: HTMLTextAreaElement, style: ResolvedFormatStyle): TextTransformResult {
  const {
    prefix,
    suffix,
    blockPrefix,
    blockSuffix,
    replaceNext,
    prefixSpace,
    scanFor,
    surroundWithNewlines,
    trimFirst,
  } = style;

  const originalSelectionStart = textarea.selectionStart;
  const originalSelectionEnd = textarea.selectionEnd;

  let selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
  let prefixToUse =
    isMultipleLines(selectedText) && blockPrefix && blockPrefix.length > 0 ? `${blockPrefix}\n` : prefix;
  let suffixToUse =
    isMultipleLines(selectedText) && blockSuffix && blockSuffix.length > 0 ? `\n${blockSuffix}` : suffix;

  if (prefixSpace) {
    const beforeSelection = textarea.value[textarea.selectionStart - 1];
    if (textarea.selectionStart !== 0 && beforeSelection != null && !/\s/.test(beforeSelection)) {
      prefixToUse = ` ${prefixToUse}`;
    }
  }

  selectedText = expandSelectedText(textarea, prefixToUse, suffixToUse, style.multiline);
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;

  const hasReplaceNext =
    !!replaceNext &&
    replaceNext.length > 0 &&
    suffixToUse.includes(replaceNext) &&
    selectedText.length > 0;

  let newlinesToAppend = '';
  let newlinesToPrepend = '';

  if (surroundWithNewlines) {
    const newlines = newlinesToSurroundSelectedText(textarea);
    newlinesToAppend = newlines.newlinesToAppend;
    newlinesToPrepend = newlines.newlinesToPrepend;
    prefixToUse = newlinesToAppend + prefix;
    suffixToUse += newlinesToPrepend;
  }

  if (selectedText.startsWith(prefixToUse) && selectedText.endsWith(suffixToUse)) {
    const replacementText = selectedText.slice(prefixToUse.length, selectedText.length - suffixToUse.length);
    if (originalSelectionStart === originalSelectionEnd) {
      let position = originalSelectionStart - prefixToUse.length;
      position = Math.max(position, selectionStart);
      position = Math.min(position, selectionStart + replacementText.length);
      selectionStart = position;
      selectionEnd = position;
    } else {
      selectionEnd = selectionStart + replacementText.length;
    }
    return { text: replacementText, selectionStart, selectionEnd };
  }

  if (!hasReplaceNext) {
    let replacementText = prefixToUse + selectedText + suffixToUse;
    selectionStart = originalSelectionStart + prefixToUse.length;
    selectionEnd = originalSelectionEnd + prefixToUse.length;

    const whitespaceEdges = selectedText.match(/^\s*|\s*$/g);
    if (trimFirst && whitespaceEdges) {
      const leadingWhitespace = whitespaceEdges[0] ?? '';
      const trailingWhitespace = whitespaceEdges[1] ?? '';
      replacementText =
        leadingWhitespace + prefixToUse + selectedText.trim() + suffixToUse + trailingWhitespace;
      selectionStart += leadingWhitespace.length;
      selectionEnd -= trailingWhitespace.length;
    }
    return { text: replacementText, selectionStart, selectionEnd };
  }

  if (scanFor) {
    const regex = typeof scanFor === 'string' ? new RegExp(scanFor) : scanFor;
    if (regex.test(selectedText)) {
      const replacementText = prefixToUse + suffixToUse.replace(replaceNext, selectedText);
      selectionStart = selectionStart + prefixToUse.length;
      selectionEnd = selectionStart;
      return { text: replacementText, selectionStart, selectionEnd };
    }
  }

  const replacementText = prefixToUse + selectedText + suffixToUse;
  const replaceIndex = suffixToUse.indexOf(replaceNext);
  selectionStart = selectionStart + prefixToUse.length + selectedText.length + replaceIndex;
  selectionEnd = selectionStart + replaceNext.length;
  return { text: replacementText, selectionStart, selectionEnd };
}

export function styleSelectedText(textarea: HTMLTextAreaElement, style: ResolvedFormatStyle): void {
  const text = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);

  let result: TextTransformResult;
  if (style.orderedList || style.unorderedList) {
    return;
  }
  if (style.multiline && isMultipleLines(text)) {
    result = multilineStyle(textarea, style);
  } else {
    result = blockStyle(textarea, style);
  }

  insertText(textarea, result);
}

export function multilineStyle(textarea: HTMLTextAreaElement, style: ResolvedFormatStyle): TextTransformResult {
  const { prefix, suffix, surroundWithNewlines } = style;
  let text = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;
  const lines = text.split('\n');

  const undoStyle = lines.every((line) => line.startsWith(prefix) && (!suffix || line.endsWith(suffix)));

  if (undoStyle) {
    text = lines
      .map((line) => {
        let result = line.slice(prefix.length);
        if (suffix) {
          result = result.slice(0, result.length - suffix.length);
        }
        return result;
      })
      .join('\n');
    selectionEnd = selectionStart + text.length;
  } else {
    text = lines.map((line) => prefix + line + (suffix ?? '')).join('\n');
    if (surroundWithNewlines) {
      const { newlinesToAppend, newlinesToPrepend } = newlinesToSurroundSelectedText(textarea);
      selectionStart += newlinesToAppend.length;
      selectionEnd = selectionStart + text.length;
      text = newlinesToAppend + text + newlinesToPrepend;
    }
  }

  return { text, selectionStart, selectionEnd };
}
