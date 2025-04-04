import Editor from "../editor.ts"
import typeCheck from "../../../utilities/typeCheck.ts";

const CopyDeltaX = 50
const CopyDeltaY = 100

class SelectionManager {
  selectedModules: Set<UID> = new Set()
  resizeHandleSize: number = 10
  activeResizeHandle: { x: number, y: number } | null = null
  isDestroyed: boolean = false
  editor: Editor
  copiedItems: ModuleProps[] = []
  isSelectAll: boolean = false

  constructor(editor: Editor) {
    this.editor = editor
  }

  public getSelected(): Set<UID> | 'all' {
    if (this.isSelectAll) {
      return 'all'
    }
    return new Set(this.selectedModules.keys())
  }

  public modifySelection(idSet: Set<UID>, action: 'add' | 'delete' | 'toggle' | 'replace') {
    if (typeCheck(idSet) !== 'set' || idSet.size <= 0) return;

    let eventCallBackData = idSet.size === 1 ? this.editor.moduleMap.get([...idSet.values()][0]).getDetails() : null

    if (action === 'replace') {
      this.selectedModules.clear();
    }

    idSet.forEach((id) => {
      switch (action) {
        case 'add':
          this.selectedModules.add(id);
          break;
        case 'delete':
          this.selectedModules.delete(id);
          break;
        case 'toggle':
          this.selectedModules.has(id) ? this.selectedModules.delete(id) : this.selectedModules.add(id);
          break;
        case 'replace':
          this.selectedModules.add(id); // Add the new selection
          break;
      }
    });

    this.render();
    this.editor.events.onSelectionUpdated?.(idSet, eventCallBackData);
  }

  public add(idSet: Set<UID>) {
    this.modifySelection(idSet, 'add');
  }

  public delete(idSet: Set<UID>) {
    this.modifySelection(idSet, 'delete');
  }

  public toggle(idSet: Set<UID>) {
    this.modifySelection(idSet, 'toggle');
  }

  public replace(idSet: Set<UID>) {
    this.modifySelection(idSet, 'replace');
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.render()
    this.editor.events.onSelectionUpdated?.('all', null)
  }

  public clear(): void {
    this.selectedModules.clear()
    this.isSelectAll = false
    this.render()
    this.editor.events.onSelectionUpdated?.(new Set(), null)
  }

  public copySelected(): void {
    this.copiedItems = []

    this.copiedItems = this.editor.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  }

  public pasteCopied(): void {
    const newModules = this.editor.batchCreate(this.copiedItems)
    this.editor.batchAdd(newModules, 'pasteModules')
    this.replace(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()
  }

  public duplicateSelected(): void {
    let temp: ModuleProps[]

    if (this.isSelectAll) {
      temp = this.editor.batchCopy('all', true)
    } else {
      temp = this.editor.batchCopy(this.selectedModules, true)
    }

    temp.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })

    const newModules = this.editor.batchCreate(temp)
    this.editor.batchAdd(newModules, 'duplicateModules')
    this.isSelectAll = false
    this.replace(new Set(newModules.keys()))
  }

  public removeSelected(): void {
    if (this.isSelectAll) {
      this.editor.batchDelete('all', 'deleteModules')
    } else {
      this.editor.batchDelete(this.selectedModules, 'deleteModules')
    }

    this.editor.selectionManager.clear()
  }

  private updateCopiedItemsDelta(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })
  }

  public getIfUnique() {
    if (this.selectedModules.size === 1) return [...this.selectedModules.values()][0]
    return null;
  }

  public update() {
    let p2: ModuleProps | null = null

    if (this.selectedModules.size === 1) {
      this.selectedModules.forEach((id) => {
        p2 = (this.editor.moduleMap.get(id) as ModuleType).getDetails()
      })
    }

    this.render()
    this.editor.events.onSelectionUpdated?.(this.selectedModules, p2)
  }

  render() {
    this.editor.viewport.resetSelectionCanvas()
    this.editor.viewport.renderSelectionCanvas()
    // render.call(this)
  }

  destroy(): void {
    if (this.isDestroyed) return

    // this.removeEventListeners()
    this.selectedModules.clear()
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.isDestroyed = true
    console.log("SelectionModule destroyed.")
  }
}

export default SelectionManager
