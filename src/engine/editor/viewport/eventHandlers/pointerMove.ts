import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"
import {isInsideRotatedRect} from "../../../lib/lib.ts";
import Rectangle from "../../../core/modules/shapes/rectangle.ts";

export default function handlePointerMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return

  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y
  this.hoveredModules.clear()
  this.drawCrossLine = false

  switch (this.manipulationStatus) {
    case 'selecting':
      this.wrapper.setPointerCapture(e.pointerId)
      // this.drawCrossLine = false
      updateSelectionBox(this.selectionBox, calcSelectionBox(this.mouseDownPoint, this.mouseMovePoint))

      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break

    case 'panning':
      this.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging':
      this.wrapper.setPointerCapture(e.pointerId)

      const x = e.movementX * this.dpr / this.zoom
      const y = e.movementY * this.dpr / this.zoom

      this.handlingModules.forEach((id) => {
        this.editor.moduleMap.get(id).x += x
        this.editor.moduleMap.get(id).y += y
      })
      this.updateVirtualRect()

      this.render()
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static':
      const MOVE_THROTTLE = 10
      const moved = Math.abs(this.mouseMovePoint.x - this.mouseDownPoint.x) > MOVE_THROTTLE ||
        Math.abs(this.mouseMovePoint.y - this.mouseDownPoint.y) > MOVE_THROTTLE

      if (this.handlingModules.size > 0 && moved) {
        this.manipulationStatus = 'dragging'
      } else {
        const virtualPoint = this.screenToCanvas(this.mouseMovePoint.x, this.mouseMovePoint.y)

        this.editor.visibleModuleMap.forEach((module) => {
          if (module.type === 'rectangle') {
            const {x, y, width, height, rotation} = (module as Rectangle)
            const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

            if (f) {
              this.hoveredModules.add(module.id)
            }
          }
        })

        this.wrapper.releasePointerCapture(e.pointerId)
        this.drawCrossLine = true
        this.updateVirtualRect()
        this.resetSelectionCanvas()
        this.renderSelectionCanvas()
      }

      // this.updateVirtualRect()
      // this.resetSelectionCanvas()
      // this.renderSelectionCanvas()
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