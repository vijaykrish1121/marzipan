# 🧁 Marzipan Bakeshop Demo

An interactive, comprehensive demo application showcasing all features of the **Marzipan** markdown editor library.

## ✨ What's Inside?

This beautifully designed demo app provides:

### 📑 Five Interactive Tabs

1. **🎨 Playground** - Full-featured editor with all capabilities enabled
   - Live markdown preview with overlay rendering
   - Complete toolbar with formatting buttons
   - Stats bar showing character/word/line counts
   - Auto-save to localStorage
   - HTML export functionality
   - Sample content demonstrating all markdown features

2. **⚡ Actions Demo** - Interactive showcase of all formatting actions
   - Visual button grid for each action
   - Live demonstration of markdown transformations
   - Keyboard shortcut hints
   - Code examples for integration

3. **🧩 Plugins Gallery** - Comprehensive plugin documentation
   - All available plugins with descriptions
   - Import paths and usage examples
   - Configuration options

4. **🎭 Themes Lab** - Theme comparison and customization
   - Side-by-side Solar (light) and Cave (dark) themes
   - Live theme switching
   - Custom theme creation examples

5. **💻 API Examples** - Complete integration guide
   - Basic setup examples
   - React integration patterns
   - Event handling
   - Multiple editor management
   - Export functionality

### 🎨 Modern Design

- **Tailwind CSS 4.x** with custom gradient designs
- **Responsive layout** that works beautifully on all devices
- **Smooth animations** and transitions
- **Pink Pixel branding** with warm, inviting colors
- **Dark mode support** via Cave theme
- **Custom scrollbars** and polished UI elements

### 🚀 Developer-Friendly

- **TypeScript** for type safety
- **Vite** for lightning-fast development
- **React 18** with modern hooks
- **Copy-ready code examples** throughout
- **URL hash navigation** for direct linking to sections

## 🏃 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or equivalent package manager

### Installation

```bash
# From the bakeshop-demo directory
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

Visit `http://localhost:5173` to explore the demo!

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
bakeshop-demo/
├── src/
│   ├── tabs/              # Individual tab components
│   │   ├── Playground.tsx
│   │   ├── ActionsDemo.tsx
│   │   ├── PluginsGallery.tsx
│   │   ├── ThemesLab.tsx
│   │   └── ApiExamples.tsx
│   ├── App.tsx            # Main app with navigation
│   ├── main.tsx           # Entry point
│   └── styles.css         # Tailwind + custom styles
├── index.html             # HTML template
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Features Demonstrated

### Core Editor Features
- ✅ Overlay markdown preview
- ✅ Toolbar with formatting buttons
- ✅ Keyboard shortcuts
- ✅ Smart list continuation
- ✅ Stats bar (character/word/line counts)
- ✅ View modes (Normal, Plain, Preview)
- ✅ Auto-resize
- ✅ Custom placeholders

### Formatting Actions
- Bold, Italic, Code, Strikethrough
- Headings (H1, H2, H3)
- Bullet lists, Numbered lists, Task lists
- Blockquotes
- Links
- Horizontal rules

### Themes
- Solar (light theme)
- Cave (dark theme)
- Custom theme creation

### Integration Patterns
- Single editor initialization
- Multiple editor management
- React component integration
- Event handling (onChange, onKeydown)
- Content get/set operations
- HTML export

### Advanced Features
- Plugin system architecture
- Custom stats formatting
- Theme switching
- Instance management
- Auto-save implementation

## 💡 Usage Tips

1. **Navigation** - Use the tab buttons or URL hash (#playground, #actions, etc.)
2. **Direct Links** - Share specific sections via URL hash
3. **Mobile** - Fully responsive, works great on phones/tablets
4. **Code Examples** - All code blocks are copy-ready
5. **Persistence** - Playground content auto-saves to localStorage

## 🛠️ Development Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

## 🎨 Customization

The demo uses Tailwind CSS 4.x with custom configuration. Key customization points:

- **Colors** - Defined in `tailwind.config.js`
- **Animations** - Custom keyframes for gradients and floating
- **Components** - Reusable Tailwind classes in `styles.css`
- **Theme** - Marzipan theme integration

## 📚 Learning Resources

After exploring the demo:

1. Check the [Marzipan API Documentation](../docs/api.md)
2. Review [Plugin Documentation](../docs/plugins.md)
3. Read the [Quick Start Guide](../docs/quick-start.md)
4. Explore the [Main Repository](https://github.com/pinkpixel-dev/marzipan)

## 🤝 Contributing

Found a bug or want to improve the demo? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This demo application is part of the Marzipan project and is licensed under Apache 2.0.

---

**Made with ❤️ by [Pink Pixel](https://pinkpixel.dev)**  
✨ *Dream it, Pixel it™*
