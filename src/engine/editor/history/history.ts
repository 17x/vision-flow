import Editor from "../index.ts";
import HistoryDoublyLinkedList from "./HistoryDoublyLinkedList.ts";

class History extends HistoryDoublyLinkedList {
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    this.bindShortcuts()
    this.replaceNext({
      type: 'init',
      modules: [],
      selectedItems: []
    })
  }

  private bindShortcuts() {
    this.editor.shortcut.subscribe('undo', this.undo.bind(this));
    this.editor.shortcut.subscribe('redo', this.redo.bind(this));
  }

  private unBindShortcuts() {
    this.editor.shortcut.unsubscribe('undo', this.undo.bind(this));
    this.editor.shortcut.unsubscribe('redo', this.redo.bind(this));
  }

  private undo(): void {
    if (!this.current) return

    const {type, modules} = this.current!.value

    if (
      type === 'paste-modules'
      || type === 'add-modules'
      || type === 'duplicate-modules'
    ) {
      this.editor.removeModules(modules!)
    }

    this.editor.selectionManager.clearSelectedItems()

    this.back()
    // this.onHistoryChange && this.onHistoryChange(this.head)
    // console.log(this.current)
  }

  private redo(): void {
    if (!this.current!.next) return

    const {type, modules} = this.current!.next.value

    if (
      type === 'paste-modules'
      || type === 'add-modules'
      || type === 'duplicate-modules'
    ) {
      this.editor.addModules(modules!)
    }
/*
    if (type === 'init') {
      this.editor.removeModules('all')
    }*/

    this.editor.selectionManager.clearSelectedItems()
    // console.log(this.current)
    this.forward()
  }

  private destroy(): void {
    this.unBindShortcuts()
  }
}

export default History;