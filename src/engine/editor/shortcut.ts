import Editor from "./index.ts";
import {ActionCode} from "./editor";

type EventsFunction = (e: KeyboardEvent, additionalInformation?: unknown) => unknown

class Shortcut {
  readonly editor: Editor
  private lock = false

  // readonly pressedKeys: Set<KeyboardEvent['key']> = new Set();

  constructor(editor: Editor) {
    this.editor = editor
    this.setupEventListeners();
  }

  destroy() {
    this.removeEventListeners()
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
    let shortcutCode: ActionCode | null = null
    const {key, ctrlKey, metaKey, shiftKey} = event
    const arrowKeys = new Set(
      [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
      ]
    )

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

    if (arrowKeys.has(key)) {
      shortcutCode = 'modify-modules'
    }

    if (!shortcutCode) return

    this.editor.action.dispatcher(shortcutCode)

    if (shortcutCode !== 'modify-modules') {
      event.preventDefault()
    }

    event.stopPropagation()
  }

  /*
    private handleKeyUp(event: KeyboardEvent) {
      this.pressedKeys.delete(event.key)
    }*/
}

export default Shortcut;
