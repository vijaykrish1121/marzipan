export interface FormatStyleOptions {
  prefix?: string;
  suffix?: string;
  blockPrefix?: string;
  blockSuffix?: string;
  multiline?: boolean;
  replaceNext?: string;
  prefixSpace?: boolean;
  scanFor?: string | RegExp;
  surroundWithNewlines?: boolean;
  orderedList?: boolean;
  unorderedList?: boolean;
  trimFirst?: boolean;
}

export interface ResolvedFormatStyle {
  prefix: string;
  suffix: string;
  blockPrefix: string;
  blockSuffix: string;
  multiline: boolean;
  replaceNext: string;
  prefixSpace: boolean;
  scanFor: string | RegExp | null;
  surroundWithNewlines: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  trimFirst: boolean;
}

export interface TextTransformResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export type UndoMethod = 'native' | 'manual' | 'auto';

export interface LineOperationAdjustment {
  start: number;
  end: number;
}

export interface LineOperationOptions {
  prefix?: string;
  adjustSelection?: (
    isRemoving: boolean,
    selectionStart: number,
    selectionEnd: number,
    lineStart: number
  ) => LineOperationAdjustment;
}
