import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseUp(this: Viewport) {
 /* this.isSelectAll = false
  this.isDragging = false
  this.isResizing = false
  this.activeResizeHandle = null // Reset active resize handle
  render.call(this)*/
  this.mouseDown = false
  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
