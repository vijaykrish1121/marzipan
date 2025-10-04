import { insertText } from '../core/insertion';
import { applyLineOperation, expandSelectionToLine, newlinesToSurroundSelectedText } from '../core/selection';
import type { ResolvedFormatStyle, TextTransformResult } from '../types';

function undoOrderedListStyle(text: string): { text: string; processed: boolean } {
  const lines = text.split('\n');
  const orderedListRegex = /^\d+\.\s+/;
  const shouldUndoOrderedList = lines.every((line) => orderedListRegex.test(line));
  const result = shouldUndoOrderedList ? lines.map((line) => line.replace(orderedListRegex, '')) : lines;

  return {
    text: result.join('\n'),
    processed: shouldUndoOrderedList,
  };
}

function undoUnorderedListStyle(text: string): { text: string; processed: boolean } {
  const lines = text.split('\n');
  const unorderedListPrefix = '- ';
  const shouldUndoUnorderedList = lines.every((line) => line.startsWith(unorderedListPrefix));
  const result = shouldUndoUnorderedList ? lines.map((line) => line.slice(unorderedListPrefix.length)) : lines;

  return {
    text: result.join('\n'),
    processed: shouldUndoUnorderedList,
  };
}

function makePrefix(index: number, unorderedList: boolean): string {
  if (unorderedList) {
    return '- ';
  }
  return `${index + 1}. `;
}

function clearExistingListStyle(
  style: ResolvedFormatStyle,
  selectedText: string,
): [
  { text: string; processed: boolean },
  { text: string; processed: boolean },
  string,
] {
  let undoResult;
  let undoResultOppositeList;
  let pristineText;

  if (style.orderedList) {
    undoResult = undoOrderedListStyle(selectedText);
    undoResultOppositeList = undoUnorderedListStyle(undoResult.text);
    pristineText = undoResultOppositeList.text;
  } else {
    undoResult = undoUnorderedListStyle(selectedText);
    undoResultOppositeList = undoOrderedListStyle(undoResult.text);
    pristineText = undoResultOppositeList.text;
  }

  return [undoResult, undoResultOppositeList, pristineText];
}

export function listStyle(textarea: HTMLTextAreaElement, style: ResolvedFormatStyle): TextTransformResult {
  const noInitialSelection = textarea.selectionStart === textarea.selectionEnd;
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;

  expandSelectionToLine(textarea);

  const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);

  const [undoResult, undoResultOppositeList, pristineText] = clearExistingListStyle(style, selectedText);

  const prefixedLines = pristineText.split('\n').map((value, index) => {
    return `${makePrefix(index, style.unorderedList)}${value}`;
  });

  const totalPrefixLength = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
    return previousValue + makePrefix(currentIndex, style.unorderedList).length;
  }, 0);

  const totalPrefixLengthOppositeList = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
    return previousValue + makePrefix(currentIndex, !style.unorderedList).length;
  }, 0);

  if (undoResult.processed) {
    if (noInitialSelection) {
      selectionStart = Math.max(selectionStart - makePrefix(0, style.unorderedList).length, 0);
      selectionEnd = selectionStart;
    } else {
      selectionStart = textarea.selectionStart;
      selectionEnd = textarea.selectionEnd - totalPrefixLength;
    }
    return { text: pristineText, selectionStart, selectionEnd };
  }

  const { newlinesToAppend, newlinesToPrepend } = newlinesToSurroundSelectedText(textarea);
  const text = newlinesToAppend + prefixedLines.join('\n') + newlinesToPrepend;

  if (noInitialSelection) {
    selectionStart = Math.max(
      selectionStart + makePrefix(0, style.unorderedList).length + newlinesToAppend.length,
      0,
    );
    selectionEnd = selectionStart;
  } else if (undoResultOppositeList.processed) {
    selectionStart = Math.max(textarea.selectionStart + newlinesToAppend.length, 0);
    selectionEnd =
      textarea.selectionEnd + newlinesToAppend.length + totalPrefixLength - totalPrefixLengthOppositeList;
  } else {
    selectionStart = Math.max(textarea.selectionStart + newlinesToAppend.length, 0);
    selectionEnd = textarea.selectionEnd + newlinesToAppend.length + totalPrefixLength;
  }

  return { text, selectionStart, selectionEnd };
}

export function applyListStyle(textarea: HTMLTextAreaElement, style: ResolvedFormatStyle): void {
  const result = applyLineOperation(
    textarea,
    (ta) => listStyle(ta, style),
    {
      adjustSelection: (_isRemoving, selStart, selEnd, lineStart) => {
        const currentLine = textarea.value.slice(lineStart, textarea.selectionEnd);
        const orderedListRegex = /^\d+\.\s+/;
        const unorderedListRegex = /^- /;

        const hasOrderedList = orderedListRegex.test(currentLine);
        const hasUnorderedList = unorderedListRegex.test(currentLine);
        const isRemovingCurrent =
          (style.orderedList && hasOrderedList) || (style.unorderedList && hasUnorderedList);

        if (selStart === selEnd) {
          if (isRemovingCurrent) {
            const prefixMatch = currentLine.match(style.orderedList ? orderedListRegex : unorderedListRegex);
            const prefixLength = prefixMatch ? prefixMatch[0]!.length : 0;
            return {
              start: Math.max(selStart - prefixLength, lineStart),
              end: Math.max(selStart - prefixLength, lineStart),
            };
          }

          if (hasOrderedList || hasUnorderedList) {
            const oldPrefixMatch = currentLine.match(hasOrderedList ? orderedListRegex : unorderedListRegex);
            const oldPrefixLength = oldPrefixMatch ? oldPrefixMatch[0]!.length : 0;
            const newPrefixLength = style.unorderedList ? 2 : 3;
            const adjustment = newPrefixLength - oldPrefixLength;
            return {
              start: selStart + adjustment,
              end: selStart + adjustment,
            };
          }

          const prefixLength = style.unorderedList ? 2 : 3;
          return {
            start: selStart + prefixLength,
            end: selStart + prefixLength,
          };
        }

        if (isRemovingCurrent) {
          const prefixMatch = currentLine.match(style.orderedList ? orderedListRegex : unorderedListRegex);
          const prefixLength = prefixMatch ? prefixMatch[0]!.length : 0;
          return {
            start: Math.max(selStart - prefixLength, lineStart),
            end: Math.max(selEnd - prefixLength, lineStart),
          };
        }

        if (hasOrderedList || hasUnorderedList) {
          const oldPrefixMatch = currentLine.match(hasOrderedList ? orderedListRegex : unorderedListRegex);
          const oldPrefixLength = oldPrefixMatch ? oldPrefixMatch[0]!.length : 0;
          const newPrefixLength = style.unorderedList ? 2 : 3;
          const adjustment = newPrefixLength - oldPrefixLength;
          return {
            start: selStart + adjustment,
            end: selEnd + adjustment,
          };
        }

        const prefixLength = style.unorderedList ? 2 : 3;
        return {
          start: selStart + prefixLength,
          end: selEnd + prefixLength,
        };
      },
      prefix: style.unorderedList ? '- ' : '1. ',
    },
  );

  insertText(textarea, result);
}
