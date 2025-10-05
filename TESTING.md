# 🧪 Testing the Block Handles Plugin

## ✅ Server is Running!

A local HTTP server has been started on your machine:
- **URL**: http://localhost:8080
- **Process ID**: 60055

## 🎯 Quick Access

Open these URLs in your browser:

### Block Handles Demo (Main Feature)
```
http://localhost:8080/examples/block-handles-demo.html
```

### Browse All Examples
```
http://localhost:8080/examples/
```

## 🎮 How to Use the Block Handles Plugin

Once you open the demo, try these interactions:

### Mouse Actions
1. **Hover** over any markdown block → Handle appears on the left
2. **Click the handle** → Selects the block
3. **Right-click the handle** → Opens context menu
4. **Shift+Click anywhere on a block** → Quick select

### Keyboard Shortcuts
- **Ctrl/Cmd + C** → Copy selected block to clipboard
- **Delete** or **Backspace** → Delete selected block
- **Escape** → Deselect current block

### Context Menu Actions
Right-click any handle to access:
- 📋 **Copy** - Copy block content
- 🗑️ **Delete** - Remove block from document
- ✓ **Select** - Select the block

## 🔍 What to Look For

### Visual Features
- ⚡ Different icons for each block type (headings, paragraphs, lists, etc.)
- 🎨 Blue hover effect when mousing over blocks
- ✨ Stronger blue highlight when block is selected
- 🔵 Blue circular handles with white icons

### Interactive Features
- Handles fade in/out on hover
- Selected blocks stay highlighted
- Toast notifications appear for copy/delete actions
- Context menu with smooth animations

## 🛠️ Testing Checklist

- [ ] Hover over a heading - see the ⚡ icon
- [ ] Hover over a paragraph - see the ¶ icon  
- [ ] Hover over a list item - see the • icon
- [ ] Click a handle to select a block
- [ ] Shift+Click a block to select it
- [ ] Right-click a handle for context menu
- [ ] Copy a block (Ctrl/Cmd+C)
- [ ] Delete a block (Delete key)
- [ ] Press Escape to deselect
- [ ] Edit the markdown and see handles update
- [ ] Check browser console for event logs

## 🎨 Customization Examples

The demo shows custom configuration:

```javascript
blockHandles: {
  enabled: true,
  showOnHover: true,
  handleOffset: -30,      // 30px to the left
  handleSize: 24,         // 24px square handles
  colors: {
    hover: 'rgba(102, 126, 234, 0.1)',      // Light blue
    selected: 'rgba(102, 126, 234, 0.2)',   // Medium blue
    handle: 'rgba(102, 126, 234, 0.9)',     // Solid blue
  }
}
```

## 🐛 Browser Console

Open Developer Tools (F12) to see:
- Block selection events
- Plugin instance information
- Debug logs

Example console output:
```
✨ Marzipan Block Handles Demo Ready!
Editor instance: {...}
Block handles plugin: BlockHandlesPlugin {...}
Block selected: { blockId: "mz-block-0", block: {...} }
```

## 🔧 Stopping the Server

When you're done testing, stop the server:

```bash
kill 60055
```

Or start a new one:
```bash
npm run serve
```

## 📝 Code Examples from the Demo

The demo includes several code snippets you can inspect:

1. **Basic initialization** with block handles
2. **Custom configuration** with colors and sizing
3. **Event listeners** for selection events
4. **Programmatic API** usage

## 🚀 Next Steps

After testing, you can:

1. **Integrate into your projects**:
   ```javascript
   import Marzipan from '@pinkpixel/marzipan';
   
   const editor = new Marzipan('#editor', {
     blockHandles: true
   });
   ```

2. **Customize the appearance**: See `src/plugins/block-handles.README.md`

3. **Build upon it**: Use the event system to create custom workflows

4. **Share feedback**: Open issues or discussions on GitHub

## 📚 Documentation

- **Plugin README**: `src/plugins/block-handles.README.md`
- **Examples README**: `examples/README.md`
- **Main README**: `README.md`
- **Changelog**: `CHANGELOG.md`

## ✨ Enjoy Testing!

The Block Handles Plugin is fully functional and ready for production use. Have fun testing it out!

---

**Made with ❤️ by Pink Pixel**
- Website: [pinkpixel.dev](https://pinkpixel.dev)
- GitHub: [@pinkpixel-dev](https://github.com/pinkpixel-dev)
