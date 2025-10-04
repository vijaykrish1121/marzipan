import { useMemo, useRef, useState } from 'react';
import type { MarzipanInstance, MarzipanOptions } from '@pinkpixel/marzipan-core';

import { MarzipanCanvas, type ThemeOption } from '../components/MarzipanCanvas';
import type { ToolbarMode } from '../utils/permalink';

const baseMarkdown = [
  '# Welcome to Marzipan Bakeshop ✨',
  '',
  '*Dream it, Pixel it.*',
  '',
  'We baked this playground so you can taste every layer of **@pinkpixel/marzipan-core**.',
  '',
  '## House Specials',
  '- Dual-pane overlay preview',
  '- Keyboard-friendly shortcuts',
  '- Smart list continuation',
  '- Plugin-friendly architecture',
  '',
  '## Daily Mise en Place',
  '- Toggle preview mode for pure reading',
  '- Show stats for word count nerds',
  '- Dial in the toolbar vibe',
  '',
  '> Pro Tip: Hit `Ctrl+tilde` for inline code or `Ctrl+Alt+1` for heading levels.'
].join('\n');

type ToolbarPreset = Record<ToolbarMode, MarzipanOptions['toolbar']>;

const toolbarPresets: ToolbarPreset = {
  classic: true,
  minimal: {
    buttons: [
      { name: 'bold', icon: '<strong>B</strong>', title: 'Bold', action: 'toggleBold' },
      { name: 'italic', icon: '<em>i</em>', title: 'Italic', action: 'toggleItalic' },
      { separator: true },
      { name: 'code', icon: '<code>&lt;/&gt;</code>', title: 'Inline code', action: 'toggleCode' },
      { name: 'link', icon: '🔗', title: 'Insert link', action: 'insertLink' },
      { separator: true },
      { name: 'quote', icon: '❝❞', title: 'Blockquote', action: 'toggleQuote' },
      { name: 'list', icon: '•', title: 'Bullet list', action: 'toggleBulletList' }
    ]
  },
  bare: false
};

export interface ChefTableProps {
  theme: ThemeOption;
  accent: string;
  toolbarMode: ToolbarMode;
  onToolbarModeChange: (mode: ToolbarMode) => void;
}

export function ChefTable({ theme, accent, toolbarMode, onToolbarModeChange }: ChefTableProps) {
  const [content, setContent] = useState(baseMarkdown);
  const [previewMode, setPreviewMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const editorRef = useRef<MarzipanInstance | null>(null);

  const toolbarConfig = useMemo(() => toolbarPresets[toolbarMode], [toolbarMode]);

  const rebuildKey = useMemo(
    () => `${typeof theme === 'string' ? theme : theme.name ?? 'custom'}::${toolbarMode}`,
    [theme, toolbarMode]
  );

  const handlePreviewToggle = () => {
    setPreviewMode((prev) => {
      const next = !prev;
      editorRef.current?.showPreviewMode(next);
      return next;
    });
  };

  const handleStatsToggle = () => {
    setShowStats((prev) => {
      const next = !prev;
      editorRef.current?.showStats(next);
      return next;
    });
  };

  const handleReset = () => {
    setContent(baseMarkdown);
    if (editorRef.current) {
      editorRef.current.setValue(baseMarkdown);
      editorRef.current.updatePreview();
    }
  };

  return (
    <section className="bakeshop-panel">
      <div>
        <h2>Chef&apos;s Table</h2>
        <p>
          Spin up a fresh Marzipan editor instance, tweak the toolbar layout, and flip between edit and
          preview service to feel the core experience.
        </p>
      </div>

      <div className="bakeshop-toolbar">
        <button
          type="button"
          className={`bakeshop-nav-button ${toolbarMode === 'classic' ? 'is-active' : ''}`}
          onClick={() => onToolbarModeChange('classic')}
        >
          🍮 Classic Toolbar
        </button>
        <button
          type="button"
          className={`bakeshop-nav-button ${toolbarMode === 'minimal' ? 'is-active' : ''}`}
          onClick={() => onToolbarModeChange('minimal')}
        >
          🧁 Minimal Buttons
        </button>
        <button
          type="button"
          className={`bakeshop-nav-button ${toolbarMode === 'bare' ? 'is-active' : ''}`}
          onClick={() => onToolbarModeChange('bare')}
        >
          ☕ Keyboard Only
        </button>
        <button
          type="button"
          className={`bakeshop-action ${previewMode ? 'is-active' : ''}`}
          onClick={handlePreviewToggle}
        >
          {previewMode ? 'Back to Editing' : 'Preview Plating'}
        </button>
        <button
          type="button"
          className={`bakeshop-action ${showStats ? 'is-active' : ''}`}
          onClick={handleStatsToggle}
        >
          Stats {showStats ? 'On' : 'Off'}
        </button>
        <button type="button" className="bakeshop-action" onClick={handleReset}>
          Reset Story
        </button>
      </div>

      <div className="demo-preview">
        <MarzipanCanvas
          id="chef-table"
          value={content}
          theme={theme}
          accent={accent}
          toolbar={toolbarConfig}
          showStats={showStats}
          rebuildKey={rebuildKey}
          onChange={setContent}
          onReady={(instance) => {
            editorRef.current = instance;
            instance.showPreviewMode(previewMode);
            instance.showStats(showStats);
          }}
        />
      </div>

      <div className="info-banner">
        <strong>{content.length} chars</strong>
        <span> | </span>
        <span>Toolbar: {toolbarMode === 'classic' ? 'Classic overlay' : toolbarMode === 'minimal' ? 'Minimal picks' : 'No toolbar'}</span>
        <span> | </span>
        <span>Preview mode: {previewMode ? 'Plate ready' : 'Editing'}</span>
      </div>
    </section>
  );
}

export default ChefTable;
