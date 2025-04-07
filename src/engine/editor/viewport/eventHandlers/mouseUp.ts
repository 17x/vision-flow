import Viewport from '../viewport.ts'
import {updateSelectionBox} from '../domManipulations.ts'

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

    case 'dragging': {
      const x = (this.mouseMovePoint.x - this.mouseDownPoint.x) * this.dpr / this.scale
      const y = (this.mouseMovePoint.y - this.mouseDownPoint.y) * this.dpr / this.scale

      // move back to origin position and do the move again
      this.handlingModules.forEach((id) => {
        this.editor.moduleMap.get(id).x -= x
        this.editor.moduleMap.get(id).y -= y
      })
      this.editor.batchMove(new Set(this.handlingModules), {x, y}, 'move')
      this.editor.selectionManager.replace(this.handlingModules)
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static':
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        this.editor.selectionManager.toggle(this.handlingModules)
      } else {
        this.editor.selectionManager.replace(this.handlingModules)
      }

      break
  }

  this.handlingModules.clear()
  this.manipulationStatus = 'static'
  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
