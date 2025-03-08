import Editor from "../index.ts";
import HistoryDoublyLinkedList, {HistoryNode, HistoryValue} from "./HistoryDoublyLinkedList.ts";

class History {
  private history: HistoryDoublyLinkedList = new HistoryDoublyLinkedList();
  private editor: Editor;

  constructor(editor: Editor) {
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
    if (!this.history.head) {
      console.log('there is no history');
      return
    }

    // console.log(this.history.head)
    this.editor.modules.forEach((module) => {
      // this.selectedItems.add(module.id);
    })
  }

  private redo(): void {
    this.editor.modules.filter((module) => {

    })
  }

  private destroy(): void {
    this.unBindShortcuts()
  }

  add(value: HistoryValue) {
    const n = this.history.add(value)
    console.log(n)
    // return this
  }
}

export default History;