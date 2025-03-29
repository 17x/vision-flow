import SelectionManager from "../selectionManager.ts"
import render from "../render.ts"


function handleMouseMove(this: SelectionManager, e: MouseEvent) {
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
    render.call(this)
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


export default handleMouseMove
