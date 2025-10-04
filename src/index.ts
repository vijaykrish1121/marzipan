// @pinkpixel/marzipan-core - Pure TypeScript markdown editor library
import Marzipan from './marzipan'

// Export the main class
export default Marzipan
export { Marzipan }

// Export core modules for advanced usage
export { MarkdownParser } from './parser'
export { ShortcutsManager } from './shortcuts'
export { Toolbar } from './toolbar'
export { LinkTooltip } from './link-tooltip'
export * from './themes'
export { generateStyles } from './styles'
export * as actions from './actions'
export type { MarkdownActions } from './actions'
export type { Options as MarzipanOptions, MarzipanInstance, MarzipanConstructor, MarzipanPlugin } from './marzipan.d'
