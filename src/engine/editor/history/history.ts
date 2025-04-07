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
    // console.log(type, payload)
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

    // restore selected modules
    if (selectedModules === 'all') {
      this.editor.selectionManager.selectAll()
    } else {
      this.editor.selectionManager.replace(selectedModules)
    }
    /*
    if (
      type === 'paste'
      || type === 'add'
      || type === 'duplicate'
    ) {
      this.editor.batchDelete(arrayToSet(modules!))
    } else if (type === 'delete') {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'modify') {
      console.log('modify', modules)
      this.editor.batchReplaceModules(modules)
    }
*/
    /*if (!quiet) {
      this.editor.selectionManager.replace(selectModules)
      this.editor.events.onHistoryUpdated?.(this)
    }*/

    super.back()

    return this.current as HistoryNode
  }

  redo(quiet = false): HistoryNode | false {
    const current = super.forward()

    if (!current) return false

    const {
      type,
      modules = [],
      selectModules = new Set(),
    } = current.data

    if (
      type === 'pasteModules'
      || type === 'addModules'
      || type === 'duplicate'
    ) {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'deleteModules') {
      this.editor.batchDelete(new Set(modules.map(m => m.id)))
    } else if (type === 'modifyModules') {
      this.editor.batchReplaceModules(modules)
    }

    if (!quiet) {
      this.editor.selectionManager.replace(selectModules)
      this.editor.events.onHistoryUpdated?.(this)
    }

    return this.current as HistoryNode
  }

  moveCurrentById(targetNode: HistoryNode) {
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

      const {selectModules} = targetNode.data
      this.editor.selectionManager.replace(selectModules)
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


