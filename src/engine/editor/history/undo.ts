import {HistoryModules} from './type'
import {extractIdSetFromArray} from './helpers.ts'
import {HistoryNode} from './DoublyLinkedList.ts'
import Editor from '../editor.ts'

export function undo(this: Editor, quiet: boolean = false): HistoryNode | false {
  if (this.history.current === this.history.head) return false

  const {type, payload} = this.history.current!.data

  const {selectedModules} = payload
  let modules: HistoryModules | null = null

  switch (type) {
    case 'history-init':
      break
    case 'history-add':
    case 'history-paste':
    case 'history-duplicate':

      // delete modules from added
      this.batchDelete(extractIdSetFromArray(payload.modules))

      break

    case 'history-modify':

      break

    case 'history-move':
      this.batchMove(payload.selectedModules, {
        x: -payload.delta.x,
        y: -payload.delta.y,
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
      modules = payload.modules

      this.batchAdd(this.batchCreate(modules!))

      break
  }

  this.history.back()
  // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)
  if (!quiet) {
    const backedNodeSelectedModules = this.history.current!.data.payload.selectedModules
    console.log(backedNodeSelectedModules)
    // restore selected modules
    this.replaceSelected(backedNodeSelectedModules)
    this.dispatchVisibleSelectedModules()

    // this.events.onHistoryUpdated?.(this.history)
  }

  return this.history.current as HistoryNode
}