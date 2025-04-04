import Viewport from "../viewport.ts"
import {isInsideRotatedRect} from "../../../lib/lib.ts";
import Rectangle from "../../../core/modules/shapes/rectangle.ts";

// import {isInsideRotatedRect, screenToCanvas} from "../../../lib/lib.ts";

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const inViewport = e.target === this.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick || this.domResizing) return

  this.mouseDownPoint.x = e.clientX - this.rect!.x
  this.mouseDownPoint.y = e.clientY - this.rect!.y
  // this.mouseDown = true

  if (this.spaceKeyDown) {
    this.manipulationStatus = 'panning'
  } else {
    console.log(this.hoveredModules)
    return
    // check item touch
    /*const virtualPoint = this.screenToCanvas(this.mouseDownPoint.x, this.mouseDownPoint.y)
    const possibleModules: UID[] = []

    this.editor.visibleModuleMap.forEach((module) => {
      if (module.type === 'rectangle') {
        const {x, y, width, height, rotation} = (module as Rectangle)
        const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

        if (f) {
          possibleModules.push(module.id)
        }
      }
    })

    if (!possibleModules.length) {
      // this.selecting = true
      this.manipulationStatus = 'selecting'

      this.editor.selectionManager.clear()
      return
    }*/

    this.manipulationStatus = 'dragging'
    // check handle points touch
    // this.manipulationStatus = 'resizing'

    // const lastOne = possibleModules[possibleModules.length - 1]

    /* if (e.metaKey || e.ctrlKey || e.shiftKey) {
       if (this.selectedModules.has(id)) {
         this.selectedModules.delete(id)
       } else {
         this.selectedModules.add(id)
       }
     } else {
       this.selectedModules.clear()
       this.selectedModules.add(id)
     }*/

    // this.update()

    // this.dragging = true

  }
}

export default handleMouseDown
