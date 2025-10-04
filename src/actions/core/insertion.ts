import { getDebugMode } from '../debug';
import type { TextTransformResult, UndoMethod } from '../types';

let canInsertText: boolean | null = null;

export function insertText(textarea: HTMLTextAreaElement, result: TextTransformResult): void {
  const debugMode = getDebugMode();

  if (debugMode) {
    console.group('🔧 insertText');
    console.log('Current selection:', `${textarea.selectionStart}-${textarea.selectionEnd}`);
    console.log('Text to insert:', JSON.stringify(result.text));
    console.log('New selection to set:', result.selectionStart, '-', result.selectionEnd);
  }

  textarea.focus();

  const originalSelectionStart = textarea.selectionStart;
  const originalSelectionEnd = textarea.selectionEnd;
  const before = textarea.value.slice(0, originalSelectionStart);
  const after = textarea.value.slice(originalSelectionEnd);

  if (debugMode) {
    console.log('Before text (last 20):', JSON.stringify(before.slice(-20)));
    console.log('After text (first 20):', JSON.stringify(after.slice(0, 20)));
    console.log(
      'Selected text being replaced:',
      JSON.stringify(textarea.value.slice(originalSelectionStart, originalSelectionEnd)),
    );
  }

  const originalValue = textarea.value;

  if (canInsertText === null || canInsertText === true) {
    textarea.contentEditable = 'true';
    try {
      canInsertText = document.execCommand('insertText', false, result.text);
      if (debugMode) {
        console.log(
          'execCommand returned:',
          canInsertText,
          'for text with',
          result.text.split('\n').length,
          'lines',
        );
      }
    } catch (error) {
      canInsertText = false;
      if (debugMode) console.log('execCommand threw error:', error);
    }
    textarea.contentEditable = 'false';
  }

  if (debugMode) {
    console.log('canInsertText before:', canInsertText);
    console.log('execCommand result:', canInsertText);
  }

  if (canInsertText) {
    const expectedValue = before + result.text + after;
    const actualValue = textarea.value;

    if (debugMode) {
      console.log('Expected length:', expectedValue.length);
      console.log('Actual length:', actualValue.length);
    }

    if (actualValue !== expectedValue) {
      if (debugMode) {
        console.log('execCommand changed the value but not as expected');
        console.log('Expected:', JSON.stringify(expectedValue.slice(0, 100)));
        console.log('Actual:', JSON.stringify(actualValue.slice(0, 100)));
      }
      // execCommand succeeded, so do not attempt manual insertion
    }
  }

  if (!canInsertText) {
    if (debugMode) console.log('Using manual insertion');
    if (textarea.value === originalValue) {
      if (debugMode) console.log('Value unchanged, doing manual replacement');
      try {
        document.execCommand('ms-beginUndoUnit');
      } catch {
        // Ignore browser-specific command failures
      }
      textarea.value = before + result.text + after;
      try {
        document.execCommand('ms-endUndoUnit');
      } catch {
        // Ignore browser-specific command failures
      }
      textarea.dispatchEvent(new CustomEvent('input', { bubbles: true, cancelable: true }));
    } else if (debugMode) {
      console.log('Value was changed by execCommand, skipping manual insertion');
    }
  }

  if (debugMode) console.log('Setting selection range:', result.selectionStart, result.selectionEnd);
  if (result.selectionStart != null && result.selectionEnd != null) {
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
  } else {
    textarea.setSelectionRange(originalSelectionStart, textarea.selectionEnd);
  }

  if (debugMode) {
    console.log('Final value length:', textarea.value.length);
    console.groupEnd();
  }
}

export function setUndoMethod(method: UndoMethod): void {
  switch (method) {
    case 'native':
      canInsertText = true;
      break;
    case 'manual':
      canInsertText = false;
      break;
    case 'auto':
    default:
      canInsertText = null;
      break;
  }
}

export function getUndoMethod(): UndoMethod {
  if (canInsertText === true) return 'native';
  if (canInsertText === false) return 'manual';
  return 'auto';
}
