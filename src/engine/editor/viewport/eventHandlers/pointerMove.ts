import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

export default function handlePointerMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return

  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y

  switch (this.manipulationStatus) {
    case 'selecting':
      this.wrapper.setPointerCapture(e.pointerId)
      this.drawCrossLine = false
      updateSelectionBox(this.selectionBox, calcSelectionBox(this.mouseDownPoint, this.mouseMovePoint))

      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break

    case 'panning':
      this.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging':
      break

    case 'resizing':
      break

    case 'rotating':
      break

    default:
      this.wrapper.releasePointerCapture(e.pointerId)
      this.drawCrossLine = true

      this.updateVirtualRect()
      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break
  }
}

export const calcSelectionBox = ({x: x1, y: y1}: Position, {x: x2, y: y2}: Position) => {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  return {x, y, width, height};
};