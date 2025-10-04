import { useEffect, useRef } from 'react'
import { Marzipan } from '@pinkpixel/marzipan'

const getSampleText = (themeName: string) => `# Theme Preview

This editor demonstrates the **${themeName}** theme.

## Features
- Syntax highlighting
- \`Inline code\` formatting
- > Blockquotes with style

\`\`\`typescript
// Code blocks with theme colors
const greeting = "Hello, Marzipan!";
console.log(greeting);
\`\`\`

### Try editing to see how the theme looks!`

export default function ThemesLab() {
  const solarRef = useRef<HTMLDivElement>(null)
  const caveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!solarRef.current || !caveRef.current) return

    const [solarInstance] = new Marzipan(solarRef.current, {
      value: getSampleText('Solar (Light)'),
      toolbar: true,
      theme: 'solar',
      minHeight: '400px',
      showStats: true,
    })

    const [caveInstance] = new Marzipan(caveRef.current, {
      value: getSampleText('Cave (Dark)'),
      toolbar: true,
      theme: 'cave',
      minHeight: '400px',
      showStats: true,
    })

    return () => {
      solarInstance.destroy?.()
      caveInstance.destroy?.()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🎭 Themes Laboratory
        </h2>
        <p className="text-slate-300">
          Marzipan includes built-in Solar (light) and Cave (dark) themes, plus support for custom themes.
        </p>
      </div>

      {/* Solar Theme */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-300">☀️ Solar Theme (Light)</h3>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-sm font-medium">
            Default
          </span>
        </div>
        <div ref={solarRef} />
      </div>

      {/* Cave Theme */}
      <div className="card p-6 bg-slate-900/70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-400">🌙 Cave Theme (Dark)</h3>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium">
            Built-in
          </span>
        </div>
        <div ref={caveRef} />
      </div>

      {/* Theme Usage */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">🎨 Using Themes</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-100 mb-2">Global Theme (All Instances)</h4>
            <pre className="code-block">
{`import { Marzipan } from '@pinkpixel/marzipan';

// Set theme globally
Marzipan.setTheme('cave');

// All new instances will use cave theme
const editors = new Marzipan('.editor');`}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-slate-100 mb-2">Instance-Specific Theme</h4>
            <pre className="code-block">
{`// Only this instance uses cave theme
new Marzipan('#editor', {
  theme: 'cave'
});`}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-slate-100 mb-2">Custom Theme</h4>
            <pre className="code-block">
{`const customTheme = {
  name: 'purple-dream',
  colors: {
    background: '#2d1b69',
    text: '#e1d5f7',
    comment: '#9c88c4',
    keyword: '#bb9af7',
    string: '#9ece6a',
    number: '#ff9e64',
    selection: '#3d2d69',
    border: '#4d3d79',
  }
};

Marzipan.setTheme(customTheme);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
