# 🚀 Quick Setup Guide

Follow these steps to get the Marzipan Bakeshop demo running:

## Step 1: Build the Parent Library

First, make sure the main Marzipan library is built:

```bash
# From the project root (/home/sizzlebop/PROJECTS/marzipan)
cd /home/sizzlebop/PROJECTS/marzipan
npm install
npm run build
```

This creates the `dist/` folder that the demo imports from.

## Step 2: Install Demo Dependencies

```bash
# Navigate to the demo directory
cd bakeshop-demo
npm install
```

## Step 3: Start the Development Server

```bash
npm run dev
```

The demo will open automatically at `http://localhost:5173` 🎉

## 🎨 What You'll See

The demo features 5 interactive tabs:

1. **🎨 Playground** - Full editor with all features
2. **⚡ Actions** - Interactive formatting buttons
3. **🧩 Plugins** - Plugin gallery and documentation
4. **🎭 Themes** - Theme comparison (Solar & Cave)
5. **💻 API** - Integration examples

## 🐛 Troubleshooting

### "Cannot find module '@pinkpixel/marzipan'"

This means the parent library isn't built yet. Run:

```bash
cd /home/sizzlebop/PROJECTS/marzipan
npm run build
```

### Port 5173 is already in use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 5174, // or any available port
  open: true,
}
```

### TypeScript errors

Make sure TypeScript is installed and run:

```bash
npm run typecheck
```

## 📝 Development Tips

- **Hot Module Replacement (HMR)** - Changes appear instantly
- **Auto-save** - Playground content saves to localStorage
- **URL Navigation** - Use hash URLs like `#actions` or `#themes`
- **Mobile Testing** - Responsive design works on all devices

## 🎯 Next Steps

After exploring the demo:

1. Check out the [Main README](README.md)
2. Review the [API Documentation](../docs/api.md)
3. Explore [Plugin Documentation](../docs/plugins.md)
4. Read the [Quick Start Guide](../docs/quick-start.md)

Happy coding! 🧁✨
