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
      type: 'init',
      payload: {
        state: null,
        selectedModules: [],
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
      case 'init':
        break
      case 'add':
      case 'paste':
      case 'duplicate':

        // delete modules from added
        this.editor.batchDelete(extractIdSetFromArray(payload.modules))

        break

      case 'modify':

        break

      case 'move':
        this.editor.batchMove(payload.selectedModules, {
          x: -payload.delta.x,
          y: -payload.delta.y,
        })
        break

      case 'reorder':
        break
      case 'group':
        break
      case 'ungroup':
        break
      case 'composite':
        break

      case 'delete':
        modules = payload.modules

        this.editor.batchAdd(this.editor.batchCreate(modules!))

        break
    }

    if (!quiet) {
      // restore selected modules
      if (selectedModules === 'all') {
        this.editor.selectionManager.selectAll()
      } else {
        this.editor.selectionManager.replace(selectedModules)
      }

      this.editor.events.onHistoryUpdated?.(this)
    }

    super.back()

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
      case 'init':
        break
      case 'add':
      case 'paste':
      case 'duplicate':

        // delete modules from added
        this.editor.batchAdd(this.editor.batchCreate(payload.modules))

        break

      case 'modify':

        break

      case 'move':
        this.editor.batchMove(payload.selectedModules, {
          x: -payload.delta.x,
          y: -payload.delta.y,
        })
        break

      case 'reorder':
        break
      case 'group':
        break
      case 'ungroup':
        break
      case 'composite':
        break

      case 'delete':
        this.editor.batchDelete(extractIdSetFromArray(payload.modules))

        break
    }

    if (!quiet) {
      if (selectedModules === 'all') {
        this.editor.selectionManager.selectAll()
      } else {
        this.editor.selectionManager.replace(selectedModules)
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

      if (selectedModules === 'all') {
        this.editor.selectionManager.selectAll()
      } else {
        this.editor.selectionManager.replace(selectedModules)
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


