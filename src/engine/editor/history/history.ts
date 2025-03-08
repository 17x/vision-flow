import Editor from "../index.ts";
import HistoryDoublyLinkedList, {HistoryNode, HistoryValue} from "./HistoryDoublyLinkedList.ts";

class History extends HistoryDoublyLinkedList {
  // private history: HistoryDoublyLinkedList = new HistoryDoublyLinkedList();
  private editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    this.bindShortcuts()
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
    if (!this.head) {
      // console.warn('there is no history');
      return
    }

    console.log(this.head)
    console.log(this.head.value)
    const {type, modules} = this.head.value

    // Delete pasted modules
    if (type === 'paste-modules') {
      this.editor.removeModules(modules!)
    }

    if (type === 'add-modules') {
      this.editor.removeModules(modules!)
    }

    if (this.head.prev) {
      this.head = this.head.prev
    }
  }

  private redo(): void {
    this.editor.modules.filter((module) => {

    })
  }

  private destroy(): void {
    this.unBindShortcuts()
  }

  /*
    add(value: HistoryValue) {
      const n = this.history.add(value)
      console.log(n)
      // return this
    }*/
}

export default History;