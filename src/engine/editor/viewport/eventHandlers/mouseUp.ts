import {updateSelectionBox} from '../domManipulations.ts'
import Editor from '../../editor.ts'

function handleMouseUp(this: Editor, e: MouseEvent) {
  const {draggingModules, manipulationStatus, moduleMap, selectingModules, selectedShadow, viewport} = this
  const x = e.clientX - viewport.rect!.x
  const y = e.clientY - viewport.rect!.y

  viewport.mouseMovePoint.x = x
  viewport.mouseMovePoint.y = y

  switch (manipulationStatus) {
    case 'selecting':
/*      console.warn(this.selectedShadow)
      console.warn(this.selectingModules)
      console.warn(this.draggingModules)
      console.warn(this.selectedModules)*/
      // this.viewport.resetSelectionCanvas()
      // this.viewport.renderSelectionCanvas()
      break

    case 'panning':
      // this.viewport.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging': {
      const x = (viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) * viewport.dpr / viewport.scale
      const y = (viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) * viewport.dpr / viewport.scale

      // move back to origin position and do the move again
      draggingModules.forEach((id) => {
        moduleMap.get(id).x -= x
        moduleMap.get(id).y -= y
      })

      this.batchMove(new Set(draggingModules), {x, y})
      this.replace(draggingModules)
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'mousedown':
      console.log(this.draggingModules)
      this.action.dispatch({
        type: 'selection-clear',
      })
      break
    case 'static':
      // console.log(this.hoveredModules)
      /*console.log(this.handlingModules)
      if (this.hoveredModules.size === 0) {
        this.action.dispatch({
          type: 'selection-clear',
          data: null,
        })
      }*/
      // console.log()
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        this.toggle(draggingModules)
      } else {
        this.replace(draggingModules)
      }

      break
  }

  draggingModules.clear()
  selectedShadow.clear()
  selectingModules.clear()
  this.manipulationStatus = 'static'
  updateSelectionBox(viewport.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
