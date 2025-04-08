import {updateSelectionBox} from '../domManipulations.ts'
import Editor from '../../editor.ts'

function handleMouseUp(this: Editor, e: MouseEvent) {
  const x = e.clientX - this.viewport.rect!.x
  const y = e.clientY - this.viewport.rect!.y

  this.viewport.mouseMovePoint.x = x
  this.viewport.mouseMovePoint.y = y

  switch (this.manipulationStatus) {
    case 'selecting':
      // this.viewport.resetSelectionCanvas()
      // this.viewport.renderSelectionCanvas()
      break

    case 'panning':
      // this.viewport.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging': {
      const x = (this.viewport.mouseMovePoint.x - this.viewport.mouseDownPoint.x) * this.viewport.dpr / this.viewport.scale
      const y = (this.viewport.mouseMovePoint.y - this.viewport.mouseDownPoint.y) * this.viewport.dpr / this.viewport.scale

      // move back to origin position and do the move again
      this.handlingModules.forEach((id) => {
        this.moduleMap.get(id).x -= x
        this.moduleMap.get(id).y -= y
      })
      this.batchMove(new Set(this.handlingModules), {x, y}, 'history-move')
      this.replace(this.handlingModules)
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static':
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        this.toggle(this.handlingModules)
      } else {
        this.replace(this.handlingModules)
      }

      break
  }

  this.handlingModules.clear()
  this.manipulationStatus = 'static'
  updateSelectionBox(this.viewport.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
