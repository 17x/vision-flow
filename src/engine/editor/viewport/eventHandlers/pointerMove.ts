import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"
import {isInsideRotatedRect} from "../../../lib/lib.ts";
import Rectangle from "../../../core/modules/shapes/rectangle.ts";

export default function handlePointerMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return

  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y
  this.hoveredModules.length = 0

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
      this.wrapper.releasePointerCapture(e.pointerId)

      break

    case 'resizing':
      break

    case 'rotating':
      break

    default:
// check item touch
      const virtualPoint = this.screenToCanvas(this.mouseMovePoint.x, this.mouseMovePoint.y)
      const possibleModules: UID[] = []

      this.editor.visibleModuleMap.forEach((module) => {
        if (module.type === 'rectangle') {
          const {x, y, width, height, rotation} = (module as Rectangle)
          const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

          if (f) {
            possibleModules.push(module.id)
          }
        }
      })

      this.hoveredModules = possibleModules
      // console.log(possibleModules)

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