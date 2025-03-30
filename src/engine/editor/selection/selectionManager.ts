import Editor from "../editor.ts"
// import coordinator from "../coordinator.ts"
import handleMouseDown from "./events/mouseDown.ts"
import handleMouseMove from "./events/mouseMove.ts"
import handleMouseUp from "./events/mouseUp.ts"
import render from "./render.ts"

// type KeyboardDirectionKeys = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
const CopyDeltaX = 10
const CopyDeltaY = 10

class SelectionManager {
  readonly boundMouseDown: (event: MouseEvent) => void
  readonly boundMouseMove: (event: MouseEvent) => void
  readonly boundMouseUp: (event: MouseEvent) => void

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  selectedModules: Set<UID> = new Set()
  // @ts-ignore
  private hoveredModules: Set<UID> = new Set()
  // @ts-ignore
  // isDragging: boolean = false
  // isResizing: boolean = false
  // @ts-ignore
  private dragStart: {
    x: number; y: number
  } = {
    x: 0, y: 0
  }
  // @ts-ignore
  resizeHandleSize: number = 10
  activeResizeHandle: { x: number, y: number } | null = null
  private isDestroyed: boolean = false
  editor: Editor
  private copiedItems: ModuleProps[] = []
  isSelectAll: boolean = false
  // private currentCopyDeltaX = CopyDeltaX
  // private currentCopyDeltaY = CopyDeltaY

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement
    this.ctx = canvas.getContext("2d")!
    this.editor = editor
    this.canvas = canvas

    // coordinator(this.editor.canvas, this.canvas)
    this.ctx.scale(this.editor.dpr, this.editor.dpr)
    canvas.style.position = "absolute"
    canvas.style.top = "0"
    canvas.style.bottom = "0"
    canvas.style.pointerEvents = "none"
    canvas.setAttribute("selection-manager", "")
    // editor.canvas.parentNode!.append(this.canvas)

    // this.watchActions()
    this.render()
    // this.boundMouseDown = handleMouseDown.bind(this)
    // this.boundMouseMove = handleMouseMove.bind(this)
    // this.boundMouseUp = handleMouseUp.bind(this)
    // this.setupEventListeners()
  }

/*  private setupEventListeners(): void {
    this.editor.canvas.addEventListener("mousedown", this.boundMouseDown)
    this.editor.canvas.addEventListener("mousemove", this.boundMouseMove)
    this.editor.canvas.addEventListener("mouseup", this.boundMouseUp)
  }*/

  private removeEventListeners(): void {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown)
    this.canvas.removeEventListener("mousemove", this.boundMouseMove)
    this.canvas.removeEventListener("mouseup", this.boundMouseUp)
  }

  public getSelected(): Set<UID> | 'all' {
    if (this.isSelectAll) {
      return 'all'
    }
    return new Set(this.selectedModules.keys())
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

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.render()
    this.editor.events.onSelectionUpdated?.('all', null)
  }

  public clear(): void {
    this.selectedModules.clear()
    this.isSelectAll = false
    render.call(this)
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

  render() {
    render.call(this)
  }

  destroy(): void {
    if (this.isDestroyed) return

    this.removeEventListeners()
    this.selectedModules.clear()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.isDestroyed = true
    console.log("SelectionModule destroyed.")
  }
}

export default SelectionManager
