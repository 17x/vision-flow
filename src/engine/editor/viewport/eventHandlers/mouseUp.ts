import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"
import Rectangle from "../../../core/modules/shapes/rectangle.ts";
import {isInsideRotatedRect} from "../../../lib/lib.ts";
import {calcSelectionBox} from "./pointerMove.ts";

function handleMouseUp(this: Viewport, e: MouseEvent) {
  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.mouseMovePoint.x = x
  this.mouseMovePoint.y = y

  switch (this.manipulationStatus) {
    case 'selecting':
      /*this.wrapper.setPointerCapture(e.pointerId)
      this.drawCrossLine = false
      updateSelectionBox(this.selectionBox, calcSelectionBox(this.mouseDownPoint, this.mouseMovePoint))
*/
      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break

    case 'panning':
      // this.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging':
      this.editor.selectionManager.select(this.handlingModules)
      // this.handlingModules.clear()
      /*this.wrapper.releasePointerCapture(e.pointerId)
      const lastId = [...this.draggingModules][this.draggingModules.size - 1];
      console.log(lastId)
      this.editor.moduleMap.get(lastId).x += e.movementX
      this.editor.moduleMap.get(lastId).y += e.movementY*/
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static':
      console.log(this.handlingModules)
      this.editor.selectionManager.toggle(this.handlingModules)
      break
  }

  this.handlingModules.clear()

  this.manipulationStatus = 'static'
  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
