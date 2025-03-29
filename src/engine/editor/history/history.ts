import Editor from "../index.ts";
import DoublyLinkedList, {HistoryNode} from "./DoublyLinkedList.ts";
import {arrayToSet} from "../../core/convert.ts";
import {HistoryNodeData} from "./type";

class History extends DoublyLinkedList {
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
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

  add(data: HistoryNodeData): void {
    super.detach()
    super.append(data)

    this.editor.events.onHistoryUpdated?.(this)
  }

  undo(): void {
    const current = super.back()

    if (!current) return

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
    }

    this.editor.selectionManager.select(selectModules)
    this.editor.events.onHistoryUpdated?.(this)
  }

  redo(): void {
    const current = super.forward()

    if (!current) return

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

    this.editor.selectionManager.select(selectModules)
    this.editor.events.onHistoryUpdated?.(this)
  }

  moveCurrentById(targetNode: HistoryNode) {
    console.log(targetNode, this.current)
    console.log(targetNode.data)
    if (targetNode === this.current) return
    let curr = targetNode

    // Determine the target node relative to the head node’s position
    let targetNodeIsAfterTheCurrent = false

    while (curr?.next) {
      if (curr === this.head) {
        targetNodeIsAfterTheCurrent = true
        break
      }
      curr = curr.next
    }

    curr = this.current

    while (curr !== targetNode && curr) {
      if (targetNodeIsAfterTheCurrent) {
        this.undo()
        curr = curr.prev
      } else {
        this.redo()
        curr = curr.prev
      }
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
    console.log(list)
    return list
  }


  private destroy(): void {
    // this.unBindShortcuts()
  }
}

export default History;