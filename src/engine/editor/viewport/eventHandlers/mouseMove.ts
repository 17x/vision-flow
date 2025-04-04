import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return

  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y

  if (this.selecting) {
    this.wrapper.setPointerCapture(e.pointerId)
    this.drawCrossLine = false
    this.resetSelectionCanvas()
    this.renderSelectionCanvas()
  } else {
    this.wrapper.releasePointerCapture(e.pointerId)
    this.drawCrossLine = true

    this.updateVirtualRect()
    this.resetSelectionCanvas()
    this.renderSelectionCanvas()
  }

  if (this.panning) {
    this.translateViewport(e.movementX, e.movementY)

    return
  }

  if (this.selecting) {
    updateSelectionBox(this.selectionBox, calcSelectionBox(this.mouseDownPoint, this.mouseMovePoint))
    return
  }
}

export const calcSelectionBox = ({x: x1, y: y1}: Position, {x: x2, y: y2}: Position) => {
  let boxX = x1
  let boxY = y1
  let boxWidth = x2 - x1
  let boxHeight = y2 - y1

  if (boxWidth < 0) {
    boxX = x2
    boxWidth = x1 - x2
  }

  if (boxHeight < 0) {
    boxY = y2
    boxHeight = y1 - y2
  }

  return {x: boxX, y: boxY, width: boxWidth, height: boxHeight}
}

export default handleMouseMove
