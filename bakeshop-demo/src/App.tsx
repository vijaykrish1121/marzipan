import { useState, useEffect } from 'react'
import Playground from './tabs/Playground'
import ActionsDemo from './tabs/ActionsDemo'
import PluginsGallery from './tabs/PluginsGallery'
import ThemesLab from './tabs/ThemesLab'
import ApiExamples from './tabs/ApiExamples'

type Tab = 'playground' | 'actions' | 'plugins' | 'themes' | 'api'

const tabs = [
  { id: 'playground' as Tab, label: '🎨 Playground', icon: '🎨' },
  { id: 'actions' as Tab, label: '⚡ Actions', icon: '⚡' },
  { id: 'plugins' as Tab, label: '🧩 Plugins', icon: '🧩' },
  { id: 'themes' as Tab, label: '🎭 Themes', icon: '🎭' },
  { id: 'api' as Tab, label: '💻 API', icon: '💻' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('playground')

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab
    if (tabs.some(t => t.id === hash)) {
      setActiveTab(hash)
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) as Tab
      if (tabs.some(t => t.id === newHash)) {
        setActiveTab(newHash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    window.location.hash = tab
  }

  return (
    <div className="min-h-screen bg-[#1b1b1f] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-[#16161a]/90 border-b border-[#2f2f36] shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Marzipan" className="w-16 h-16 animate-float" />
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  Marzipan Bakeshop
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Interactive demo of the pure TypeScript markdown editor
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://marzipan.pinkpixel.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-pink-500/60 bg-[#27272f] text-pink-200 font-semibold shadow-sm hover:bg-pink-500/10 hover:border-pink-400 hover:shadow-xl transition-all duration-300"
              >
                📚 Documentation
              </a>
              <a
                href="https://github.com/pinkpixel-dev/marzipan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {activeTab === 'playground' && <Playground />}
          {activeTab === 'actions' && <ActionsDemo />}
          {activeTab === 'plugins' && <PluginsGallery />}
          {activeTab === 'themes' && <ThemesLab />}
          {activeTab === 'api' && <ApiExamples />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-[#2f2f36] bg-[#16161a]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300 mb-2">
            Made with ❤️ by{' '}
            <a
              href="https://pinkpixel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-pink-200 font-semibold"
            >
              Pink Pixel
            </a>
          </p>
          <p className="text-slate-400 text-sm">
            ✨ Dream it, Pixel it™
          </p>
        </div>
      </footer>
    </div>
  )
}
