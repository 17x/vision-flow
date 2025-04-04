import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseUp(this: Viewport, e: MouseEvent) {
  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.mouseMovePoint.x = x
  this.mouseMovePoint.y = y

  this.manipulationStatus = 'static'
  this.mouseDown = false
  this.selecting = false
  this.panning = false

  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
}

export default handleMouseUp
