import {extractIdSetFromArray} from './helpers.ts'
import {HistoryNode} from './DoublyLinkedList.ts'
import Editor from '../editor.ts'

export function redo(this: Editor, quiet: boolean = false): HistoryNode | false {
  if (this.history.current === this.history.tail) return false

  this.history.forward()

  const {type, payload} = this.history.current!.data
  const {selectedModules} = payload

  switch (type) {
    case 'history-init':
      break
    case 'history-add':
    case 'history-paste':
    case 'history-duplicate':

      // delete modules from added
      this.batchAdd(this.batchCreate(payload.modules))

      break

    case 'history-modify':

      break

    case 'history-move':
      this.batchMove(payload.selectedModules, {
        x: payload.delta.x,
        y: payload.delta.y,
      })
      break

    case 'history-reorder':
      break
    case 'history-group':
      break
    case 'history-ungroup':
      break
    case 'history-composite':
      break

    case 'history-delete':
      this.batchDelete(extractIdSetFromArray(payload.modules))

      break
  }

  // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)

  if (!quiet) {
    if (selectedModules === 'all') {
      this.selectAll()
    } else {
      this.replace(selectedModules)
    }

    // this.events.onHistoryUpdated?.(this.history)
  }

  return this.history.current as HistoryNode
}
