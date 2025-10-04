export default function ApiExamples() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          💻 API Examples & Integration
        </h2>
        <p className="text-slate-300">
          Comprehensive code examples showing how to integrate Marzipan into your application.
        </p>
      </div>

      {/* Basic Setup */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">🚀 Basic Setup</h3>
        <pre className="code-block">
{`import { Marzipan } from '@pinkpixel/marzipan';

// Simple initialization
const [editor] = new Marzipan('#my-editor', {
  placeholder: 'Start writing...',
  toolbar: true,
  showStats: true,
});

// Get/Set content
const content = editor.getValue();
editor.setValue('# New Content');`}
        </pre>
      </div>

      {/* React Integration */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">⚛️ React Integration</h3>
        <pre className="code-block">
{`import { useEffect, useRef } from 'react';
import { Marzipan } from '@pinkpixel/marzipan';

export function MarkdownEditor({ initialValue, onChange }) {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const [instance] = new Marzipan(editorRef.current, {
      value: initialValue,
      toolbar: true,
      onChange: (value) => onChange?.(value),
    });

    instanceRef.current = instance;

    return () => instance.destroy?.();
  }, []);

  return <div ref={editorRef} />;
}`}
        </pre>
      </div>

      {/* Event Handling */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">⚡ Event Handling</h3>
        <pre className="code-block">
{`new Marzipan('#editor', {
  onChange: (value, instance) => {
    console.log('Content changed:', value);
    // Auto-save logic here
  },
  
  onKeydown: (event, instance) => {
    if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      saveContent(instance.getValue());
    }
  },
});`}
        </pre>
      </div>

      {/* Multiple Editors */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">📑 Multiple Editors</h3>
        <pre className="code-block">
{`// Initialize multiple editors at once
const editors = Marzipan.init('.markdown-editor', {
  toolbar: true,
  showStats: true,
});

// Customize individual editors
editors[0].reinit({ theme: 'solar' });
editors[1].reinit({ theme: 'cave' });

// Get instance from element
const element = document.getElementById('my-editor');
const instance = Marzipan.getInstance(element);`}
        </pre>
      </div>

      {/* Custom Stats Formatter */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">📊 Custom Stats Formatter</h3>
        <pre className="code-block">
{`new Marzipan('#editor', {
  showStats: true,
  statsFormatter: ({ words, chars, lines, line, column }) => {
    const readingTime = Math.ceil(words / 200);
    return \`\${words} words • \${chars} chars • \${readingTime}m read • Line \${line}:\${column}\`;
  },
});`}
        </pre>
      </div>

      {/* Export HTML */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">📥 Export HTML</h3>
        <pre className="code-block">
{`const editor = Marzipan.getInstance(element);

// Get HTML with syntax highlighting
const html = editor.getRenderedHTML();

// Get clean HTML for export (no Marzipan classes)
const cleanHtml = editor.getCleanHTML();

// Download as file
const blob = new Blob([cleanHtml], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'export.html';
a.click();`}
        </pre>
      </div>

      {/* View Modes */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">👁️ View Modes</h3>
        <pre className="code-block">
{`const editor = new Marzipan('#editor')[0];

// Toggle between normal and plain textarea
editor.showPlainTextarea(true);  // Show plain textarea
editor.showPlainTextarea(false); // Show markdown overlay

// Toggle preview-only mode
editor.showPreviewMode(true);  // Preview only (read-only)
editor.showPreviewMode(false); // Edit mode

// Toggle stats bar
editor.showStats(true);`}
        </pre>
      </div>
    </div>
  )
}
