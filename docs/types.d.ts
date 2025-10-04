/**
 * TypeScript definitions for Marzipan markdown editor
 * @version 1.0.6
 * @author Pink Pixel
 */

export interface MarzipanTheme {
  name: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  // Base colors
  background: string;
  text: string;
  textMuted?: string;
  
  // Syntax highlighting
  comment: string;
  keyword: string;
  string: string;
  number: string;
  punctuation?: string;
  
  // UI elements
  selection?: string;
  border?: string;
  toolbar?: string;
  
  // Interactive elements
  linkHover?: string;
  buttonActive?: string;
  
  // Additional colors for custom themes
  [key: string]: string | undefined;
}

export interface MarzipanMobileOptions {
  fontSize: string;
  padding: string;
  lineHeight: number;
}

export interface StatsData {
  chars: number;
  words: number;
  lines: number;
  line: number;
  column: number;
}

export type StatsFormatter = (stats: StatsData) => string;

export type ChangeHandler = (value: string, instance: Marzipan) => void;

export type KeydownHandler = (event: KeyboardEvent, instance: Marzipan) => void;

export interface ToolbarConfig {
  buttons: Array<ToolbarButton | '|'>;
}

export type ToolbarButton = 
  | 'bold' 
  | 'italic' 
  | 'strikethrough' 
  | 'code' 
  | 'link' 
  | 'image' 
  | 'quote' 
  | 'ul' 
  | 'ol' 
  | 'hr' 
  | 'toggle-plain';

export interface TextareaProps {
  [key: string]: any;
  className?: string;
  class?: string;
  style?: Partial<CSSStyleDeclaration> | string;
  'aria-label'?: string;
  'data-testid'?: string;
  maxlength?: number;
  rows?: number;
  cols?: number;
}

export interface MarzipanOptions {
  // Typography
  fontSize?: string;
  lineHeight?: number;
  fontFamily?: string;
  padding?: string;
  
  // Mobile-specific styles
  mobile?: Partial<MarzipanMobileOptions>;
  
  // Textarea properties
  textareaProps?: TextareaProps;
  
  // Behavior
  autofocus?: boolean;
  autoResize?: boolean;
  minHeight?: string;
  maxHeight?: string | null;
  placeholder?: string;
  value?: string;
  
  // Callbacks
  onChange?: ChangeHandler;
  onKeydown?: KeydownHandler;
  
  // Features
  showActiveLineRaw?: boolean;
  showStats?: boolean;
  toolbar?: boolean | ToolbarConfig;
  statsFormatter?: StatsFormatter;
  smartLists?: boolean;
  
  // Themes (per-instance)
  theme?: string | MarzipanTheme;
}

export interface RenderOptions {
  cleanHTML?: boolean;
}

export type TargetElement = string | Element | NodeList | Array<Element>;

export declare class Marzipan {
  // Static properties
  static instances: WeakMap<Element, Marzipan>;
  static stylesInjected: boolean;
  static globalListenersInitialized: boolean;
  static instanceCount: number;
  static currentTheme: MarzipanTheme;
  
  // Static attached utilities
  static MarkdownParser: any;
  static ShortcutsManager: any;
  static themes: { [key: string]: MarzipanTheme };
  static getTheme: (name: string) => MarzipanTheme | null;

  // Instance properties
  element: Element;
  container: HTMLElement;
  wrapper: HTMLElement;
  textarea: HTMLTextAreaElement;
  preview: HTMLElement;
  statsBar?: HTMLElement;
  toolbar?: any;
  shortcuts: any;
  linkTooltip: any;
  
  options: Required<MarzipanOptions>;
  instanceId: number;
  initialized: boolean;
  instanceTheme: string | MarzipanTheme | null;

  // Constructor
  constructor(target: TargetElement, options?: MarzipanOptions);

  // Instance methods - Content Management
  getValue(): string;
  setValue(value: string): void;
  getRenderedHTML(options?: RenderOptions): string;
  getPreviewHTML(): string;
  getCleanHTML(): string;

  // Instance methods - Focus Management
  focus(): void;
  blur(): void;

  // Instance methods - Display Modes
  showPlainTextarea(show: boolean): boolean;
  showPreviewMode(show: boolean): boolean;
  showStats(show: boolean): void;

  // Instance methods - Editor State
  updatePreview(): void;
  isInitialized(): boolean;
  reinit(options?: Partial<MarzipanOptions>): void;
  destroy(): void;

  // Instance methods - Event Handlers (typically internal)
  handleInput(event: Event): void;
  handleKeydown(event: KeyboardEvent): void;
  handleScroll(event: Event): void;
  handleSmartListContinuation(): boolean;

  // Static methods
  static init(target: TargetElement, options?: MarzipanOptions): Array<Marzipan>;
  static getInstance(element: Element): Marzipan | null;
  static destroyAll(): void;
  static setTheme(theme: string | MarzipanTheme, customColors?: Partial<ThemeColors>): void;
  static injectStyles(force?: boolean): void;
  static initGlobalListeners(): void;
}

// Default export
export default Marzipan;

// Module declaration for environments that need it
declare module '@pinkpixel/marzipan' {
  export default Marzipan;
  export { 
    Marzipan, 
    MarzipanOptions, 
    MarzipanTheme, 
    ThemeColors, 
    StatsData, 
    StatsFormatter,
    ChangeHandler,
    KeydownHandler,
    ToolbarConfig,
    ToolbarButton,
    TextareaProps,
    RenderOptions,
    TargetElement
  };
}

// Global declaration for browser environments
declare global {
  interface Window {
    Marzipan: typeof Marzipan;
  }
  
  interface Element {
    MarzipanInstance?: Marzipan;
  }
}