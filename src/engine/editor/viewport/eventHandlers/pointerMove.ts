import {updateSelectionBox} from '../domManipulations.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {generateBoundingRectFromTwoPoints, isInsideRotatedRect, rectInside} from '../../../core/utils.ts'
import {SelectionActionMode} from '../../selection/type'
import Editor from '../../editor.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  this.viewport.mouseMovePoint.x = e.clientX - this.viewport.rect!.x
  this.viewport.mouseMovePoint.y = e.clientY - this.viewport.rect!.y
  this.viewport.hoveredModules.clear()
  this.viewport.drawCrossLine = false

  this.viewport.editor.action.dispatch({
    type: 'world-mouse-move',
    data: this.viewport.getWorldPointByViewportPoint(this.viewport.mouseMovePoint.x, this.viewport.mouseMovePoint.y),
  })

  switch (this.viewport.manipulationStatus) {
    case 'selecting': {
      this.viewport.wrapper.setPointerCapture(e.pointerId)

      const rect = generateBoundingRectFromTwoPoints(this.viewport.mouseDownPoint, this.viewport.mouseMovePoint)
      const pointA = this.viewport.getWorldPointByViewportPoint(rect.x, rect.y)
      const pointB = this.viewport.getWorldPointByViewportPoint(rect.x + rect.width, rect.y + rect.height)
      const virtualSelectionRect: BoundingRect = generateBoundingRectFromTwoPoints(pointA, pointB)
      const idSet: Set<UID> = new Set()
      let mode: SelectionActionMode = 'replace'
      this.viewport.editor.getVisibleModuleMap().forEach((module) => {
        if (module.type === 'rectangle') {
          const boundingRect = module.getBoundingRect() as BoundingRect

          if (rectInside(boundingRect, virtualSelectionRect)) {
            idSet.add(module.id)
          }
        }
      })

      if ((e.ctrlKey || e.shiftKey || e.metaKey)) {
        mode = 'add'
      }

      this.viewport.editor.action.dispatch({
        type: 'selection-modify', data: {mode, idSet},
      })
      updateSelectionBox(this.viewport.selectionBox, rect)
      // this.viewport.resetSelectionCanvas()
      // this.viewport.renderSelectionCanvas()
    }
      break

    case 'panning':
      this.viewport.editor.action.dispatch({
        type: 'viewport-panning',
        data: {
          x: e.movementX,
          y: e.movementY,
        },
      })

      break

    case 'dragging': {
      this.viewport.wrapper.setPointerCapture(e.pointerId)

      const x = e.movementX * this.viewport.dpr / this.viewport.scale
      const y = e.movementY * this.viewport.dpr / this.viewport.scale

      this.viewport.handlingModules.forEach((id) => {
        this.viewport.editor.moduleMap.get(id).x += x
        this.viewport.editor.moduleMap.get(id).y += y
      })

      // this.viewport.editor.updateVisibleModuleMap(this.viewport.worldRect)

      // this.viewport.render()
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'static': {
      const MOVE_THROTTLE = 10
      const moved = Math.abs(this.viewport.mouseMovePoint.x - this.viewport.mouseDownPoint.x) > MOVE_THROTTLE ||
        Math.abs(this.viewport.mouseMovePoint.y - this.viewport.mouseDownPoint.y) > MOVE_THROTTLE

      if (this.viewport.handlingModules.size > 0 && moved) {
        this.viewport.manipulationStatus = 'dragging'
      } else {
        const virtualPoint = this.viewport.getWorldPointByViewportPoint(this.viewport.mouseMovePoint.x, this.viewport.mouseMovePoint.y)

        this.viewport.editor.getVisibleModuleMap().forEach((module) => {
          if (module.type === 'rectangle') {
            const {x, y, width, height, rotation} = (module as Rectangle)
            const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

            if (f) {
              this.viewport.hoveredModules.add(module.id)
            }
          }
        })

        this.viewport.wrapper.releasePointerCapture(e.pointerId)
        this.viewport.drawCrossLine = this.viewport.drawCrossLineDefault
      }
    }
      break
  }
}
