// @ts-nocheck
/**
 * Link Tooltip - CSS Anchor Positioning with index-based anchors
 * Shows a clickable tooltip when cursor is within a link
 * Uses CSS anchor positioning with dynamically selected anchor
 */

let tooltipStylesInjected = false;

function ensureTooltipStyles() {
  if (tooltipStylesInjected || typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.className = 'marzipan-link-tooltip-styles';
  style.textContent = `
    @supports (position-anchor: --x) and (position-area: center) {
      .marzipan-link-tooltip {
        position: absolute;
        position-anchor: var(--target-anchor, --link-0);
        position-area: block-end center;
        margin-top: 8px !important;
        background: #333 !important;
        color: white !important;
        padding: 6px 10px !important;
        border-radius: 16px !important;
        font-size: 12px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        display: none !important;
        z-index: 10000 !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        max-width: 300px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        position-try: most-width block-end inline-end, flip-inline, block-start center;
        position-visibility: anchors-visible;
      }

      .marzipan-link-tooltip.visible {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(style);
  tooltipStylesInjected = true;
}

export class LinkTooltip {
  [key: string]: any;

  constructor(editor: any) {
    this.editor = editor;
    this.tooltip = null;
    this.currentLink = null;
    this.hideTimeout = null;
    this.supportsAnchor = false;

    this._selectionHandler = null;
    this._keyupHandler = null;
    this._inputHandler = null;
    this._scrollHandler = null;
    this._tooltipEnterHandler = null;
    this._tooltipLeaveHandler = null;

    this.init();
  }

  init() {
    if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
      return;
    }

    const supportsAnchor = CSS.supports('position-anchor: --x') && CSS.supports('position-area: center');
    if (!supportsAnchor) {
      return;
    }

    ensureTooltipStyles();

    this.supportsAnchor = true;
    this.createTooltip();
    this.bindListeners();
  }

  bindListeners() {
    if (!this.supportsAnchor || typeof document === 'undefined' || !this.tooltip) return;

    this._selectionHandler = () => this.handleSelectionChange();
    document.addEventListener('selectionchange', this._selectionHandler);

    this._keyupHandler = (e: KeyboardEvent) => {
      if (e.key.includes('Arrow') || e.key === 'Home' || e.key === 'End') {
        this.checkCursorPosition();
      }
    };
    this.editor.textarea.addEventListener('keyup', this._keyupHandler);

    this._inputHandler = () => this.hide();
    this.editor.textarea.addEventListener('input', this._inputHandler);

    this._scrollHandler = () => this.hide();
    this.editor.textarea.addEventListener('scroll', this._scrollHandler);

    this._tooltipEnterHandler = () => this.cancelHide();
    this._tooltipLeaveHandler = () => this.scheduleHide();
    this.tooltip.addEventListener('mouseenter', this._tooltipEnterHandler);
    this.tooltip.addEventListener('mouseleave', this._tooltipLeaveHandler);
  }

  createTooltip() {
    if (typeof document === 'undefined') return;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'marzipan-link-tooltip';

    this.tooltip.innerHTML = `
      <span style="display: flex; align-items: center; gap: 6px;">
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
        </svg>
        <span class="marzipan-link-tooltip-url"></span>
      </span>
    `;

    this.tooltip.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentLink) {
        window.open(this.currentLink.url, '_blank');
        this.hide();
      }
    });

    this.editor.container.appendChild(this.tooltip);
  }

  handleSelectionChange() {
    if (typeof document === 'undefined') {
      return;
    }

    if (document.activeElement !== this.editor.textarea) {
      this.scheduleHide();
      return;
    }
    this.checkCursorPosition();
  }

  checkCursorPosition() {
    if (!this.tooltip) return;

    const cursorPos = this.editor.textarea.selectionStart;
    const text = this.editor.textarea.value;

    const linkInfo = this.findLinkAtPosition(text, cursorPos);

    if (linkInfo) {
      if (!this.currentLink || this.currentLink.url !== linkInfo.url || this.currentLink.index !== linkInfo.index) {
        this.show(linkInfo);
      }
    } else {
      this.scheduleHide();
    }
  }

  findLinkAtPosition(text, position) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let linkIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;

      if (position >= start && position <= end) {
        return {
          text: match[1],
          url: match[2],
          index: linkIndex,
          start,
          end,
        };
      }
      linkIndex++;
    }

    return null;
  }

  show(linkInfo) {
    if (!this.tooltip) return;

    this.currentLink = linkInfo;
    this.cancelHide();

    const urlSpan = this.tooltip.querySelector('.marzipan-link-tooltip-url');
    if (urlSpan) {
      urlSpan.textContent = linkInfo.url;
    }

    this.tooltip.style.setProperty('--target-anchor', `--link-${linkInfo.index}`);
    this.tooltip.classList.add('visible');
  }

  hide() {
    if (!this.tooltip) return;
    this.tooltip.classList.remove('visible');
    this.currentLink = null;
  }

  scheduleHide() {
    this.cancelHide();
    this.hideTimeout = setTimeout(() => this.hide(), 300);
  }

  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  destroy() {
    this.cancelHide();

    if (this._selectionHandler && typeof document !== 'undefined') {
      document.removeEventListener('selectionchange', this._selectionHandler);
      this._selectionHandler = null;
    }
    if (this._keyupHandler) {
      this.editor.textarea.removeEventListener('keyup', this._keyupHandler);
      this._keyupHandler = null;
    }
    if (this._inputHandler) {
      this.editor.textarea.removeEventListener('input', this._inputHandler);
      this._inputHandler = null;
    }
    if (this._scrollHandler) {
      this.editor.textarea.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
    if (this._tooltipEnterHandler) {
      this.tooltip?.removeEventListener('mouseenter', this._tooltipEnterHandler);
      this._tooltipEnterHandler = null;
    }
    if (this._tooltipLeaveHandler) {
      this.tooltip?.removeEventListener('mouseleave', this._tooltipLeaveHandler);
      this._tooltipLeaveHandler = null;
    }

    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
    this.tooltip = null;
    this.currentLink = null;
  }
}
