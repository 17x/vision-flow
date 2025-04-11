import {updateSelectionBox} from '../domManipulations.ts'
// import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {
  generateBoundingRectFromTwoPoints,
  rectInside,
} from '../../../core/utils.ts'
import Editor from '../../editor.ts'
import {areSetsEqual, getSymmetricDifference} from '../../../lib/lib.ts'
import {updateHoveredModules} from './funcs.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  const {
    action,
    draggingModules,
    moduleMap,
    viewport,
    selectedShadow,
    _selectingModules,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false
  // hoveredModules.clear()

  action.dispatch('world-mouse-move')

  switch (this.manipulationStatus) {
    case 'selecting': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const rect = generateBoundingRectFromTwoPoints(
        viewport.mouseDownPoint,
        viewport.mouseMovePoint,
      )
      const pointA = this.getWorldPointByViewportPoint(rect.x, rect.y)
      const pointB = this.getWorldPointByViewportPoint(
        rect.right,
        rect.bottom,
      )
      const virtualSelectionRect: BoundingRect =
        generateBoundingRectFromTwoPoints(pointA, pointB)
      const _selecting: Set<UID> = new Set()
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey

      this.getVisibleModuleMap.forEach((module) => {
        if (module.type === 'rectangle') {
          const boundingRect = module.getBoundingRect() as BoundingRect

          if (rectInside(boundingRect, virtualSelectionRect)) {
            _selecting.add(module.id)
          }
        }
      })

      const selectingChanged = !areSetsEqual(_selectingModules, _selecting)

      updateSelectionBox(viewport.selectionBox, rect)

      /**
       * Simple logic
       * If with modifyKey
       *    original-selected Symmetric Difference selecting
       * else
       *    original-selected merge selecting
       */
      if (!selectingChanged) return

      this._selectingModules = _selecting

      const SD = getSymmetricDifference(selectedShadow, _selecting)

      if (modifyKey) {
        action.dispatch('modify-selection', {
          mode: 'replace',
          idSet: SD,
        })
      } else {
        if (_selecting.size === 0 && selectedShadow.size === 0) {
          return action.dispatch('selection-clear')
        }
        const newSet = new Set([...selectedShadow, ..._selecting])

        action.dispatch('modify-selection', {
          mode: 'replace',
          idSet: newSet,
        })
      }
    }
      break

    case 'panning':
      action.dispatch('world-shift',
        {
          x: e.movementX,
          y: e.movementY,
        })

      break

    case 'dragging': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const x = (e.movementX * viewport.dpr) / viewport.scale
      const y = (e.movementY * viewport.dpr) / viewport.scale

      draggingModules.forEach((id) => {
        moduleMap.get(id).move(x, y)
      })

      // force update
      this.action.dispatch('visible-module-update')
    }
      break

    case 'resizing':
      break

    case 'rotating':
      break

    case 'mousedown': {
      const MOVE_THROTTLE = 1
      const moved =
        Math.abs(viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) >
        MOVE_THROTTLE ||
        Math.abs(viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) >
        MOVE_THROTTLE

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
      const {viewport, hoveredModules} = this
      const virtualPoint = this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y)
      this.operationHandlers.forEach(operationHandler => {
        // console.log(operationHandler.data)
      })
      updateHoveredModules.call(this)

      // console.log(hoveredModules)

      viewport.wrapper.releasePointerCapture(e.pointerId)
      viewport.drawCrossLine = viewport.drawCrossLineDefault
    }

      break
  }
}
