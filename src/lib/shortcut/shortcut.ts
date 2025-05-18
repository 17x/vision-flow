export interface ShortcutOptions {
  shortcuts: { id: string, shortcut: string }[],
  upMode?: boolean
  callback?: (id: string, event: WheelEvent) => void
}

class Shortcut {
  protected eventsController: AbortController = new AbortController()
  shortcuts: { id: string, shortcut: string }[]
  upMode: boolean
  callback?: (id: string, event: WheelEvent) => void

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
    const parts: string[] = []
    // console.log(event)
    if (ctrlKey) parts.push('ctrl')
    if (metaKey) parts.push('meta')
    if (shiftKey) parts.push('shift')
    if (altKey) parts.push('alt')

    parts.push(key.toLowerCase())

    const inputShortcut = parts.join('+')

    for (const {id, shortcut} of this.shortcuts) {
      const keys = shortcut.split(',').map(s => s.trim().toLowerCase())
      if (keys.includes(inputShortcut)) {
        event.preventDefault()
        console.log(id)
        this.callback?.(id, event as any)
        break
      }
    }
  }

  destroy() {
    this.eventsController.abort()
    this.eventsController = null!
    this.upMode = null!
    this.callback = null!
    this.shortcuts = null!
  }
}

export default Shortcut