export interface ShortcutOptions {
  shortcuts: { code: string, shortcut: string }[],
  upMode?: boolean
  callback?: (code: string, event: WheelEvent) => void
}

class Shortcut {
  protected eventsController: AbortController = new AbortController()
  shortcuts: { code: string, shortcut: string }[]
  upMode: boolean
  callback?: (code: string, event: WheelEvent) => void

  constructor({
                shortcuts = [],
                callback,
                upMode = false,
              }: ShortcutOptions) {
    this.upMode = upMode
    this.callback = callback
    this.shortcuts = shortcuts

    window.addEventListener(upMode ? 'keyup' : 'keydown', this.handleKey.bind(this), {
      signal: this.eventsController.signal,
      passive: false,
    })
  }

  handleKey(event: KeyboardEvent) {
    const {key, altKey, ctrlKey, metaKey, shiftKey} = event
    console.log(altKey, ctrlKey, metaKey, shiftKey)
    // Normalize the key combo into a string like "ctrl+shift+a"
    const parts: string[] = []
    if (ctrlKey) parts.push('ctrl')
    if (metaKey) parts.push('meta')
    if (shiftKey) parts.push('shift')
    if (altKey) parts.push('alt') // ✅ add this line
    parts.push(key.toLowerCase())
    const inputShortcut = parts.join('+')

    for (const {code, shortcut} of this.shortcuts) {
      // Support multiple shortcuts separated by comma
      const keys = shortcut.split(',').map(s => s.trim().toLowerCase())
      if (keys.includes(inputShortcut)) {
        event.preventDefault()
        this.callback?.(code, event as any)
        break
      }
    }
  }

  destroy() {
    console.log(this)
    this.eventsController.abort()
    this.eventsController = null!
    this.upMode = null!
    this.callback = null!
    this.shortcuts = null!
  }
}

export default Shortcut