export function buildTableMarkdown(rows: number, cols: number): string {
  const safeRows = Math.max(1, Math.floor(rows));
  const safeCols = Math.max(1, Math.floor(cols));

  const header = Array.from({ length: safeCols }, (_, i) => `Header ${i + 1}`).join(' | ');
  const divider = Array.from({ length: safeCols }, () => '---').join(' | ');
  const body = Array.from({ length: safeRows }, () =>
    Array.from({ length: safeCols }, () => ' ').join(' | '),
  )
    .map((row) => `| ${row} |`)
    .join('\n');

  return `| ${header} |\n| ${divider} |\n${body}\n`;
}

export function resolvePositiveInteger(value: string | null, fallback: number): number | null {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return Math.max(1, fallback);
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return Math.max(1, fallback);
  }

  return parsed;
}
