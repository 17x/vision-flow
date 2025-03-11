import Editor from "./index.ts";
import {ShortcutCode} from "./editor";

type EventsFunction = (e: KeyboardEvent, additionalInformation?: unknown) => unknown

class Shortcut {
  readonly editor: Editor
  readonly eventsMap: Map<ShortcutCode, EventsFunction[]> = new Map()
  private lock = false

  // readonly pressedKeys: Set<KeyboardEvent['key']> = new Set();

  constructor(editor: Editor) {
    this.editor = editor
    this.setupEventListeners();
  }

  destroy() {
    this.removeEventListeners()
  }

  public subscribe(eventName: ShortcutCode, callback: EventsFunction) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap.get(eventName)!.push(callback);
    } else {
      this.eventsMap.set(eventName, [callback])
    }
  }

  public unsubscribe(eventName: ShortcutCode, callback: EventsFunction) {
    if (this.eventsMap.has(eventName)) {
      const arr = this.eventsMap.get(eventName)!

      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === callback) {
          arr.splice(i, 1)
          return 'deleted'
        }
      }

      return 'Cannot find event or function'
    }
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    // window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private removeEventListeners(): void {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    // window.removeEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    let shortcutCode: ShortcutCode | null = null
    const {key, ctrlKey, metaKey, shiftKey} = event

    // this.pressedKeys.add(key)
    // console.log(this.pressedKeys)
    // console.log(event)
    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'select-all'
    }

    if (key === 'c' && (ctrlKey || metaKey) && !shiftKey) {
      shortcutCode = 'copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'duplicate'
    }

    if (key === 'Delete' || key === 'Backspace') {
      shortcutCode = 'delete'
    }
    if (key === 'Escape') {
      shortcutCode = 'escape'
    }

    if (key === 'z' && (ctrlKey || metaKey)) {
      shortcutCode = 'undo'
    }

    if (key === 'z' && shiftKey && (ctrlKey || metaKey)) {
      shortcutCode = 'redo'
    }

    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      shortcutCode = 'modify-modules'
    }

    if (!shortcutCode || this.lock) return

    this.lock = true

    if (this.eventsMap.has(shortcutCode)) {
      this.eventsMap.get(shortcutCode)!.forEach((cb) => {

        cb(event, key)
      })

      event.preventDefault()
    }

    this.lock = false

    event.stopPropagation()
  }

  /*
    private handleKeyUp(event: KeyboardEvent) {
      this.pressedKeys.delete(event.key)
    }*/
}

export default Shortcut;
