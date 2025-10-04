let debugMode = false;

export function setDebugMode(enabled: boolean): void {
  debugMode = enabled;
}

export function getDebugMode(): boolean {
  return debugMode;
}

export function debugLog(functionName: string, message: string, data?: unknown): void {
  if (!debugMode) return;

  console.group(`🔍 ${functionName}`);
  console.log(message);
  if (data !== undefined) {
    console.log('Data:', data);
  }
  console.groupEnd();
}

export function debugSelection(textarea: HTMLTextAreaElement, label: string): void {
  if (!debugMode) return;

  const selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
  console.group(`📍 Selection: ${label}`);
  console.log('Position:', `${textarea.selectionStart}-${textarea.selectionEnd}`);
  console.log('Selected text:', JSON.stringify(selected));
  console.log('Length:', selected.length);

  const before = textarea.value.slice(Math.max(0, textarea.selectionStart - 10), textarea.selectionStart);
  const after = textarea.value.slice(textarea.selectionEnd, Math.min(textarea.value.length, textarea.selectionEnd + 10));
  console.log('Context:', `${JSON.stringify(before)}[SELECTION]${JSON.stringify(after)}`);
  console.groupEnd();
}

export function debugResult(result: { text: string; selectionStart: number; selectionEnd: number }): void {
  if (!debugMode) return;

  console.group('📝 Result');
  console.log('Text to insert:', JSON.stringify(result.text));
  console.log('New selection:', `${result.selectionStart}-${result.selectionEnd}`);
  console.groupEnd();
}
