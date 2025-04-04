import Editor from "../editor.ts"

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

  public toggle(idSet: Set<UID>) {
    let p2: ModuleProps | null = null

    idSet.forEach((id) => {
      if (idSet.size === 1) {
        p2 = (this.editor.moduleMap.get(id) as ModuleType).getDetails()
      }
      if (this.selectedModules.has(id)) {
        this.selectedModules.delete(id)
      } else {
        this.selectedModules.add(id)
      }
    })

    this.render()
    this.editor.events.onSelectionUpdated?.(idSet, p2)
  }

  public select(idSet: Set<UID> | 'all') {
    if (!idSet) return

    let p2: ModuleProps | null = null

    this.selectedModules.clear()

    if (idSet === 'all') {
      this.isSelectAll = true
    } else {

      idSet.forEach((id) => {
        if (idSet.size === 1) {
          p2 = (this.editor.moduleMap.get(id) as ModuleType).getDetails()
        }
        this.selectedModules.add(id)
      })
    }
    // console.log(p2)
    this.render()
    this.editor.events.onSelectionUpdated?.(idSet, p2)
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

  public copy(): void {
    this.copiedItems = []

    this.copiedItems = this.editor.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  }

  public paste(): void {
    const newModules = this.editor.batchCreate(this.copiedItems)
    this.editor.batchAdd(newModules, 'pasteModules')
    this.select(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()
  }

  public duplicate(): void {
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
    this.select(new Set(newModules.keys()))
  }

  public delete(): void {
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
