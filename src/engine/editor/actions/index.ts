import {ActionCode} from "../editor";
import Editor from "../index.ts";

// type EventsFunction = (e: KeyboardEvent, additionalInformation?: unknown) => unknown
type EventsFunction = () => unknown

class Action {
  private lock: boolean
  readonly editor: Editor
  readonly eventsMap: Map<ActionCode, EventsFunction[]> = new Map([
    ['selectAll', []],
    ['copy', []],
    ['paste', []],
    ['duplicate', []],
    ['delete', []],
    ['escape', []],
    ['modify-modules', []],
    ['undo', []],
    ['redo', []]
  ])

  constructor(editor: Editor) {
    this.editor = editor
    this.lock = false
  }

  public subscribe(eventName: ActionCode, callback: EventsFunction) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap.get(eventName)!.push(callback);
    } else {
      this.eventsMap.set(eventName, [callback])
    }
  }

  public unsubscribe(eventName: ActionCode, callback: EventsFunction) {
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

  public dispatcher(code: ActionCode, data: unknown = null) {
    if (this.lock) return

    this.lock = true

    if (code === 'selectAll') {
      this.editor.selectionManager.selectAll()
    }
    if (code === 'select') {
      this.editor.selectionManager.select(data as Set<UID>)
    }

    if (code === 'copy') {
      this.editor.selectionManager.copy()
    }

    if (code === 'delete') {
      this.editor.selectionManager.delete()
    }

    if (code === 'duplicate') {
      this.editor.selectionManager.duplicate()
    }

    if (code === 'escape') {
      this.editor.selectionManager.clear()
    }

    if (code === 'paste') {
      this.editor.selectionManager.paste()
    }

    if (code === 'redo') {
      this.editor.history.redo()
    }

    if (code === 'undo') {
      this.editor.history.undo()
    }

    if (code === 'moveUp') {
      // console.log(this.editor.selectionManager)
      this.editor.selectionManager
    }

    if (this.eventsMap.has(code)) {
      this.eventsMap.get(code)!.forEach((cb) => {
        cb()
      })
    }

    this.lock = false
  }
}

export const doIt = () => {
  console.log(this)
}
export default Action;