import Editor from "../index.ts";
import HistoryDoublyLinkedList, {HistoryNode, HistoryValue} from "./HistoryDoublyLinkedList.ts";
import {arrayToMap, arrayToSet} from "../../core/convert.ts";

class History extends HistoryDoublyLinkedList {
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    // this.bindShortcuts()
    {
      this.replaceNext({
        type: 'init',
        modules: [],
        selectedItems: []
      })
      if (editor.events.onHistoryUpdated) {
        editor.events.onHistoryUpdated(this)
      }
    }
    // if (onHistoryUpdated) onHistoryUpdated()
  }

  private bindShortcuts() {
    // this.editor.action.subscribe('undo', this.undo.bind(this));
    // this.editor.action.subscribe('redo', this.redo.bind(this));
  }

  private unBindShortcuts() {
    // this.editor.action.unsubscribe('undo', this.undo.bind(this));
    // this.editor.action.unsubscribe('redo', this.redo.bind(this));
  }

  replaceNext(value: HistoryValue): void {
    super.replaceNext(value)

    if (this.editor.events.onHistoryUpdated) {
      this.editor.events.onHistoryUpdated(this)
    }
  }

  undo(): void {
    if (!this.current) return

    // get current history node data
    const type = this.current.value.type;
    const modules = this.current.value.modules || []

    if (
      type === 'paste-modules'
      || type === 'add-modules'
      || type === 'duplicate-modules'
    ) {
      console.log(modules)
      this.editor.batchDelete(arrayToSet(modules!))
    } else if (type === 'delete-modules') {
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    }

    this.editor.selectionManager.clear()

    this.back()

    if (this.editor.events.onHistoryUpdated) {
      this.editor.events.onHistoryUpdated(this)
    }
  }

  redo(): void {
    if (!this.current!.next) return

    const type = this.current!.next.value.type;
    const modules = this.current!.next.value.modules || []

    if (
      type === 'paste-modules'
      || type === 'add-modules'
      || type === 'duplicate-modules'
    ) {
      console.log(this.editor.batchCreate(modules!))
      this.editor.batchAdd(this.editor.batchCreate(modules!))
    } else if (type === 'delete-modules') {
      this.editor.batchDelete(modules!)
    }

    this.editor.selectionManager.clear()
    this.forward()

    if (this.editor.events.onHistoryUpdated) {
      this.editor.events.onHistoryUpdated(this)
    }
  }

  setNode(targetNode: HistoryNode) {
    console.log(targetNode)
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