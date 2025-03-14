import Editor from "../index.ts";
import HistoryDoublyLinkedList from "./HistoryDoublyLinkedList.ts";
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
      selectedItems: []
    })
  }

  private bindShortcuts() {
    // this.editor.action.subscribe('undo', this.undo.bind(this));
    // this.editor.action.subscribe('redo', this.redo.bind(this));
  }

  private unBindShortcuts() {
    // this.editor.action.unsubscribe('undo', this.undo.bind(this));
    // this.editor.action.unsubscribe('redo', this.redo.bind(this));
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
    // this.onHistoryChange && this.onHistoryChange(this.head)
    // console.log(this.current)
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
  }

  private destroy(): void {
    // this.unBindShortcuts()
  }
}

export default History;