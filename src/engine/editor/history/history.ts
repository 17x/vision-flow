import Editor from "../index.ts";
import HistoryDoublyLinkedList from "./HistoryDoublyLinkedList.ts";

class History extends HistoryDoublyLinkedList {
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    this.bindShortcuts()
    this.add({
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
    if (!this.current!.prev) return
    const {type, modules} = this.current!.value

    // Delete pasted modules
    if (type === 'paste-modules') {
      this.editor.removeModules(modules!)
    }

    // Delete added modules
    if (type === 'add-modules') {
      this.editor.removeModules(modules!)
    }

    // Clear all modules
    if (type === 'init') {
      this.editor.removeModules('all')
    }

    this.current = this.current!.prev
  }

  private redo(): void {
    if (!this.current!.next) return
    console.log('redo', this.current!.next)
    const {type, modules} = this.current!.value

    // Delete pasted modules
    if (type === 'paste-modules') {
      this.editor.addModules(modules!)
    }

    // Delete added modules
    if (type === 'add-modules') {
      this.editor.addModules(modules!)
    }

    // Clear all modules
    if (type === 'init') {
      this.editor.removeModules('all')
    }

    this.current = this.current!.next
  }

  private destroy(): void {
    this.unBindShortcuts()
  }
}

export default History;