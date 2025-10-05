// @ts-nocheck
/**
 * Block Handles Plugin
 * 
 * Provides interactive handles on the left side of markdown blocks in the preview overlay.
 * Handles appear on hover and provide quick actions for block manipulation.
 * 
 * Features:
 * - Hover to show handles
 * - Click to select blocks
 * - Copy block content
 * - Delete blocks
 * - Visual feedback for selected blocks
 */

export interface BlockHandle {
  id: string;
  type: string;
  lineStart: number;
  lineEnd: number;
  element: HTMLElement;
  handleElement: HTMLElement | null;
}

export interface BlockHandlesConfig {
  enabled?: boolean;
  showOnHover?: boolean;
  handleOffset?: number;
  handleSize?: number;
  colors?: {
    hover?: string;
    selected?: string;
    handle?: string;
  };
}

export class BlockHandlesPlugin {
  private editor: HTMLTextAreaElement;
  private preview: HTMLElement;
  private config: Required<BlockHandlesConfig>;
  private blocks: Map<string, BlockHandle>;
  private selectedBlockId: string | null;
  private handleContainer: HTMLElement | null;

  constructor(editor: HTMLTextAreaElement, preview: HTMLElement, config: BlockHandlesConfig = {}) {
    this.editor = editor;
    this.preview = preview;
    this.config = {
      enabled: config.enabled ?? true,
      showOnHover: config.showOnHover ?? true,
      handleOffset: config.handleOffset ?? -30,
      handleSize: config.handleSize ?? 20,
      colors: {
        hover: config.colors?.hover ?? 'rgba(59, 130, 246, 0.1)',
        selected: config.colors?.selected ?? 'rgba(59, 130, 246, 0.2)',
        handle: config.colors?.handle ?? 'rgba(59, 130, 246, 0.8)',
      },
    };
    this.blocks = new Map();
    this.selectedBlockId = null;
    this.handleContainer = null;

    this.initialize();
  }

  /**
   * Initialize the plugin
   */
  private initialize(): void {
    if (!this.config.enabled) return;

    // Create handle container
    this.createHandleContainer();

    // Set up event listeners
    this.setupEventListeners();

    // Initial scan for blocks
    this.scanBlocks();
  }

  /**
   * Create the container for block handles
   */
  private createHandleContainer(): void {
    this.handleContainer = document.createElement('div');
    this.handleContainer.className = 'mz-block-handles';
    this.handleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    `;
    this.preview.style.position = 'relative';
    this.preview.appendChild(this.handleContainer);
  }

  /**
   * Set up event listeners for block interactions
   */
  private setupEventListeners(): void {
    // Mouse move for hover effects
    this.preview.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.preview.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Click for selection
    this.preview.addEventListener('click', this.handleClick.bind(this));

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Scan the preview for blocks and create handles
   */
  public scanBlocks(): void {
    this.blocks.clear();
    
    if (!this.handleContainer) return;

    // Clear existing handles
    this.handleContainer.innerHTML = '';

    // Find all elements with block metadata
    const blockElements = this.preview.querySelectorAll('[data-block-id]');
    
    blockElements.forEach((element: HTMLElement) => {
      const blockId = element.getAttribute('data-block-id');
      const blockType = element.getAttribute('data-block-type');
      const lineStart = parseInt(element.getAttribute('data-line-start') || '0', 10);
      const lineEnd = parseInt(element.getAttribute('data-line-end') || '0', 10);

      if (!blockId) return;

      // Create handle for this block
      const handle = this.createHandle(blockId, blockType || 'paragraph', element);

      this.blocks.set(blockId, {
        id: blockId,
        type: blockType || 'paragraph',
        lineStart,
        lineEnd,
        element,
        handleElement: handle,
      });
    });
  }

  /**
   * Create a handle element for a block
   */
  private createHandle(blockId: string, blockType: string, blockElement: HTMLElement): HTMLElement {
    const handle = document.createElement('div');
    handle.className = `mz-block-handle mz-block-handle-${blockType}`;
    handle.setAttribute('data-block-id', blockId);
    handle.style.cssText = `
      position: absolute;
      width: ${this.config.handleSize}px;
      height: ${this.config.handleSize}px;
      left: ${this.config.handleOffset}px;
      background: ${this.config.colors.handle};
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      user-select: none;
    `;

    // Add icon based on block type
    handle.innerHTML = this.getHandleIcon(blockType);

    // Handle click events
    handle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectBlock(blockId);
    });

    // Show context menu on right click
    handle.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(blockId, e);
    });

    this.handleContainer?.appendChild(handle);
    this.updateHandlePosition(blockId);

    return handle;
  }

  /**
   * Get icon for handle based on block type
   */
  private getHandleIcon(blockType: string): string {
    const icons: Record<string, string> = {
      heading: '⚡',
      paragraph: '¶',
      'list-item': '•',
      quote: '"',
      'code-fence': '{',
      'code-content': '{}',
      hr: '―',
      'table-row': '⊞',
      'table-separator': '═',
    };
    return icons[blockType] || '○';
  }

  /**
   * Update handle position based on block element position
   */
  private updateHandlePosition(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (!block || !block.handleElement) return;

    const blockRect = block.element.getBoundingClientRect();
    const previewRect = this.preview.getBoundingClientRect();

    const top = blockRect.top - previewRect.top + this.preview.scrollTop;
    
    block.handleElement.style.top = `${top}px`;
  }

  /**
   * Update all handle positions (call on scroll/resize)
   */
  public updateAllHandlePositions(): void {
    this.blocks.forEach((block, blockId) => {
      this.updateHandlePosition(blockId);
    });
  }

  /**
   * Handle mouse move for hover effects
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.config.showOnHover) return;

    const target = e.target as HTMLElement;
    const blockElement = this.findBlockElement(target);

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-block-id');
      if (blockId) {
        this.showHandle(blockId);
        this.highlightBlock(blockId, false);
      }
    } else {
      this.hideAllHandles();
      this.unhighlightAll();
    }
  }

  /**
   * Handle mouse leave event
   */
  private handleMouseLeave(): void {
    this.hideAllHandles();
    this.unhighlightAll(true);
  }

  /**
   * Handle click events for block selection
   */
  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const blockElement = this.findBlockElement(target);

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-block-id');
      if (blockId && e.shiftKey) {
        e.preventDefault();
        this.selectBlock(blockId);
      }
    } else if (!target.closest('.mz-block-handle')) {
      // Click outside blocks and handles - deselect
      this.deselectBlock();
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.selectedBlockId) return;

    // Copy block (Ctrl/Cmd + C when block is selected)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !this.editor.selectionStart) {
      e.preventDefault();
      this.copyBlock(this.selectedBlockId);
    }

    // Delete block (Delete or Backspace when block is selected)
    if ((e.key === 'Delete' || e.key === 'Backspace') && !this.editor.selectionStart) {
      e.preventDefault();
      this.deleteBlock(this.selectedBlockId);
    }

    // Escape to deselect
    if (e.key === 'Escape') {
      this.deselectBlock();
    }
  }

  /**
   * Find the block element from any child element
   */
  private findBlockElement(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;
    
    // Check if element itself is a block
    if (element.hasAttribute('data-block-id')) {
      return element;
    }

    // Look up the tree for a block element
    return element.closest('[data-block-id]') as HTMLElement | null;
  }

  /**
   * Show a specific handle
   */
  private showHandle(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (block?.handleElement) {
      block.handleElement.style.opacity = '1';
    }
  }

  /**
   * Hide all handles except selected
   */
  private hideAllHandles(): void {
    this.blocks.forEach((block) => {
      if (block.handleElement && block.id !== this.selectedBlockId) {
        block.handleElement.style.opacity = '0';
      }
    });
  }

  /**
   * Highlight a block
   */
  private highlightBlock(blockId: string, selected: boolean): void {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const color = selected ? this.config.colors.selected : this.config.colors.hover;
    block.element.style.backgroundColor = color;
  }

  /**
   * Remove highlight from all blocks
   */
  private unhighlightAll(keepSelected: boolean = false): void {
    this.blocks.forEach((block) => {
      if (!keepSelected || block.id !== this.selectedBlockId) {
        block.element.style.backgroundColor = '';
      }
    });
  }

  /**
   * Select a block
   */
  private selectBlock(blockId: string): void {
    // Deselect previous block
    if (this.selectedBlockId) {
      this.unhighlightAll();
      const prevBlock = this.blocks.get(this.selectedBlockId);
      if (prevBlock?.handleElement) {
        prevBlock.handleElement.style.opacity = '0';
      }
    }

    // Select new block
    this.selectedBlockId = blockId;
    this.highlightBlock(blockId, true);
    this.showHandle(blockId);

    // Dispatch selection event
    this.preview.dispatchEvent(new CustomEvent('blockSelected', {
      detail: { blockId, block: this.blocks.get(blockId) },
    }));
  }

  /**
   * Deselect current block
   */
  private deselectBlock(): void {
    if (!this.selectedBlockId) return;

    const blockId = this.selectedBlockId;
    this.selectedBlockId = null;
    this.unhighlightAll();
    this.hideAllHandles();

    // Dispatch deselection event
    this.preview.dispatchEvent(new CustomEvent('blockDeselected', {
      detail: { blockId },
    }));
  }

  /**
   * Copy block content to clipboard
   */
  private async copyBlock(blockId: string): Promise<void> {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const content = this.getBlockContent(block);
    
    try {
      await navigator.clipboard.writeText(content);
      this.showToast('Block copied to clipboard');
    } catch (err) {
      console.error('Failed to copy block:', err);
      this.showToast('Failed to copy block', 'error');
    }
  }

  /**
   * Delete a block from the editor
   */
  private deleteBlock(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const content = this.editor.value;
    const lines = content.split('\n');

    // Remove lines for this block
    lines.splice(block.lineStart, block.lineEnd - block.lineStart + 1);

    // Update editor
    this.editor.value = lines.join('\n');
    
    // Trigger input event to update preview
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));

    // Deselect and rescan
    this.deselectBlock();
    this.showToast('Block deleted');
  }

  /**
   * Get the text content of a block from the editor
   */
  private getBlockContent(block: BlockHandle): string {
    const content = this.editor.value;
    const lines = content.split('\n');
    
    return lines
      .slice(block.lineStart, block.lineEnd + 1)
      .join('\n');
  }

  /**
   * Show context menu for block actions
   */
  private showContextMenu(blockId: string, e: MouseEvent): void {
    // Remove existing context menu if any
    const existingMenu = document.querySelector('.mz-block-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'mz-block-context-menu';
    menu.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 150px;
      padding: 4px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
    `;

    const actions = [
      { label: 'Copy', action: () => this.copyBlock(blockId), icon: '📋' },
      { label: 'Delete', action: () => this.deleteBlock(blockId), icon: '🗑️' },
      { label: 'Select', action: () => this.selectBlock(blockId), icon: '✓' },
    ];

    actions.forEach(({ label, action, icon }) => {
      const item = document.createElement('div');
      item.className = 'mz-context-menu-item';
      item.textContent = `${icon} ${label}`;
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        user-select: none;
      `;

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#f5f5f5';
      });

      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
      });

      item.addEventListener('click', () => {
        action();
        menu.remove();
      });

      menu.appendChild(item);
    });

    document.body.appendChild(menu);

    // Close menu on click outside
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }

  /**
   * Show a toast notification
   */
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = 'mz-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /**
   * Enable the plugin
   */
  public enable(): void {
    this.config.enabled = true;
    this.initialize();
  }

  /**
   * Disable the plugin
   */
  public disable(): void {
    this.config.enabled = false;
    this.handleContainer?.remove();
    this.handleContainer = null;
    this.blocks.clear();
    this.selectedBlockId = null;
  }

  /**
   * Refresh the plugin (rescan blocks and update positions)
   */
  public refresh(): void {
    this.scanBlocks();
  }

  /**
   * Get the currently selected block
   */
  public getSelectedBlock(): BlockHandle | null {
    return this.selectedBlockId ? this.blocks.get(this.selectedBlockId) || null : null;
  }

  /**
   * Get all blocks
   */
  public getAllBlocks(): BlockHandle[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Clean up and remove the plugin
   */
  public destroy(): void {
    this.disable();
    this.preview.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.preview.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.preview.removeEventListener('click', this.handleClick.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}
