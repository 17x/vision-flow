import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseUp(this: Viewport, e: MouseEvent) {
  /* this.isSelectAll = false
   this.isDragging = false
   this.isResizing = false
   this.activeResizeHandle = null // Reset active resize handle
   render.call(this)*/

  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.mouseCurrentPoint.x = x
  this.mouseCurrentPoint.y = y

  this.mouseDown = false
  this.selecting = false
  this.panning = false

  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
  /*
    const minX = Math.min(this.pointMouseDown.x, this.pointMouseCurrent.x)
    const maxX = Math.max(this.pointMouseDown.x, this.pointMouseCurrent.x)
    const minY = Math.min(this.pointMouseDown.y, this.pointMouseCurrent.y)
    const maxY = Math.max(this.pointMouseDown.y, this.pointMouseCurrent.y)

    console.log(minX, maxX, minY, maxY)*/
}

export default handleMouseUp
