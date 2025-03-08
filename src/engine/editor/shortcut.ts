import Editor from "./index.ts";
import {ShortcutCode} from "./editor";

class Shortcut {
  readonly editor: Editor
  readonly eventsMap: Map<ShortcutCode, VoidFunction[]> = new Map()

  constructor(editor: Editor) {
    this.editor = editor
    this.setupEventListeners();
  }

  destroy() {
    this.removeEventListeners()
  }

  public subscribe(eventName: ShortcutCode, callback: VoidFunction) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap.get(eventName)!.push(callback);
    } else {
      this.eventsMap.set(eventName, [callback])
    }
  }

  public unsubscribe(eventName: ShortcutCode, callback: VoidFunction) {
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
  }

  private removeEventListeners(): void {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    let shortcutCode: ShortcutCode | null = null

    if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      shortcutCode = 'select-all'
    }

    if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
      shortcutCode = 'copy'
    }

    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      shortcutCode = 'paste'
    }

    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      shortcutCode = 'undo'
    }

    if (event.key === 'z' && (event.ctrlKey && event.shiftKey)) {
      shortcutCode = 'redo'
    }

    if (!shortcutCode) return

    if (this.eventsMap.has(shortcutCode)) {
      console.log(this.eventsMap.get(shortcutCode))
      this.eventsMap.get(shortcutCode)!.forEach((cb) => {
        console.log(9)
        cb()
      })

      event.preventDefault()
    }


    // event.stopPropagation()
    // event.preventDefault()
  }
}

export default Shortcut;
