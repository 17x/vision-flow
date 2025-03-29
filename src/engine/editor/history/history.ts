import Editor from "../index.ts";
import HistoryDoublyLinkedList, {HistoryNode, HistoryValue} from "./HistoryDoublyLinkedList.ts";
import {arrayToMap, arrayToSet} from "../../core/convert.ts";

class History extends HistoryDoublyLinkedList {
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    // this.bindShortcuts()

    this.replaceNext({
      type: 'init',
      modules: [],
      selectModules: new Set()
    })

    editor.events.onHistoryUpdated?.(this)

    // if (onHistoryUpdated) onHistoryUpdated()
  }

  replaceNext(value: HistoryValue): void {
    super.replaceNext(value)

    this.editor.events.onHistoryUpdated?.(this)
  }

  undo(): void {
    if (!this.current) return

    const {type, modules = [], selectModules = new Set()} = this.current.value

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

    this.back()

    this.editor.events.onHistoryUpdated?.(this)
  }

  redo(): void {
    if (!this.current!.next) return
    const {type, modules = [], selectModules = new Set()} = this.current!.next.value

    if (
      type === 'pasteModules'
      || type === 'addModules'
      || type === 'duplicateModules'
    ) {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'deleteModules') {
      this.editor.batchDelete(new Set(modules.map(m => m.id)))
    }

    console.log(selectModules)
    this.editor.selectionManager.select(selectModules)
    this.forward()

    this.editor.events.onHistoryUpdated?.(this)
  }

  setNode(targetNode: HistoryNode) {
    console.log(targetNode, this.current)
    console.log(targetNode.value)
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

    return list
  }

  private destroy(): void {
    // this.unBindShortcuts()
  }
}

export default History;