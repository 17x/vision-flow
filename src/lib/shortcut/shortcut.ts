export interface ShortcutOptions {
  shortcuts: { code: string, shortcut: string }[],
  upMode?: boolean
  callback?: (code: string, event: WheelEvent) => void
}

class Shortcut {
  protected eventsController: AbortController
  shortcuts: { code: string, shortcut: string }[]
  upMode: boolean
  callback?: (code: string, event: WheelEvent) => void

  constructor({
                shortcuts = [],
                callback,
                upMode = false,
              }: ShortcutOptions) {
    this.eventsController = new AbortController()
    this.upMode = upMode
    this.callback = callback

    shortcuts.forEach(({code, shortcut}) => {
      console.log(code, shortcut)
    })

    window.addEventListener(upMode ? 'keyup' : 'keydown', this.handleKey.bind(this), {
      signal: this.eventsController.signal,
      passive: false,
    })
  }

  handleKey(event: KeyboardEvent) {

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