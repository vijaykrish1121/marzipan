# Marzipan Quick Start Guide

Spin up the editor, wire up the bundled actions, and opt into plugins in just a few steps. 🎉

## 1. Install the package

```bash
npm install @pinkpixel/marzipan
```

The package ships ESM output and TypeScript definitions. No extra formatting dependencies are required.

## 2. Render your first editor

```ts
import { Marzipan } from '@pinkpixel/marzipan';

const [editor] = new Marzipan('#my-editor', {
  placeholder: 'Start writing…',
  toolbar: true,
  theme: 'solar',
  smartLists: true,
});
```

You can pass a selector string, DOM element, `NodeList`, or array of elements. The constructor always returns an array of instances.

## 3. Trigger formatting with bundled actions

```ts
import { actions } from '@pinkpixel/marzipan';

const textarea = document.querySelector<HTMLTextAreaElement>('#my-editor textarea');
if (textarea) {
  actions.toggleBold(textarea);
}
```

All actions accept the target `HTMLTextAreaElement`. They’re the same utilities used internally by the toolbar and keyboard shortcuts.

## 4. Enable a plugin

Every plugin in `src/plugins` publishes under `@pinkpixel/marzipan/plugins/<name>`.

```ts
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';
import { tinyHighlight } from '@pinkpixel/marzipan/plugins/tinyHighlight';

new Marzipan('#with-plugins', {
  plugins: [tablePlugin(), tinyHighlight()],
});
```

Each plugin exports a factory so you can configure behavior before adding it to the editor instance.

## 5. React usage (example)

```tsx
import { useEffect, useRef } from 'react';
import { Marzipan } from '@pinkpixel/marzipan';
import { actions } from '@pinkpixel/marzipan';

export function Editor() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const [instance] = new Marzipan(hostRef.current, { toolbar: true });
    return () => instance.destroy?.();
  }, []);

  return <div ref={hostRef} />;
}
```

## 6. Explore the Bakeshop demo

```bash
cd bakeshop-demo
npm install
npm run dev
```

Open `http://localhost:5173` to experiment with every option, plugin, and action in a guided playground.

## Next steps

- Review the [API reference](./api.md) for events, helpers, and configuration details.
- Browse the [Plugin Catalogue](./plugins.md) to discover tables, Mermaid, image helpers, and more.
- Check [../CHANGELOG.md](../CHANGELOG.md) for the latest updates.
