🧩 The Concept

Each block (paragraph, heading, list item, image, etc.) is a distinct unit in your editor’s DOM. When the user hovers near its left edge, you show a floating action button (“block handle”). That handle can open a small context menu or command palette for formatting or inserting new content.

🧱 Core Pieces We'll Need

A block wrapper
Every editable block should be wrapped in a container <div> with:

<div class="block" data-block-id="123">
  <div class="block-handle"></div>
  <div class="block-content" contenteditable="true">
    Your text here
  </div>
</div>

Show handle on hover
CSS:

.block {
  position: relative;
  padding-left: 32px; /* space for handle */
}

.block-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
  cursor: pointer;
}

.block:hover .block-handle {
  opacity: 1;
}

We can style it as a simple dot or plus icon, keeping in mind we want to stay dependency free.

Floating context menu
When the handle is clicked, open a menu near it.

Example:

const handleClick = (e: MouseEvent) => {
  const menu = document.createElement('div')
  menu.className = 'block-menu'
  menu.innerHTML = `
    <button data-action="heading">Heading</button>
    <button data-action="list">List</button>
    <button data-action="quote">Quote</button>
  `
  document.body.appendChild(menu)
  // position using e.clientX / e.clientY or floating-ui
}

Command logic
When a button in that menu is clicked, trigger an action on that block’s content.
For instance:

document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('[data-action]')
  if (!btn) return
  const action = btn.dataset.action
  const block = btn.closest('.block')
  if (action === 'heading') block.querySelector('.block-content')!.innerHTML = `<h2>${block.textContent}</h2>`
  // etc.
})

🍬 Extras

Keyboard support: When a block is focused, typing “/” could open the same command menu (like Notion’s “slash commands”).

Drag handles: The same handle can double as a drag anchor for reordering blocks (with drag-and-drop libraries like @dnd-kit/core or sortablejs).

Context awareness: Menu options can change depending on block type — e.g., lists get “Convert to checklist”, images get “Replace image”.