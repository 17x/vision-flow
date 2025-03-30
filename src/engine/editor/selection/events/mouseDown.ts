import Rectangle from "../../../core/modules/shapes/rectangle.ts"
import {isInsideRotatedRect} from "../helper.ts"
import SelectionManager from "../selectionManager.ts"
// import render from "../render.ts"

function handleMouseDown(this: SelectionManager, e: MouseEvent) {

  // if (this.editor.panableContainer.isSpaceKeyPressed) return

  const mouseX = e.offsetX
  const mouseY = e.offsetY
// const mousePointX = mouseX
// const mousePointY = mouseY
  // @ts-ignore
  this.isDragging = true
  // @ts-ignore
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

  this.update()
  // render.call(this)
  // this.editor.events.onSelectionUpdated?.(this.selectedModules)
}


export default handleMouseDown
