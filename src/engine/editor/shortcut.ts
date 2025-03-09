import Editor from "./index.ts";
import {ShortcutCode} from "./editor";

class Shortcut {
  readonly editor: Editor
  readonly eventsMap: Map<ShortcutCode, VoidFunction[]> = new Map()

  // readonly pressedKeys: Set<KeyboardEvent['key']> = new Set();

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

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'select-all'
    }

    if (key === 'c' && (ctrlKey || metaKey)) {
      shortcutCode = 'copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'duplicate'
    }

    if (key === 'z' && (ctrlKey || metaKey)) {
      shortcutCode = 'undo'
    }

    if (key === 'z' && shiftKey && (ctrlKey || metaKey)) {
      shortcutCode = 'redo'
    }


    if (!shortcutCode) return

    if (this.eventsMap.has(shortcutCode)) {
      this.eventsMap.get(shortcutCode)!.forEach((cb) => {
        cb()
      })

      event.preventDefault()
    }

  }

  /*
    private handleKeyUp(event: KeyboardEvent) {
      this.pressedKeys.delete(event.key)
    }
    */
}

export default Shortcut;
