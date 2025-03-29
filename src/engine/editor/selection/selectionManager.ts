import Editor from "../index.ts"
import coordinator from "../coordinator.ts"
import rectRender from "../../core/renderer/rectRender.ts"
import {CircleRenderProps, RectangleRenderProps} from "../../core/renderer/type"
import Rectangle from "../../core/modules/shapes/rectangle.ts"
import circleRender from "../../core/renderer/circleRender.ts"
import {getBoxControlPoints, isInsideRotatedRect} from "./helper.ts"

// type KeyboardDirectionKeys = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
const CopyDeltaX = 10
const CopyDeltaY = 10

class SelectionManager {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private selectedModules: Set<UID> = new Set()
  // @ts-ignore
  private hoveredModules: Set<UID> = new Set()
  // @ts-ignore
  private isDragging: boolean = false
  private isResizing: boolean = false
  // @ts-ignore
  private dragStart: {
    x: number; y: number
  } = {
    x: 0, y: 0
  }
  private resizeHandleSize: number = 10
  private activeResizeHandle: { x: number, y: number } | null = null
  private isDestroyed: boolean = false
  private editor: Editor
  private copiedItems: ModuleProps[] = []
  private isSelectAll: boolean = false
  // private currentCopyDeltaX = CopyDeltaX
  // private currentCopyDeltaY = CopyDeltaY

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement
    this.ctx = canvas.getContext("2d")!
    this.editor = editor
    this.canvas = canvas

    coordinator(this.editor.canvas, this.canvas)
    this.ctx.scale(this.editor.dpr, this.editor.dpr)
    canvas.style.position = "absolute"
    canvas.style.top = "0"
    canvas.style.bottom = "0"
    canvas.style.pointerEvents = "none"
    canvas.setAttribute("selection-manager", "")
    editor.canvas.parentNode!.append(this.canvas)

    // this.watchActions()
    this.render()
    this.setupEventListeners()
  }

  public getSelected(): Set<UID> | 'all' {
    if (this.isSelectAll) {
      return 'all'
    }
    return new Set(this.selectedModules.keys())
  }

  public select(idSet: Set<UID> | 'all') {
    if (!idSet) return

    this.selectedModules.clear()

    if (idSet === 'all') {
      this.isSelectAll = true
    } else {
      idSet.forEach((id) => {
        this.selectedModules.add(id)
      })
    }

    this.render()
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.render()
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  public clear(): void {
    this.selectedModules.clear()
    this.isSelectAll = false
    this.render()
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
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

  private setupEventListeners(): void {
    this.editor.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
    this.editor.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
    this.editor.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this))
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this))
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this))
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.editor.panableContainer.isSpaceKeyPressed) return

    const mouseX = e.offsetX
    const mouseY = e.offsetY
    // const mousePointX = mouseX
    // const mousePointY = mouseY
    this.isDragging = true
    this.dragStart = {
      x: mouseX, y: mouseY
    }

    const possibleModules = Array.from(this.editor.moduleMap.values()).filter((item) => {
      if (item.type === 'rectangle' && item.rotation > 0) {
        const {
          x, y, width, height, rotation
        } = (item as Rectangle).getDetails()

        return isInsideRotatedRect(mouseX, mouseY, x, y, width, height, rotation)
      }
    })

    if (!possibleModules.length) {
      this.clear()
      return
    }

    const lastOne = possibleModules[possibleModules.length - 1]
    const id = lastOne.id

    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      if (this.selectedModules.has(id)) {
        this.selectedModules.delete(id)
      } else {
        this.selectedModules.add(id)
      }
    } else {
      this.selectedModules.clear()
      this.selectedModules.add(id)
    }

    this.render()
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  private handleMouseMove(e: MouseEvent): void {
    const mouseX = e.offsetX
    const mouseY = e.offsetY

    // Drag logic
    if (this.isResizing && this.activeResizeHandle) {
      // Calculate the new size based on the mouse position
      const newSize = Math.max(20,
        Math.min(
          this.canvas.width,
          this.canvas.height,
          mouseX - this.activeResizeHandle.x,
          mouseY - this.activeResizeHandle.y
        )
      )

      // Apply the resize effect
      // @ts-ignore
      this.activeResizeHandle.size = newSize
      this.render()
    }

    // console.log(this.editor.modules.entries())
    // hover logic
    const filtered = Array.from(this.editor.moduleMap.values()).filter((module) => {
      const {top, right, bottom, left} = module.getBoundingRect()

      return mouseX > left && mouseY > top && mouseX < right && mouseY < bottom
    })
    // console.log(filtered);

    this.canvas.style.cursor = filtered.length > 0 ? "move" : 'default'
  }

  private handleMouseUp(): void {
    this.isSelectAll = false
    this.isDragging = false
    this.isResizing = false
    this.activeResizeHandle = null // Reset active resize handle
    this.render()
  }

  public render(): void {
    const enableRotationHandle = this.selectedModules.size === 1

    const BatchDrawer = (modules: ModuleMap) => {
      const {ctx} = this

      const l = this.resizeHandleSize / 2
      const rects: RectangleRenderProps[] = []
      const dots: CircleRenderProps[] = []
      const fillColor = "#5491f8"
      const lineColor = "#5491f8"
      const lineWidth = 1


      if (enableRotationHandle) {
        // this.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
        // this.ctx.rotate(item.rotation); // Apply rotation
      }

      modules.forEach((module) => {
        const {
          x, y, width, height, rotation
        } = (module as Rectangle).getDetails()
        const points = getBoxControlPoints(x, y, width, height, rotation)

        dots.push(...points.map(point => ({
          ...point,
          r1: l,
          r2: l,
          fillColor,
          lineColor: '#fff',
        })))

        rects.push({
          x,
          y,
          width,
          height,
          fillColor,
          lineColor,
          lineWidth,
          rotation,
          opacity: 0,
          dashLine: 'dash'
        })
      })

      // console.log(rects)
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // ctx.setTransform(this.editor.scale, 0, 0, this.editor.scale, 0, 0);
      rectRender(ctx, rects)
      circleRender(ctx, dots)
    }

    if (this.isSelectAll) {
      BatchDrawer(this.editor.moduleMap)
    } else {
      const selectedModulesMap: ModuleMap = new Map()

      this.selectedModules.forEach(id => {
        this.editor.moduleMap.forEach((module) => {
          if (module.id === id) {
            selectedModulesMap.set(module.id, module)
          }
        })
      })

      BatchDrawer(selectedModulesMap)
    }
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
