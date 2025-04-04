import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

export default function handlePointerMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return

  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y

  if (this.selecting) {
    this.wrapper.setPointerCapture(e.pointerId)
    this.drawCrossLine = false
    updateSelectionBox(this.selectionBox, calcSelectionBox(this.mouseDownPoint, this.mouseMovePoint))

    this.resetSelectionCanvas()
    this.renderSelectionCanvas()
  } else if (this.panning) {
    this.translateViewport(e.movementX, e.movementY)
  } else if (this.dragging) {

  } else if (this.resizing) {

  } else if (this.rotating) {

  } else {
    this.wrapper.releasePointerCapture(e.pointerId)
    this.drawCrossLine = true

    // dragging or resizing

    this.updateVirtualRect()
    this.resetSelectionCanvas()
    this.renderSelectionCanvas()
  }
}

export const calcSelectionBox = ({x: x1, y: y1}: Position, {x: x2, y: y2}: Position) => {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  return {x, y, width, height};
};