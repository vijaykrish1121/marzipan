export default function PluginsGallery() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🧩 Plugins Gallery
        </h2>
        <p className="text-slate-300">
          Explore all available Marzipan plugins with live examples and configuration options.
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">📦 Available Plugins</h3>
        
        <div className="space-y-6">
          {/* Table Plugin */}
          <div className="border-l-4 border-pink-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Table Plugin</h4>
            <p className="text-slate-300 mb-2">Interactive table generation and editing with inline controls.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              import {`{ tablePlugin }`} from '@pinkpixel/marzipan/plugins/tablePlugin'
            </code>
          </div>

          {/* Mermaid Plugin */}
          <div className="border-l-4 border-purple-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Mermaid Plugin</h4>
            <p className="text-slate-300 mb-2">Render diagrams inline with lazy-loaded Mermaid.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              import {`{ mermaidPlugin }`} from '@pinkpixel/marzipan/plugins/mermaidPlugin'
            </code>
          </div>

          {/* Syntax Highlighting */}
          <div className="border-l-4 border-emerald-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Tiny Highlight Plugin</h4>
            <p className="text-slate-300 mb-2">Lightweight syntax highlighting for code blocks.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              import {`{ tinyHighlightPlugin }`} from '@pinkpixel/marzipan/plugins/tinyHighlight'
            </code>
          </div>

          {/* Image Manager */}
          <div className="border-l-4 border-rose-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Image Manager Plugin</h4>
            <p className="text-slate-300 mb-2">Dropzone and gallery UI for managing images.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              import {`{ imageManagerPlugin }`} from '@pinkpixel/marzipan/plugins/imageManagerPlugin'
            </code>
          </div>

          {/* Accent Swatch */}
          <div className="border-l-4 border-amber-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Accent Swatch Plugin</h4>
            <p className="text-slate-300 mb-2">Palette picker for accent colors synced with toolbar.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              import {`{ accentSwatchPlugin }`} from '@pinkpixel/marzipan/plugins/accentSwatchPlugin'
            </code>
          </div>

          {/* Block Handles */}
          <div className="border-l-4 border-blue-400/70 pl-4">
            <h4 className="font-bold text-lg text-slate-100 mb-2">Block Handles Plugin</h4>
            <p className="text-slate-300 mb-2">Interactive handles for selecting, copying, and deleting markdown blocks with visual feedback and keyboard shortcuts.</p>
            <code className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm text-slate-100">
              blockHandles: true // Built-in feature
            </code>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/5 to-amber-500/10">
        <h3 className="text-lg font-bold text-pink-200 mb-2">💡 Plugin Usage</h3>
        <pre className="code-block mt-4">
{`import { Marzipan } from '@pinkpixel/marzipan';
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';
import { mermaidPlugin } from '@pinkpixel/marzipan/plugins/mermaidPlugin';

new Marzipan('#editor', {
  toolbar: true,
  
  // Configure built-in block handles
  blockHandles: {
    enabled: true,
    showOnHover: true,
    colors: {
      hover: 'rgba(236, 72, 153, 0.1)',
      selected: 'rgba(236, 72, 153, 0.2)',
      handle: 'rgba(236, 72, 153, 0.9)',
    }
  },
  
  // Add plugins
  plugins: [
    tablePlugin({ defaultColumns: 3, defaultRows: 4 }),
    mermaidPlugin({ theme: 'dark' }),
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
