import {ActionCode} from "../type"
import Editor from "../editor.ts"

// type EventsFunction = (e: KeyboardEvent, additionalInformation?: unknown) => unknown
type EventsFunction = () => unknown

class Action {
  private lock: boolean
  private editor: Editor
  readonly eventsMap: Map<ActionCode, EventsFunction[]> = new Map([
    ['selectAll', []],
    ['copy', []],
    ['paste', []],
    ['duplicate', []],
    ['delete', []],
    ['escape', []],
    ['modifyModules', []],
    ['undo', []],
    ['redo', []]
  ])

  constructor(editor: Editor) {
    this.editor = editor
    this.lock = false
  }

  public subscribe(eventName: ActionCode, callback: EventsFunction) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap.get(eventName)!.push(callback)
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
      this.editor.selectionManager.selectAllModules()
    }
    if (code === 'select') {
      this.editor.selectionManager.replace(data as Set<UID>)
    }

    if (code === 'copy') {
      this.editor.selectionManager.copySelectedModules()
    }

    if (code === 'delete') {
      this.editor.selectionManager.removeSelectedModules()
    }

    if (code === 'duplicate') {
      this.editor.selectionManager.duplicateSelectedModules()
    }

    if (code === 'escape') {
      this.editor.selectionManager.clearSelectedModules()
    }

    if (code === 'paste') {
      this.editor.selectionManager.pasteCopiedModules()
    }

    if (code === 'redo') {
      this.editor.history.redo()
    }

    if (code === 'undo') {
      this.editor.history.undo()
    }

    if (code === 'moveUp' || code === 'moveRight' || code === 'moveDown' || code === 'moveLeft') {
      // console.log(this.editor.selectionManager)
      const selectedModules = this.editor.selectionManager.getSelected()

      this.editor.batchModify(selectedModules, {
        code,
      }, 'modifyModules')
      // console.log(selectedModules)
    }

    if (this.eventsMap.has(code)) {
      this.eventsMap.get(code)!.forEach((cb) => {
        cb()
      })
    }

    this.lock = false
  }

  public destroy() {
    this.eventsMap.clear()
     
    // @ts-expect-error
    this.editor = null
    this.lock = false
  }
}

export default Action