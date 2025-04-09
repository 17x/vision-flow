import {updateSelectionBox} from '../domManipulations.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {generateBoundingRectFromTwoPoints, isInsideRotatedRect, rectInside} from '../../../core/utils.ts'
import {SelectionActionMode} from '../../selection/type'
import Editor from '../../editor.ts'
import {areSetsEqual} from '../../../lib/lib.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  const {
    action,
    draggingModules,
    moduleMap,
    viewport,
    hoveredModules,
    selectingModules,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false
  hoveredModules.clear()

  action.dispatch({type: 'world-mouse-move'})

  switch (this.manipulationStatus) {
    case 'selecting': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const rect = generateBoundingRectFromTwoPoints(viewport.mouseDownPoint, viewport.mouseMovePoint)
      const pointA = this.getWorldPointByViewportPoint(rect.x, rect.y)
      const pointB = this.getWorldPointByViewportPoint(rect.right, rect.bottom)
      const virtualSelectionRect: BoundingRect = generateBoundingRectFromTwoPoints(pointA, pointB)
      const _localSelectionModules: Set<UID> = new Set()
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
      const mode: SelectionActionMode = modifyKey ? 'toggle' : 'replace'

      this.getVisibleModuleMap().forEach((module) => {
        if (module.type === 'rectangle') {
          const boundingRect = module.getBoundingRect() as BoundingRect

          if (rectInside(boundingRect, virtualSelectionRect)) {
            _localSelectionModules.add(module.id)
          }
        }
      })

      const equal = areSetsEqual(selectingModules, _localSelectionModules)

      updateSelectionBox(viewport.selectionBox, rect)
      console.log(equal)

      if (equal) {
        if (_localSelectionModules.size === 0) return

      } else {
        this.selectingModules = _localSelectionModules
        action.dispatch({
          type: 'selection-modify', data: {mode, _localSelectionModules},
        })
        console.log(_localSelectionModules,mode,this.selectedModules)

      }

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

      draggingModules.forEach((id) => {
        moduleMap.get(id).move(x, y)
        // moduleMap.get(id).x += x
        // moduleMap.get(id).y += y
      })

      // use dispatch temporary
      this.action.dispatch({
        type: 'visible-module-update',
      })
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'mousedown': {

      const MOVE_THROTTLE = 1
      const moved = Math.abs(viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) > MOVE_THROTTLE ||
        Math.abs(viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) > MOVE_THROTTLE

      if (moved) {
        if (draggingModules.size > 0) {
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

      // console.log(hoveredModules)

      viewport.wrapper.releasePointerCapture(e.pointerId)
      viewport.drawCrossLine = viewport.drawCrossLineDefault
    }

      break
  }
}
