import { useEffect, useMemo, useRef, useState } from 'react';
import Marzipan, {
  type MarzipanInstance,
  type MarzipanOptions,
  type MarzipanPlugin,
  getTheme,
  themeToCSSVars
} from '@pinkpixel/marzipan-core';

export type ThemeOption = string | { name?: string };

type MarzipanThemeValue = NonNullable<MarzipanOptions['theme']>;

export interface MarzipanCanvasProps {
  id: string;
  value?: string;
  defaultValue?: string;
  theme: ThemeOption;
  accent?: string;
  toolbar?: MarzipanOptions['toolbar'];
  plugins?: MarzipanPlugin[];
  minHeight?: string;
  showStats?: boolean;
  autofocus?: boolean;
  rebuildKey?: string | number;
  onChange?: (value: string) => void;
  onReady?: (instance: MarzipanInstance) => void;
  onAccentChange?: (hex: string) => void;
  className?: string;
}

const DEFAULT_HEIGHT = '360px';

type MarzipanCtor = new (
  target: string | Element | Element[] | NodeList,
  options?: Partial<MarzipanOptions>
) => MarzipanInstance[];

export function MarzipanCanvas({
  id,
  value,
  defaultValue,
  theme,
  accent,
  toolbar = true,
  plugins,
  minHeight = DEFAULT_HEIGHT,
  showStats = false,
  autofocus = false,
  rebuildKey,
  onChange,
  onReady,
  onAccentChange,
  className
}: MarzipanCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<MarzipanInstance | null>(null);
  const latestExternalValue = useRef<string | undefined>(value ?? defaultValue);
  const [internalValue, setInternalValue] = useState(() => value ?? defaultValue ?? '');

  const pluginSignature = useMemo(
    () =>
      plugins?.map((plugin, index) => plugin?.name ?? `plugin-${index}`).join('|') ?? 'none',
    [plugins]
  );

  const signature = useMemo(
    () =>
      [
        id,
        rebuildKey,
        typeof theme === 'string' ? theme : (theme?.name ?? 'custom'),
        toolbar ? 'toolbar-on' : 'toolbar-off',
        pluginSignature,
        defaultValue ?? ''
      ].join('::'),
    [id, rebuildKey, theme, toolbar, pluginSignature, defaultValue]
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Clean up any previous instance
    if (editorRef.current) {
      editorRef.current.destroy?.();
      editorRef.current = null;
    }

    host.innerHTML = '';

    const options: Partial<MarzipanOptions> = {
      value: latestExternalValue.current ?? internalValue,
      theme: theme as MarzipanThemeValue,
      toolbar,
      plugins,
      autoResize: true,
      minHeight,
      showStats,
      autofocus,
      onChange: (next: string) => {
        latestExternalValue.current = next;
        setInternalValue(next);
        onChange?.(next);
      }
    };

    const instances = new (Marzipan as unknown as MarzipanCtor)(host, options);
    const instance = instances[0];
    if (!instance) {
      return;
    }
    editorRef.current = instance;
    
    // Apply theme CSS variables to container
    if (instance.container) {
      const themeObj = typeof theme === 'string' ? getTheme(theme) : theme;
      if (themeObj && themeObj.colors) {
        const cssVars = themeToCSSVars(themeObj.colors);
        console.log('[MarzipanCanvas] Applying theme:', typeof theme === 'string' ? theme : theme?.name);
        const currentStyle = instance.container.getAttribute('style') || '';
        instance.container.style.cssText = currentStyle + ';' + cssVars;
        
        // Verify the styles are applied
        setTimeout(() => {
          const wrapper = instance.container.querySelector('.marzipan-wrapper');
          if (wrapper) {
            const computed = window.getComputedStyle(wrapper);
            console.log('[MarzipanCanvas] Computed wrapper background:', computed.backgroundColor);
            console.log('[MarzipanCanvas] Computed wrapper color:', computed.color);
            console.log('[MarzipanCanvas] Container --bg-secondary:', instance.container.style.getPropertyValue('--bg-secondary'));
          }
        }, 100);
      }
    }

    if (accent) {
      host.style.setProperty('--mz-accent', accent);
      instance.container?.style?.setProperty('--mz-accent', accent);
    }

    onReady?.(instance);

    if (onAccentChange) {
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<{ color: string }>).detail;
        if (detail?.color) {
          onAccentChange(detail.color);
        }
      };
      host.addEventListener('marzipan:accent', handler as EventListener);

      return () => {
        host.removeEventListener('marzipan:accent', handler as EventListener);
        instance.destroy?.();
        editorRef.current = null;
      };
    }

    return () => {
      instance.destroy?.();
      editorRef.current = null;
    };
  }, [signature]);

  // Sync accent updates coming from parent
  useEffect(() => {
    const host = hostRef.current;
    if (host && accent) {
      host.style.setProperty('--mz-accent', accent);
      editorRef.current?.container?.style?.setProperty('--mz-accent', accent);
    }
  }, [accent]);

  // Push external value changes into the editor without recreating it
  useEffect(() => {
    if (typeof value === 'undefined') return;
    latestExternalValue.current = value;
    setInternalValue(value);

    const editor = editorRef.current;
    if (editor && value !== editor.getValue()) {
      editor.setValue(value);
    }
  }, [value]);

  // Update default value for uncontrolled instances when source markdown changes
  useEffect(() => {
    if (typeof value !== 'undefined') return;
    if (typeof defaultValue === 'undefined') return;

    latestExternalValue.current = defaultValue;
    setInternalValue(defaultValue);

    const editor = editorRef.current;
    if (editor && defaultValue !== editor.getValue()) {
      editor.setValue(defaultValue);
    }
  }, [defaultValue, value]);

  return <div ref={hostRef} className={className} data-marzipan-demo-id={id} />;
}

export default MarzipanCanvas;
