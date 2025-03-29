import SelectionManager from "../selectionManager.ts"
import render from "../render.ts"


function handleMouseUp(this: SelectionManager) {
  this.isSelectAll = false
  this.isDragging = false
  this.isResizing = false
  this.activeResizeHandle = null // Reset active resize handle
  render.call(this)
}


export default handleMouseUp
