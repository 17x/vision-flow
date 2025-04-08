// import Editor from '../editor.ts'
import {EditorEventData, EditorEvents, EditorEventType} from './type'

type EventsCallback = (data: EditorEventData) => void

class Action {
  private lock: boolean
  // private editor: Editor
  readonly eventsMap: Map<EditorEventType, EventsCallback[]> = new Map()

  constructor(/*editor: Editor*/) {
    // this.editor = editor
    this.lock = false
  }

  // subscribe
  public on(eventName: EditorEventType, callback: EventsCallback) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap.get(eventName)!.push(callback)
    } else {
      this.eventsMap.set(eventName, [callback])
    }
  }

  // unsubscribe
  public off(eventName: EditorEventType, callback: EventsCallback) {
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

  public dispatch({type, data}: EditorEvents) {
    if (type !== 'world-mouse-move') {
      console.log('action: ', type)
    }

    if (this.eventsMap.has(type)) {
      this.eventsMap.get(type)!.forEach((cb) => {
        cb(data as EditorEventData)
      })
    }
  }

  public execute(type: EditorEventType, data: never) {
    /*  switch (type) {
        case 'editor-initialized':
          break

        case 'module-select-all':
          this.editor.selectionManager.selectAll()
          break

        case 'module-add':
          this.editor.selectionManager.replace(data as Set<UID>)
          break

        case 'module-select':
          this.editor.selectionManager.replace(data as Set<UID>)
          break

        case 'module-copy':
          this.editor.selectionManager.copySelected()
          break

        case 'module-delete':
          this.editor.selectionManager.removeSelected()
          break

        case 'module-duplicate':
          this.editor.selectionManager.duplicateSelected()
          break

        case 'module-escape':
          this.editor.selectionManager.clear()
          break

        case 'module-paste':
          this.editor.selectionManager.pasteCopied()
          break

        case 'module-redo':
          this.editor.history.redo()
          break

        case 'module-undo':
          this.editor.history.undo()
          break

        case 'zoom':
          this.editor.viewport.zoomTo(data)
          break

        case 'module-move-up':
        case 'module-move-right':
        case 'module-move-left':
        case 'module-move-down':
          this.editor.batchMove(
            this.editor.selectionManager.getSelected(),
            {
              x: (type === 'moveLeft' && -MODULE_MOVE_STEP) || (type === 'moveRight' && MODULE_MOVE_STEP) || 0,
              y: (type === 'moveUp' && -MODULE_MOVE_STEP) || (type === 'moveDown' && MODULE_MOVE_STEP) || 0,
            },
            'history-move',
          )
          break

        default:
          // Optionally handle unknown codes
          console.warn(`Unknown code: ${type}`)
      }*/

    /*   if (this.lock) return
       const MODULE_MOVE_STEP = 5
       this.lock = true
       this.lock = true

       this.lock = false*/

  }

  public destroy() {
    this.eventsMap.clear()

    // @ts-expect-error
    this.editor = null
    this.lock = false
  }
}

export default Action