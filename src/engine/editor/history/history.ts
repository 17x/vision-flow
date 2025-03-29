import Editor from "../index.ts"
import DoublyLinkedList, {HistoryNode} from "./DoublyLinkedList.ts"
import {arrayToSet} from "../../core/convert.ts"
import {HistoryNodeData} from "./type"

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
      modules: [],
      selectModules: new Set()
    })

    this.editor.events.onHistoryUpdated?.(this)
  }

  // Add a History node after the current
  add(data: HistoryNodeData): void {
    super.detach()
    super.append(data)

    this.editor.events.onHistoryUpdated?.(this)
  }

  undo(quiet = false): HistoryNode | false {
    const current = this.current

    if (!current) return false

    const {
      type,
      modules = [],
      selectModules = new Set()
    } = current.data

    if (
      type === 'pasteModules'
      || type === 'addModules'
      || type === 'duplicateModules'
    ) {
      this.editor.batchDelete(arrayToSet(modules!))
    } else if (type === 'deleteModules') {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'modifyModules') {
      console.log(modules)
      this.editor.batchModify()
    }

    if (!quiet) {
      this.editor.selectionManager.select(selectModules)
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
      modules = [],
      selectModules = new Set()
    } = current.data

    if (
      type === 'pasteModules'
      || type === 'addModules'
      || type === 'duplicateModules'
    ) {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'deleteModules') {
      this.editor.batchDelete(new Set(modules.map(m => m.id)))
    }

    if (!quiet) {
      this.editor.selectionManager.select(selectModules)
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
      this.editor.selectionManager.select(selectModules)
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