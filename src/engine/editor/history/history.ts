import Editor from '../editor.ts'
import DoublyLinkedList, {HistoryNode} from './DoublyLinkedList.ts'
import {extractIdSetFromArray} from './helpers.ts'
import {HistoryModules, HistoryOperation} from './type'

class History extends DoublyLinkedList {
  private editor: Editor

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.init()
  }

  init() {
    this.append({
      type: 'history-init',
      payload: {
        state: null,
        selectedModules: 'all',
      },
    })

    this.editor.events.onHistoryUpdated?.(this)
  }

  // Add a History node after the current
  add(data: HistoryOperation): void {
    this.detach()
    this.append(data)

    this.editor.events.onHistoryUpdated?.(this)
  }

  undo(quiet = false): HistoryNode | false {
    const current = this.current

    if (!current) return false

    const {
      type,
      payload,
    } = current.data

    const {selectedModules} = payload
    let modules: HistoryModules | null = null

    switch (type) {
      case 'history-init':
        break
      case 'history-add':
      case 'history-paste':
      case 'history-duplicate':

        // delete modules from added
        this.editor.batchDelete(extractIdSetFromArray(payload.modules))

        break

      case 'history-modify':

        break

      case 'history-move':
        this.editor.batchMove(payload.selectedModules, {
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

        this.editor.batchAdd(this.editor.batchCreate(modules!))

        break
    }

    super.back()
    // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)
    if (!quiet) {
      // restore selected modules
      if (selectedModules === 'all') {
        this.editor.selectAll()
      } else {
        this.editor.replace(selectedModules)
      }

      this.editor.events.onHistoryUpdated?.(this)
    }

    return this.current as HistoryNode
  }

  redo(quiet = false): HistoryNode | false {
    const current = super.forward()

    if (!current) return false

    const {
      type,
      payload,
    } = current.data
    const {selectedModules} = payload

    switch (type) {
      case 'history-init':
        break
      case 'history-add':
      case 'history-paste':
      case 'history-duplicate':

        // delete modules from added
        this.editor.batchAdd(this.editor.batchCreate(payload.modules))

        break

      case 'history-modify':

        break

      case 'history-move':
        this.editor.batchMove(payload.selectedModules, {
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
        this.editor.batchDelete(extractIdSetFromArray(payload.modules))

        break
    }

    // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)

    if (!quiet) {
      if (selectedModules === 'all') {
        this.editor.selectAll()
      } else {
        this.editor.replace(selectedModules)
      }

      this.editor.events.onHistoryUpdated?.(this)
    }

    return this.current as HistoryNode
  }

  moveCurrentToTargetById(targetNode: HistoryNode) {
    const relativePosition = super.compareToCurrentPosition(targetNode)

    if (!relativePosition || relativePosition === 'equal') return

    if (relativePosition === 'front' || relativePosition === 'behind') {
      const quietMode = true
      let localCurrent

      while (true) {
        if (relativePosition === 'front') {
          localCurrent = this.undo(quietMode) as HistoryNode
        } else if (relativePosition === 'behind') {
          localCurrent = this.redo(quietMode) as HistoryNode
        }

        if (localCurrent === targetNode) break
      }

      const {selectedModules} = targetNode.data.payload

      // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)

      if (selectedModules === 'all') {
        this.editor.selectAll()
      } else {
        this.editor.replace(selectedModules)
      }
      this.editor.events.onHistoryUpdated?.(this)
    } else {
      // do sth...
    }
  }

  toArray(): HistoryNode[] {
    const list: HistoryNode[] = []

    if (this.head) {
      let curr = this.head

      list.push(curr)

      while (curr.next) {
        list.push(curr.next)
        curr = curr.next
      }
    }

    return list
  }
}

export default History


