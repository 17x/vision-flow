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

  public dispatcher(code: ActionCode, data: never) {
    if (this.lock) return

    this.lock = true

    switch (code) {
      case 'selectAll':
        this.editor.selectionManager.selectAll()
        break

      case 'select':
        this.editor.selectionManager.replace(data as Set<UID>)
        break

      case 'copy':
        this.editor.selectionManager.copySelected()
        break

      case 'delete':
        this.editor.selectionManager.removeSelected()
        break

      case 'duplicate':
        this.editor.selectionManager.duplicateSelected()
        break

      case 'escape':
        this.editor.selectionManager.clear()
        break

      case 'paste':
        this.editor.selectionManager.pasteCopied()
        break

      case 'redo':
        this.editor.history.redo()
        break

      case 'undo':
        this.editor.history.undo()
        break

      case 'zoom':
        this.editor.viewport.zoomTo(data)
        break

      case 'moveUp':
      case 'moveRight':
      case 'moveDown':
      case 'moveLeft':
        const selectedModules = this.editor.selectionManager.getSelected()

        this.editor.batchModify(selectedModules, {
          code,
        }, 'modifyModules')
        break

      default:
        // Optionally handle unknown codes
        console.warn(`Unknown code: ${code}`)
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