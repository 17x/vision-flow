import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseUp(this: Viewport, e: MouseEvent) {
  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.mouseMovePoint.x = x
  this.mouseMovePoint.y = y

  switch (this.manipulationStatus) {
    case 'selecting':
      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break

    case 'panning':
      // this.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging':
      this.editor.selectionManager.select(this.handlingModules)
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static':
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        this.editor.selectionManager.toggle(this.handlingModules)
      } else {
        this.editor.selectionManager.select(this.handlingModules)
      }

      break
  }

  this.handlingModules.clear()
  this.manipulationStatus = 'static'
  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
