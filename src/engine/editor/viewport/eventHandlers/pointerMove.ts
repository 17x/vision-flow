import {updateSelectionBox} from '../domManipulations.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {generateBoundingRectFromTwoPoints, isInsideRotatedRect, rectInside} from '../../../core/utils.ts'
import {SelectionActionMode} from '../../selection/type'
import Editor from '../../editor.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  const {
    action,
    handlingModules,
    moduleMap,
    viewport,
    hoveredModules,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false
  hoveredModules.clear()

  action.dispatch({
    type: 'world-mouse-move',
    data: this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y),
  })

  switch (this.manipulationStatus) {
    case 'selecting': {
      viewport.wrapper.setPointerCapture(e.pointerId)

      const rect = generateBoundingRectFromTwoPoints(viewport.mouseDownPoint, viewport.mouseMovePoint)
      const pointA = this.getWorldPointByViewportPoint(rect.x, rect.y)
      const pointB = this.getWorldPointByViewportPoint(rect.x + rect.width, rect.y + rect.height)
      const virtualSelectionRect: BoundingRect = generateBoundingRectFromTwoPoints(pointA, pointB)
      const idSet: Set<UID> = new Set()
      let mode: SelectionActionMode = 'replace'

      this.getVisibleModuleMap().forEach((module) => {
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

      action.dispatch({
        type: 'selection-modify', data: {mode, idSet},
      })

      updateSelectionBox(viewport.selectionBox, rect)
      // this.viewport.resetSelectionCanvas()
      // this.viewport.renderSelectionCanvas()
    }
      break

    case 'panning':
      action.dispatch({
        type: 'world-shift',
        data: {
          x: e.movementX,
          y: e.movementY,
        },
      })

      break

    case 'dragging': {
      viewport.wrapper.setPointerCapture(e.pointerId)

      const x = e.movementX * viewport.dpr / viewport.scale
      const y = e.movementY * viewport.dpr / viewport.scale

      handlingModules.forEach((id) => {
        moduleMap.get(id).x += x
        moduleMap.get(id).y += y
      })

      // this.updateVisibleModuleMap(this.viewport.worldRect)

      // this.viewport.render()
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'mousedown': {
      const MOVE_THROTTLE = 10
      const moved = Math.abs(viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) > MOVE_THROTTLE ||
        Math.abs(viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) > MOVE_THROTTLE

      if (moved) {
        if (handlingModules.size > 0) {
          this.manipulationStatus = 'dragging'
        } else {
          this.manipulationStatus = 'selecting'
        }
      }
    }
      break

    case 'static': {
      const virtualPoint = this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y)

      this.getVisibleModuleMap().forEach((module) => {
        if (module.type === 'rectangle') {
          const {x, y, width, height, rotation} = (module as Rectangle)
          const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

          if (f) {
            hoveredModules.add(module.id)
          }
        }
      })

      viewport.wrapper.releasePointerCapture(e.pointerId)
      viewport.drawCrossLine = viewport.drawCrossLineDefault
    }

      break
  }
}
