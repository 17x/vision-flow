import Editor from "../index.ts";
import HistoryDoublyLinkedList, {HistoryNode, HistoryValue} from "./HistoryDoublyLinkedList.ts";

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
    console.log(this.current)
    this.current = this.current!.prev
    this.action()
  }

  private redo(): void {
    this.current = this.current!.next
    this.action()
  }

  private action(): void {
    if (!this.current) return
    console.log(this.current)
    const {type, modules} = this.current!.value

    console.log(type)

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
  }


  private destroy(): void {
    this.unBindShortcuts()
  }
}

export default History;