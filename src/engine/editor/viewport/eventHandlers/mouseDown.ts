import Viewport from "../viewport.ts"
import {isInsideRotatedRect} from "../../../lib/lib.ts";

// import {isInsideRotatedRect, screenToCanvas} from "../../../lib/lib.ts";

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const inViewport = e.target === this.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick || this.domResizing) return

  this.mouseDownPoint.x = e.clientX - this.rect!.x
  this.mouseDownPoint.y = e.clientY - this.rect!.y
  this.mouseDown = true

  if (this.spaceKeyDown) {
    this.panning = true
  } else {
    // check item touch
    //
    const virtualPoint = this.screenToCanvas(this.mouseDownPoint.x, this.mouseDownPoint.y)

    this.editor.visibleModuleMap.forEach((module) => {
      if (module.type === 'rectangle') {
        const boundingRect = module.getBoundingRect() as BoundingRect
        const f = isInsideRotatedRect(virtualPoint, boundingRect, module.rotation)

        if (f) {
          console.log(module)
        }
      }
    })
    // const f = isInsideRotatedRect()
    // console.log(this.editor.selectionManager.selectedModules)

    this.selecting = true
    // this.dragging = true

  }
}

export default handleMouseDown
