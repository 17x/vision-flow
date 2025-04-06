import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"
import Rectangle from "../../../core/modules/shapes/rectangle.ts";
import {generateBoundingRectFromTwoPoints, isInsideRotatedRect, rectInside} from "../../../core/utils.ts";

export default function handlePointerMove(this: Viewport, e: PointerEvent) {
  if (this.domResizing) return
  // if (this.zooming) return
  // console.log(this.zooming,this.manipulationStatus)
  this.mouseMovePoint.x = e.clientX - this.rect!.x
  this.mouseMovePoint.y = e.clientY - this.rect!.y
  this.hoveredModules.clear()
  this.drawCrossLine = false

  switch (this.manipulationStatus) {
    case 'selecting':
      this.wrapper.setPointerCapture(e.pointerId)

      const rect = generateBoundingRectFromTwoPoints(this.mouseDownPoint, this.mouseMovePoint)
      const pointA = this.screenToCanvas(rect.x, rect.y)
      const pointB = this.screenToCanvas(rect.x + rect.width, rect.y + rect.height)
      const virtualSelectionRect: BoundingRect = generateBoundingRectFromTwoPoints(pointA, pointB)
      let idSet: Set<UID> = new Set()

      this.editor.visibleModuleMap.forEach((module) => {
        if (module.type === 'rectangle') {
          const boundingRect = module.getBoundingRect() as BoundingRect

          if (rectInside(boundingRect, virtualSelectionRect)) {
            idSet.add(module.id)
          }
        }
      })

      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        this.editor.selectionManager.replace(idSet)
      } else {
        this.editor.selectionManager.toggle(idSet)
      }

      updateSelectionBox(this.selectionBox, rect)
      this.resetSelectionCanvas()
      this.renderSelectionCanvas()
      break

    case 'panning':
      this.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging':
      this.wrapper.setPointerCapture(e.pointerId)

      const x = e.movementX * this.dpr / this.scale
      const y = e.movementY * this.dpr / this.scale

      this.handlingModules.forEach((id) => {
        this.editor.moduleMap.get(id).x += x
        this.editor.moduleMap.get(id).y += y
      })
      // this.updateVirtualRect()

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
